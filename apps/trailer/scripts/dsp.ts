/** Small DSP toolkit for the soundtrack: oscillators, filters, envelopes and effects. */

export const SAMPLE_RATE = 48000;
const TAU = Math.PI * 2;

export const midiToHz = (note: number) => 440 * 2 ** ((note - 69) / 12);

/** Deterministic noise, so every render of the soundtrack is identical. */
export function createNoise(seed = 1) {
	let state = seed >>> 0 || 1;
	return () => {
		state ^= state << 13;
		state ^= state >>> 17;
		state ^= state << 5;
		return ((state >>> 0) / 4294967296) * 2 - 1;
	};
}

/** Band-limited sawtooth step (PolyBLEP), so high notes don't alias. */
function polyBlep(phase: number, increment: number) {
	if (phase < increment) {
		const t = phase / increment;
		return t + t - t * t - 1;
	}
	if (phase > 1 - increment) {
		const t = (phase - 1) / increment;
		return t * t + t + t + 1;
	}
	return 0;
}

export class Saw {
	phase: number;
	constructor(phase = 0) {
		this.phase = phase;
	}
	next(hz: number) {
		const increment = hz / SAMPLE_RATE;
		const value = 2 * this.phase - 1 - polyBlep(this.phase, increment);
		this.phase += increment;
		if (this.phase >= 1) this.phase -= 1;
		return value;
	}
}

export class Sine {
	phase = 0;
	next(hz: number) {
		const value = Math.sin(TAU * this.phase);
		this.phase += hz / SAMPLE_RATE;
		if (this.phase >= 1) this.phase -= 1;
		return value;
	}
}

/** Zero-delay state variable filter (Zavalishin). Cutoff can change every sample. */
export class Svf {
	private ic1 = 0;
	private ic2 = 0;
	lp = 0;
	bp = 0;
	hp = 0;
	process(input: number, cutoff: number, q = Math.SQRT1_2) {
		const g = Math.tan(
			(Math.PI * Math.min(cutoff, SAMPLE_RATE * 0.45)) / SAMPLE_RATE,
		);
		const k = 1 / q;
		const a1 = 1 / (1 + g * (g + k));
		const a2 = g * a1;
		const a3 = g * a2;
		const v3 = input - this.ic2;
		const v1 = a1 * this.ic1 + a2 * v3;
		const v2 = this.ic2 + a2 * this.ic1 + a3 * v3;
		this.ic1 = 2 * v1 - this.ic1;
		this.ic2 = 2 * v2 - this.ic2;
		this.lp = v2;
		this.bp = v1;
		this.hp = input - k * v1 - v2;
		return this;
	}
}

/** A stereo pair of sample buffers. */
export class Bus {
	left: Float32Array;
	right: Float32Array;
	constructor(length: number) {
		this.left = new Float32Array(length);
		this.right = new Float32Array(length);
	}
	get length() {
		return this.left.length;
	}
	/** Adds a mono voice at `seconds`, with an equal-power pan (-1 left, 1 right). */
	addMono(seconds: number, samples: Float32Array, gain = 1, pan = 0) {
		const start = Math.round(seconds * SAMPLE_RATE);
		const angle = ((pan + 1) * Math.PI) / 4;
		const l = Math.cos(angle) * gain * Math.SQRT2;
		const r = Math.sin(angle) * gain * Math.SQRT2;
		for (let i = 0; i < samples.length; i++) {
			const at = start + i;
			if (at < 0 || at >= this.length) continue;
			const s = samples[i] ?? 0;
			this.left[at] = (this.left[at] ?? 0) + s * l;
			this.right[at] = (this.right[at] ?? 0) + s * r;
		}
	}
	addStereo(
		seconds: number,
		left: Float32Array,
		right: Float32Array,
		gain = 1,
	) {
		const start = Math.round(seconds * SAMPLE_RATE);
		for (let i = 0; i < left.length; i++) {
			const at = start + i;
			if (at < 0 || at >= this.length) continue;
			this.left[at] = (this.left[at] ?? 0) + (left[i] ?? 0) * gain;
			this.right[at] = (this.right[at] ?? 0) + (right[i] ?? 0) * gain;
		}
	}
	mixInto(target: Bus, gain = 1) {
		for (let i = 0; i < this.length; i++) {
			target.left[i] = (target.left[i] ?? 0) + (this.left[i] ?? 0) * gain;
			target.right[i] = (target.right[i] ?? 0) + (this.right[i] ?? 0) * gain;
		}
	}
}

