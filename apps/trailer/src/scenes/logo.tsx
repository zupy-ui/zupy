import { Backdrop, Display, Pop } from "@/components/kit";
import { ease, range, wobble } from "@/lib/anim";
import { useTime } from "@/lib/frame";
import { logo } from "@/timeline";

/** The drop: the logo slams down, rings burst out, the wordmark pops in letter by letter. */
export function Logo() {
	const { since } = useTime();
	const t = since(logo.slam);
	const fall = ease.out(range(t, [0, 0.16]));
	const scale = 2.6 - fall * 1.6 + wobble(t - 0.16, 3.5, 6) * 0.08;
	return (
		<Backdrop tone="primary">
			<Rings t={t} />
			<div className="absolute inset-0 flex flex-col items-center justify-center">
				<div className="flex items-center gap-12">
					<img
						src="/logo.webp"
						alt=""
						width={256}
						height={256}
						className="shrink-0"
						style={{
							transform: `scale(${scale})`,
							opacity: range(t, [0, 0.05]),
							filter: "drop-shadow(0 14px 0 var(--zupy-edge))",
						}}
					/>
					<Wordmark />
				</div>
				<Pop at={logo.tagline} className="mt-10">
					<Display className="text-[64px] font-semibold opacity-90">
						Tactile React components
					</Display>
				</Pop>
			</div>
		</Backdrop>
	);
}

/** "zupy", one letter per eighth note. Bold, with a hard shadow in the edge color. */
export function Wordmark({
	cues = logo.letters,
	size = 260,
}: {
	cues?: readonly number[];
	size?: number;
}) {
	return (
		<div className="flex">
			{["z", "u", "p", "y"].map((letter, index) => (
				<Pop key={letter} at={cues[index] ?? 0} origin="50% 80%">
					<Display
						style={{
							fontSize: size,
							textShadow: `0 ${size / 22}px 0 var(--zupy-edge)`,
							WebkitTextStroke: `${size / 52}px var(--zupy-edge)`,
							paintOrder: "stroke fill",
						}}
					>
						{letter}
					</Display>
				</Pop>
			))}
		</div>
	);
}

/** Two outlines that burst out from the center on impact. */
export function Rings({ t }: { t: number }) {
	return (
		<div className="absolute inset-0 flex items-center justify-center">
			{[0, 0.08].map((delay) => {
				const p = ease.out(range(t - delay, [0, 0.7]));
				if (t - delay < 0 || p >= 1) return null;
				const size = 200 + p * 1900;
				return (
					<div
						key={delay}
						className="absolute rounded-full border-primary-foreground"
						style={{
							width: size,
							height: size,
							borderWidth: 18 * (1 - p) + 2,
							opacity: 1 - p,
						}}
					/>
				);
			})}
		</div>
	);
}
