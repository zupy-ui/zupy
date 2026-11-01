import { llms, loader } from "fumadocs-core/source";
import { defineDocs } from "fumadocs-mdx/macro";
import { icons as lucide } from "lucide-react";
import { createElement } from "react";
import { pageIcons } from "@/components/page-icons";
import { docsRoute } from "@/lib/shared";

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
	// Frontmatter `icon:` resolves to our own zupy icons first, then Lucide.
	icon(name) {
		if (!name) return;
		const Icon = pageIcons[name] ?? lucide[name as keyof typeof lucide];
		return Icon ? createElement(Icon) : undefined;
	},
});

export const docsLlms = llms(source, {
	renderPage: async (page) => `# ${page.data.title} (${page.url})

${await page.data.getText("processed")}`,
});
