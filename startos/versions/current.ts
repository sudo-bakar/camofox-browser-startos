import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.14.0:1',
  releaseNotes: {
    en_US: `Wraps upstream camofox-browser v1.14.0; API access requires a generated bearer key.

**StartOS package**

- Rebuilt on start-sdk 3.0.3; requires StartOS 0.4.0.2 or newer. No functional changes.`,
    es_ES: `Envuelve camofox-browser v1.14.0; el acceso a la API requiere una clave bearer generada.

**Paquete de StartOS**

- Recompilado con start-sdk 3.0.3; requiere StartOS 0.4.0.2 o posterior. Sin cambios funcionales.`,
    de_DE: `Bündelt camofox-browser v1.14.0; API-Zugriff erfordert einen generierten Bearer-Schlüssel.

**StartOS-Paket**

- Neu gebaut mit start-sdk 3.0.3; erfordert StartOS 0.4.0.2 oder neuer. Keine funktionalen Änderungen.`,
    pl_PL: `Opakowuje camofox-browser v1.14.0; dostęp do API wymaga wygenerowanego klucza bearer.

**Pakiet StartOS**

- Zbudowany ponownie z start-sdk 3.0.3; wymaga StartOS 0.4.0.2 lub nowszego. Bez zmian funkcjonalnych.`,
    fr_FR: `Empaquette camofox-browser v1.14.0 ; l’accès API requiert une clé bearer générée.

**Paquet StartOS**

- Reconstruit avec start-sdk 3.0.3 ; nécessite StartOS 0.4.0.2 ou version ultérieure. Aucun changement fonctionnel.`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
