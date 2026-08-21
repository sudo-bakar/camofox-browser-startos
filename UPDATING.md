# Updating the upstream version

"Upstream" is the Docker image `ghcr.io/jo-inc/camofox-browser`, published by
the upstream GitHub workflow (`docker.yml`) on every GitHub release.

## Determining the upstream version

The current pin lives in `startos/manifest/index.ts` as
`images['camofox-browser'].source.dockerTag`. Fetch the latest upstream release:

```bash
curl -s https://api.github.com/repos/jo-inc/camofox-browser/releases/latest \
  | jq -r .tag_name        # e.g. v1.14.0
```

The image tag is the release tag without the leading `v` (release `v1.14.0`
→ image tag `1.14.0`). The image is multi-arch (`amd64`/`arm64`); confirm the
new tag exists before pinning it:

```bash
curl -s https://ghcr.io/v2/jo-inc/camofox-browser/tags/list
```

## Applying the bump

1. Edit `startos/manifest/index.ts` — change the dockerTag to
   `ghcr.io/jo-inc/camofox-browser:<version>`.
2. Edit `startos/versions/current.ts` — set `version` to `<version>:0`, and
   refresh the release notes (translated) to name the upstream release.
3. Re-verify the image still runs as root and that `~/.camofox/{profiles,
   cookies, uploads}` under the image's home still match the mountpoints in
   `startos/main.ts` (the Camoufox engine layout and default directories have
   shifted between upstream releases before).
4. `npm run check && make` and install-verify against a running host.

The Camoufox engine version is pinned separately inside the upstream image by
its `CAMOUFOX_VERSION`/`CAMOUFOX_RELEASE` build args and does not need a
change here unless upstream documents an engine bump that requires it.
