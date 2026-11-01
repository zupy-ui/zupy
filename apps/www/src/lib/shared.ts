import { createGetUrl } from "fumadocs-core/source";

export const appName = "zupy";
export const docsRoute = "/docs";
export const docsImageRoute = "/og/docs";

export const gitConfig = {
	user: "zupy-ui",
	repo: "zupy",
	branch: "main",
};

export const githubUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;

/** The published docs site (GitHub Pages, deployed to the zupy-ui.github.io repo). */
export const siteUrl = "https://zupy-ui.github.io";

/** Where the app is served from: "/" unless built with BASE_PATH. Always ends with "/". */
export const basePath = import.meta.env.BASE_URL;

/**
 * Prefixes a root-relative path with the base path. Use it for raw URLs (images, fetches, plain
 * `<a>` tags); router `<Link>`s already get the base path.
 */
export function withBase(path: string) {
	return `${basePath}${path.replace(/^\//, "")}`;
}

const getDocsUrl = createGetUrl(docsRoute);

export function getPageMarkdownUrl(page: { slugs: string[]; locale?: string }) {
	const segments = [...page.slugs];
	if (segments.length === 0) {
		segments.push("index.md");
	} else {
		segments[segments.length - 1] += ".md";
	}

	return { segments, url: getDocsUrl(segments, page.locale) };
}

/** @returns page slugs */
export function decodeMarkdownUrl(segments: string[]) {
	if (segments.length === 0) return [];

	const out = [...segments];
	out[out.length - 1] = out[out.length - 1].replace(/\.md$/, "");
	if (out.length === 1 && out[0] === "index") out.pop();
	return out;
}

const getImageUrl = createGetUrl(docsImageRoute);

export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
	const segments = [...page.slugs, "image.webp"];

	return { segments, url: getImageUrl(segments, page.locale) };
}
