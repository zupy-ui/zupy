import { createFileRoute, Link } from "@tanstack/react-router";
import {
	HeartIcon,
	HelloIcon,
	InstallIcon,
	RobotIcon,
	StarIcon,
	ThemeIcon,
} from "@zupy/icons";
import { type ThemeName, themes } from "@zupy/tokens";
import { Badge, Button, Card, IconButton, Switch } from "@zupy/ui";
import { ArrowRight, Check, Copy } from "lucide-react";
import { type ComponentType, useState } from "react";
import { Logo } from "@/components/logo";
import { SiteHeader } from "@/components/site-header";
import { examples } from "@/lib/examples";
import { githubUrl, withBase } from "@/lib/shared";

export const Route = createFileRoute("/")({
	component: Home,
});

const themeBlurb: Record<ThemeName, string> = {
	pop: "Cream paper, ink edges",
	arcade: "Navy outlines, bold blue",
	gloss: "Borderless glossy tiles",
};

const features: {
	icon: ComponentType<{ className?: string; tone?: "primary" | "accent" }>;
	title: string;
	text: string;
}[] = [
	{
		icon: StarIcon,
		title: "Made to be pressed",
		text: "Hard shadows and springy motion. Raised things sink into their shadow when you press them.",
	},
	{
		icon: HelloIcon,
		title: "Accessible underneath",
		text: "Built on Base UI, so keyboard, focus and screen reader behavior come for free.",
	},
	{
		icon: ThemeIcon,
		title: "Themes from tokens",
		text: "Color, shape and depth live in one set of tokens. Swap a theme and everything follows.",
	},
	{
		icon: InstallIcon,
		title: "Fits your stack",
		text: "Plain React and Tailwind v4 classes. Typed props, a render prop for any element, no lock-in.",
	},
	{
		icon: HeartIcon,
		title: "Icons that match",
		text: "A tactile icon set drawn with the same outlines and shadows, plus a helper to make your own.",
	},
	{
		icon: RobotIcon,
		title: "Docs your AI can read",
		text: "Every page has a Markdown copy, and llms.txt points your assistant at all of them.",
	},
];

const featured = examples[0];

function Home() {
	const [theme, setTheme] = useState<ThemeName>("pop");

	return (
		<div
			data-theme={theme}
			className="min-h-screen overflow-x-clip bg-background text-foreground"
		>
			<SiteHeader />

			<main className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
				<Hero />
				<Playground theme={theme} onThemeChange={setTheme} />
				<Features />
				<Themes />
				<Showcase />
				<ForAI />
				<CallToAction />
			</main>

			<Footer />
		</div>
	);
}

function Hero() {
	return (
		<section className="relative pt-12 pb-16 text-center sm:pt-20">
			<StarIcon
				tone="accent"
				aria-hidden
				className="absolute top-16 left-2 hidden size-16 -rotate-12 md:block lg:left-10"
			/>
			<HeartIcon
				tone="primary"
				aria-hidden
				className="absolute top-40 right-4 hidden size-14 rotate-12 md:block lg:right-14"
			/>
			<Badge variant="primary">v0 · early preview</Badge>
			<h1 className="mx-auto mt-6 max-w-3xl font-bold font-display text-5xl leading-[1.05] tracking-tight sm:text-7xl">
				Components you want to <span className="text-primary">press</span>.
			</h1>
			<p className="mx-auto mt-5 max-w-xl text-lg text-muted">
				Chunky edges, hard shadows and springy motion for React. Built on Base
				UI and Tailwind v4, with docs your AI can read.
			</p>
			<div className="mt-8 flex flex-wrap items-center justify-center gap-3">
				<Button
					size="lg"
					render={<Link to="/docs/$" params={{ _splat: "" }} />}
				>
					Get started
				</Button>
				<Button size="lg" variant="secondary" render={<Link to="/examples" />}>
					See examples <ArrowRight />
				</Button>
			</div>
			<InstallCommand />
		</section>
	);
}

function InstallCommand() {
	const command = "bun add @zupy/ui";
	const [copied, setCopied] = useState(false);

	return (
		<div className="mx-auto mt-8 flex w-fit items-center gap-2 rounded-full border-2 border-border bg-surface py-1 pr-1 pl-4 font-mono text-sm">
			<span className="text-muted select-none">$</span>
			<code>{command}</code>
			<IconButton
				variant="ghost"
				size="sm"
				className="size-8 rounded-full"
				aria-label={copied ? "Copied" : "Copy install command"}
				onClick={() => {
					navigator.clipboard?.writeText(command).then(() => {
						setCopied(true);
						setTimeout(() => setCopied(false), 1500);
					});
				}}
			>
				{copied ? <Check /> : <Copy />}
			</IconButton>
		</div>
	);
}

