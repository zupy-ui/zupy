import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import type { ThemeName } from "@zupy/tokens";
import { IconButton } from "@zupy/ui";
import { ArrowLeft, Code2, X } from "lucide-react";
import { useState } from "react";
import { ThemeFab } from "@/components/examples/theme-fab";
import { Logo } from "@/components/logo";
import { getExample } from "@/lib/examples";
import { gitConfig, githubUrl } from "@/lib/shared";

export const Route = createFileRoute("/examples/$id")({
	loader: ({ params }) => {
		if (!getExample(params.id)) throw notFound();
	},
	head: ({ params }) => {
		const example = getExample(params.id);
		if (!example) return {};
		return {
			meta: [
				{ title: `${example.title} · zupy examples` },
				{ name: "description", content: example.description },
			],
		};
	},
	component: ExamplePage,
});

/** The example fills the whole page, like a real app, under a small dismissible banner. */
function ExamplePage() {
	const { id } = Route.useParams();
	const [banner, setBanner] = useState(true);
	const [theme, setTheme] = useState<ThemeName>("pop");
	// The loader already 404s unknown ids.
	const example = getExample(id);
	if (!example) return null;
	const Example = example.component;
	const sourceUrl = `${githubUrl}/blob/${gitConfig.branch}/apps/www/src/components/examples/${example.source}`;

	return (
		<div data-theme={theme} className="min-h-screen bg-background">
			{/* In the flow on phones, so it doesn't cover the app; floating above it on wider screens. */}
			{banner && (
				<aside
					aria-label="About this example"
					className="raised z-50 mx-3 mt-3 flex items-center gap-2 rounded-full bg-card py-1.5 pr-1.5 pl-2 text-sm sm:fixed sm:inset-x-3 sm:top-3 sm:mx-auto sm:mt-0 sm:max-w-xl motion-safe:animate-pop"
				>
					<Link to="/" aria-label="zupy home" className="shrink-0">
						<Logo size={26} />
					</Link>
					<p className="min-w-0 flex-1 truncate">
						<span className="font-display font-semibold">{example.title}</span>
						<span className="text-muted"> is an example built with zupy.</span>
					</p>
					<Link
						to="/examples"
						className="flex shrink-0 items-center gap-1 rounded-full px-2 py-1 font-display font-semibold hover:text-primary focus-visible:outline-3 focus-visible:outline-ring"
					>
						<ArrowLeft className="size-4" aria-hidden />
						<span className="hidden sm:inline">Examples</span>
					</Link>
					<a
						href={sourceUrl}
						className="flex shrink-0 items-center gap-1 rounded-full px-2 py-1 font-display font-semibold hover:text-primary focus-visible:outline-3 focus-visible:outline-ring"
					>
						<Code2 className="size-4" aria-hidden />
						<span className="hidden sm:inline">Source</span>
					</a>
					<IconButton
						variant="ghost"
						size="sm"
						aria-label="Hide banner"
						className="size-8 shrink-0"
						onClick={() => setBanner(false)}
					>
						<X />
					</IconButton>
				</aside>
			)}
			<Example />
			<ThemeFab theme={theme} onThemeChange={setTheme} />
		</div>
	);
}
