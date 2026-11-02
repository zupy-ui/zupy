import { Link } from "@tanstack/react-router";
import { Button } from "@zupy/ui";
import { Logo } from "@/components/logo";
import { githubUrl } from "@/lib/shared";

/** Header for the landing and examples pages. The docs use Fumadocs' nav instead. */
export function SiteHeader() {
	return (
		<header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
			<Link to="/" aria-label="zupy home">
				<Logo size={40} />
			</Link>
			<nav className="flex items-center gap-2">
				<Button
					variant="ghost"
					size="sm"
					render={<Link to="/docs/$" params={{ _splat: "" }} />}
				>
					Docs
				</Button>
				<Button
					variant="ghost"
					size="sm"
					render={
						<Link
							to="/examples"
							activeProps={{ className: "bg-surface text-primary" }}
						/>
					}
				>
					Examples
				</Button>
				<Button variant="secondary" size="sm" render={<a href={githubUrl} />}>
					GitHub
				</Button>
			</nav>
		</header>
	);
}
