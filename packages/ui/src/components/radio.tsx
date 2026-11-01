import { Radio as BaseRadio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import { cn } from "@/lib/cn";
import { disabledStyle, focusRing } from "@/lib/styles";

export interface RadioGroupProps
	extends Omit<BaseRadioGroup.Props, "className"> {
	className?: string;
}

/**
 * A set of `Radio` options where only one can be picked.
 *
 * @example
 * <RadioGroup defaultValue="easy">
 *   <label className="flex items-center gap-2"><Radio value="easy" /> Easy</label>
 *   <label className="flex items-center gap-2"><Radio value="hard" /> Hard</label>
 * </RadioGroup>
 */
export function RadioGroup({ className, ...props }: RadioGroupProps) {
	return (
		<BaseRadioGroup
			className={cn("flex flex-col gap-3", className)}
			{...props}
		/>
	);
}

export interface RadioProps extends Omit<BaseRadio.Root.Props, "className"> {
	className?: string;
}

/** One option inside a `RadioGroup`. Wrap it in a `<label>` with its text. */
export function Radio({ className, ...props }: RadioProps) {
	return (
		<BaseRadio.Root
			className={cn(
				"raised filled pressable depth-sm inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full",
				"[--zupy-fill:var(--zupy-card)] data-checked:[--zupy-fill:var(--zupy-primary)]",
				focusRing,
				disabledStyle,
				className,
			)}
			{...props}
		>
			<BaseRadio.Indicator className="size-2.5 animate-pop rounded-full bg-primary-foreground" />
		</BaseRadio.Root>
	);
}
