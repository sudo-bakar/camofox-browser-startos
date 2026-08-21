import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

// Read-only: returns the current bearer access key so the user can paste it
// into the agent (OpenClaw plugin env, Hermes tool config, or any HTTP client).
export const viewAccessKey = sdk.Action.withoutInput(
  'view-access-key',
  async () => ({
    name: i18n('View API Access Key'),
    description: i18n(
      'Show the current Camofox API access key. Send it as `Authorization: Bearer <key>` on every API request.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),
  async ({ effects }) => {
    const accessKey = await storeJson.read((s) => s.accessKey).once()

    return {
      version: '1',
      title: i18n('API Access Key'),
      message: i18n(
        'Send this value as `Authorization: Bearer <key>` on every Camofox API request.',
      ),
      result: {
        type: 'single',
        name: i18n('Access Key'),
        description: null,
        value: accessKey ?? '',
        masked: true,
        copyable: true,
        qr: false,
      },
    }
  },
)
