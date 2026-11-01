import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

export const cardVariants = cva("rounded-xl text-foreground", {
	variants: {
		variant: {
			/** Outlined and lifted on a hard shadow. */
			raised: "raised bg-card",
			/** Flat surface with a soft border, for content inside a raised card. */
			flat: "border-2 border-border bg-card",
			/** Tinted surface with no border. */
			sunken: "bg-surface",
		},
		padding: {
			none: "",
			sm: "p-4",
			md: "p-5 sm:p-6",
			lg: "p-6 sm:p-8",
		},
	},
	defaultVariants: { variant: "raised", padding: "md" },
});

export interface CardProps
	extends useRender.ComponentProps<"div">,
		VariantProps<typeof cardVariants> {}

/**
 * A container surface.
 *
 * @example
 * <Card>
 *   <Heading level={3}>Daily puzzle</Heading>
 *   <Text tone="muted">Six tries to guess the word.</Text>
 * </Card>
 */
export function Card({
	variant,
	padding,
	className,
	render,
	...props
}: CardProps) {
	return useRender({
		render,
		defaultTagName: "div",
		props: {
			className: cn(cardVariants({ variant, padding }), className),
			...props,
		},
	});
}
