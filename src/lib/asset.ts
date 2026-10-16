/**
 * Prefix for files in /public when the site is served from a sub-path
 * (GitHub Pages serves this repo at /ridham-portfolio). next/link and
 * next/router add it automatically; raw src/href strings need this helper.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const asset = (path: string) => `${BASE_PATH}${path}`;
