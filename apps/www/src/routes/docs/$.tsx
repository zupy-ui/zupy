import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useFumadocsLoader } from "fumadocs-core/source/client";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import {
	DocsBody,
	DocsDescription,
	DocsPage,
	DocsTitle,
	MarkdownCopyButton,
	ViewOptionsPopover,
} from "fumadocs-ui/layouts/docs/page";
import {
	TOCPopover,
	TOCProvider,
} from "fumadocs-ui/layouts/docs/page/slots/toc";
import { Suspense, use } from "react";
import {
	NavTitle,
	sidebarComponents,
	ThemeSwitch,
} from "@/components/docs-sidebar";
import { DocsTOC } from "@/components/docs-toc";
import { useMDXComponents } from "@/components/mdx";
import { baseOptions } from "@/lib/layout.shared";
import {
	getPageImageUrl,
	getPageMarkdownUrl,
	gitConfig,
	githubUrl,
	siteUrl,
	withBase,
} from "@/lib/shared";
import { docs, source } from "@/lib/source";
import { staticLoaderMiddleware } from "@/lib/static-loader";

export const Route = createFileRoute("/docs/$")({
	component: Page,
	loader: async ({ params }) => {
		const slugs = params._splat?.split("/") ?? [];
		const data = await serverLoader({ data: slugs });
		await docs.getPage(data.path)?.preload();
		return data;
	},
	head: ({ loaderData }) => ({
		meta: loaderData
			? [
					{
						property: "og:image",
						content: `${siteUrl}${getPageImageUrl({ slugs: loaderData.slugs }).url}`,
					},
				]
			: [],
	}),
});

// The static middleware saves each result as JSON at build time, so client-side navigation
// works on GitHub Pages without a server.
const serverLoader = createServerFn({
	method: "GET",
})
	.validator((slugs: string[]) => slugs)
	.middleware([staticLoaderMiddleware])
	.handler(async ({ data: slugs }) => {
		const page = source.getPage(slugs);
		if (!page) throw notFound();

		return {
			path: page.path,
			slugs: page.slugs,
			markdownUrl: withBase(getPageMarkdownUrl(page).url),
			pageTree: await source.serializePageTree(source.getPageTree()),
		};
	});

function Content({ path, markdownUrl }: { path: string; markdownUrl: string }) {
	const page = docs.getPage(path);
	if (!page) throw new Error(`unknown page: ${path}`);

	const { toc } = use(page.load());
	const MDX = page.body;

	return (
		<DocsPage
			toc={toc}
			slots={{
				toc: { provider: TOCProvider, main: DocsTOC, popover: TOCPopover },
			}}
		>
			<DocsTitle>{page.title}</DocsTitle>
			<DocsDescription>{page.description}</DocsDescription>
			<div className="flex flex-row gap-2 items-center border-b -mt-4 pb-6">
				<MarkdownCopyButton markdownUrl={markdownUrl} />
				<ViewOptionsPopover
					markdownUrl={markdownUrl}
					githubUrl={`${githubUrl}/blob/${gitConfig.branch}/apps/www/content/docs/${path}`}
				/>
			</div>
			<DocsBody>
				<MDX components={useMDXComponents()} />
			</DocsBody>
		</DocsPage>
	);
}

function Page() {
	const { path, pageTree, markdownUrl } = useFumadocsLoader(
		Route.useLoaderData(),
	);

	return (
		<DocsLayout
			{...baseOptions()}
			tree={pageTree}
			sidebar={{ components: sidebarComponents }}
			slots={{ navTitle: NavTitle, themeSwitch: ThemeSwitch }}
		>
			<Suspense>
				<Content path={path} markdownUrl={markdownUrl} />
			</Suspense>
		</DocsLayout>
	);
}
