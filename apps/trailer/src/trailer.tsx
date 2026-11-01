import { hash } from "@/lib/anim";
import { ClockProvider, Scene } from "@/lib/frame";
import { Code } from "@/scenes/code";
import { Components } from "@/scenes/components";
import { Icons } from "@/scenes/icons";
import { Intro } from "@/scenes/intro";
import { Logo } from "@/scenes/logo";
import { Outro } from "@/scenes/outro";
import { Pillars } from "@/scenes/pillars";
import { Stack } from "@/scenes/stack";
import { Themes } from "@/scenes/themes";
import { FPS, frameToBeat, SECONDS_PER_BEAT, scenes } from "@/timeline";

/** Beats where the camera kicks with the drums. */
const grooves: [number, number][] = [
	[8, 36],
	[36, 44],
	[44, 48],
	[52, 64],
];

/** Hard hits that shake the camera. */
const impacts = [8, 56, 57, 58, 59, 60, 64];

function camera(frame: number) {
	const beat = frameToBeat(frame);
	let scale = 1;
	if (grooves.some(([from, to]) => beat >= from && beat < to)) {
		const sinceBeat = (beat % 1) * SECONDS_PER_BEAT;
		scale += 0.007 * Math.exp(-sinceBeat * 9);
	}
	let x = 0;
	let y = 0;
	for (const hit of impacts) {
		const t = (beat - hit) * SECONDS_PER_BEAT;
		if (t < 0 || t > 0.4) continue;
		const strength = 14 * Math.exp(-t * 12);
		const seed = Math.floor(frame / 2);
		x += (hash(seed) - 0.5) * 2 * strength;
		y += (hash(seed + 99) - 0.5) * 2 * strength;
	}
	return `translate(${x}px, ${y}px) scale(${scale})`;
}

/** The whole trailer at one frame. Pure: the same frame always renders the same picture. */
export function Trailer({ frame }: { frame: number }) {
	return (
		<ClockProvider frame={frame}>
			<div
				data-theme="pop"
				className="stage bg-background"
				data-frame={frame}
				data-seconds={(frame / FPS).toFixed(2)}
			>
				<div className="absolute inset-0" style={{ transform: camera(frame) }}>
					<Scene {...scenes.intro}>
						<Intro />
					</Scene>
					<Scene {...scenes.logo}>
						<Logo />
					</Scene>
					<Scene {...scenes.pillars} lead={0.5}>
						<Pillars />
					</Scene>
					<Scene {...scenes.components} lead={0.5} tail={0.75}>
						<Components />
					</Scene>
					<Scene {...scenes.themes} tail={0.5}>
						<Themes />
					</Scene>
					<Scene {...scenes.icons} lead={0.5}>
						<Icons />
					</Scene>
					<Scene {...scenes.code} lead={0.5}>
						<Code />
					</Scene>
					<Scene {...scenes.stack}>
						<Stack />
					</Scene>
					<Scene {...scenes.outro} lead={0.5}>
						<Outro />
					</Scene>
				</div>
			</div>
		</ClockProvider>
	);
}
