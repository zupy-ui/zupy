import { Badge, Button } from "@zupy/ui";
import {
	Backdrop,
	Display,
	Pop,
	pressed,
	usePress,
	Zoom,
} from "@/components/kit";
import { ease, pop, range } from "@/lib/anim";
import { useTime } from "@/lib/frame";
import { intro } from "@/timeline";

/** A lone button gets pressed on the beat, then the headline lands and swallows the screen. */
export function Intro() {
	const { beat } = useTime();
	return (
		<Backdrop tone="paper">
			{beat < (intro.words[0] ?? 0) ? <PressMe /> : <Headline />}
		</Backdrop>
	);
}

function PressMe() {
	const { since } = useTime();
	const amount = usePress(intro.presses);
	const { scale, opacity } = pop(since(intro.buttonIn), 0.4);
	return (
		<div className="absolute inset-0 flex items-center justify-center">
			<div style={{ transform: `scale(${scale})`, opacity }}>
				<Zoom by={2.6}>
					<Button size="lg" {...pressed(amount)}>
						Press me
					</Button>
				</Zoom>
			</div>
			{intro.presses.map((cue, index) => (
				<PlusOne key={cue} at={cue} index={index} />
			))}
		</div>
	);
}

/** A "+1" badge that pops out of the button and floats away. */
function PlusOne({ at, index }: { at: number; index: number }) {
	const { since } = useTime();
	const t = since(at);
	if (t < 0 || t > 0.9) return null;
	const rise = ease.out(range(t, [0, 0.9])) * 150;
	const fade = range(t, [0.55, 0.9], [1, 0]);
	const x = [-230, 250, -40][index] ?? 0;
	return (
		<div
			className="absolute top-1/2 left-1/2"
			style={{
				transform: `translate(calc(-50% + ${x}px), calc(-50% - ${150 + rise}px))`,
				opacity: fade,
			}}
		>
			<Pop at={at} duration={0.3}>
				<Zoom by={4}>
					<Badge variant="accent">+1</Badge>
				</Zoom>
			</Pop>
		</div>
	);
}

function Headline() {
	const { since } = useTime();
	const amount = usePress([intro.pressWord], 0.12);
	// After the press, the tile grows until its blue fills the frame for the logo drop.
	const grow = ease.in(range(since(intro.pressWord + 0.3), [0, 0.32]));
	const scale = 1 + grow * 34;
	const [first, second, third] = intro.words;
	return (
		<div className="absolute inset-0 flex flex-col items-center justify-center gap-6 text-center">
			<div className="flex items-baseline gap-8" style={{ opacity: 1 - grow }}>
				<Pop at={first ?? 0}>
					<Display className="text-[160px]">Components</Display>
				</Pop>
			</div>
			<div className="flex items-center gap-10">
				<div style={{ opacity: 1 - grow }}>
					<Pop at={second ?? 0}>
						<Display className="text-[160px]">you want to</Display>
					</Pop>
				</div>
				<Pop at={third ?? 0}>
					<div
						style={{ transform: `scale(${scale})` }}
						className="relative z-10"
					>
						<div
							className="raised filled pressable rounded-xl px-10 pt-1 pb-5 text-primary-foreground [--z-lift:14px] [--zupy-edge-width:5px] [--zupy-fill:var(--zupy-primary)]"
							{...pressed(amount, 10)}
						>
							<Display
								className="text-[160px]"
								style={{ opacity: 1 - range(grow, [0, 0.15]) }}
							>
								press.
							</Display>
						</div>
					</div>
				</Pop>
			</div>
		</div>
	);
}
