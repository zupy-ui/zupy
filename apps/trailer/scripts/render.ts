/**
 * Renders the trailer to out/zupy-trailer.mp4 (1920×1080, 60fps, H.264 + AAC).
 *
 *   bun run render                    full video
 *   bun run render --stills 120,900   just those frames, as PNGs in out/stills
 *   bun run render --workers 6        parallel browser pages (default: CPU count, max 6)
 *
 * Needs ffmpeg on PATH. Set CHROMIUM_PATH to use a specific Chromium build.
 */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, rm } from "node:fs/promises";
import { availableParallelism } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { build, preview } from "vite";
import { writeSoundtrack } from "./music";

const root = fileURLToPath(new URL("..", import.meta.url));
const out = join(root, "out");
const args = process.argv.slice(2);
const option = (name: string) => {
	const index = args.indexOf(`--${name}`);
	return index === -1 ? undefined : args[index + 1];
};

const stills = option("stills")?.split(",").map(Number);
const workers = Number(
	option("workers") ?? Math.min(6, Math.max(1, availableParallelism())),
);

const soundtrack = join(root, "public", "bgm.wav");
if (!stills || !existsSync(soundtrack)) await writeSoundtrack(soundtrack);

await build({ root, logLevel: "warn" });
const server = await preview({ root, preview: { port: 0 }, logLevel: "warn" });
const url = server.resolvedUrls?.local[0];
if (!url) throw new Error("Preview server did not start");

const browser = await chromium.launch({
	executablePath: process.env.CHROMIUM_PATH || undefined,
});

async function openStage() {
	const page = await browser.newPage({
		viewport: { width: 1920, height: 1080 },
		deviceScaleFactor: 1,
	});
	await page.goto(`${url}?render`);
	await page.waitForFunction(() => window.trailer !== undefined);
	// Touch every font before the first capture.
	await page.evaluate(async () => {
		await Promise.all(
			[
				"700 1em Fredoka",
				"600 1em Fredoka",
				"1em Inter",
				"1em 'JetBrains Mono'",
			].map((font) => document.fonts.load(font)),
		);
	});
	return page;
}

async function capture(
	page: Awaited<ReturnType<typeof openStage>>,
	frame: number,
	path: string,
) {
	await page.evaluate((f) => window.trailer?.seek(f), frame);
	await page.screenshot({ path, type: "png" });
}

try {
	if (stills) {
		const dir = join(out, "stills");
		await mkdir(dir, { recursive: true });
		const page = await openStage();
		for (const frame of stills) {
			await capture(
				page,
				frame,
				join(dir, `${String(frame).padStart(5, "0")}.png`),
			);
		}
		console.log(`Saved ${stills.length} stills to ${dir}`);
	} else {
		const frames = await (await openStage()).evaluate(
			() => window.trailer?.frames ?? 0,
		);
		const dir = join(out, "frames");
		await rm(dir, { recursive: true, force: true });
		await mkdir(dir, { recursive: true });

		let done = 0;
		const started = Date.now();
		const chunk = Math.ceil(frames / workers);
		await Promise.all(
			Array.from({ length: workers }, async (_, worker) => {
				const page = await openStage();
				const end = Math.min(frames, (worker + 1) * chunk);
				for (let frame = worker * chunk; frame < end; frame++) {
					await capture(
						page,
						frame,
						join(dir, `${String(frame).padStart(5, "0")}.png`),
					);
					done++;
					if (done % 120 === 0) {
						const rate = done / ((Date.now() - started) / 1000);
						console.log(`${done}/${frames} frames (${rate.toFixed(1)} fps)`);
					}
				}
			}),
		);

		const video = join(out, "zupy-trailer.mp4");
		await run("ffmpeg", [
			"-y",
			"-loglevel",
			"error",
			"-framerate",
			"60",
			"-i",
			join(dir, "%05d.png"),
			"-i",
			soundtrack,
			"-c:v",
			"libx264",
			"-preset",
			"slow",
			"-crf",
			"16",
			"-pix_fmt",
			"yuv420p",
			"-c:a",
			"aac",
			"-b:a",
			"256k",
			"-shortest",
			"-movflags",
			"+faststart",
			video,
		]);
		await rm(dir, { recursive: true, force: true });
		console.log(`Wrote ${video}`);
	}
} finally {
	await browser.close();
	await new Promise((resolve) => server.httpServer.close(resolve));
}

function run(command: string, commandArgs: string[]) {
	return new Promise<void>((resolve, reject) => {
		const child = spawn(command, commandArgs, { stdio: "inherit" });
		child.on("error", reject);
		child.on("exit", (code) =>
			code === 0
				? resolve()
				: reject(new Error(`${command} exited with ${code}`)),
		);
	});
}