/** Renders `seconds` of a mono voice from a per-sample function of time. */
export function voice(seconds: number, fn: (t: number) => number) {
	const out = new Float32Array(Math.ceil(seconds * SAMPLE_RATE));
	for (let i = 0; i < out.length; i++) out[i] = fn(i / SAMPLE_RATE);
	return out;
}

/** Attack / exponential decay envelope with a short fade at the end to avoid clicks. */
export function envelope(
	t: number,
	{
		attack = 0.002,
		decay = 6,
		length = Number.POSITIVE_INFINITY,
		release = 0.02,
	}: { attack?: number; decay?: number; length?: number; release?: number },
) {
	if (t < 0) return 0;
	const a = t < attack ? t / attack : 1;
	const d = Math.exp(-Math.max(0, t - attack) * decay);
	const r = t > length ? Math.max(0, 1 - (t - length) / release) : 1;
	return a * d * r;
}

/** Ping-pong delay with a darkening feedback path. */
export function pingPong(
	bus: Bus,
	delaySeconds: number,
	feedback = 0.38,
	tone = 3500,
) {
	const out = new Bus(bus.length);
	const size = Math.round(delaySeconds * SAMPLE_RATE);
	const bufL = new Float32Array(size);
	const bufR = new Float32Array(size);
	const toneL = new Svf();
	const toneR = new Svf();
	let index = 0;
	for (let i = 0; i < bus.length; i++) {
		const dl = bufL[index] ?? 0;
		const dr = bufR[index] ?? 0;
		const mono = ((bus.left[i] ?? 0) + (bus.right[i] ?? 0)) * 0.5;
		// Input enters on the left; each repeat crosses sides.
		bufL[index] = mono + toneR.process(dr, tone).lp * feedback;
		bufR[index] = toneL.process(dl, tone).lp * feedback;
		out.left[i] = dl;
		out.right[i] = dr;
		index = (index + 1) % size;
	}
	return out;
}

/** Freeverb-style stereo reverb. Returns only the wet signal. */
export function reverb(bus: Bus, roomSize = 0.84, damping = 0.3) {
	const combs = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617];
	const allpasses = [556, 441, 341, 225];
	const scale = SAMPLE_RATE / 44100;
	const channel = (input: Float32Array, spread: number) => {
		const out = new Float32Array(input.length);
		const combState = combs.map((length) => ({
			buffer: new Float32Array(Math.round((length + spread) * scale)),
			index: 0,
			store: 0,
		}));
		const apState = allpasses.map((length) => ({
			buffer: new Float32Array(Math.round((length + spread) * scale)),
			index: 0,
		}));
		for (let i = 0; i < input.length; i++) {
			const x = (input[i] ?? 0) * 0.015;
			let sum = 0;
			for (const comb of combState) {
				const y = comb.buffer[comb.index] ?? 0;
				comb.store = y * (1 - damping) + comb.store * damping;
				comb.buffer[comb.index] = x + comb.store * roomSize;
				comb.index = (comb.index + 1) % comb.buffer.length;
				sum += y;
			}
			for (const ap of apState) {
				const buffered = ap.buffer[ap.index] ?? 0;
				ap.buffer[ap.index] = sum + buffered * 0.5;
				sum = buffered - sum;
				ap.index = (ap.index + 1) % ap.buffer.length;
			}
			out[i] = sum;
		}
		return out;
	};
	const out = new Bus(bus.length);
	out.left = channel(bus.left, 0);
	out.right = channel(bus.right, 23);
	return out;
}

/** 16-bit PCM WAV. */
export function encodeWav(bus: Bus) {
	const frames = bus.length;
	const data = Buffer.alloc(44 + frames * 4);
	data.write("RIFF", 0);
	data.writeUInt32LE(36 + frames * 4, 4);
	data.write("WAVE", 8);
	data.write("fmt ", 12);
	data.writeUInt32LE(16, 16);
	data.writeUInt16LE(1, 20);
	data.writeUInt16LE(2, 22);
	data.writeUInt32LE(SAMPLE_RATE, 24);
	data.writeUInt32LE(SAMPLE_RATE * 4, 28);
	data.writeUInt16LE(4, 32);
	data.writeUInt16LE(16, 34);
	data.write("data", 36);
	data.writeUInt32LE(frames * 4, 40);
	for (let i = 0; i < frames; i++) {
		const l = Math.max(-1, Math.min(1, bus.left[i] ?? 0));
		const r = Math.max(-1, Math.min(1, bus.right[i] ?? 0));
		data.writeInt16LE(Math.round(l * 32767), 44 + i * 4);
		data.writeInt16LE(Math.round(r * 32767), 46 + i * 4);
	}
	return data;
}
