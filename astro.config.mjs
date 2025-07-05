// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'http://localhost:3000',
  base: '/',
  integrations: [
    starlight({
      title: 'staticfish',
      customCss: [
        './src/styles/global.css',
      ],
      sidebar: [
        {
          label: 'Git',
          autogenerate: { directory: 'git' },
        },
        {
          label: 'Node.js & Bun',
          autogenerate: { directory: 'node-bun' },
        },
        {
          label: 'Astro',
          autogenerate: { directory: 'astro' },
        },
        {
          label: 'Resend',
          autogenerate: { directory: 'resend' },
        },
      ],
    }),
  ],
  vite: {
    plugins: [tailwindcss()],

  },
});