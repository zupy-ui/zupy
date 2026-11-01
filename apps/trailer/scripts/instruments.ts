/** The soundtrack's instruments and sound effects. Each returns a mono voice (or a stereo pair). */
import {
	createNoise,
	envelope,
	midiToHz,
	SAMPLE_RATE,
	Saw,
	Sine,
	Svf,
	voice,
} from "./dsp";

const noise = createNoise(7);
const TAU = Math.PI * 2;

export function kick() {
	let phase = 0;
	return voice(0.55, (t) => {
		const hz = 44 + 120 * Math.exp(-t * 26) + 260 * Math.exp(-t * 180);
		phase += (TAU * hz) / SAMPLE_RATE;
		const body =
			Math.tanh(1.8 * Math.sin(phase)) *
			envelope(t, { attack: 0.001, decay: 6.5 });
		const click = noise() * Math.exp(-t * 700) * 0.35;
		return body + click;
	});
}

export function clap() {
	const filter = new Svf();
	const body = new Sine();
	return voice(0.4, (t) => {
		// Three quick slaps, then a tail.
		let amp = 0;
		for (const offset of [0, 0.009, 0.019]) {
			if (t >= offset) amp += Math.exp(-(t - offset) * 340);
		}
		if (t >= 0.026) amp += 0.7 * Math.exp(-(t - 0.026) * 16);
		const snap = filter.process(noise(), 1700, 0.9).bp * amp * 1.8;
		const tone = body.next(190 - t * 120) * Math.exp(-t * 32) * 0.45;
		return snap + tone;
	});
}

/** Metallic hat from inharmonic squares, like an 808. */
export function hat(open = false) {
	const ratios = [2, 3, 4.16, 5.43, 6.79, 8.21];
	const phases = ratios.map(() => 0);
	const hp = new Svf();
	const bp = new Svf();
	return voice(open ? 0.45 : 0.09, (t) => {
		let sum = 0;
		ratios.forEach((ratio, i) => {
			phases[i] = ((phases[i] ?? 0) + (ratio * 330) / SAMPLE_RATE) % 1;
			sum += (phases[i] ?? 0) < 0.5 ? 1 : -1;
		});
		const metal = bp.process(sum / 6 + noise() * 0.6, 10500, 0.8).bp;
		const bright = hp.process(metal, 7500).hp;
		return bright * envelope(t, { attack: 0.0005, decay: open ? 8 : 55 }) * 1.6;
	});
}

export function bass(note: number, seconds: number) {
	const saw = new Saw();
	const sub = new Sine();
	const filter = new Svf();
	const hz = midiToHz(note);
	return voice(seconds + 0.03, (t) => {
		const env = envelope(t, {
			attack: 0.004,
			decay: 1.5,
			length: seconds,
			release: 0.03,
		});
		const cutoff = 180 + 1400 * Math.exp(-t * 16);
		const growl = filter.process(saw.next(hz), cutoff, 1.4).lp;
		return (growl * 0.65 + sub.next(hz) * 0.75) * env;
	});
}

/** Wide detuned saws. Returns a stereo pair. */
export function supersaw(
	notes: readonly number[],
	seconds: number,
	{
		cutoff = 4200,
		attack = 0.006,
		release = 0.12,
		decay = 0.25,
	}: {
		cutoff?: number | ((t: number) => number);
		attack?: number;
		release?: number;
		decay?: number;
	} = {},
) {
	const detune = [-0.17, -0.1, -0.035, 0, 0.035, 0.1, 0.17];
	const length = Math.ceil((seconds + release) * SAMPLE_RATE);
	const left = new Float32Array(length);
	const right = new Float32Array(length);
	const filterL = new Svf();
	const filterR = new Svf();
	const oscillators = notes.flatMap((note, n) =>
		detune.map((d, i) => ({
			osc: new Saw(((n * 7 + i) * 0.137) % 1),
			hz: midiToHz(note + d),
			pan: (i / (detune.length - 1)) * 2 - 1,
		})),
	);
	const norm = 1 / Math.sqrt(oscillators.length);
	for (let i = 0; i < length; i++) {
		const t = i / SAMPLE_RATE;
		let l = 0;
		let r = 0;
		for (const { osc, hz, pan } of oscillators) {
			const s = osc.next(hz);
			l += s * (1 - pan) * 0.5;
			r += s * (1 + pan) * 0.5;
		}
		const a = Math.min(1, t / attack);
		const sustain = 0.75 + 0.25 * Math.exp(-t / decay);
		const rel = t > seconds ? Math.max(0, 1 - (t - seconds) / release) : 1;
		const env = a * sustain * rel * norm;
		const fc = typeof cutoff === "function" ? cutoff(t) : cutoff;
		left[i] = filterL.process(l, fc, 0.8).lp * env;
		right[i] = filterR.process(r, fc, 0.8).lp * env;
	}
	return { left, right };
}

