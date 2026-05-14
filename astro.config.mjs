import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://leandrobenjaminl.github.io',
  base: '/portfolio',
  output: 'static',
  build: {
    assets: 'assets',
  },
});
