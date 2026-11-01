import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

export const tileVariants = cva(
	"inline-flex shrink-0 select-none items-center justify-center font-bold font-display uppercase leading-none",
	{
		variants: {
			variant: {
				/** An unfilled slot. */
				empty: "border-2 border-border border-dashed bg-transparent",
				neutral: "raised filled text-foreground [--zupy-fill:var(--zupy-card)]",
				primary:
					"raised filled text-primary-foreground [--zupy-fill:var(--zupy-primary)]",
				accent:
					"raised filled text-accent-foreground [--zupy-fill:var(--zupy-accent)]",
				success:
					"raised filled text-success-foreground [--zupy-fill:var(--zupy-success)]",
				warning:
					"raised filled text-warning-foreground [--zupy-fill:var(--zupy-warning)]",
				danger:
					"raised filled text-danger-foreground [--zupy-fill:var(--zupy-danger)]",
				muted: "raised filled text-muted [--zupy-fill:var(--zupy-surface)]",
			},
			size: {
				sm: "depth-sm size-10 rounded-sm text-lg",
				md: "size-14 rounded-md text-2xl",
				lg: "size-18 rounded-lg text-4xl",
			},
		},
		defaultVariants: { variant: "neutral", size: "md" },
	},
);

export interface TileProps
	extends useRender.ComponentProps<"div">,
		VariantProps<typeof tileVariants> {
	/** Play the pop-in animation when the tile mounts or its `key` changes. */
	pop?: boolean;
}

/**
 * A chunky square for letters, numbers or emoji: word games, scores, dice.
 *
 * @example
 * <Tile variant="success">Z</Tile>
 * <Tile variant="accent" pop key={letter}>{letter}</Tile>
 */
export function Tile({
	variant,
	size,
	pop,
	className,
	render,
	...props
}: TileProps) {
	return useRender({
		render,
		defaultTagName: "div",
		props: {
			className: cn(
				tileVariants({ variant, size }),
				pop && "animate-pop",
				className,
			),
			...props,
		},
	});
}
