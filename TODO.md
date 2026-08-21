# Camofox Browser — TODO

Release-readiness tracking for the Camofox Browser package (upstream
`ghcr.io/jo-inc/camofox-browser`, pinned 1.14.0).

## Pending

- [ ] **Replace `manifest.packageRepo`** — still the placeholder
      `https://github.com/Start9Labs/camofox-browser-startos`, which does not
      exist. Set the real repo URL before any registry publish.
- [ ] **Backup → uninstall → restore has never been exercised.** Blocked: the
      test box has no backup target, and `start-cli` has no backup-create
      command. Once a target exists, create a backup with profiles/cookies/
      uploads populated, restore, and confirm `storage-state.json` and the
      access key survive the round trip.
- [ ] **aarch64 runtime verification.** Only x86_64 tested. Install on native
      ARM hardware and repeat health + tab + restart checks.
- [ ] **Confirm the square icon renders uncropped in the StartOS UI.** Padded
      to a 400×400 transparent-margin square under the 40 KiB limit; visually
      confirm in the service marketplace/tile and adjust margins if the fox
      touches the cached `border-radius` frame.

## Verified (evidence, 1.14.0:0, StartOS 0.4.0.1 x86_64)

- [x] Build: `tsc --noEmit` green, prettier clean, `.s9pk` packs (912 MB) with
      `icon.png` embedded.
- [x] Install completes; daemon `server` healthy — `/health` returns
      `{"ok":true,"browserRunning":true}`.
- [x] Auth enforced twice: container (`CAMOFOX_ACCESS_KEY`) and StartOS proxy
      edge (`addSsl.auth` bearer). `/health` 401 unauthenticated, 200 with the
      key on both paths.
- [x] Full API flow over the key: tab create → `/snapshot` with element refs;
      unauthenticated requests get 401.
- [x] Restart persistence: `profiles/<hash>/storage-state.json` + `meta.json`
      survived a restart; the same `userId` re-created sessions.
- [x] Key rotation (`rotate-access-key`): rewrites `store.json`, restarts the
      daemon, and re-keys the proxy binding. Old key 401, new key 200.
- [x] Volume mounts: `main` mounted at `/root/.camofox/{profiles,cookies,
      uploads}` (rw); Camoufox engine lives in `/root/.cache` inside the image,
      unmounted (correct).
- [x] Image runs as root with no init system → `sdk.useEntrypoint()`, no
      `runAsInit`. Crash telemetry hardcoded `false`; VNC/desktop disabled.

## Future v2

- [ ] Optionally expose VNC interactive login (`ENABLE_VNC` + generated
      `VNC_PASSWORD`, a second noVNC interface). Deliberately out of v1.
- [ ] Optionally surface proxy + GeoIP (`PROXY_*`) as typed StartOS config.
- [ ] Load behavior under concurrent sessions / tab recycling remains untested
      (only single-session flows exercised).
