/** Shared across themes. `pop` overshoots like Guessword's tiles; `snap` settles with no bounce. */
export const easing = {
	pop: "cubic-bezier(0.3, 1.5, 0.6, 1)",
	snap: "cubic-bezier(0.2, 0, 0, 1)",
	out: "cubic-bezier(0.16, 1, 0.3, 1)",
} as const;

export const duration = {
	press: "80ms",
	fast: "140ms",
	base: "200ms",
	slow: "320ms",
} as const;

export const font = {
	display: '"Fredoka", ui-rounded, "SF Pro Rounded", system-ui, sans-serif',
	sans: '"Inter", ui-sans-serif, system-ui, sans-serif',
	mono: '"JetBrains Mono", ui-monospace, monospace',
} as const;
