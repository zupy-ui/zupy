import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { fumadocsMdx } from "fumadocs-mdx/vite";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

const ui = (path: string) =>
	fileURLToPath(new URL(`../../packages/ui/src/${path}`, import.meta.url));

export default defineConfig({
	server: {
		port: 3000,
	},
	plugins: [
		fumadocsMdx(),
		tailwindcss(),
		tanstackStart({
			prerender: {
				enabled: true,
			},
		}),
		react(),
		nitro(),
	],
	resolve: {
		tsconfigPaths: true,
		// Point at @zupy/ui source so library edits hot-reload without a rebuild.
		alias: [
			{ find: /^@zupy\/ui$/, replacement: ui("index.ts") },
			{ find: /^@zupy\/ui\/styles\.css$/, replacement: ui("styles.css") },
			{ find: "tslib", replacement: "tslib/tslib.es6.js" },
		],
	},
});
