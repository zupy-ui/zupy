/**
 * Static server functions for GitHub Pages.
 *
 * Adapted from `@tanstack/start-static-server-functions`, which fetches its cache from
 * `/__tsr/...` and so breaks when the site lives under a base path like `/zupy/`.
 * At build time (prerender) each result is written to `__tsr/staticServerFnCache/<hash>.json`;
 * in the browser the same file is fetched from under the base path instead of calling a server.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { createMiddleware } from "@tanstack/react-start";
import {
	defaultSerovalDeserializerPlugins,
	getDefaultSerovalPlugins,
	getSerovalPlugins,
} from "@tanstack/start-client-core";
import { fromJSON, toJSONAsync } from "seroval";
import { basePath } from "@/lib/shared";

const CACHE_DIR = "__tsr/staticServerFnCache";

async function sha1(message: string) {
	const buffer = await crypto.subtle.digest(
		"SHA-1",
		new TextEncoder().encode(message),
	);
	return Array.from(new Uint8Array(buffer))
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
}

/** Stable, filename-safe key for the function input (object keys sorted). */
function stableKey(data: unknown) {
	return JSON.stringify(data ?? "", (_key, value) =>
		value && typeof value === "object" && !Array.isArray(value)
			? Object.fromEntries(
					Object.keys(value)
						.sort()
						.map((k) => [k, value[k]]),
				)
			: value,
	)
		.replace(/[/\\?%*:|"<>]/g, "-")
		.replace(/\s+/g, "_");
}

/** Cache file path relative to the site root, e.g. `__tsr/staticServerFnCache/ab12….json`. */
async function cacheFile(functionId: string, data: unknown) {
	return `${CACHE_DIR}/${await sha1(`${functionId}__${stableKey(data)}`)}.json`;
}

export const staticLoaderMiddleware = createMiddleware({ type: "function" })
	.client(async (ctx) => {
		if (
			process.env.NODE_ENV === "production" &&
			typeof document !== "undefined"
		) {
			const file = await cacheFile(ctx.serverFnMeta.id, ctx.data);
			const json = await fetch(`${basePath}${file}`).then((r) => r.json());
			const response = fromJSON(json, {
				plugins: getSerovalPlugins(defaultSerovalDeserializerPlugins),
			}) as { result: unknown; context: Record<string, unknown> };
			return {
				result: response.result,
				context: { ...(ctx.context as unknown as object), ...response.context },
			} as never;
		}
		return ctx.next();
	})
	.server(async (ctx) => {
		const response = await ctx.next();
		const outDir = process.env.TSS_CLIENT_OUTPUT_DIR;
		if (process.env.NODE_ENV === "production" && outDir) {
			const filePath = path.join(
				outDir,
				await cacheFile(ctx.serverFnMeta.id, ctx.data),
			);
			await fs.mkdir(path.dirname(filePath), { recursive: true });
			// Same payload shape as the upstream package: the result plus the context sent to the client.
			const { sendContext } = ctx as unknown as { sendContext?: unknown };
			const { result } = response as unknown as { result: unknown };
			const json = await toJSONAsync(
				{ result, context: sendContext },
				{ plugins: getDefaultSerovalPlugins() },
			);
			await fs.writeFile(filePath, JSON.stringify(json), "utf-8");
		}
		return response;
	});
