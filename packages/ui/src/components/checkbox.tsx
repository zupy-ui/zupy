import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { cn } from "@/lib/cn";
import { disabledStyle, focusRing } from "@/lib/styles";

export interface CheckboxProps
	extends Omit<BaseCheckbox.Root.Props, "className"> {
	className?: string;
}

/**
 * A raised checkbox whose tick pops in. Wrap it in a `<label>` with its text.
 *
 * @example
 * <label className="flex items-center gap-2">
 *   <Checkbox defaultChecked />
 *   Sound effects
 * </label>
 */
export function Checkbox({ className, ...props }: CheckboxProps) {
	return (
		<BaseCheckbox.Root
			className={cn(
				"raised filled pressable depth-sm inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-sm",
				"text-primary-foreground [--zupy-fill:var(--zupy-card)]",
				"data-checked:[--zupy-fill:var(--zupy-primary)] data-indeterminate:[--zupy-fill:var(--zupy-primary)]",
				focusRing,
				disabledStyle,
				className,
			)}
			{...props}
		>
			<BaseCheckbox.Indicator className="group flex animate-pop">
				<svg
					viewBox="0 0 16 16"
					fill="none"
					stroke="currentColor"
					strokeWidth={2.75}
					strokeLinecap="round"
					strokeLinejoin="round"
					className="size-4 group-data-indeterminate:hidden"
					aria-hidden
				>
					<path d="M3.5 8.5l3 3 6-7" />
				</svg>
				<svg
					viewBox="0 0 16 16"
					fill="none"
					stroke="currentColor"
					strokeWidth={2.75}
					strokeLinecap="round"
					className="hidden size-4 group-data-indeterminate:block"
					aria-hidden
				>
					<path d="M4 8h8" />
				</svg>
			</BaseCheckbox.Indicator>
		</BaseCheckbox.Root>
	);
}
