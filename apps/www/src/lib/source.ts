import { type IconName, icons } from "@zupy/icons";
import { llms, loader } from "fumadocs-core/source";
import { defineDocs } from "fumadocs-mdx/macro";
import { icons as lucide } from "lucide-react";
import { type ComponentType, createElement } from "react";
import { docsRoute } from "@/lib/shared";

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

export const docsLlms = llms(source, {
	renderPage: async (page) => `# ${page.data.title} (${page.url})

${await page.data.getText("processed")}`,
});
