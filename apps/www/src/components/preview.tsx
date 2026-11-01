import type { ReactNode } from "react";

/** Renders a live example on a zupy surface. Used from MDX as `<Preview>...</Preview>`. */
export function Preview({ children }: { children: ReactNode }) {
	return (
		<div className="not-prose my-6 flex min-h-40 flex-wrap items-center justify-center gap-3 rounded-xl border border-fd-border bg-background p-8">
			{children}
		</div>
	);
}
