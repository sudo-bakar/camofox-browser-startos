import { utils } from '@start9labs/start-sdk'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'

// Ensures the CAMOFOX_ACCESS_KEY bearer token exists. Without an access key
// Camofox serves its REST API unauthenticated, which would let any peer on
// the LAN drive a headless browser. Seeded on install and re-seeded whenever
// it is missing (e.g. a restore that lost store.json), so the API never
// comes up unauthenticated. A long alphanumeric value is safe to embed as a
// Bearer token; it is never shown without an explicit action.
//
// The read is deliberately non-reactive (.once()): main.ts and interfaces.ts
// read the same key with .const() so a rotation restarts the daemon and
// re-keys the proxy edge. If this read were reactive too, every rotation
// would re-run init; with .once() init only notices a missing key.
export const seedAccessKey = sdk.setupOnInit(async (effects) => {
  const existing = await storeJson.read((s) => s.accessKey).once()

  if (existing) return

  await storeJson.merge(effects, {
    accessKey: utils.getDefaultString({ charset: 'a-z,A-Z,0-9', len: 64 }),
  })
})
