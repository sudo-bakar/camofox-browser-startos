import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'camofox-browser',
  title: 'Camofox Browser',
  license: 'MIT',
  packageRepo: 'https://github.com/sudo-bakar/camofox-browser-startos',
  upstreamRepo: 'https://github.com/jo-inc/camofox-browser',
  marketingUrl: 'https://github.com/jo-inc/camofox-browser',
  donationUrl: null,
  description: { short, long },
  volumes: ['main'],
  images: {
    'camofox-browser': {
      source: { dockerTag: 'ghcr.io/jo-inc/camofox-browser:1.14.0' },
      arch: ['x86_64', 'aarch64'],
    },
  },
  // The Camoufox (Firefox) engine launches lazily, but once it does it is a
  // full browser; 2 GB is a sane lower bound, matching other browser-based
  // packages.
  hardwareRequirements: {
    ram: 2 * 1024 ** 3,
  },
  dependencies: {},
})
