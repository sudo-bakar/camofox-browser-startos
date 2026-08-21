import { i18n } from './i18n'
import { sdk } from './sdk'
import { apiPort } from './utils'
import { storeJson } from './fileModels/store.json'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting Camofox Browser!'))

  // Reactive read of the access key. When rotate-access-key writes store.json,
  // StartOS rebuilds the daemon chain and the container restarts with the new
  // CAMOFOX_ACCESS_KEY env var.
  const accessKey = await storeJson.read((s) => s.accessKey).const(effects)

  // Camofox persists session state (login profiles, imported cookies, file
  // uploads) under each of these. Tracing zips are deliberately left on the
  // ephemeral filesystem: they are transient and can be large.
  const mounts = sdk.Mounts.of()
    .mountVolume({
      volumeId: 'main',
      subpath: 'profiles',
      mountpoint: '/root/.camofox/profiles',
      readonly: false,
    })
    .mountVolume({
      volumeId: 'main',
      subpath: 'cookies',
      mountpoint: '/root/.camofox/cookies',
      readonly: false,
    })
    .mountVolume({
      volumeId: 'main',
      subpath: 'uploads',
      mountpoint: '/root/.camofox/uploads',
      readonly: false,
    })

  return sdk.Daemons.of(effects).addDaemon('server', {
    subcontainer: sdk.SubContainer.of(
      effects,
      { imageId: 'camofox-browser' },
      mounts,
      'camofox-browser',
    ),
    exec: {
      command: sdk.useEntrypoint(),
      env: {
        CAMOFOX_PORT: String(apiPort),
        CAMOFOX_ACCESS_KEY: accessKey ?? '',
        CAMOFOX_CRASH_REPORT_ENABLED: 'false',
      },
    },
    ready: {
      display: i18n('API'),
      fn: () =>
        sdk.healthCheck.checkWebUrl(
          effects,
          `http://127.0.0.1:${apiPort}/health`,
          {
            successMessage: i18n('The API is ready'),
            errorMessage: i18n('The API is not ready'),
          },
        ),
    },
    requires: [],
  })
})
