import { Input as BaseInput } from "@base-ui/react/input";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

export const inputVariants = cva(
	[
		"w-full min-w-0 rounded-lg border-2 border-border bg-card text-foreground outline-none",
		"shadow-[inset_0_2px_0_rgb(0_0_0/0.05)] placeholder:text-muted",
		"transition-[border-color,box-shadow] duration-(--zupy-duration-fast)",
		"focus:border-primary focus:ring-3 focus:ring-primary/20",
		"data-invalid:border-danger data-invalid:focus:ring-danger/20",
		"data-disabled:cursor-not-allowed data-disabled:opacity-50",
	],
	{
		variants: {
			size: {
				sm: "h-9 px-3 text-sm",
				md: "h-11 px-4 text-base",
				lg: "h-14 px-5 text-lg",
			},
		},
		defaultVariants: { size: "md" },
	},
);

export interface InputProps
	extends Omit<BaseInput.Props, "className" | "size">,
		VariantProps<typeof inputVariants> {
	className?: string;
}

/**
 * A text input. Inside a `Field` it picks up the label, description and validation state.
 *
 * @example
 * <Input placeholder="Your nickname" />
 */
export function Input({ size, className, ...props }: InputProps) {
	return (
		<BaseInput className={cn(inputVariants({ size }), className)} {...props} />
	);
}

export interface TextareaProps
	extends Omit<BaseInput.Props, "className" | "size" | "render"> {
	/** Visible lines before it scrolls. @default 4 */
	rows?: number;
	className?: string;
}

/**
 * A multi-line text input with the same look as `Input`.
 *
 * @example
 * <Textarea placeholder="Say something nice" />
 */
export function Textarea({ rows = 4, className, ...props }: TextareaProps) {
	return (
		<BaseInput
			render={<textarea rows={rows} />}
			className={cn(
				inputVariants({ size: "md" }),
				"h-auto resize-y py-3 leading-relaxed",
				className,
			)}
			{...props}
		/>
	);
}
