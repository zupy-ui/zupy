import { easing } from "@zupy/tokens";

/** Pure animation math. Everything here is a function of time, so any frame can be rendered alone. */

export const clamp = (value: number, min = 0, max = 1) =>
	Math.min(max, Math.max(min, value));

export const lerp = (from: number, to: number, t: number) =>
	from + (to - from) * t;

/** Maps `value` from one range to another, clamped. */
export function range(
	value: number,
	[inMin, inMax]: readonly [number, number],
	[outMin, outMax]: readonly [number, number] = [0, 1],
) {
	const t = clamp((value - inMin) / (inMax - inMin));
	return lerp(outMin, outMax, t);
}

/** CSS cubic-bezier as a function, so the trailer moves with the same curves as the components. */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
	const sample = (a: number, b: number, t: number) =>
		3 * a * (1 - t) ** 2 * t + 3 * b * (1 - t) * t ** 2 + t ** 3;
	const slope = (a: number, b: number, t: number) =>
		3 * a * (1 - t) ** 2 + 6 * (b - a) * (1 - t) * t + 3 * (1 - b) * t ** 2;
	return (x: number) => {
		if (x <= 0) return 0;
		if (x >= 1) return 1;
		let t = x;
		for (let i = 0; i < 8; i++) {
			const d = slope(x1, x2, t);
			if (Math.abs(d) < 1e-6) break;
			t -= (sample(x1, x2, t) - x) / d;
		}
		return sample(y1, y2, clamp(t));
	};
}

function fromToken(value: string) {
	const [x1 = 0, y1 = 0, x2 = 1, y2 = 1] =
		value.match(/-?[\d.]+/g)?.map(Number) ?? [];
	return cubicBezier(x1, y1, x2, y2);
}

/** zupy's motion tokens. `pop` overshoots, `snap` settles without bounce. */
export const ease = {
	pop: fromToken(easing.pop),
	snap: fromToken(easing.snap),
	out: fromToken(easing.out),
	inOut: cubicBezier(0.65, 0, 0.35, 1),
	in: cubicBezier(0.5, 0, 0.75, 0),
};

/**
 * The `animate-pop` keyframes (scale 0.6 → 1.12 → 1, fade in), stretched to `duration` seconds.
 * `t` is seconds since the pop started.
 */
export function pop(t: number, duration = 0.32) {
	if (t < 0) return { scale: 0.6, opacity: 0 };
	const p = t / duration;
	if (p >= 1) return { scale: 1, opacity: 1 };
	if (p < 0.6) {
		const k = ease.pop(p / 0.6);
		return { scale: lerp(0.6, 1.12, k), opacity: clamp(k * 1.4) };
	}
	return { scale: lerp(1.12, 1, ease.snap((p - 0.6) / 0.4)), opacity: 1 };
}

/** A damped spring from 0 to 1. `t` in seconds. */
export function spring(t: number, frequency = 3.2, damping = 0.42) {
	if (t <= 0) return 0;
	const omega = 2 * Math.PI * frequency;
	const decay = damping * omega;
	const damped = omega * Math.sqrt(1 - damping ** 2);
	return (
		1 -
		Math.exp(-decay * t) *
			(Math.cos(damped * t) + (decay / damped) * Math.sin(damped * t))
	);
}

/** A decaying wobble around 0, for squash and impacts. `t` in seconds. */
export function wobble(t: number, frequency = 5, decay = 7) {
	if (t < 0) return 0;
	return Math.sin(2 * Math.PI * frequency * t) * Math.exp(-decay * t);
}

/**
 * How far a pressable is pushed into its shadow, 0 to 1. Down fast like `--zupy-duration-press`,
 * held briefly, then released with a little overshoot.
 */
export function press(t: number, hold = 0.09) {
	const down = 0.08;
	const up = 0.16;
	if (t < 0) return 0;
	if (t < down) return ease.snap(t / down);
	if (t < down + hold) return 1;
	const r = (t - down - hold) / up;
	if (r >= 1) return 0;
	return 1 - ease.pop(r);
}

/** Sum of `press` over several cue times (only the most recent one matters). */
export function pressAny(t: number, cues: readonly number[], hold?: number) {
	let value = 0;
	for (const cue of cues) value = Math.max(value, press(t - cue, hold));
	return value;
}

/** A deterministic pseudo-random number in [0, 1) for a seed. */
export function hash(seed: number) {
	const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
	return x - Math.floor(x);
}
