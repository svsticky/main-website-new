import { defineConfig } from 'astro/config';
import { storyblok } from '@storyblok/astro';
import { loadEnv } from 'vite';
import mkcert from 'vite-plugin-mkcert';

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

import preload from "astro-preload";

const env = loadEnv(import.meta.env.MODE, process.cwd(), '');
const {
  STORYBLOK_DELIVERY_API_TOKEN,
  STORYBLOK_API_BASE_URL,
  STORYBLOK_REGION,
} = env;

export default defineConfig({
  devToolbar: {
    enabled: false,
  },
  integrations: [storyblok({
    accessToken: STORYBLOK_DELIVERY_API_TOKEN,
    apiOptions: {
      /** Set the correct region for your space. Learn more: https://www.storyblok.com/docs/packages/storyblok-js#example-region-parameter */
      region: STORYBLOK_REGION || 'eu',
      /** The following code is only required when creating a Storyblok space directly via the Blueprints feature. */
      endpoint: STORYBLOK_API_BASE_URL
        ? `${new URL(STORYBLOK_API_BASE_URL).origin}/v2`
        : undefined,
    },
    components: {
      "page": 'components/Page',
      "grid": 'components/basics/Grid',
      "card": "components/basics/Card",
      "rich-text": "components/basics/RichText",
      "image": "components/basics/Image",
      "hero": "components/Hero",
      "contact-card": "components/ContactCard",
      "button": "components/basics/Button",
      "board": "components/board/Board",
      "board-overview": "components/board/Overview",
      "partner": "components/partners/Partner",
      "partner-overview": "components/partners/Overview",
      "vacancy": "components/vacancies/Vacancy",
      "vacancy-overview": "components/vacancies/Overview",
      "committee": "components/committees/Committee",
      "committee-overview": "components/committees/Overview"
    },
  }), react(), preload()],
  vite: {
    plugins: [mkcert(), tailwindcss()],
  },
});