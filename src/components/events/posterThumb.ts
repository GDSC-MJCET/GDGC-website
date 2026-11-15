import { EVENT_PHOTOS, POSTER_THUMBS } from "./posterThumbs";

/** The phone-sized copy of an event poster (made by `npm run posters`), or the original when there is none. */
export const thumbOf = (src: string) => POSTER_THUMBS[src] ?? src;

/** The page-sized copy of an event photo (made by `npm run posters`), or the original when there is none. */
export const photoOf = (src: string) => EVENT_PHOTOS[src] ?? src;
