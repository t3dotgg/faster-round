import { defineConfig } from "astro/config";
import preact from "@astrojs/preact";
import tailwind from "@astrojs/tailwind";

import vercel from "@juanm04/astrojs-vercel/edge";

// https://astro.build/config
export default defineConfig({
  integrations: [preact(), tailwind()],
  output: "server",
  adapter: vercel(),
  vite: {
    resolve: {
      alias: {
        uuid: "node_modules/uuid/dist/esm-browser/index.js",
      },
    },
  },
});
