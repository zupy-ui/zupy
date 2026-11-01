import { BellIcon, HeartIcon, StarIcon } from "@zupy/icons";
import {
	Avatar,
	Badge,
	Button,
	Card,
	Checkbox,
	cn,
	Field,
	FieldDescription,
	FieldLabel,
	IconButton,
	Input,
	Kbd,
	PinInput,
	Segmented,
	SegmentedItem,
	Switch,
} from "@zupy/ui";
import type { ReactNode } from "react";
import {
	Backdrop,
	Display,
	Enter,
	Pop,
	pressed,
	type Style,
	useStep,
	Zoom,
} from "@/components/kit";
import { ease, pop, press, range, spring } from "@/lib/anim";
import { Scene, useTime } from "@/lib/frame";
import { beatToSeconds, montageCues as cues, montage } from "@/timeline";

const titles: Record<(typeof montage.cuts)[number], string> = {
	button: "Button",
	switch: "Switch",
	checkbox: "Checkbox",
	segmented: "Segmented",
	pin: "Pin input",
	badge: "Badge & Avatar",
	kbd: "Kbd & IconButton",
	input: "Field & Input",
};

const demos: Record<(typeof montage.cuts)[number], () => ReactNode> = {
	button: Buttons,
	switch: Switches,
	checkbox: Checkboxes,
	segmented: SegmentedDemo,
	pin: Pin,
	badge: Badges,
	kbd: Keys,
	input: FieldDemo,
};

/** A cut every two beats. The camera whips sideways from one card to the next. */
export function Components() {
	const { beat } = useTime();
	const step = montage.beatsPerCut;
	// Whip: in the last half beat of each cut the strip slides one screen left, landing on the
	// next downbeat.
	const index = Math.floor(beat / step);
	const local = beat - index * step;
	const travel = ease.snap(range(local, [step - 0.5, step]));
	const position = Math.min(
		montage.cuts.length - 1,
		Math.max(0, index + travel),
	);
	return (
		<Enter from="right">
			<Backdrop tone="paper">
				<div
					className="absolute inset-0"
					style={{ transform: `translateX(${-position * 1920}px)` }}
				>
					{montage.cuts.map((cut, i) => {
						const Demo = demos[cut];
						if (Math.abs(i - position) > 1.2) return null;
						return (
							<div
								key={cut}
								className="absolute top-0 flex h-full w-[1920px] items-center justify-center gap-24 px-32"
								style={{ left: i * 1920 }}
							>
								<Scene from={i * step} to={(i + 1) * step} lead={1} tail={1}>
									<CutTitle index={i} title={titles[cut]} />
									<Zoom by={2} className="shrink-0">
										<Card className="flex h-[320px] w-[500px] items-center justify-center">
											{/* Undo the card's zoom so each demo sets its own scale. */}
											<Zoom by={0.5}>
												<Demo />
											</Zoom>
										</Card>
									</Zoom>
								</Scene>
							</div>
						);
					})}
				</div>
			</Backdrop>
		</Enter>
	);
}

function CutTitle({ index, title }: { index: number; title: string }) {
	return (
		<div className="flex w-[560px] shrink-0 flex-col gap-6">
			<Pop at={-0.2} origin="left center">
				<Zoom by={2.2}>
					<Badge variant="primary" className="font-mono">
						{String(index + 1).padStart(2, "0")}
					</Badge>
				</Zoom>
			</Pop>
			<Pop at={-0.05} origin="left center">
				<Display className="text-[104px]">{title}</Display>
			</Pop>
		</div>
	);
}

function Buttons() {
	const variants = ["primary", "accent", "secondary", "danger"] as const;
	const labels = ["Continue", "Upgrade", "Cancel", "Delete"];
	const { since } = useTime();
	return (
		<Zoom by={2.3} className="grid grid-cols-2 gap-5">
			{variants.map((variant, i) => {
				const amount = press(since(cues.button.presses[i] ?? 0));
				const { scale } = pop(since(0.1 + i * 0.08));
				return (
					<div key={variant} style={{ transform: `scale(${scale})` }}>
						<Button
							variant={variant}
							size="lg"
							className="w-full"
							{...pressed(amount)}
						>
							{labels[i]}
						</Button>
					</div>
				);
			})}
		</Zoom>
	);
}

