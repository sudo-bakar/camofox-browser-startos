import { utils } from '@start9labs/start-sdk'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'

// Generates the CAMOFOX_ACCESS_KEY bearer token on first install. Without an
// access key Camofox serves its REST API unauthenticated, which would let any
// peer on the LAN drive a headless browser. A long alphanumeric value is safe
// to embed as a Bearer token; it is never shown without an explicit action.
export const seedAccessKey = sdk.setupOnInit(async (effects, kind) => {
  if (kind !== 'install') return

  await storeJson.merge(effects, {
    accessKey: utils.getDefaultString({ charset: 'a-z,A-Z,0-9', len: 64 }),
  })
})
