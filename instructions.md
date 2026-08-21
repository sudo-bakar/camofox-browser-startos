# Camofox Browser

## Documentation

- [Camofox Browser README](https://github.com/jo-inc/camofox-browser) — upstream reference: full API endpoints, environment variables, cookie import, and plugin system.
- [Camofox Browser API reference](https://github.com/jo-inc/camofox-browser#api) — the REST endpoints your agents call (tabs, snapshots, clicks, typing, screenshots).

## What you get on StartOS

Camofox Browser gives your AI agents (Hermes, OpenClaw, or anything that speaks
HTTP) a stealth headless browser they drive through a REST API. On StartOS the
API is protected by a generated bearer key, and the browser runs with crash
telemetry disabled. Login sessions, imported cookies, and file uploads persist
across restarts.

The **Browser API** interface on the Interfaces tab is the connection point.
Its URL is masked — view it from the Interfaces tab and use it together with
the access key described below.

## Getting set up

1. On the service page, open **Actions** and run **View API Access Key**. Copy
   the key.
2. Open the **Interfaces** tab and copy the Browser API address (`.local` on
   your LAN, or whichever binding you enable).
3. Give both to your agent:
   - **OpenClaw**: set `CAMOFOX_ACCESS_KEY` to the key and point the
     `camofox-browser` plugin at the interface URL (the OpenClaw plugin is
     installed with `openclaw plugins install @askjo/camofox-browser`).
   - **Hermes / Other agents**: send `Authorization: Bearer <key>` on every
     request, e.g.
     ```bash
     curl -H "Authorization: Bearer <key>" \
       -d '{"userId":"agent1","sessionKey":"t1","url":"https://example.com"}' \
       https://<your-camofox-address>/tabs
     ```

That is the whole setup. The browser launches on the first tab request and
shuts itself down when idle.

## Using Camofox Browser

### Browser API

The REST API is Camofox's native interface: create tabs, take accessibility
snapshots, click and type by element ref, screenshot pages, and import cookies.
See the upstream [API reference](https://github.com/jo-inc/camofox-browser#api)
for the full endpoint list.

### Actions

- **View API Access Key** — shows the current bearer key. Run it any time you
  need to wire up a new agent.
- **Rotate API Access Key** — generates a new key and invalidates the old one
  (the service restarts briefly). Run it if a key leaked; then update your
  agents with the value shown.

### Importing cookies

To browse a site that requires login, export a Netscape-format cookie file from
your own browser and upload it into the service's `cookies` directory (via the
volume's file transfer). Your agent's `camofox_import_cookies` tool then loads
it by filename.

## Limitations

Interactive VNC login and the noVNC/desktop views are not enabled in this
package — Camofox is headless-only. Crash telemetry is disabled. Session
traces are not backed up.
