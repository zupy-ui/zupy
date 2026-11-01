import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const pkg = (path: string) =>
	fileURLToPath(new URL(`../../packages/${path}`, import.meta.url));

export default defineConfig({
	server: { port: 3100 },
	preview: { port: 3101 },
	plugins: [tailwindcss(), react()],
	resolve: {
		tsconfigPaths: true,
		// Point at library source, like apps/www, so the trailer always shows current components.
		alias: [
			{ find: /^@zupy\/ui$/, replacement: pkg("ui/src/index.ts") },
			{
				find: /^@zupy\/ui\/styles\.css$/,
				replacement: pkg("ui/src/styles.css"),
			},
			{ find: /^@zupy\/icons$/, replacement: pkg("icons/src/index.ts") },
		],
	},
});
