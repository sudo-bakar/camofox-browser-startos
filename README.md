<p align="center">
  <img src="icon.svg" alt="Camofox Browser Logo" width="21%">
</p>

# Camofox Browser on StartOS

> Everything not listed in this document should behave the same as upstream
> Camofox Browser. If a feature, setting, or behavior is not mentioned here,
> the upstream documentation is accurate and fully applicable — see the
> Documentation section of `instructions.md` for links.

Camofox Browser serves a REST API over an anti-detection Camoufox (Firefox)
engine so AI agents can open tabs, read accessibility snapshots, click, type,
and screenshot real pages. This package wraps the upstream
[ghcr.io/jo-inc/camofox-browser](https://github.com/jo-inc/camofox-browser)
image, pins it by tag, and gates the API behind a generated bearer key.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)

---

## Image and Container Runtime

The upstream multi-arch image (`ghcr.io/jo-inc/camofox-browser`, tag pinned in
the manifest) is used unmodified. It is Debian-trixie-based with the Camoufox
binary, yt-dlp, and the `persistence`/`youtube` plugins baked in at build time.
`x86_64` and `aarch64` are targeted.

One subcontainer runs, the whole service:

- **`camofox-browser`** — `node server.js` via the image entrypoint. No bundled
  init system, so it does not need `runAsInit`.

## Volume and Data Layout

One volume, `main`, backed up wholesale. Camofox's per-user session state lives
under `/root/.camofox` (the image runs as root) and is split across:

| Mount point               | Subpath   | Purpose                                            |
| ------------------------- | --------- | -------------------------------------------------- |
| `/root/.camofox/profiles` | `profiles` | Persisted login sessions (`storage_state.json`)   |
| `/root/.camofox/cookies`  | `cookies`  | Netscape cookie files read by `camofox_import_cookies` |
| `/root/.camofox/uploads`  | `uploads`  | Files attached via the upload endpoint             |

The Camoufox engine binary itself lives in `/root/.cache/camoufox` inside the
image and is not persisted; every start relaunches the pre-baked engine.

## File Models

The package owns one StartOS-side state file:

- **`store.json`** (path `main/store.json`) — holds the generated
  `accessKey`. Seeded once on install by `seedAccessKey`; rewritten only by
  the rotate-access-key action. A hand edit is not supported: the value is a
  generated secret, re-written by the rotate action, and read reactively.

No upstream configuration file is written by this package. Camofox's
`camofox.config.json` ships inside the image and is left at its defaults.

## Dependencies

None.

## Network Access and Interfaces

One interface:

- **`api`** (type `api`, port `9377`, HTTP) — the Camofox REST API. Marked
  masked. The StartOS reverse proxy enforces `Authorization: Bearer <accessKey>`
  at the edge (`addSsl.auth`, bearer) before any request reaches the container;
  the same key is also passed to Camofox as `CAMOFOX_ACCESS_KEY`, so the
  application itself enforces it for anything that reaches it without the
  proxy.

## Installation and First-Run Flow

Install completes without user interaction. During install init the package
generates a 64-character `CAMOFOX_ACCESS_KEY` and stores it. The daemon starts
immediately with that key, with crash telemetry hardcoded off. The browser
engine launches lazily on first tab request and shuts down after its idle
timeout; the `/health` endpoint is reachable without auth.

## Actions

Two user-facing actions, both safe to run at any time (they either read state
or rewrite one key, then the container restarts):

- **View API Access Key** — run when wiring an agent (Hermes, OpenClaw) to the
  package. Reads and displays the current bearer key. No state change, no
  restart, repeat-safe.
- **Rotate API Access Key** — run to invalidate a leaked key. Generates a new
  key, rewrites `store.json`, returns the new value. The reactive reads
  restart the daemon with the new `CAMOFOX_ACCESS_KEY` and re-key the proxy
  edge; expect a brief service restart.

## Tasks

None — the service is never held on a user prompt, and its ordinary controls
are always available.

## Health Checks

One daemon readiness check, **Browser API**:

- Probes `GET http://127.0.0.1:9377/health` inside the container. Success means
  the Node server is up and the Camoufox engine reports connected. A failure
  means the process crashed, is still starting, or the Firefox engine cannot
  launch — check the service logs for `camoufox launched` vs an error line.
  Note the check needs no auth: `/health` is exempt from the access key.

## Backups and Restore

Strategy: the `main` volume is copied wholesale (`ofVolumes`). That captures
session profiles, imported cookies, and uploads. Traces (transient zips) are
excluded on purpose — they are temporary and can be large; nothing lost by
dropping them. A restored instance is usable immediately if the access key is
present (it is part of `store.json` on the same volume). Re-attach the same
key to dependent agents after a restore to a new box.

## Limitations and Differences

1. **VNC interactive login and the noVNC/desktop views are disabled**
   (`ENABLE_VNC`/`CAMOFOX_INTERACTIVE` are not set). Only the headless API is
   exposed.
2. **Crash telemetry is hardcoded off** (`CAMOFOX_CRASH_REPORT_ENABLED=false`),
   so the service never contacts the upstream askjo telemetry endpoint.
3. **Cookie import is gated by the access key** — the `POST /sessions/:userId/cookies`
   endpoint requires a `CAMOFOX_API_KEY` upstream, but here the whole API is
   protected by `CAMOFOX_ACCESS_KEY` instead; the cookie file must be placed in
   the mounted `cookies` directory (via file transfer into the volume).
4. **Session traces are not backed up** and are swept per upstream TTL.
5. **Proxy + GeoIP is not configured** by the package; set the `PROXY_*`
   variables through Camofox config if needed (not exposed as StartOS config).

---

## Quick Reference for AI Consumers

```yaml
package_id: camofox-browser
image: ghcr.io/jo-inc/camofox-browser # never a tag
architectures: [x86_64, aarch64]
subcontainers: [camofox-browser]
volumes:
  main: /root/.camofox
file_models:
  - store.json
startos_managed_env_vars:
  - CAMOFOX_PORT
  - CAMOFOX_ACCESS_KEY
  - CAMOFOX_CRASH_REPORT_ENABLED
dependencies: none
interfaces:
  api: { type: api, port: 9377 }
actions:
  - view-access-key
  - rotate-access-key
tasks: none
health_checks:
  - Browser API (daemon readiness)
```
