import "@/styles.css";
import { StrictMode } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { Player } from "@/player";
import { DURATION_FRAMES, FPS, HEIGHT, WIDTH } from "@/timeline";
import { Trailer } from "@/trailer";

declare global {
	interface Window {
		/** Used by scripts/render.ts to step through frames. */
		trailer?: {
			fps: number;
			frames: number;
			width: number;
			height: number;
			seek: (frame: number) => Promise<void>;
		};
	}
}

const container = document.getElementById("root");
if (!container) throw new Error("Missing #root");
const root = createRoot(container);

if (new URLSearchParams(location.search).has("render")) {
	// Render mode: a bare 1920×1080 stage that the capture script seeks frame by frame.
	const seek = async (frame: number) => {
		flushSync(() => root.render(<Trailer frame={frame} />));
		await document.fonts.ready;
		await new Promise((resolve) => requestAnimationFrame(resolve));
	};
	window.trailer = {
		fps: FPS,
		frames: DURATION_FRAMES,
		width: WIDTH,
		height: HEIGHT,
		seek,
	};
	void seek(0);
} else {
	root.render(
		<StrictMode>
			<Player />
		</StrictMode>,
	);
}
