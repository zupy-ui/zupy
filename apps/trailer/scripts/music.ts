/**
 * Writes the trailer soundtrack to public/bgm.wav: an upbeat 128 BPM track synthesized from
 * scratch (no samples, no licensing), with every sound effect placed on the same beats the
 * scenes animate on.
 *
 *   bun run music
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
	code,
	codeLines,
	DURATION_SECONDS,
	iconCues,
	intro,
	logo,
	montage,
	montageCues,
	outro,
	pillars,
	SECONDS_PER_BEAT,
	scenes,
	stack,
	themeCycle,
} from "@/timeline";
import { Bus, encodeWav, pingPong, reverb, SAMPLE_RATE } from "./dsp";
import {
	bass,
	clap,
	clickSound,
	hat,
	impact,
	kick,
	mallet,
	pluck,
	popSound,
	reverseCrash,
	riser,
	supersaw,
	typeTick,
	whoosh,
} from "./instruments";

const at = (beat: number) => beat * SECONDS_PER_BEAT;
const length = Math.ceil(DURATION_SECONDS * SAMPLE_RATE);

/** IV – V – iii – vi in C major, then a V → I cadence at the end. */
const chords = {
	F: { notes: [53, 57, 60, 64], root: 41 },
	G: { notes: [55, 59, 62, 67], root: 43 },
	Em: { notes: [52, 55, 59, 62], root: 40 },
	Am: { notes: [57, 60, 64, 67], root: 45 },
	C: { notes: [48, 55, 60, 64, 67, 72], root: 36 },
};
const progression = [chords.F, chords.G, chords.Em, chords.Am];

/** The hook, on an eighth-note grid: [position, note] per bar of the progression. */
const hook: [number, number][][] = [
	[
		[0, 76],
		[2, 79],
		[4, 81],
		[5, 79],
		[7, 76],
	],
	[
		[0, 74],
		[2, 79],
		[4, 83],
		[5, 81],
		[7, 79],
	],
	[
		[0, 76],
		[2, 79],
		[4, 83],
		[6, 81],
		[7, 79],
	],
	[
		[0, 81],
		[2, 79],
		[3, 76],
		[5, 72],
		[6, 74],
		[7, 76],
	],
];
const hookAnswer: [number, number][] = [
	[0, 84],
	[2, 83],
	[3, 81],
	[5, 79],
	[7, 76],
];

/** Beats where the drop groove plays. */
const grooves: [number, number][] = [
	[8, 48],
	[52, 64],
];
const inRanges = (beat: number, ranges: [number, number][]) =>
	ranges.some(([from, to]) => beat >= from && beat < to);

const chordAt = (beat: number) =>
	beat < 4
		? chords.Am
		: beat < 8
			? chords.G
			: beat >= 64
				? chords.C
				: (progression[Math.floor((beat - 8) / 4) % 4] ?? chords.F);

