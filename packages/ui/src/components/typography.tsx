import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

export const headingVariants = cva(
	"font-bold font-display text-foreground tracking-tight",
	{
		variants: {
			size: {
				display: "text-5xl leading-[1.02] sm:text-7xl",
				xl: "text-4xl leading-tight",
				lg: "text-3xl leading-tight",
				md: "text-2xl leading-snug",
				sm: "text-lg leading-snug",
			},
		},
	},
);

type HeadingLevel = 1 | 2 | 3 | 4;

const sizeForLevel: Record<HeadingLevel, NonNullable<HeadingProps["size"]>> = {
	1: "xl",
	2: "lg",
	3: "md",
	4: "sm",
};

export interface HeadingProps
	extends useRender.ComponentProps<"h2">,
		VariantProps<typeof headingVariants> {
	/** Picks the tag (`h1`–`h4`) and, unless `size` is set, the size. @default 2 */
	level?: HeadingLevel;
}

/**
 * A rounded, heavy heading. `level` sets the semantic tag; `size` overrides the look.
 *
 * @example
 * <Heading level={1}>Ready, player?</Heading>
 * <Heading level={2} size="display">Big poster title</Heading>
 */
export function Heading({
	level = 2,
	size,
	className,
	render,
	...props
}: HeadingProps) {
	return useRender({
		render,
		defaultTagName: `h${level}`,
		props: {
			className: cn(
				headingVariants({ size: size ?? sizeForLevel[level] }),
				className,
			),
			...props,
		},
	});
}

export const textVariants = cva("", {
	variants: {
		size: {
			xs: "text-xs",
			sm: "text-sm",
			md: "text-base",
			lg: "text-lg",
		},
		tone: {
			default: "text-foreground",
			muted: "text-muted",
			primary: "text-primary",
			danger: "text-danger",
		},
		weight: {
			regular: "font-normal",
			medium: "font-medium",
			bold: "font-semibold",
		},
	},
	defaultVariants: { size: "md", tone: "default", weight: "regular" },
});

export interface TextProps
	extends useRender.ComponentProps<"p">,
		VariantProps<typeof textVariants> {}

/**
 * Body copy. Renders a `<p>`; use `render={<span />}` for inline text.
 *
 * @example
 * <Text tone="muted">Pick a room to join.</Text>
 */
export function Text({
	size,
	tone,
	weight,
	className,
	render,
	...props
}: TextProps) {
	return useRender({
		render,
		defaultTagName: "p",
		props: {
			className: cn(textVariants({ size, tone, weight }), className),
			...props,
		},
	});
}
