/**
 * One clock for picture and sound. Scenes and the music script both read these beats, so every
 * pop, press and whoosh on screen lands on the matching hit in the soundtrack.
 */

export const FPS = 60;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const BPM = 128;
export const SECONDS_PER_BEAT = 60 / BPM;
export const FRAMES_PER_BEAT = FPS * SECONDS_PER_BEAT;

/** Beat at which the picture has fully faded out. The audio ends here too. */
export const END_BEAT = 70;
export const DURATION_SECONDS = END_BEAT * SECONDS_PER_BEAT;
export const DURATION_FRAMES = Math.ceil(DURATION_SECONDS * FPS);

export const beatToFrame = (beat: number) => beat * FRAMES_PER_BEAT;
export const frameToBeat = (frame: number) => frame / FRAMES_PER_BEAT;
export const beatToSeconds = (beat: number) => beat * SECONDS_PER_BEAT;

/** Scene boundaries, in beats. Each scene starts on a downbeat. */
export const scenes = {
	intro: { from: 0, to: 8 },
	logo: { from: 8, to: 12 },
	pillars: { from: 12, to: 20 },
	components: { from: 20, to: 36 },
	themes: { from: 36, to: 44 },
	icons: { from: 44, to: 48 },
	code: { from: 48, to: 56 },
	stack: { from: 56, to: 60 },
	outro: { from: 60, to: END_BEAT },
} as const;

export type SceneName = keyof typeof scenes;

// Scene-local cue beats. Scenes animate on them and the music script plays a matching sound.

/** Intro: the button pops in, gets pressed three times, then the headline lands word by word. */
export const intro = {
	buttonIn: 0,
	presses: [1, 2, 3],
	words: [4, 5, 6],
	pressWord: 7,
};

/** Logo slam on the drop, then the wordmark letters on eighths, then the tagline. */
export const logo = {
	slam: 0,
	letters: [1, 1.5, 2, 2.5],
	tagline: 3,
};

/** Three pillars, two beats each, then the tile bounces on eighths. */
export const pillars = {
	edges: 0,
	shadows: 2,
	motion: 4,
	bounces: [4.5, 5, 5.5, 6, 6.5, 7, 7.5],
};

/** Component montage: a cut every two beats. */
export const montage = {
	cuts: [
		"button",
		"switch",
		"checkbox",
		"segmented",
		"pin",
		"badge",
		"kbd",
		"input",
	] as const,
	beatsPerCut: 2,
};

/** What happens inside each montage cut, in beats from the cut's downbeat. */
export const montageCues = {
	button: { presses: [0.5, 0.75, 1, 1.25] },
	switch: { toggles: [0.25, 0.75, 1.25] },
	checkbox: { ticks: [0.25, 0.75, 1.25] },
	segmented: { changes: [0.5, 1, 1.5] },
	pin: { digits: [0.25, 0.5, 0.75, 1] },
	badge: { pops: [0.5, 0.75, 1, 1.25] },
	kbd: { keys: 0.25, icons: [0.75, 1, 1.25] },
	input: { typeFrom: 0.25, typeTo: 0.75, save: 1.5 },
};

/** Theme switch on every beat. */
export const themeCycle = [
	{ theme: "pop", dark: false },
	{ theme: "pop", dark: true },
	{ theme: "arcade", dark: false },
	{ theme: "arcade", dark: true },
	{ theme: "gloss", dark: false },
	{ theme: "gloss", dark: true },
	{ theme: "arcade", dark: false },
	{ theme: "pop", dark: false },
] as const;

/** Icons pop in on sixteenths, then bounce on the beat. */
export const iconCues = {
	pops: Array.from({ length: 10 }, (_, i) => 0.25 + i * 0.25),
};

/** Code scene: install, import, press. */
export const code = {
	install: 0,
	import: 2,
	usage: 3,
	press: 4,
	presses: [5, 6, 6.5, 7],
	/** Seconds per typed character. */
	typeRate: 0.02,
};

export const codeLines = {
	install: "bun add @zupy/ui @zupy/icons",
	import: 'import { Button } from "@zupy/ui";',
	usage: "<Button>Press me</Button>",
};

/** Stack chips slam in on each beat. */
export const stack = {
	chips: [0, 1, 2, 3],
};

/** Outro: logo, install chip, then the link button gets pressed on the last hit. */
export const outro = {
	logo: 0,
	command: 2,
	link: 3,
	press: 4,
	fadeFrom: 8.5,
};
