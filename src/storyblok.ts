import { useStoryblokApi } from "@storyblok/astro";
import { createLogger } from "vite";

const storyblok_api = useStoryblokApi();

const logger = createLogger(undefined, { prefix: "API_cache" });

function memo<F extends (...args: any[]) => Promise<any>>(f: F): F {
  const cache: Map<string, ReturnType<F>> = new Map;

  return (async (...params: Parameters<F>) => {
    // Since storyblok parameters need to be transferred over the internet,
    // they are safe to stringify to JSON.
    const cache_key = JSON.stringify(params);
    if (!cache.has(cache_key)) {
      try {
        cache.set(cache_key, await f(...params));
        logger.info(`Retrieved non-cached result for ${f.name}(${cache_key.slice(1, cache_key.length - 1)})`);
      } catch (e: any) {
        logger.error(`Could not fetch non-cache result for ${f.name}(${cache_key.slice(1, cache_key.length - 1)}). Reason: ${e.message}.`);
        throw new Error(e.message);
      }
    }
    return cache.get(cache_key)!;
  }) as F;
}

// We memoise the results of the API calls, so that we save on
// API requests, since there is a limit on them that's easily reached
// when serving the website in development mode.
//
// Vite will only reload the modules with changes, so as long as this module
// does not change, the caches for the following functions persists across reloads.
export const getStories = memo(storyblok_api.getStories.bind(storyblok_api));
export const get = memo(storyblok_api.get.bind(storyblok_api));
export const getAll = memo(storyblok_api.getAll.bind(storyblok_api));