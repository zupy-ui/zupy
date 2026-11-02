import { glob } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { getSlugs } from "fumadocs-core/source";
import { fumadocsMdx } from "fumadocs-mdx/vite";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

const pkg = (path: string) =>
	fileURLToPath(new URL(`../../packages/${path}`, import.meta.url));

/** "/" by default (the site is served at the domain root). Set BASE_PATH to host it in a subfolder. */
const base = process.env.BASE_PATH ?? "/";

const docSlugs: string[][] = [];
for await (const entry of glob("**/*.mdx", { cwd: "content/docs" })) {
	docSlugs.push(getSlugs(entry));
}

// OG images are binary, so Nitro prerenders them (TanStack's prerender saves responses as text).
const imageRoutes = docSlugs.map(
	(slugs) => `/og/docs/${[...slugs, "image.webp"].join("/")}`,
);

// The Markdown copy of every page, for AI tools. Nothing links to most of them.
const markdownPages = docSlugs.map((slugs) => ({
	path: `/docs/${slugs.length ? slugs.join("/") : "index"}.md`,
}));

export default defineConfig({
	base,
	server: {
		port: 3000,
	},
	optimizeDeps: {
		// Start must strip server-only branches before Vite bundles this dependency.
		exclude: ["@tanstack/start-client-core"],
	},
	plugins: [
		fumadocsMdx(),
		tailwindcss(),
		tanstackStart({
			// The prerenderer prefixes page paths with this, so `pages` stay base-less.
			router: { basepath: base.replace(/\/$/, "") || "/" },
			prerender: {
				enabled: true,
				crawlLinks: true,
			},
			// Not linked from any page, so the crawler wouldn't find them on its own.
			pages: [
				{ path: "/" },
				{ path: "/docs" },
				{ path: "/api/search" },
				{ path: "/llms.txt" },
				{ path: "/llms-full.txt" },
				...markdownPages,
			],
		}),
		react(),
		nitro({
			prerender: { routes: imageRoutes },
		}),
	],
	resolve: {
		tsconfigPaths: true,
		// Point at library source so edits hot-reload without a rebuild.
		alias: [
			{ find: /^@zupy\/ui$/, replacement: pkg("ui/src/index.ts") },
			{
				find: /^@zupy\/ui\/styles\.css$/,
				replacement: pkg("ui/src/styles.css"),
			},
			{ find: /^@zupy\/icons$/, replacement: pkg("icons/src/index.ts") },
			{ find: "tslib", replacement: "tslib/tslib.es6.js" },
		],
	},
});
