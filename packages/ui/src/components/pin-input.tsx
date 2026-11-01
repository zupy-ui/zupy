import { OTPField } from "@base-ui/react/otp-field";
import { cva, type VariantProps } from "class-variance-authority";
import { Fragment } from "react";
import { cn } from "@/lib/cn";

export const pinInputSlotVariants = cva(
	[
		"raised filled min-w-0 text-center font-bold font-display text-foreground caret-primary outline-none",
		"[--zupy-fill:var(--zupy-card)] placeholder:text-muted/50",
		"transition-transform duration-(--zupy-duration-fast)",
		// Focus: outline and shadow turn primary, and the slot lifts a touch.
		"focus:-translate-y-0.5 not-data-complete:focus:[--zupy-edge:var(--zupy-primary)]",
		"motion-safe:data-filled:animate-bump",
		// Done: every slot fills with primary. The edge stays ink so slots don't melt into each other.
		"data-complete:text-primary-foreground data-complete:caret-primary-foreground data-complete:[--zupy-fill:var(--zupy-primary)]",
		"data-invalid:[--zupy-edge:var(--zupy-danger)]",
		"data-disabled:cursor-not-allowed data-disabled:opacity-50",
	],
	{
		variants: {
			size: {
				sm: "depth-sm size-10 rounded-sm text-lg",
				md: "size-13 rounded-md text-2xl",
				lg: "size-16 rounded-lg text-3xl",
			},
		},
		defaultVariants: { size: "md" },
	},
);

export interface PinInputProps
	extends Omit<OTPField.Root.Props, "className" | "length" | "children">,
		VariantProps<typeof pinInputSlotVariants> {
	/** Number of characters. @default 6 */
	length?: number;
	/** Split the slots into groups with a dash, e.g. `3` for `123-456`. */
	groupSize?: number;
	/** Placeholder shown in each empty slot, e.g. `"•"`. */
	placeholder?: string;
	/** Accessible name for the whole field when there's no visible label. */
	"aria-label"?: string;
	className?: string;
}

/**
 * A row of chunky slots for one-time codes and PINs. Typing moves to the next slot, Backspace
 * goes back, and pasting or autofilling a code fills every slot.
 *
 * @example
 * <PinInput length={6} groupSize={3} onValueComplete={(code) => verify(code)} />
 * <PinInput length={4} mask validationType="numeric" aria-label="PIN" />
 */
export function PinInput({
	length = 6,
	groupSize,
	size,
	placeholder,
	className,
	...props
}: PinInputProps) {
	return (
		<OTPField.Root
			length={length}
			className={cn(
				"flex w-fit items-center gap-2 data-invalid:motion-safe:animate-shake",
				className,
			)}
			{...props}
		>
			{Array.from({ length }, (_, index) => (
				// Slots are positional and never reorder, so the index is a stable key.
				// biome-ignore lint/suspicious/noArrayIndexKey: fixed-length positional slots
				<Fragment key={index}>
					{groupSize && index > 0 && index % groupSize === 0 ? (
						<OTPField.Separator className="mx-1 h-1 w-3 shrink-0 rounded-full bg-border" />
					) : null}
					<OTPField.Input
						placeholder={placeholder}
						className={pinInputSlotVariants({ size })}
					/>
				</Fragment>
			))}
		</OTPField.Root>
	);
}
