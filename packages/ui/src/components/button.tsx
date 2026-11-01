import { Button as BaseButton } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";
import { disabledStyle, focusRing } from "@/lib/styles";

export const buttonVariants = cva(
	[
		"inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap",
		"font-display font-semibold tracking-tight",
		focusRing,
		disabledStyle,
		"[&_svg]:pointer-events-none [&_svg]:shrink-0",
	],
	{
		variants: {
			variant: {
				primary:
					"raised filled pressable text-primary-foreground [--zupy-fill:var(--zupy-primary)]",
				accent:
					"raised filled pressable text-accent-foreground [--zupy-fill:var(--zupy-accent)]",
				secondary:
					"raised filled pressable text-foreground [--zupy-fill:var(--zupy-card)]",
				danger:
					"raised filled pressable text-danger-foreground [--zupy-fill:var(--zupy-danger)]",
				ghost:
					"bg-transparent text-foreground transition-[background-color,scale] duration-(--zupy-duration-fast) hover:bg-surface active:scale-97",
			},
			size: {
				sm: "h-9 rounded-md px-3.5 text-sm [&_svg]:size-4",
				md: "h-11 rounded-lg px-5 text-base [&_svg]:size-5",
				lg: "h-14 rounded-xl px-7 text-lg [&_svg]:size-6",
			},
		},
		defaultVariants: { variant: "primary", size: "md" },
	},
);

export interface ButtonProps
	extends Omit<BaseButton.Props, "className">,
		VariantProps<typeof buttonVariants> {
	/** Extra classes, merged over the variant classes. */
	className?: string;
}

/**
 * A chunky button that sinks into its shadow when pressed.
 *
 * @example
 * <Button>Play now</Button>
 * <Button variant="accent" size="lg">Join lobby</Button>
 * <Button variant="ghost" render={<a href="/docs" />}>Docs</Button>
 */
export function Button({
	className,
	variant,
	size,
	render,
	// A custom `render` (link, router Link) is usually not a <button>.
	nativeButton = render === undefined,
	...props
}: ButtonProps) {
	return (
		<BaseButton
			className={cn(buttonVariants({ variant, size }), className)}
			render={render}
			nativeButton={nativeButton}
			{...props}
		/>
	);
}
