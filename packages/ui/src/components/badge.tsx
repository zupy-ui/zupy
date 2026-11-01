import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

export const badgeVariants = cva(
	[
		"inline-flex h-6 w-fit shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5",
		"font-display font-semibold text-xs",
		"[&_svg]:size-3.5 [&_svg]:shrink-0",
	],
	{
		variants: {
			variant: {
				neutral: "border-2 border-border bg-surface text-foreground",
				primary:
					"border-(length:--zupy-edge-width) border-edge bg-primary text-primary-foreground",
				accent:
					"border-(length:--zupy-edge-width) border-edge bg-accent text-accent-foreground",
				success:
					"border-(length:--zupy-edge-width) border-edge bg-success text-success-foreground",
				warning:
					"border-(length:--zupy-edge-width) border-edge bg-warning text-warning-foreground",
				danger:
					"border-(length:--zupy-edge-width) border-edge bg-danger text-danger-foreground",
			},
		},
		defaultVariants: { variant: "neutral" },
	},
);

export interface BadgeProps
	extends useRender.ComponentProps<"span">,
		VariantProps<typeof badgeVariants> {}

/**
 * A small pill for status and counts.
 *
 * @example
 * <Badge variant="accent">New</Badge>
 * <Badge variant="success">3 online</Badge>
 */
export function Badge({ variant, className, render, ...props }: BadgeProps) {
	return useRender({
		render,
		defaultTagName: "span",
		props: { className: cn(badgeVariants({ variant }), className), ...props },
	});
}
