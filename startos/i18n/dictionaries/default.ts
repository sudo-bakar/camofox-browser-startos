export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'Starting Camofox Browser!': 0,
  API: 1,
  'The API is ready': 2,
  'The API is not ready': 3,
  // interfaces.ts
  'Browser API': 4,
  'Camofox REST API: tab, snapshot, click, type, screenshot, and session endpoints for AI agents.': 5,
  // actions/viewAccessKey.ts
  'View API Access Key': 6,
  'Show the current Camofox API access key. Send it as `Authorization: Bearer <key>` on every API request.': 7,
  'API Access Key': 8,
  'Send this value as `Authorization: Bearer <key>` on every Camofox API request.': 9,
  'Access Key': 10,
  // actions/rotateAccessKey.ts
  'Rotate API Access Key': 11,
  'Generate a new Camofox API access key, invalidating the old one. The service restarts automatically to pick it up.': 12,
  'New API Access Key': 13,
  'The old key is invalid. Send the new value as `Authorization: Bearer <key>` on every API request.': 14,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