function Switches() {
	const { since } = useTime();
	const rows = ["Notifications", "Sound effects", "Weekly summary"].map(
		(label, i) => ({ label, at: cues.switch.toggles[i] ?? 0 }),
	);
	return (
		<Zoom by={2.7} className="flex w-[300px] flex-col gap-4">
			{rows.map((row) => {
				const t = since(row.at);
				const on = t >= 0;
				const p = spring(t, 3.4, 0.45);
				return (
					<div
						key={row.label}
						className="flex items-center justify-between gap-6"
					>
						<span className="font-display font-semibold text-lg">
							{row.label}
						</span>
						<Switch
							checked={on}
							className="anim-switch"
							style={
								{
									"--thumb-x": `calc((1.5rem - 2 * var(--zupy-edge-width)) * ${on ? p : 0})`,
									backgroundColor: `color-mix(in oklab, var(--zupy-surface), var(--zupy-primary) ${Math.round(range(t, [0, 0.12]) * 100)}%)`,
								} as Style
							}
						/>
					</div>
				);
			})}
		</Zoom>
	);
}

function Checkboxes() {
	const { since } = useTime();
	const rows = ["Drink water", "Go for a walk", "Read a chapter"].map(
		(label, i) => ({ label, at: cues.checkbox.ticks[i] ?? 0 }),
	);
	return (
		<Zoom by={2.9} className="flex flex-col gap-4">
			<span className="font-display font-semibold text-muted text-sm uppercase tracking-wide">
				Today
			</span>
			{rows.map((row) => {
				const t = since(row.at);
				const amount = press(since(row.at - 0.05), 0.04);
				return (
					<div key={row.label} className="flex items-center gap-3">
						<Checkbox
							checked={t >= 0}
							className="anim-indicator"
							{...pressed(amount, "sm")}
							style={
								{
									...pressed(amount, "sm").style,
									"--indicator-scale": pop(t, 0.26).scale,
								} as Style
							}
						/>
						<span
							className={cn(
								"font-display font-semibold text-lg",
								t >= 0 && "text-muted line-through",
							)}
						>
							{row.label}
						</span>
					</div>
				);
			})}
		</Zoom>
	);
}

function SegmentedDemo() {
	const values = ["day", "week", "month"];
	const changes = [0, ...cues.segmented.changes];
	const step = useStep(changes);
	const value = ["week", "month", "day", "week"][step] ?? "week";
	const { since } = useTime();
	const lastChange = changes[step] ?? 0;
	const bump = 1 + (pop(since(lastChange), 0.22).scale - 1) * 0.4;
	const totals = { day: "1,240", week: "8,905", month: "36,112" } as const;
	return (
		<Zoom by={2.3} className="flex flex-col items-center gap-6">
			<Segmented value={value} style={{ transform: `scale(${bump})` }}>
				{values.map((v) => (
					<SegmentedItem key={v} value={v} className="capitalize">
						{v}
					</SegmentedItem>
				))}
			</Segmented>
			<div className="text-center">
				<Pop at={lastChange} duration={0.26}>
					<div className="font-bold font-display text-6xl tabular-nums tracking-tight">
						{totals[value as keyof typeof totals]}
					</div>
				</Pop>
				<div className="font-display font-semibold text-muted">Steps</div>
			</div>
		</Zoom>
	);
}

