import { type IconName, icons } from "@zupy/icons";
import { llms, loader } from "fumadocs-core/source";
import { defineDocs } from "fumadocs-mdx/macro";
import { icons as lucide } from "lucide-react";
import { type ComponentType, createElement } from "react";
import { docsRoute, getPageMarkdownUrl, siteUrl } from "@/lib/shared";

/** `icon: HelloIcon` in frontmatter picks a zupy icon; any other name falls back to Lucide. */
function resolveIcon(name: string): ComponentType | undefined {
	return icons[name as IconName] ?? lucide[name as keyof typeof lucide];
}

export const docs = defineDocs({
	dir: "content/docs",
	docs: {
		async: true,
		postprocess: {
			includeProcessedMarkdown: true,
		},
	},
});

export const source = loader({
	source: docs.toFumadocsSource(),
	baseUrl: docsRoute,
	icon(name) {
		const Icon = name ? resolveIcon(name) : undefined;
		return Icon ? createElement(Icon) : undefined;
	},
});

/** Absolute URL of a docs page's Markdown copy, e.g. https://zupy-ui.github.io/docs/components/button.md */
function absoluteMarkdownUrl(url: string) {
	const slugs = url.slice(docsRoute.length).split("/").filter(Boolean);
	return `${siteUrl}${getPageMarkdownUrl({ slugs }).url}`;
}

export const docsLlms = llms(source, {
	renderPage: async (
		page,
	) => `# ${page.data.title} (${absoluteMarkdownUrl(page.url)})

${await page.data.getText("processed")}`,
});

/**
 * `llms.txt` following https://llmstxt.org: a title, a one-line summary, then every page linked
 * by the absolute URL of its Markdown copy so agents can fetch pages directly.
 */
export async function llmsIndex() {
	const index = (await docsLlms.index())
		.replace(/^# .*\n+/, "")
		.replace(
			/\]\((\/docs[^)]*)\)/g,
			(_, url: string) => `](${absoluteMarkdownUrl(url)})`,
		);
	return `# zupy

> Tactile React components with chunky edges, hard shadows and springy motion. Built on Base UI and Tailwind CSS v4. Install with \`bun add @zupy/ui\`.

Every page in one file: ${siteUrl}/llms-full.txt

${index}`;
}
