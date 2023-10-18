import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";

import react from "@astrojs/react";
import relativeLinks from 'astro-relative-links';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react(), relativeLinks()],
  root: 'redbullApp'
});