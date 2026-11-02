import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge, Card } from "@zupy/ui";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { examples } from "@/lib/examples";

export const Route = createFileRoute("/examples/")({
	head: () => ({
		meta: [
			{ title: "Examples · zupy" },
			{
				name: "description",
				content: "Full, interactive pages built with zupy components.",
			},
		],
	}),
	component: Examples,
});

function Examples() {
	return (
		<div className="min-h-screen bg-background text-foreground">
			<SiteHeader />
			<main className="mx-auto max-w-6xl px-4 pt-12 pb-24 sm:px-6 sm:pt-16">
				<h1 className="font-bold font-display text-5xl tracking-tight sm:text-6xl">
					Examples
				</h1>
				<p className="mt-4 max-w-xl text-lg text-muted">
					Full pages built from zupy components. Open one, click around, then
					grab the source.
				</p>

				<ul className="mt-12 grid gap-8 md:grid-cols-2">
					{examples.map((example) => {
						const Preview = example.component;
						return (
							<li key={example.id}>
								<Card
									padding="none"
									className="group block overflow-hidden motion-safe:transition-transform motion-safe:duration-200 motion-safe:hover:-translate-y-1"
									render={
										<Link to="/examples/$id" params={{ id: example.id }} />
									}
								>
									{/* A live, shrunken copy of the example as the thumbnail. */}
									<div
										aria-hidden
										inert
										className="pointer-events-none relative aspect-16/10 overflow-hidden bg-background"
									>
										<div className="absolute top-0 left-0 w-[400%] origin-top-left scale-25">
											<Preview />
										</div>
									</div>
									<div className="flex items-center justify-between gap-4 border-border border-t-2 p-5 sm:p-6">
										<div>
											<h2 className="font-display font-semibold text-2xl">
												{example.title}
											</h2>
											<p className="mt-1 text-muted text-sm">
												{example.description}
											</p>
										</div>
										<span className="raised flex size-10 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
											<ArrowUpRight className="size-5" aria-hidden />
										</span>
									</div>
								</Card>
							</li>
						);
					})}
					<li>
						<Card
							variant="sunken"
							className="flex h-full min-h-48 flex-col items-center justify-center gap-3 text-center"
						>
							<Badge>Coming soon</Badge>
							<p className="text-muted">More examples on the way.</p>
						</Card>
					</li>
				</ul>
			</main>
		</div>
	);
}
