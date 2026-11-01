import { RobotIcon } from "@zupy/icons";
import { cn } from "@zupy/ui";
import { Backdrop, Display, type Style } from "@/components/kit";
import { ease, range, wobble } from "@/lib/anim";
import { useTime } from "@/lib/frame";
import { stack } from "@/timeline";

const chips = [
	{ text: "Base UI", fill: "card", x: -440, y: -300, rotate: -6 },
	{ text: "Tailwind v4", fill: "primary", x: 420, y: -230, rotate: 5 },
	{ text: "Accessible", fill: "accent", x: -500, y: 170, rotate: 4 },
	{ text: "Docs your AI can read", fill: "card", x: 300, y: 330, rotate: -3 },
] as const;

const fills = {
	card: "text-foreground [--zupy-fill:var(--zupy-card)]",
	primary: "text-primary-foreground [--zupy-fill:var(--zupy-primary)]",
	accent: "text-accent-foreground [--zupy-fill:var(--zupy-accent)]",
};

/** What it's built on: four chips slam down, one per beat. */
export function Stack() {
	return (
		<Backdrop tone="paper">
			<div className="absolute inset-0 flex items-center justify-center">
				<Display className="text-[72px] text-muted">Built with care</Display>
				{chips.map((chip, index) => (
					<Chip key={chip.text} {...chip} at={stack.chips[index] ?? 0} />
				))}
			</div>
		</Backdrop>
	);
}

function Chip({
	text,
	fill,
	x,
	y,
	rotate,
	at,
}: (typeof chips)[number] & { at: number }) {
	const { since } = useTime();
	const t = since(at);
	if (t < 0) return null;
	// Drops from above the camera and lands hard, then wobbles.
	const land = ease.in(range(t, [0, 0.11]));
	const scale = 2.2 - land * 1.2 + wobble(t - 0.11, 4, 8) * 0.06;
	const amount = range(t, [0.11, 0.16]) * (1 - range(t, [0.18, 0.32]));
	return (
		<div
			className="absolute top-1/2 left-1/2"
			style={{
				transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rotate}deg) scale(${scale})`,
				opacity: range(t, [0, 0.05]),
			}}
		>
			<div
				data-pressed={amount > 0 ? "" : undefined}
				className={cn(
					"raised filled pressable flex items-center gap-5 rounded-full px-14 py-6 [--z-lift:12px] [--zupy-edge-width:5px]",
					fills[fill],
				)}
				style={{ "--z-press": `${amount * 8}px` } as Style}
			>
				{text.startsWith("Docs") ? <RobotIcon size={84} /> : null}
				<Display className="whitespace-nowrap text-[84px]">{text}</Display>
			</div>
		</div>
	);
}