export async function writeSoundtrack(path: string) {
	const drums = new Bus(length);
	const music = new Bus(length);
	const lead = new Bus(length);
	const fx = new Bus(length);
	const send = new Bus(length);

	const kickVoice = kick();
	const clapVoice = clap();
	const closedHat = hat();
	const openHat = hat(true);
	const kicks: number[] = [];

	const playKick = (beat: number, gain = 1) => {
		drums.addMono(at(beat), kickVoice, 0.8 * gain);
		kicks.push(at(beat));
	};
	const playClap = (beat: number, gain = 1) => {
		drums.addMono(at(beat), clapVoice, 0.42 * gain);
		send.addMono(at(beat), clapVoice, 0.25 * gain);
	};

	// --- Drums -----------------------------------------------------------------------------

	// Intro: a soft heartbeat under the button presses, then a roll into the drop.
	for (const beat of [0, 1, 2, 3, 4, 5, 6])
		playKick(beat, beat < 4 ? 0.38 : 0.5);
	for (let beat = 4; beat < 7.75; beat += beat < 6 ? 0.5 : 0.25) {
		playClap(beat, 0.25 + ((beat - 4) / 3.75) * 0.6);
	}

	for (let beat = 8; beat < 64; beat++) {
		const groove = inRanges(beat, grooves);
		const breakdown = beat >= 48 && beat < 52;
		if (groove) playKick(beat);
		if (beat % 2 === 1) playClap(beat, breakdown ? 0.7 : 1);
		// Hats: sixteenths with an accent on the off-beat, open hat on the "and".
		for (let s = 0; s < 4; s++) {
			const accent = [0.35, 0.18, 0.5, 0.2][s] ?? 0.2;
			if (breakdown && s % 2 === 1) continue;
			drums.addMono(at(beat + s / 4), closedHat, accent * 0.6, 0.25);
		}
		if (groove) drums.addMono(at(beat + 0.5), openHat, 0.22, -0.2);
	}
	// Fills into the icons wave, the "Press." drop and the outro.
	for (let beat = 47; beat < 48; beat += 0.25)
		playClap(beat, 0.35 + (beat - 47) * 0.4);
	for (let beat = 51; beat < 52; beat += 0.125)
		playClap(beat, 0.3 + (beat - 51) * 0.6);
	for (let beat = 59; beat < 60; beat += 0.125)
		playClap(beat, 0.3 + (beat - 59) * 0.6);
	playKick(64, 1.1);

	// --- Harmony and bass ------------------------------------------------------------------

	// Intro pad, opening up as the build rises.
	for (const bar of [0, 4]) {
		const chord = chordAt(bar);
		// The second bar stops half a beat early: a breath of silence before the drop.
		const { left, right } = supersaw(chord.notes, at(bar === 0 ? 4 : 3.5), {
			attack: 0.15,
			release: bar === 0 ? 0.12 : 0.05,
			cutoff: (t) => (bar === 0 ? 700 : 900 + 5000 * (t / at(4)) ** 2),
		});
		music.addStereo(at(bar), left, right, 0.55);
		send.addStereo(at(bar), left, right, 0.35);
	}

	for (let bar = 8; bar < 64; bar += 4) {
		const chord = chordAt(bar);
		const breakdown = bar === 48;
		const { left, right } = supersaw(chord.notes, at(4) - 0.02, {
			cutoff: breakdown ? (t) => 700 + 2200 * (t / at(4)) ** 2 : 5200,
		});
		music.addStereo(at(bar), left, right, 0.62);
		send.addStereo(at(bar), left, right, 0.2);
		// Bass on every eighth, jumping an octave on the last one of the bar.
		for (let e = 0; e < 8; e++) {
			const note = chord.root + (e === 7 ? 12 : 0);
			music.addMono(
				at(bar + e / 2),
				bass(note, at(0.5) * 0.85),
				breakdown ? 0.32 : 0.42,
			);
		}
	}

	// The final chord: resolve to C on the last hit and let it ring.
	{
		const { left, right } = supersaw(chords.C.notes, at(4), {
			release: 2.2,
			decay: 0.6,
			cutoff: (t) => 5200 * Math.exp(-t * 0.5) + 600,
		});
		music.addStereo(at(64), left, right, 0.7);
		send.addStereo(at(64), left, right, 0.5);
		music.addMono(at(64), bass(chords.C.root, at(3)), 0.5);
	}

	// --- Lead hook and arpeggios -----------------------------------------------------------

	const playHook = (from: number, to: number) => {
		for (let bar = from; bar < to; bar += 4) {
			const index = Math.floor((bar - 8) / 4) % 4;
			const phrase =
				index === 3 && Math.floor((bar - 8) / 16) % 2 === 1
					? hookAnswer
					: (hook[index] ?? []);
			for (const [position, note] of phrase) {
				lead.addMono(
					at(bar + position / 2),
					pluck(note),
					0.75,
					((position % 3) - 1) * 0.25,
				);
			}
		}
	};
	playHook(8, 36);
	playHook(52, 64);

	const arp = [0, 1, 2, 3, 2, 1, 2, 3];
	for (let beat = 20; beat < 64; beat += 0.25) {
		if (beat >= 44 && beat < 52) continue;
		const chord = chordAt(beat);
		const step = Math.round(beat * 4) % arp.length;
		const note = (chord.notes[arp[step] ?? 0] ?? 60) + 12;
		const pan = Math.sin(beat * 1.3) * 0.5;
		music.addMono(at(beat), mallet(note, 0.8), 0.13, pan);
	}

	// --- Sound effects, on the same cues the scenes use -----------------------------------

	const pop = (beat: number, pitch = 1, gain = 0.32) => {
		fx.addMono(at(beat), popSound(pitch), gain);
		send.addMono(at(beat), popSound(pitch), gain * 0.3);
	};
	const click = (beat: number, gain = 0.5, release?: number) =>
		fx.addMono(at(beat), clickSound(release), gain);
	const swish = (beat: number, beats = 0.5, gain = 0.22) => {
		const { left, right } = whoosh(at(beats));
		fx.addStereo(at(beat), left, right, gain);
	};
	const hit = (beat: number, gain = 0.6, decay?: number) => {
		const { left, right } = impact(decay);
		fx.addStereo(at(beat), left, right, gain);
		send.addStereo(at(beat), left, right, gain * 0.3);
	};
	const blip = (beat: number, note: number, gain = 0.28) => {
		fx.addMono(at(beat), mallet(note, 1.2), gain, Math.sin(note) * 0.4);
		send.addMono(at(beat), mallet(note, 1.2), gain * 0.4);
	};

	// Intro
	pop(intro.buttonIn, 1, 0.38);
	for (const beat of intro.presses) click(beat, 0.6);
	intro.words.forEach((beat, i) => {
		pop(beat, 0.9 + i * 0.12);
	});
	click(intro.pressWord, 0.7, 0.2);
	fx.addMono(at(4), riser(at(4)), 0.22);
	fx.addMono(at(8) - at(2), reverseCrash(at(2)), 0.3);

	// Logo
	const logoStart = scenes.logo.from;
	hit(logoStart + logo.slam, 0.75);
	logo.letters.forEach((beat, i) => {
		blip(logoStart + beat, [72, 76, 79, 84][i] ?? 72, 0.3);
	});
	pop(logoStart + logo.tagline, 1.1, 0.25);

	// Pillars
	const pillarsStart = scenes.pillars.from;
	swish(pillarsStart - 0.5, 0.5);
	for (const beat of [pillars.edges, pillars.shadows, pillars.motion])
		pop(pillarsStart + beat, 0.85);
	for (const beat of pillars.bounces) click(pillarsStart + beat, 0.38, 0.06);

	// Component montage
	const montageStart = scenes.components.from;
	swish(montageStart - 0.5, 0.5);
	montage.cuts.forEach((cut, i) => {
		const start = montageStart + i * montage.beatsPerCut;
		if (i > 0) swish(start - 0.5, 0.5, 0.2);
		const notes = [72, 76, 79, 84];
		switch (cut) {
			case "button":
				for (const beat of montageCues.button.presses)
					click(start + beat, 0.45);
				break;
			case "switch":
				montageCues.switch.toggles.forEach((beat, n) => {
					blip(start + beat, notes[n + 1] ?? 79);
				});
				break;
			case "checkbox":
				montageCues.checkbox.ticks.forEach((beat, n) => {
					pop(start + beat, 1 + n * 0.15, 0.28);
				});
				break;
			case "segmented":
				for (const beat of montageCues.segmented.changes)
					click(start + beat, 0.4, 0.05);
				break;
			case "pin":
				montageCues.pin.digits.forEach((beat, n) => {
					blip(start + beat, notes[n] ?? 72, 0.26);
				});
				break;
			case "badge":
				montageCues.badge.pops.forEach((beat, n) => {
					pop(start + beat, 0.9 + n * 0.12, 0.26);
				});
				break;
			case "kbd":
				click(start + montageCues.kbd.keys, 0.55, 0.2);
				for (const beat of montageCues.kbd.icons) click(start + beat, 0.42);
				break;
			case "input": {
				const { typeFrom, typeTo, save } = montageCues.input;
				const chars = "Sam Rivera".length;
				for (let c = 0; c < chars; c++) {
					fx.addMono(
						at(start + typeFrom + ((typeTo - typeFrom) * c) / chars),
						typeTick(c),
						0.25,
						0.2,
					);
				}
				click(start + save, 0.5);
				break;
			}
		}
	});

	// Themes: a sweep with every reveal.
	themeCycle.forEach((_, i) => {
		swish(scenes.themes.from + i - 0.15, 0.6, 0.16);
	});

	// Icons: a rising mallet run as they pop in.
	const iconNotes = [72, 74, 76, 79, 81, 84, 86, 88, 91, 93];
	swish(scenes.icons.from - 0.5, 0.5);
	iconCues.pops.forEach((beat, i) => {
		blip(scenes.icons.from + beat, iconNotes[i] ?? 84, 0.22);
	});

	// Code: typing, then presses.
	const codeStart = scenes.code.from;
	swish(codeStart - 0.5, 0.5);
	for (const [beat, text] of [
		[code.install, codeLines.install],
		[code.import, codeLines.import],
		[code.usage, codeLines.usage],
	] as const) {
		pop(codeStart + beat, 0.9, 0.2);
		for (let c = 0; c < text.length; c++) {
			if (text[c] === " ") continue;
			fx.addMono(
				at(codeStart + beat) + c * code.typeRate,
				typeTick(c + beat * 10),
				0.2,
				0.3,
			);
		}
	}
	fx.addMono(at(codeStart + 2), riser(at(2)), 0.16);
	hit(codeStart + code.press, 0.45, 3);
	pop(codeStart + code.press, 1.1, 0.35);
	for (const beat of code.presses) click(codeStart + beat, 0.55);

	// Stack: four slams.
	for (const beat of stack.chips) {
		const b = scenes.stack.from + beat;
		hit(b, 0.42, 6);
		click(b + 0.03, 0.35, 0.1);
	}
	fx.addMono(at(scenes.stack.from + 2), riser(at(2)), 0.2);

	// Outro.
	const outroStart = scenes.outro.from;
	swish(outroStart - 0.5, 0.5, 0.25);
	hit(outroStart + outro.logo, 0.8);
	[0.1, 0.2, 0.3, 0.4].forEach((beat, i) => {
		blip(outroStart + beat, [72, 76, 79, 84][i] ?? 72, 0.22);
	});
	pop(outroStart + outro.command, 1, 0.3);
	pop(outroStart + outro.link, 1.15, 0.3);
	click(outroStart + outro.press, 0.75, 0.25);
	hit(outroStart + outro.press, 0.85, 1.6);
	// Sparkle as the confetti flies.
	for (let i = 0; i < 12; i++) {
		blip(
			outroStart + outro.press + 0.1 + i * 0.09,
			[84, 88, 91, 96][i % 4] ?? 84,
			0.12 * (1 - i / 14),
		);
	}

	// --- Mix -------------------------------------------------------------------------------

	// Sidechain: the chords and bass duck under every kick, the classic pump.
	const duck = new Float32Array(length).fill(1);
	for (const kickTime of kicks) {
		const start = Math.round(kickTime * SAMPLE_RATE);
		for (let i = 0; i < SAMPLE_RATE * 0.45; i++) {
			const index = start + i;
			if (index >= length) break;
			const t = i / SAMPLE_RATE;
			const attack = Math.min(1, t / 0.004);
			const gain = 1 - 0.6 * attack * Math.exp(-t / 0.11);
			duck[index] = Math.min(duck[index] ?? 1, gain);
		}
	}
	for (let i = 0; i < length; i++) {
		const d = duck[i] ?? 1;
		music.left[i] = (music.left[i] ?? 0) * d;
		music.right[i] = (music.right[i] ?? 0) * d;
	}

	const echoes = pingPong(lead, at(0.75), 0.35);
	lead.mixInto(send, 0.35);
	const space = reverb(send);

	if (process.env.MIX_REPORT) {
		const rms = (bus: Bus, fromBeat: number, toBeat: number) => {
			let sum = 0;
			const a = Math.round(at(fromBeat) * SAMPLE_RATE);
			const b = Math.round(at(toBeat) * SAMPLE_RATE);
			for (let i = a; i < b; i++)
				sum += (bus.left[i] ?? 0) ** 2 + (bus.right[i] ?? 0) ** 2;
			return (10 * Math.log10(sum / (2 * (b - a)) + 1e-12)).toFixed(1);
		};
		for (const [name, bus] of Object.entries({
			drums,
			music,
			lead,
			echoes,
			fx,
			space,
		})) {
			console.log(
				name.padEnd(8),
				"intro",
				rms(bus, 0, 8),
				"drop",
				rms(bus, 8, 36),
				"break",
				rms(bus, 48, 52),
			);
		}
	}

	const master = new Bus(length);
	drums.mixInto(master, 1);
	music.mixInto(master, 0.85);
	lead.mixInto(master, 0.9);
	echoes.mixInto(master, 0.32);
	fx.mixInto(master, 1);
	space.mixInto(master, 0.9);

	finish(master);
	await mkdir(dirname(path), { recursive: true });
	await writeFile(path, encodeWav(master));
	console.log(`Wrote ${path} (${DURATION_SECONDS.toFixed(2)}s)`);
}

