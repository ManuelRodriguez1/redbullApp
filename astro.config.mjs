import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import relativeLinks from 'astro-relative-links';

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react(), relativeLinks()],
  root: 'redbullApp',
  output: "server",
  adapter: node({
    mode: "standalone"
  })
});