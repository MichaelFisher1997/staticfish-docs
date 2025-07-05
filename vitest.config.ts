import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    // Vitest configuration options
    environment: 'happy-dom',
    globals: true,
  },
});
