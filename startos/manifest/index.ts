import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'camofox-browser',
  title: 'Camofox Browser',
  license: 'MIT',
  packageRepo: 'https://github.com/Start9Labs/camofox-browser-startos',
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
  dependencies: {},
})