/** Bright pluck for the lead hook. */
export function pluck(note: number) {
	const a = new Saw(0.3);
	const b = new Saw(0.7);
	const filter = new Svf();
	const hz = midiToHz(note);
	return voice(0.6, (t) => {
		const cutoff = 700 + 6500 * Math.exp(-t * 16);
		const raw = a.next(hz * 1.004) + b.next(hz * 0.996);
		return (
			filter.process(raw, cutoff, 1.2).lp *
			envelope(t, { attack: 0.002, decay: 5.5 }) *
			0.5
		);
	});
}

/** A wooden FM mallet: the "tactile" sound of the trailer. */
export function mallet(note: number, brightness = 1) {
	const hz = midiToHz(note);
	let carrier = 0;
	let modulator = 0;
	return voice(0.5, (t) => {
		modulator += (TAU * hz * 4) / SAMPLE_RATE;
		const index = 2.4 * brightness * Math.exp(-t * 26);
		carrier += (TAU * hz) / SAMPLE_RATE;
		return (
			Math.sin(carrier + index * Math.sin(modulator)) *
			envelope(t, { attack: 0.001, decay: 9 })
		);
	});
}

/** A bubbly pop for things appearing. `pitch` scales the sweep. */
export function popSound(pitch = 1) {
	let phase = 0;
	return voice(0.16, (t) => {
		const hz = pitch * (360 + 900 * (1 - Math.exp(-t * 55)));
		phase += (TAU * hz) / SAMPLE_RATE;
		return (
			(Math.sin(phase) * 0.9 + noise() * Math.exp(-t * 900) * 0.3) *
			envelope(t, { attack: 0.0015, decay: 30 })
		);
	});
}

/** A chunky key press: thock on the way down, softer tick on release. */
export function clickSound(release = 0.17) {
	const tick = new Svf();
	const thud = new Sine();
	const ring = new Sine();
	return voice(release + 0.08, (t) => {
		const down =
			thud.next(150 - t * 200) * Math.exp(-t * 55) * 0.8 +
			ring.next(980) * Math.exp(-t * 110) * 0.35 +
			tick.process(noise(), 3400, 1.2).bp * Math.exp(-t * 300) * 1.4;
		const up =
			t >= release
				? tick.process(noise(), 5200, 1.4).bp *
					Math.exp(-(t - release) * 400) *
					0.6
				: 0;
		return down + up;
	});
}

/** A soft keyboard tick for typing, varied by `seed`. */
export function typeTick(seed: number) {
	const filter = new Svf();
	const cutoff = 3800 + ((seed * 977) % 2200);
	return voice(
		0.03,
		(t) => filter.process(noise(), cutoff, 1.6).bp * Math.exp(-t * 320) * 1.2,
	);
}

/** Filtered noise sweep. Returns a stereo pair that pans across. */
export function whoosh(seconds: number, from = 400, to = 6000) {
	const filter = new Svf();
	const length = Math.ceil(seconds * SAMPLE_RATE);
	const left = new Float32Array(length);
	const right = new Float32Array(length);
	for (let i = 0; i < length; i++) {
		const p = i / length;
		const cutoff = from * (to / from) ** p;
		const s =
			filter.process(noise(), cutoff, 1.6).bp * Math.sin(Math.PI * p) ** 2;
		left[i] = s * (1 - p);
		right[i] = s * p;
	}
	return { left, right };
}

/** Rising noise and pitch into a drop. */
export function riser(seconds: number) {
	const filter = new Svf();
	const saw = new Saw();
	return voice(seconds, (t) => {
		const p = t / seconds;
		const swell = p ** 2.2;
		const n = filter.process(noise(), 300 + 9000 * p ** 2, 1.3).bp;
		const tone = saw.next(110 * 2 ** (p * 2.5)) * 0.18;
		return (n + tone) * swell;
	});
}

/** Crash plus a sub boom for big hits. Returns a stereo pair. */
export function impact(decay = 2.2) {
	const seconds = 3;
	const hpL = new Svf();
	const hpR = new Svf();
	const boom = new Sine();
	const length = Math.ceil(seconds * SAMPLE_RATE);
	const left = new Float32Array(length);
	const right = new Float32Array(length);
	for (let i = 0; i < length; i++) {
		const t = i / SAMPLE_RATE;
		const env = envelope(t, { attack: 0.001, decay });
		const low = boom.next(58 * Math.exp(-t * 1.2)) * Math.exp(-t * 3.2) * 0.9;
		left[i] = hpL.process(noise(), 4500).hp * env * 0.55 + low;
		right[i] = hpR.process(noise(), 4500).hp * env * 0.55 + low;
	}
	return { left, right };
}

/** A crash played backwards, swelling into a hit that lands at its end. */
export function reverseCrash(seconds: number) {
	const hp = new Svf();
	const forward = voice(
		seconds,
		(t) => hp.process(noise(), 5000).hp * Math.exp(-t * (3 / seconds)),
	);
	return forward.reverse();
}
