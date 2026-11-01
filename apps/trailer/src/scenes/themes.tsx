import { HelloIcon, ThemeIcon } from "@zupy/icons";
import {
	Avatar,
	Badge,
	Button,
	Card,
	cn,
	Segmented,
	SegmentedItem,
	Switch,
} from "@zupy/ui";
import { Backdrop, Display, Pop, Zoom } from "@/components/kit";
import { ease, range } from "@/lib/anim";
import { useTime } from "@/lib/frame";
import { themeCycle } from "@/timeline";

type Look = (typeof themeCycle)[number];

/**
 * The same screen in a new theme on every beat. Each look is revealed with a circle that grows
 * from the theme chip, over the previous one.
 */
export function Themes() {
	const { beat, since } = useTime();
	const index = Math.max(0, Math.min(themeCycle.length - 1, Math.floor(beat)));
	const current = themeCycle[index] ?? themeCycle[0];
	const previous = themeCycle[index - 1];
	const reveal = ease.out(range(since(index), [0, 0.3]));
	// The first look arrives from the last montage card, so it grows over it too.
	return (
		<div className="absolute inset-0">
			{previous ? <Layer look={previous} step={index - 1} /> : null}
			<div
				className="absolute inset-0"
				style={{
					clipPath: `circle(${reveal * 2300}px at 1310px 540px)`,
				}}
			>
				<Layer look={current} step={index} />
			</div>
		</div>
	);
}

function Layer({ look, step }: { look: Look; step: number }) {
	return (
		<div
			data-theme={look.theme}
			className={cn("absolute inset-0", look.dark && "dark")}
		>
			<Backdrop tone="paper">
				<div className="absolute inset-0 flex items-center gap-20 pl-32">
					<div className="flex w-[820px] flex-col gap-8">
						<Pop at={0} origin="left center">
							<Display className="text-[108px]">
								Three themes.
								<br />
								<span className="text-primary">Light</span> and dark.
							</Display>
						</Pop>
						<div className="flex items-center gap-4">
							<ThemeIcon size={72} />
							<Zoom by={2.4}>
								<Badge variant="primary" className="capitalize">
									{look.theme} · {look.dark ? "dark" : "light"}
								</Badge>
							</Zoom>
						</div>
					</div>
					<Profile step={step} />
				</div>
			</Backdrop>
		</div>
	);
}

/** An everyday settings card: the screen every theme gets tried on. */
function Profile({ step }: { step: number }) {
	const periods = ["Day", "Week", "Month"];
	return (
		<Zoom by={1.9}>
			<Card className="flex w-[400px] flex-col gap-5">
				<div className="flex items-center gap-4">
					<Avatar name="Sam Rivera" size="lg" />
					<div className="flex-1">
						<div className="font-bold font-display text-xl tracking-tight">
							Sam Rivera
						</div>
						<div className="text-muted text-sm">Weekly goal · 12 of 20</div>
					</div>
					<HelloIcon size={40} />
				</div>
				<div className="h-4 overflow-hidden rounded-full bg-surface">
					<div className="raised filled h-full w-3/5 rounded-full [--zupy-fill:var(--zupy-primary)]" />
				</div>
				<Segmented value={periods[step % 3]}>
					{periods.map((item) => (
						<SegmentedItem key={item} value={item}>
							{item}
						</SegmentedItem>
					))}
				</Segmented>
				<div className="flex items-center justify-between">
					<span className="font-display font-semibold">Reminders</span>
					<Switch checked={step % 2 === 0} />
				</div>
				<div className="flex gap-3">
					<Button className="flex-1">Save</Button>
					<Button variant="secondary" className="flex-1">
						Cancel
					</Button>
				</div>
			</Card>
		</Zoom>
	);
}
