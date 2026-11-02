import { type ThemeName, themes } from "@zupy/tokens";
import { cn, IconButton, Segmented, SegmentedItem } from "@zupy/ui";
import { Moon, Palette, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useId, useRef, useState } from "react";

const blurb: Record<ThemeName, string> = {
	pop: "Cream paper, ink edges",
	arcade: "Navy outlines, bold blue",
	gloss: "Borderless glossy tiles",
};

/**
 * Floating button in the bottom-right corner of an example that switches the zupy theme and
 * light/dark mode. The theme is applied by the caller through `data-theme`.
 */
export function ThemeFab({
	theme,
	onThemeChange,
}: {
	theme: ThemeName;
	onThemeChange: (theme: ThemeName) => void;
}) {
	const [open, setOpen] = useState(false);
	const { resolvedTheme, setTheme } = useTheme();
	const root = useRef<HTMLDivElement>(null);
	const panelId = useId();

	useEffect(() => {
		if (!open) return;
		const close = (event: PointerEvent | KeyboardEvent) => {
			if (
				event instanceof KeyboardEvent
					? event.key === "Escape"
					: !root.current?.contains(event.target as Node)
			) {
				setOpen(false);
			}
		};
		document.addEventListener("pointerdown", close);
		document.addEventListener("keydown", close);
		return () => {
			document.removeEventListener("pointerdown", close);
			document.removeEventListener("keydown", close);
		};
	}, [open]);

	return (
		<div
			ref={root}
			className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3"
		>
			{open && (
				<section
					id={panelId}
					aria-label="Theme"
					className="raised w-72 rounded-xl bg-card p-4 motion-safe:animate-pop"
				>
					<p className="font-display font-semibold">Theme</p>
					<div className="mt-3 flex flex-col gap-2">
						{(Object.keys(themes) as ThemeName[]).map((name) => (
							<button
								key={name}
								type="button"
								aria-pressed={name === theme}
								onClick={() => onThemeChange(name)}
								className={cn(
									"flex items-center gap-3 rounded-lg border-2 p-2 text-left focus-visible:outline-3 focus-visible:outline-ring",
									name === theme
										? "border-primary bg-surface"
										: "border-transparent hover:bg-surface",
								)}
							>
								{/* Each swatch renders in its own theme, so the colors come from the tokens. */}
								<span
									data-theme={name}
									aria-hidden
									className="raised depth-sm flex h-9 w-12 shrink-0 items-center justify-center gap-1 rounded-md bg-background"
								>
									<span className="size-3 rounded-full bg-primary" />
									<span className="size-3 rounded-full bg-accent" />
								</span>
								<span className="min-w-0">
									<span className="block font-display font-semibold text-sm capitalize">
										{name}
									</span>
									<span className="block text-muted text-xs">
										{blurb[name]}
									</span>
								</span>
							</button>
						))}
					</div>
					<Segmented
						value={resolvedTheme === "dark" ? "dark" : "light"}
						onValueChange={setTheme}
						aria-label="Color mode"
						className="mt-4 w-full"
					>
						<SegmentedItem value="light" className="flex-1">
							<Sun className="size-4" aria-hidden /> Light
						</SegmentedItem>
						<SegmentedItem value="dark" className="flex-1">
							<Moon className="size-4" aria-hidden /> Dark
						</SegmentedItem>
					</Segmented>
				</section>
			)}
			<IconButton
				size="lg"
				className="rounded-full"
				aria-label={open ? "Close theme picker" : "Change theme"}
				aria-expanded={open}
				aria-controls={open ? panelId : undefined}
				onClick={() => setOpen((value) => !value)}
			>
				{open ? <X /> : <Palette />}
			</IconButton>
		</div>
	);
}
