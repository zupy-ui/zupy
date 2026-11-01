import { cn } from "@zupy/ui";
import type { CSSProperties, ReactNode } from "react";
import { ease, pop, press, range } from "@/lib/anim";
import { useTime } from "@/lib/frame";
import { SECONDS_PER_BEAT } from "@/timeline";

/** Inline style that also accepts CSS custom properties. */
export type Style = CSSProperties & Record<`--${string}`, string | number>;

/**
 * Props that push a `pressable` element into its shadow by `amount` (0 to 1). Uses the real
 * `pressable` utility: `data-pressed` plus a scaled `--z-press`. `depth` picks the press token
 * (`sm` for compact controls) or a distance in pixels for oversized elements.
 */
export function pressed(amount: number, depth: "md" | "sm" | number = "md") {
	const distance =
		typeof depth === "number"
			? `${depth}px`
			: `var(${depth === "sm" ? "--zupy-press-sm" : "--zupy-press"})`;
	return {
		"data-pressed": amount > 0.001 ? "" : undefined,
		style: { "--z-press": `calc(${distance} * ${amount})` } as Style,
	};
}

/** Pops its children in at `at` (beats, scene-local) with the `animate-pop` curve. */
export function Pop({
	at,
	duration,
	className,
	style,
	children,
	origin = "center",
}: {
	at: number;
	duration?: number;
	className?: string;
	style?: Style;
	children: ReactNode;
	origin?: string;
}) {
	const { since } = useTime();
	const { scale, opacity } = pop(since(at), duration);
	return (
		<div
			className={className}
			style={{
				...style,
				transform: `${style?.transform ?? ""} scale(${scale})`,
				transformOrigin: origin,
				opacity,
			}}
		>
			{children}
		</div>
	);
}

/** A full-bleed background in a theme color, with the paper dot grid drifting slowly. */
export function Backdrop({
	tone = "paper",
	className,
	children,
}: {
	tone?: "paper" | "primary" | "accent";
	className?: string;
	children?: ReactNode;
}) {
	const { seconds } = useTime();
	const drift = (seconds * 18) % 48;
	const tones = {
		paper: "bg-background text-foreground [--dot:var(--zupy-border)]",
		primary:
			"bg-primary text-primary-foreground [--dot:color-mix(in_oklab,var(--zupy-primary-foreground)_16%,transparent)]",
		accent:
			"bg-accent text-accent-foreground [--dot:color-mix(in_oklab,var(--zupy-edge)_14%,transparent)]",
	};
	return (
		<div
			className={cn("absolute inset-0 overflow-hidden", tones[tone], className)}
		>
			<div
				className="absolute -inset-24"
				style={{
					backgroundImage:
						"radial-gradient(circle, var(--dot) 2.5px, transparent 3px)",
					backgroundSize: "48px 48px",
					transform: `translate(${drift}px, ${drift}px)`,
				}}
			/>
			{children}
		</div>
	);
}

/**
 * Scene entrance. A raised sheet slides in over the previous scene and lands on the downbeat
 * (scene time 0). Mount the scene with a `lead` of at least `beats`.
 */
export function Enter({
	from,
	beats = 0.5,
	children,
}: {
	from: "bottom" | "right" | "top";
	beats?: number;
	children: ReactNode;
}) {
	const { seconds } = useTime();
	const lead = beats * SECONDS_PER_BEAT;
	const p = ease.snap(range(seconds, [-lead, 0]));
	const offset = (1 - p) * 104;
	const transform = {
		bottom: `translateY(${offset}%)`,
		top: `translateY(${-offset}%)`,
		right: `translateX(${offset}%)`,
	}[from];
	const settled = p >= 1;
	return (
		<div className="absolute inset-0" style={{ transform }}>
			<div className="absolute inset-0 overflow-hidden">{children}</div>
			{settled ? null : (
				// The sheet's edge lives on its own layer so the override doesn't reach the components.
				<div className="raised pointer-events-none absolute inset-0 rounded-xl [--z-lift:18px] [--zupy-edge-width:5px]" />
			)}
		</div>
	);
}

/** A pressable press curve for this scene's cue beats. */
export function usePress(cues: readonly number[], hold?: number) {
	const { since } = useTime();
	let amount = 0;
	for (const cue of cues) amount = Math.max(amount, press(since(cue), hold));
	return amount;
}

/** Index of the last cue that has passed, or -1. */
export function useStep(cues: readonly number[]) {
	const { beat } = useTime();
	let step = -1;
	cues.forEach((cue, index) => {
		if (beat >= cue) step = index;
	});
	return step;
}

/** Scales a component up for 1080p with CSS `zoom`, so text and edges stay crisp. */
export function Zoom({
	by,
	className,
	style,
	children,
}: {
	by: number;
	className?: string;
	style?: Style;
	children: ReactNode;
}) {
	return (
		<div className={className} style={{ zoom: by, ...style }}>
			{children}
		</div>
	);
}

/** A big display word or phrase in Fredoka, bold and tight like zupy headings. */
export function Display({
	className,
	style,
	children,
}: {
	className?: string;
	style?: Style;
	children: ReactNode;
}) {
	return (
		<div
			className={cn(
				"font-bold font-display leading-[0.95] tracking-tight",
				className,
			)}
			style={style}
		>
			{children}
		</div>
	);
}
