import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { fumadocsMdx } from "fumadocs-mdx/vite";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

const pkg = (path: string) =>
	fileURLToPath(new URL(`../../packages/${path}`, import.meta.url));

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
