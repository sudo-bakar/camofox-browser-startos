import { utils } from '@start9labs/start-sdk'
import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

// Generates a fresh CAMOFOX_ACCESS_KEY and stores it. The reactive `.const()`
// reads in main.ts and interfaces.ts restart the container and re-key the
// StartOS proxy edge automatically; nothing here touches the running process.
export const rotateAccessKey = sdk.Action.withoutInput(
  'rotate-access-key',
  async () => ({
    name: i18n('Rotate API Access Key'),
    description: i18n(
      'Generate a new Camofox API access key, invalidating the old one. The service restarts automatically to pick it up.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),
  async ({ effects }) => {
    const accessKey = utils.getDefaultString({
      charset: 'a-z,A-Z,0-9',
      len: 64,
    })
    await storeJson.merge(effects, { accessKey })

    return {
      version: '1',
      title: i18n('New API Access Key'),
      message: i18n(
        'The old key is invalid. Send the new value as `Authorization: Bearer <key>` on every API request.',
      ),
      result: {
        type: 'single',
        name: i18n('Access Key'),
        description: null,
        value: accessKey,
        masked: true,
        copyable: true,
        qr: false,
      },
    }
  },
)
