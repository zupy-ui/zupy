import { StarIcon } from "@zupy/icons";
import { cn } from "@zupy/ui";
import {
	Backdrop,
	Display,
	Enter,
	Pop,
	pressed,
	type Style,
	usePress,
} from "@/components/kit";
import { ease, range, wobble } from "@/lib/anim";
import { useTime } from "@/lib/frame";
import { pillars } from "@/timeline";

const lines = [
	{ at: pillars.edges, text: "Chunky edges." },
	{ at: pillars.shadows, text: "Hard shadows." },
	{ at: pillars.motion, text: "Springy motion." },
];

/** The three ingredients, built up on one tile: outline, then lift, then press. */
export function Pillars() {
	const { beat } = useTime();
	return (
		<Enter from="bottom">
			<Backdrop tone="paper">
				<div className="absolute inset-0 flex items-center justify-center gap-28">
					<Tile />
					<div className="flex w-[1000px] flex-col gap-4">
						{lines.map((line, index) => {
							const next = lines[index + 1]?.at ?? Number.POSITIVE_INFINITY;
							const active = beat >= line.at && beat < next;
							return (
								<Pop key={line.text} at={line.at} origin="left center">
									<Display
										className={cn(
											"text-[124px]",
											active ? "text-foreground" : "text-muted/60",
										)}
									>
										{line.text}
									</Display>
								</Pop>
							);
						})}
					</div>
				</div>
			</Backdrop>
		</Enter>
	);
}

function Tile() {
	const { since } = useTime();
	const edge = ease.pop(range(since(pillars.edges), [0.05, 0.4])) * 14;
	const lift = ease.pop(range(since(pillars.shadows), [0, 0.4])) * 30;
	const filled = since(pillars.motion) >= 0;
	const amount = usePress(pillars.bounces, 0.05);
	// Squash on each press, springing back after release.
	const lastBounce = [...pillars.bounces].reverse().find((b) => since(b) >= 0);
	const squash = lastBounce === undefined ? 0 : wobble(since(lastBounce), 4, 9);
	const enter = ease.pop(range(since(pillars.motion), [0, 0.3]));
	return (
		<div
			className="relative size-[460px]"
			style={{
				transform: `scale(${1 + squash * 0.05}, ${1 - squash * 0.05})`,
				transformOrigin: "50% 100%",
			}}
		>
			<div
				className={cn(
					"raised filled pressable absolute inset-0 flex items-center justify-center rounded-[56px]",
					filled
						? "[--zupy-fill:var(--zupy-primary)]"
						: "[--zupy-fill:var(--zupy-card)]",
				)}
				{...pressed(amount, lift * 0.75)}
				style={
					{
						...pressed(amount, lift * 0.75).style,
						"--zupy-edge-width": `${edge}px`,
						"--z-lift": `${lift}px`,
					} as Style
				}
			>
				{filled ? (
					<StarIcon
						tone="accent"
						size={250}
						style={{ transform: `scale(${0.6 + enter * 0.4})`, opacity: enter }}
					/>
				) : null}
			</div>
		</div>
	);
}
