import { createFileRoute, Link } from "@tanstack/react-router";
import { themes } from "@zupy/tokens";
import { Button } from "@zupy/ui";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { withBase } from "@/lib/shared";

export const Route = createFileRoute("/")({
	component: Home,
});

type ThemeName = keyof typeof themes;

const themeBlurb: Record<ThemeName, string> = {
	pop: "Cream paper, ink edges",
	arcade: "Navy outlines, bold blue",
	gloss: "Borderless glossy tiles",
};

function Home() {
	const [theme, setTheme] = useState<ThemeName>("pop");

	return (
		<div
			data-theme={theme}
			className="min-h-screen bg-background text-foreground"
		>
			<SiteHeader />

			<main className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
				<section className="pt-12 pb-16 text-center sm:pt-20">
					<span className="raised inline-block rounded-full bg-primary px-3 py-1 font-display font-semibold text-primary-foreground text-sm">
						v0 · early preview
					</span>
					<h1 className="mx-auto mt-6 max-w-3xl font-bold font-display text-5xl leading-[1.05] tracking-tight sm:text-7xl">
						Components you want to <span className="text-primary">press</span>.
					</h1>
					<p className="mx-auto mt-5 max-w-xl text-lg text-muted">
						Chunky edges, hard shadows and springy motion for playful React
						apps. Built on Base UI and Tailwind v4, with docs your AI can read.
					</p>
					<div className="mt-8 flex flex-wrap items-center justify-center gap-3">
						<Button
							size="lg"
							render={<Link to="/docs/$" params={{ _splat: "" }} />}
						>
							Get started
						</Button>
						<Button
							size="lg"
							variant="secondary"
							render={<a href={withBase("/llms.txt")} />}
						>
							llms.txt
						</Button>
					</div>
				</section>

				<section className="raised rounded-xl bg-card p-5 sm:p-8">
					<div className="flex flex-wrap items-center justify-between gap-4">
						<div>
							<h2 className="font-bold font-display text-2xl tracking-tight">
								Try a theme
							</h2>
							<p className="text-muted">{themeBlurb[theme]}</p>
						</div>
						<div className="flex flex-wrap gap-2">
							{(Object.keys(themes) as ThemeName[]).map((name) => (
								<Button
									key={name}
									size="sm"
									variant={name === theme ? "primary" : "secondary"}
									aria-pressed={name === theme}
									onClick={() => setTheme(name)}
									className="capitalize"
								>
									{name}
								</Button>
							))}
						</div>
					</div>

					<div className="mt-8 grid gap-6 md:grid-cols-2">
						<Showcase />
						<Counter />
					</div>
				</section>
			</main>
		</div>
	);
}

function Showcase() {
	return (
		<div className="rounded-lg bg-surface p-6">
			<p className="font-display font-semibold text-muted text-sm uppercase tracking-wide">
				Buttons
			</p>
			<div className="mt-4 flex flex-wrap gap-3">
				<Button>Primary</Button>
				<Button variant="accent">Accent</Button>
				<Button variant="secondary">Secondary</Button>
				<Button variant="danger">Danger</Button>
				<Button variant="ghost">Ghost</Button>
				<Button disabled>Disabled</Button>
			</div>
			<div className="mt-4 flex flex-wrap items-center gap-3">
				<Button size="sm">Small</Button>
				<Button size="md">Medium</Button>
				<Button size="lg">Large</Button>
			</div>
		</div>
	);
}

function Counter() {
	const [count, setCount] = useState(0);
	return (
		<div className="flex flex-col items-center justify-center gap-5 rounded-lg bg-surface p-6 text-center">
			<p className="font-display font-semibold text-muted text-sm uppercase tracking-wide">
				Go on, press it
			</p>
			<span
				key={count}
				className="inline-block animate-pop font-bold font-display text-7xl tabular-nums"
			>
				{count}
			</span>
			<Button size="lg" variant="accent" onClick={() => setCount((c) => c + 1)}>
				Boop +1
			</Button>
		</div>
	);
}
