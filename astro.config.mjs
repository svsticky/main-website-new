import { defineConfig } from 'astro/config';
import { storyblok } from '@storyblok/astro';
import { loadEnv } from 'vite';
import node from "@astrojs/node";
import mkcert from 'vite-plugin-mkcert';
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import preload from "astro-preload";

const env = loadEnv(import.meta.env.MODE, process.cwd(), '');
const {
  STORYBLOK_DELIVERY_API_TOKEN,
  STORYBLOK_REGION,
} = env;

export default defineConfig({
  output: "static",
  adapter: node({
    mode: "standalone"
  }),
  devToolbar: {
    enabled: false,
  },
  integrations: [storyblok({
    accessToken: STORYBLOK_DELIVERY_API_TOKEN,
    apiOptions: {
      region: STORYBLOK_REGION || 'eu',
    },
    components: {
      "page": 'components/Page',
      "grid": 'components/basics/Grid',
      "card": "components/basics/Card",
      "rich-text": "components/basics/RichText",
      "image": "components/basics/Image",
      "hero": "components/home/Hero",
      "button": "components/basics/Button",
      "board": "components/board/Board",
      "partner": "components/partners/Partner",
      "partner-overview": "components/partners/Overview",
      "vacancy": "components/vacancies/Vacancy",
      "vacancy-overview": "components/vacancies/Overview",
      "activities": "components/Activities",
      "committee": "components/committees/Committee",
      "committee-overview": "components/committees/Overview",
      "society-overview": "components/societies/Overview",
      "society": "components/societies/Society",
      "vcp-page": "components/Vcp",
      "lvv-page": "components/Lvv",
      "contact-grid": "components/Contact",
      "links-page": "components/Links",
      "timeline": "components/Timeline",
      "stats-section": "components/home/StatsSection",
      "featured-partner-banner": "components/home/FeaturedPartnerBanner",
      "info-columns": "components/home/InfoColumns",
      "activities-carousel": "components/home/ActivitiesCarousel",
      "news-carousel": "components/home/NewsCarousel",
      "news-item": "components/news/News",
      "news-overview": "components/news/Overview",
      "separator": "components/basics/Separator",
      "title": "components/basics/Title",
      "current-board": "components/board/Current",
      "old-boards": "components/board/Old",
      "button-grid": "components/basics/ButtonGrid",
      "branding-colour": "components/branding/Colour",
      "branding-logos": "components/branding/Logos",
      "branding-poster": "components/branding/PosterSpecs",
      "branding-twocol": "components/branding/TwoColumn",
      "partner_carousel": "components/collaboration/PartnerCarousel",
      "promotion": "components/collaboration/Promotion",
      "partnering_reasons": "components/collaboration/PartneringReasons",
      "collaboration-form": "components/collaboration/ContactForm"
    },
  }), react(), preload()],
  vite: {
    plugins: [mkcert(), tailwindcss()],
  },
});