function Playground({
	theme,
	onThemeChange,
}: {
	theme: ThemeName;
	onThemeChange: (theme: ThemeName) => void;
}) {
	return (
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
							onClick={() => onThemeChange(name)}
							className="capitalize"
						>
							{name}
						</Button>
					))}
				</div>
			</div>

			<div className="mt-8 grid gap-6 md:grid-cols-2">
				<Buttons />
				<Counter />
			</div>
		</section>
	);
}

function Buttons() {
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

function SectionHeading({
	eyebrow,
	title,
	text,
}: {
	eyebrow: string;
	title: string;
	text: string;
}) {
	return (
		<div className="mx-auto max-w-2xl text-center">
			<p className="font-display font-semibold text-primary text-sm uppercase tracking-widest">
				{eyebrow}
			</p>
			<h2 className="mt-3 font-bold font-display text-4xl tracking-tight sm:text-5xl">
				{title}
			</h2>
			<p className="mt-4 text-lg text-muted">{text}</p>
		</div>
	);
}

function Features() {
	return (
		<section className="pt-24 sm:pt-32">
			<SectionHeading
				eyebrow="Why zupy"
				title="Feels good. Works properly."
				text="The fun is on the surface. Underneath it's the boring, solid stuff you'd want anyway."
			/>
			<div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
				{features.map(({ icon: Icon, title, text }) => (
					<Card key={title}>
						<Icon className="size-11" />
						<h3 className="mt-4 font-display font-semibold text-xl">{title}</h3>
						<p className="mt-2 text-muted leading-relaxed">{text}</p>
					</Card>
				))}
			</div>
		</section>
	);
}

function Themes() {
	return (
		<section className="pt-24 sm:pt-32">
			<SectionHeading
				eyebrow="Theming"
				title="Same code. Different personality."
				text="Every theme is a set of tokens. The markup below is identical in all three."
			/>
			<div className="mt-12 grid gap-5 md:grid-cols-3">
				{(Object.keys(themes) as ThemeName[]).map((name) => (
					<div
						key={name}
						data-theme={name}
						className="rounded-xl bg-background p-5 text-foreground"
					>
						<ThemeSample name={name} />
					</div>
				))}
			</div>
			<p className="mt-8 text-center">
				<Button
					variant="ghost"
					render={<Link to="/docs/$" params={{ _splat: "theming" }} />}
				>
					Make your own theme <ArrowRight />
				</Button>
			</p>
		</section>
	);
}

function ThemeSample({ name }: { name: ThemeName }) {
	const [on, setOn] = useState(true);
	return (
		<Card>
			<div className="flex items-center justify-between">
				<span className="font-display font-semibold text-lg capitalize">
					{name}
				</span>
				<Badge variant="accent">New</Badge>
			</div>
			<p className="mt-2 text-muted text-sm">{themeBlurb[name]}</p>
			<label className="mt-5 flex items-center justify-between gap-3 text-sm">
				Notifications
				<Switch checked={on} onCheckedChange={setOn} />
			</label>
			<div className="mt-5 flex gap-2">
				<Button size="sm" className="flex-1">
					Save
				</Button>
				<Button size="sm" variant="secondary" className="flex-1">
					Cancel
				</Button>
			</div>
		</Card>
	);
}

function Showcase() {
	const Preview = featured.component;
	return (
		<section className="grid items-center gap-10 pt-24 sm:pt-32 lg:grid-cols-5 lg:gap-14">
			<div className="lg:col-span-2">
				<p className="font-display font-semibold text-primary text-sm uppercase tracking-widest">
					Examples
				</p>
				<h2 className="mt-3 font-bold font-display text-4xl tracking-tight sm:text-5xl">
					Whole apps, not just buttons.
				</h2>
				<p className="mt-4 text-lg text-muted">
					See how the pieces come together in full pages you can click around.
					Switch themes while you're there.
				</p>
				<Button
					className="mt-7"
					render={<Link to="/examples/$id" params={{ id: featured.id }} />}
				>
					Open {featured.title} <ArrowRight />
				</Button>
			</div>
			<Link
				to="/examples/$id"
				params={{ id: featured.id }}
				aria-label={`Open the ${featured.title} example`}
				className="raised group block overflow-hidden rounded-xl bg-card focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-ring lg:col-span-3"
			>
				<div className="flex items-center gap-1.5 border-border border-b-2 px-4 py-3">
					<span className="size-3 rounded-full bg-danger" />
					<span className="size-3 rounded-full bg-warning" />
					<span className="size-3 rounded-full bg-success" />
				</div>
				{/* A live, shrunken copy of the example. */}
				<div
					aria-hidden
					inert
					className="pointer-events-none relative aspect-16/10 overflow-hidden"
				>
					<div className="absolute top-0 left-0 w-[200%] origin-top-left scale-50 motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[0.52]">
						<Preview />
					</div>
				</div>
			</Link>
		</section>
	);
}

function ForAI() {
	const links = [
		{ label: "llms.txt", href: "/llms.txt", text: "An index of every page" },
		{
			label: "llms-full.txt",
			href: "/llms-full.txt",
			text: "All the docs in one file",
		},
		{
			label: "/docs/<page>.md",
			href: "/docs/installation.md",
			text: "A Markdown copy of each page",
		},
	];

	return (
		<section className="grid items-center gap-10 pt-24 sm:pt-32 lg:grid-cols-2 lg:gap-14">
			<Card variant="sunken" padding="lg" className="font-mono text-sm">
				<p className="text-muted"># install</p>
				<p className="mt-1">bun add @zupy/ui</p>
				<p className="mt-5 text-muted">{"/* app.css */"}</p>
				<p className="mt-1">@import "tailwindcss";</p>
				<p>@import "@zupy/ui/styles.css";</p>
				<p className="mt-5 text-muted">{"// app.tsx"}</p>
				<p className="mt-1">
					<span className="text-primary">import</span> {"{ Button }"}{" "}
					<span className="text-primary">from</span> "@zupy/ui";
				</p>
				<p className="mt-3">{"<Button>Press me</Button>"}</p>
			</Card>
			<div>
				<RobotIcon className="size-12" />
				<h2 className="mt-5 font-bold font-display text-4xl tracking-tight sm:text-5xl">
					Your AI already knows it.
				</h2>
				<p className="mt-4 text-lg text-muted">
					Point your coding assistant at the docs and it gets plain Markdown,
					props and examples. No scraping, no guessing.
				</p>
				<ul className="mt-6 flex flex-col gap-3">
					{links.map((link) => (
						<li key={link.label}>
							<a
								href={withBase(link.href)}
								className="group flex items-center justify-between gap-4 rounded-lg border-2 border-border bg-card px-4 py-3 hover:border-primary focus-visible:outline-3 focus-visible:outline-ring"
							>
								<span>
									<code className="font-mono font-semibold text-sm">
										{link.label}
									</code>
									<span className="block text-muted text-sm">{link.text}</span>
								</span>
								<ArrowRight
									aria-hidden
									className="size-4 shrink-0 text-muted group-hover:text-primary"
								/>
							</a>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}

function CallToAction() {
	return (
		<section className="raised relative mt-24 overflow-hidden rounded-xl bg-primary px-6 py-14 text-center text-primary-foreground sm:mt-32 sm:px-12 sm:py-20">
			<StarIcon
				tone="accent"
				aria-hidden
				className="absolute -top-4 -left-4 size-28 -rotate-12 opacity-90 sm:size-36"
			/>
			<StarIcon
				tone="accent"
				aria-hidden
				className="absolute -right-6 -bottom-8 size-32 rotate-12 opacity-90 sm:size-44"
			/>
			<h2 className="relative font-bold font-display text-4xl tracking-tight sm:text-6xl">
				Make something you want to press.
			</h2>
			<p className="relative mx-auto mt-4 max-w-md text-lg opacity-90">
				Start with one button. The rest follows.
			</p>
			<div className="relative mt-8 flex flex-wrap justify-center gap-3">
				<Button
					size="lg"
					variant="accent"
					render={<Link to="/docs/$" params={{ _splat: "" }} />}
				>
					Get started <ArrowRight />
				</Button>
				<Button size="lg" variant="secondary" render={<a href={githubUrl} />}>
					Star on GitHub
				</Button>
			</div>
		</section>
	);
}

function Footer() {
	const linkClass =
		"rounded-sm hover:text-primary focus-visible:outline-2 focus-visible:outline-ring";
	return (
		<footer className="border-border border-t-2">
			<div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
				<div className="flex items-center gap-3">
					<Logo size={28} />
					<p className="text-muted text-sm">
						Tactile React components. MIT licensed.
					</p>
				</div>
				<nav aria-label="Footer" className="flex gap-6 text-muted text-sm">
					<Link to="/docs/$" params={{ _splat: "" }} className={linkClass}>
						Docs
					</Link>
					<Link to="/examples" className={linkClass}>
						Examples
					</Link>
					<a href={withBase("/llms.txt")} className={linkClass}>
						llms.txt
					</a>
					<a href={githubUrl} className={linkClass}>
						GitHub
					</a>
				</nav>
			</div>
		</footer>
	);
}
