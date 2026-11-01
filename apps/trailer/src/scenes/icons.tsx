import { icons } from "@zupy/icons";
import { Backdrop, Display, Enter, Pop } from "@/components/kit";
import { wobble } from "@/lib/anim";
import { useTime } from "@/lib/frame";
import { iconCues } from "@/timeline";

const all = Object.values(icons);

/** Every icon pops onto the grid on a sixteenth, then the grid bounces on the beat. */
export function Icons() {
	const { since } = useTime();
	return (
		<Enter from="bottom">
			<Backdrop tone="accent">
				<div className="absolute inset-0 flex flex-col items-center justify-center gap-16">
					<Pop at={-0.1}>
						<Display className="text-[120px]">Tactile icons.</Display>
					</Pop>
					<div className="grid grid-cols-5 gap-x-20 gap-y-14">
						{all.map((Icon, index) => {
							const at = iconCues.pops[index] ?? 0;
							// A wave across the grid on beat 3.
							const hop = wobble(since(3 + (index % 5) * 0.06), 2.6, 5);
							return (
								<Pop key={Icon.displayName ?? index} at={at} duration={0.3}>
									<div
										style={{
											transform: `translateY(${-Math.max(0, hop) * 46}px)`,
										}}
									>
										<Icon size={168} />
									</div>
								</Pop>
							);
						})}
					</div>
				</div>
			</Backdrop>
		</Enter>
	);
}