/** Glue and loudness: high-pass, gentle saturation, normalize to -1 dBFS, fade the tail. */
function finish(bus: Bus) {
	let peak = 0;
	for (const channel of [bus.left, bus.right]) {
		let previousIn = 0;
		let previousOut = 0;
		for (let i = 0; i < channel.length; i++) {
			// One-pole DC blocker / ~20 Hz high-pass.
			const x = channel[i] ?? 0;
			const y = x - previousIn + 0.9974 * previousOut;
			previousIn = x;
			previousOut = y;
			channel[i] = y;
			peak = Math.max(peak, Math.abs(y));
		}
	}
	const drive = 1.6;
	const fadeFrom = at(outro.fadeFrom + scenes.outro.from);
	let outPeak = 0;
	for (const channel of [bus.left, bus.right]) {
		for (let i = 0; i < channel.length; i++) {
			const t = i / SAMPLE_RATE;
			const fade =
				t > fadeFrom
					? Math.max(0, 1 - (t - fadeFrom) / (DURATION_SECONDS - fadeFrom)) **
						1.5
					: 1;
			const y =
				(Math.tanh((drive * (channel[i] ?? 0)) / peak) / Math.tanh(drive)) *
				fade;
			channel[i] = y;
			outPeak = Math.max(outPeak, Math.abs(y));
		}
	}
	const target = 10 ** (-1 / 20) / outPeak;
	for (const channel of [bus.left, bus.right]) {
		for (let i = 0; i < channel.length; i++)
			channel[i] = (channel[i] ?? 0) * target;
	}
}

if (import.meta.main) {
	const root = fileURLToPath(new URL("..", import.meta.url));
	await writeSoundtrack(join(root, "public", "bgm.wav"));
}
