import { i18n } from './i18n'
import { sdk } from './sdk'
import { apiPort } from './utils'
import { storeJson } from './fileModels/store.json'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  // Reactive: when rotate-access-key rewrites store.json, setupInterfaces
  // re-runs and the proxy edge picks up the new bearer token automatically.
  const accessKey = await storeJson.read((s) => s.accessKey).const(effects)

  const multi = sdk.MultiHost.of(effects, 'api')
  const origin = await multi.bindPort(apiPort, {
    protocol: 'http',
    preferredExternalPort: apiPort,
    addSsl: {
      auth: {
        type: 'bearer',
        tokens: accessKey ? [accessKey] : [],
        realm: null,
      },
    },
  })

  const api = sdk.createInterface(effects, {
    name: i18n('Browser API'),
    id: 'api',
    description: i18n(
      'Camofox REST API: tab, snapshot, click, type, screenshot, and session endpoints for AI agents.',
    ),
    type: 'api',
    masked: true,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
  })

  return [await origin.export([api])]
})
