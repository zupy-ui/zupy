import type { ReactNode } from "react";

/**
 * zupy-style icons: a chunky outline, an accent fill and a hard drop shadow in the edge color,
 * like a tiny raised tile.
 *
 * Two inks keep every part readable in light and dark mode:
 * - `outside`: the body outline and strokes beyond the fill, in `--zupy-icon-outline` (text color)
 * - `children`: details drawn on the fill, in `--zupy-icon-ink` (accent foreground)
 * `--zupy-icon-fill` (accent) can be swapped too, e.g. on an accent row.
 */
function TactileIcon({
	body,
	outside,
	children,
}: {
	body: string;
	outside?: ReactNode;
	children?: ReactNode;
}) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			style={{ color: "var(--zupy-icon-outline, var(--zupy-foreground))" }}
			aria-hidden
		>
			<path
				d={body}
				transform="translate(0 1.75)"
				style={{ fill: "var(--zupy-edge)", stroke: "var(--zupy-edge)" }}
			/>
			<path
				d={body}
				style={{ fill: "var(--zupy-icon-fill, var(--zupy-accent))" }}
			/>
			{outside}
			<g
				style={{ color: "var(--zupy-icon-ink, var(--zupy-accent-foreground))" }}
			>
				{children}
			</g>
		</svg>
	);
}

const dot = { fill: "currentColor", stroke: "none" } as const;

/** A speech bubble saying hello. */
export function HelloIcon() {
	return (
		<TactileIcon body="M8 3h8a5 5 0 0 1 5 5v3a5 5 0 0 1-5 5h-4.5l-4 3.5v-3.8A5 5 0 0 1 3 11V8a5 5 0 0 1 5-5z">
			<circle cx="9.5" cy="8.5" r="1.2" {...dot} />
			<circle cx="14.5" cy="8.5" r="1.2" {...dot} />
			<path d="M9.5 11.6c1.4 1.3 3.6 1.3 5 0" />
		</TactileIcon>
	);
}

/** A box with an arrow dropping into it. */
export function InstallIcon() {
	return (
		<TactileIcon
			body="M4 11h16v7a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 18z"
			outside={
				<>
					<path d="M12 2.5v6" />
					<path d="M9 6l3 3 3-3" />
				</>
			}
		>
			<path d="M10 15.5h4" />
		</TactileIcon>
	);
}

/** A paint palette with three dabs. */
export function ThemeIcon() {
	return (
		<TactileIcon body="M12 3a9 9 0 1 0 0 18c1.3 0 2-.9 2-1.9 0-.6-.3-1-.6-1.4-.4-.4-.6-.8-.6-1.4 0-1.1.9-2 2-2h2.3a4 4 0 0 0 3.9-4C21 6.3 17 3 12 3z">
			<circle cx="7.5" cy="11" r="1.3" {...dot} />
			<circle cx="9.5" cy="7" r="1.3" {...dot} />
			<circle cx="14.5" cy="7" r="1.3" {...dot} />
		</TactileIcon>
	);
}

/** A friendly robot head. */
export function RobotIcon() {
	return (
		<TactileIcon
			body="M8 7.5h8a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-4a4 4 0 0 1 4-4z"
			outside={
				<>
					<path d="M12 7.5V4.5" />
					<circle cx="12" cy="3.5" r="1.4" {...dot} />
					<path d="M2 12.5v2M22 12.5v2" />
				</>
			}
		>
			<circle cx="9.5" cy="12.5" r="1.3" {...dot} />
			<circle cx="14.5" cy="12.5" r="1.3" {...dot} />
			<path d="M10.5 16h3" />
		</TactileIcon>
	);
}

/** Names usable as `icon:` in docs frontmatter. */
export const pageIcons: Record<string, () => ReactNode> = {
	hello: HelloIcon,
	install: InstallIcon,
	theme: ThemeIcon,
	robot: RobotIcon,
};
