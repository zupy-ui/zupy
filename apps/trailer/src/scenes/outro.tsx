import { Button, Card } from "@zupy/ui";
import {
	Backdrop,
	Enter,
	Pop,
	pressed,
	type Style,
	usePress,
	Zoom,
} from "@/components/kit";
import { ease, hash, range, wobble } from "@/lib/anim";
import { useTime } from "@/lib/frame";
import { outro } from "@/timeline";
import { Rings, Wordmark } from "./logo";

/** Logo, install command, and the link button pressed on the final hit. */
export function Outro() {
	const { since } = useTime();
	const t = since(outro.logo);
	const fall = ease.out(range(t, [0, 0.16]));
	const scale = 2.4 - fall * 1.4 + wobble(t - 0.16, 3.5, 6) * 0.08;
	const linkPress = usePress([outro.press], 0.16);
	const fade = range(since(outro.fadeFrom), [0, 0.7]);
	return (
		<Enter from="bottom">
			<Backdrop tone="primary">
				<Rings t={t} />
				<Rings t={since(outro.press)} />
				<Confetti t={since(outro.press)} />
				<div className="absolute inset-0 flex flex-col items-center justify-center gap-14">
					<div className="flex items-center gap-10">
						<img
							src="/logo.webp"
							alt=""
							width={220}
							height={220}
							style={{
								transform: `scale(${scale})`,
								opacity: range(t, [0, 0.05]),
								filter: "drop-shadow(0 12px 0 var(--zupy-edge))",
							}}
						/>
						<Wordmark cues={[0.1, 0.2, 0.3, 0.4]} size={230} />
					</div>
					<div className="flex items-center gap-8">
						<Pop at={outro.command}>
							<Zoom by={2.2}>
								<Card
									padding="none"
									className="flex h-14 items-center gap-2 rounded-lg px-5 font-mono font-semibold text-lg"
								>
									<span className="text-muted">$</span> bun add @zupy/ui
								</Card>
							</Zoom>
						</Pop>
						<Pop at={outro.link}>
							<Zoom by={2.2}>
								<Button variant="accent" size="lg" {...pressed(linkPress)}>
									zupy-ui.github.io
								</Button>
							</Zoom>
						</Pop>
					</div>
				</div>
				<div
					className="absolute inset-0 bg-edge"
					style={{ opacity: ease.inOut(fade) }}
				/>
			</Backdrop>
		</Enter>
	);
}

/** Raised bits that burst out of the button on the final press. */
function Confetti({ t }: { t: number }) {
	if (t < 0 || t > 2.4) return null;
	const pieces = Array.from({ length: 34 }, (_, i) => i);
	const fills = [
		"[--zupy-fill:var(--zupy-accent)]",
		"[--zupy-fill:var(--zupy-card)]",
		"[--zupy-fill:var(--zupy-success)]",
		"[--zupy-fill:var(--zupy-danger)]",
	];
	return (
		<div className="absolute top-[640px] left-[1330px]">
			{pieces.map((i) => {
				const angle = -Math.PI / 2 + (hash(i) - 0.5) * Math.PI * 1.5;
				const speed = 900 + hash(i + 50) * 900;
				const x = Math.cos(angle) * speed * t;
				const y = Math.sin(angle) * speed * t + 1300 * t * t;
				const size = 22 + hash(i + 9) * 26;
				const spin = (hash(i + 3) - 0.5) * 900 * t;
				return (
					<div
						key={i}
						className={`raised filled absolute ${i % 3 === 0 ? "rounded-full" : "rounded-sm"} ${fills[i % fills.length]}`}
						style={
							{
								width: size,
								height: size,
								transform: `translate(${x}px, ${y}px) rotate(${spin}deg)`,
								opacity: 1 - range(t, [1.6, 2.4]),
								"--z-lift": "5px",
								"--zupy-edge-width": "3px",
							} as Style
						}
					/>
				);
			})}
		</div>
	);
}
