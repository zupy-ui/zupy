import { Button, Kbd } from "@zupy/ui";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	DURATION_FRAMES,
	FPS,
	frameToBeat,
	HEIGHT,
	scenes,
	WIDTH,
} from "@/timeline";
import { Trailer } from "@/trailer";

/**
 * Dev preview: plays the trailer in real time against the soundtrack, with scrubbing.
 * The audio element is the clock, so picture and sound never drift apart.
 */
export function Player() {
	const audio = useRef<HTMLAudioElement>(null);
	const [frame, setFrame] = useState(0);
	const [playing, setPlaying] = useState(false);
	const [scale, setScale] = useState(0.5);

	useEffect(() => {
		const fit = () =>
			setScale(
				Math.min(
					(window.innerWidth - 48) / WIDTH,
					(window.innerHeight - 160) / HEIGHT,
				),
			);
		fit();
		window.addEventListener("resize", fit);
		return () => window.removeEventListener("resize", fit);
	}, []);

	useEffect(() => {
		if (!playing) return;
		let id = 0;
		const tick = () => {
			const element = audio.current;
			if (element) {
				const next = Math.floor(element.currentTime * FPS);
				setFrame(Math.min(next, DURATION_FRAMES - 1));
				if (element.ended || next >= DURATION_FRAMES) setPlaying(false);
			}
			id = requestAnimationFrame(tick);
		};
		id = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(id);
	}, [playing]);

	const toggle = useCallback(() => {
		const element = audio.current;
		if (!element) return;
		if (playing) {
			element.pause();
			setPlaying(false);
		} else {
			if (frame >= DURATION_FRAMES - 1) element.currentTime = 0;
			void element.play();
			setPlaying(true);
		}
	}, [playing, frame]);

	const seek = (next: number) => {
		setFrame(next);
		if (audio.current) audio.current.currentTime = next / FPS;
	};

	useEffect(() => {
		const onKey = (event: KeyboardEvent) => {
			if (event.code === "Space") {
				event.preventDefault();
				toggle();
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [toggle]);

	const beat = frameToBeat(frame);
	const current = Object.entries(scenes).find(
		([, scene]) => beat >= scene.from && beat < scene.to,
	)?.[0];

	return (
		<div
			data-theme="pop"
			className="dark flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-6 text-foreground"
		>
			{/* biome-ignore lint/a11y/useMediaCaption: the soundtrack is instrumental. */}
			<audio ref={audio} src="/bgm.wav" preload="auto" />
			<div
				className="overflow-hidden rounded-lg"
				style={{ width: WIDTH * scale, height: HEIGHT * scale }}
			>
				<div style={{ transform: `scale(${scale})`, transformOrigin: "0 0" }}>
					<Trailer frame={frame} />
				</div>
			</div>
			<div className="flex items-center gap-4" style={{ width: WIDTH * scale }}>
				<Button size="sm" onClick={toggle} className="w-20">
					{playing ? "Pause" : "Play"}
				</Button>
				<input
					type="range"
					min={0}
					max={DURATION_FRAMES - 1}
					value={frame}
					onChange={(event) => seek(Number(event.target.value))}
					className="flex-1 accent-primary"
					aria-label="Scrub"
				/>
				<span className="w-56 font-mono text-muted text-sm tabular-nums">
					{(frame / FPS).toFixed(2)}s · beat {beat.toFixed(1)} · {current}
				</span>
				<Kbd>Space</Kbd>
			</div>
		</div>
	);
}
