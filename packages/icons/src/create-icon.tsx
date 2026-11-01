import type { ReactNode, SVGProps } from "react";

// Fallbacks match the default `pop` theme, so icons also look right without zupy's CSS.
const OUTLINE = "var(--zupy-icon-outline, var(--zupy-foreground, #1b1530))";
const FILL = "var(--zupy-icon-fill, var(--zupy-accent, #ffd400))";
const INK = "var(--zupy-icon-ink, var(--zupy-accent-foreground, #1b1530))";
const EDGE = "var(--zupy-edge, #1b1530)";

const tones = {
	accent: ["--zupy-accent", "--zupy-accent-foreground"],
	primary: ["--zupy-primary", "--zupy-primary-foreground"],
	success: ["--zupy-success", "--zupy-success-foreground"],
	warning: ["--zupy-warning", "--zupy-warning-foreground"],
	danger: ["--zupy-danger", "--zupy-danger-foreground"],
	neutral: ["--zupy-card", "--zupy-foreground"],
} as const;

export type IconTone = keyof typeof tones;

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "children"> {
	/** Width and height. @default "1em" */
	size?: number | string;
	/** Fill color from the theme. Without it the icon uses the accent, or whatever a parent sets. */
	tone?: IconTone;
	/** Accessible name. Without it the icon is decorative and hidden from screen readers. */
	title?: string;
}

export interface IconShape {
	/** The main shape, as SVG path data. Filled, outlined and lifted on a hard shadow. */
	body: string;
	/** Strokes outside the body (handles, antennas, arrows), drawn in the outline color. */
	outside?: ReactNode;
	/** Details drawn on top of the body (eyes, dots, lines), in the ink color. */
	details?: ReactNode;
}

/**
 * Builds a zupy icon from a 24×24 shape. The body gets an accent fill, a 2px outline and a hard
 * drop shadow; `outside` and `details` are drawn on top.
 *
 * Colors come from CSS variables, so a parent can restyle every icon inside it:
 * `--zupy-icon-fill`, `--zupy-icon-ink` and `--zupy-icon-outline`.
 *
 * @example
 * export const CloudIcon = createIcon("CloudIcon", {
 *   body: "M7 18a4 4 0 0 1-.5-8 6 6 0 0 1 11.5 1.5A3.5 3.5 0 0 1 17.5 18z",
 *   details: <path d="M9 14h6" />,
 * });
 */
export function createIcon(displayName: string, shape: IconShape) {
	const { body, outside, details } = shape;

	// biome-ignore lint/correctness/noComponentHookFactories: runs once per icon at module scope, like lucide's createLucideIcon.
	function Icon({ size = "1em", tone, title, style, ...props }: IconProps) {
		const toneVars = tone
			? {
					"--zupy-icon-fill": `var(${tones[tone][0]})`,
					"--zupy-icon-ink": `var(${tones[tone][1]})`,
				}
			: undefined;
		return (
			// biome-ignore lint/a11y/noSvgWithoutTitle: decorative (aria-hidden) unless `title` is passed, which renders a <title>.
			<svg
				width={size}
				height={size}
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth={2}
				strokeLinecap="round"
				strokeLinejoin="round"
				role={title ? "img" : undefined}
				aria-hidden={title ? undefined : true}
				style={{ color: OUTLINE, ...toneVars, ...style }}
				{...props}
			>
				{title ? <title>{title}</title> : null}
				<path
					d={body}
					transform="translate(0 1.75)"
					style={{ fill: EDGE, stroke: EDGE }}
				/>
				<path d={body} style={{ fill: FILL }} />
				{outside}
				<g style={{ color: INK }}>{details}</g>
			</svg>
		);
	}

	Icon.displayName = displayName;
	return Icon;
}

/** Props for a filled dot inside `outside` or `details`. */
export const dot = { fill: "currentColor", stroke: "none" } as const;
