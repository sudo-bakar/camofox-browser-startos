import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.14.0:0',
  releaseNotes: {
    en_US:
      'Initial release for StartOS. Wraps upstream camofox-browser v1.14.0; API access requires a generated bearer key.',
    es_ES:
      'Versión inicial para StartOS. Envuelve camofox-browser v1.14.0; el acceso a la API requiere una clave bearer generada.',
    de_DE:
      'Erstveröffentlichung für StartOS. Bündelt camofox-browser v1.14.0; API-Zugriff erfordert einen generierten Bearer-Schlüssel.',
    pl_PL:
      'Pierwsze wydanie dla StartOS. Opakowuje camofox-browser v1.14.0; dostęp do API wymaga wygenerowanego klucza bearer.',
    fr_FR:
      'Version initiale pour StartOS. Empaquette camofox-browser v1.14.0 ; l’accès API requiert une clé bearer générée.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
