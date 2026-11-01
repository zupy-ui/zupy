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

/** "/" locally; set BASE_PATH=/zupy/ for GitHub Pages. */
const base = process.env.BASE_PATH ?? "/";

// OG images are binary, so Nitro prerenders them (TanStack's prerender saves responses as text).
const imageRoutes: string[] = [];
for await (const entry of glob("**/*.mdx", { cwd: "content/docs" })) {
	imageRoutes.push(`/og/docs/${[...getSlugs(entry), "image.webp"].join("/")}`);
}

export default defineConfig({
	base,
	server: {
		port: 3000,
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