function Pin() {
	const { since } = useTime();
	const digits = "4207";
	const slots = cues.pin.digits;
	const typed = slots.filter((cue) => since(cue) >= 0).length;
	const vars: Style = {};
	slots.forEach((cue, i) => {
		const t = since(cue);
		vars[`--slot-${i + 1}`] =
			t >= 0 ? 1 + Math.sin(range(t, [0, 0.14]) * Math.PI) * 0.1 : 1;
	});
	return (
		<Zoom by={2.4} className="flex flex-col items-center gap-5">
			<span className="font-display font-semibold text-lg">
				Enter your code
			</span>
			<PinInput
				length={4}
				size="lg"
				value={digits.slice(0, typed)}
				aria-label="Code"
				className="anim-pin"
				style={vars}
			/>
		</Zoom>
	);
}

function Badges() {
	const badges = (
		[
			["primary", "New"],
			["accent", "Pro"],
			["success", "Online"],
			["neutral", "3 tasks"],
		] as const
	).map(([variant, label], i) => ({
		variant,
		label,
		at: cues.badge.pops[i] ?? 0,
	}));
	return (
		<Zoom by={2.6} className="flex items-center gap-6">
			<Pop at={0.1}>
				<Avatar name="Sam Rivera" size="xl" />
			</Pop>
			<div className="flex flex-col gap-3">
				<Pop at={0.2} origin="left center">
					<div className="font-bold font-display text-2xl tracking-tight">
						Sam Rivera
					</div>
				</Pop>
				<div className="flex w-56 flex-wrap gap-2">
					{badges.map((badge) => (
						<Pop key={badge.label} at={badge.at}>
							<Badge variant={badge.variant}>{badge.label}</Badge>
						</Pop>
					))}
				</div>
			</div>
		</Zoom>
	);
}

function Keys() {
	const { since } = useTime();
	const keyPress = press(since(cues.kbd.keys), 0.12);
	const icons = (
		[
			[HeartIcon, "Like", "danger"],
			[StarIcon, "Favorite", "accent"],
			[BellIcon, "Notify", "primary"],
		] as const
	).map(([Icon, label, tone], i) => ({
		Icon,
		label,
		tone,
		at: cues.kbd.icons[i] ?? 0,
	}));
	return (
		<Zoom by={2.4} className="flex flex-col items-center gap-8">
			<div className="flex items-center gap-2">
				{["⌘", "K"].map((key) => (
					<Kbd
						key={key}
						className="pressable h-12 min-w-12 rounded-md text-2xl"
						{...pressed(keyPress, "sm")}
					>
						{key}
					</Kbd>
				))}
			</div>
			<div className="flex gap-3">
				{icons.map(({ Icon, label, at, tone }) => (
					<IconButton
						key={label}
						aria-label={label}
						variant="secondary"
						size="lg"
						{...pressed(press(since(at)))}
					>
						<Icon tone={tone} />
					</IconButton>
				))}
			</div>
		</Zoom>
	);
}

function FieldDemo() {
	const { since } = useTime();
	const name = "Sam Rivera";
	const { typeFrom, typeTo, save: saveAt } = cues.input;
	const typed = Math.floor(
		range(since(typeFrom), [0, beatToSeconds(typeTo - typeFrom)]) * name.length,
	);
	const save = press(since(saveAt));
	const caretOn = Math.floor(since(0) * 4) % 2 === 0 || typed < name.length;
	return (
		<Zoom by={2.4} className="flex w-[320px] flex-col gap-4">
			<Field>
				<FieldLabel>Display name</FieldLabel>
				<div className="relative">
					<Input
						readOnly
						value={name.slice(0, typed)}
						className="border-primary ring-3 ring-primary/20"
					/>
					<Caret visible={caretOn} offset={typed} />
				</div>
				<FieldDescription>Shown on your profile.</FieldDescription>
			</Field>
			<Pop at={1} origin="left center">
				<Button {...pressed(save)}>Save</Button>
			</Pop>
		</Zoom>
	);
}

/** A fake caret, since a captured frame never has real focus. */
function Caret({ visible, offset }: { visible: boolean; offset: number }) {
	return (
		<span
			className="absolute top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary"
			style={{
				left: `calc(1rem + ${offset}ch * 0.93)`,
				opacity: visible ? 1 : 0,
			}}
		/>
	);
}
