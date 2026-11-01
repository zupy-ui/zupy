import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { cn } from "@/lib/cn";
import { disabledStyle, focusRing } from "@/lib/styles";

export interface SwitchProps extends Omit<BaseSwitch.Root.Props, "className"> {
	className?: string;
}

/**
 * An on/off toggle with a springy thumb. Wrap it in a `<label>` with its text.
 *
 * @example
 * <label className="flex items-center gap-3">
 *   <Switch defaultChecked />
 *   Haptics
 * </label>
 */
export function Switch({ className, ...props }: SwitchProps) {
	return (
		<BaseSwitch.Root
			className={cn(
				"inline-flex h-8 w-13 shrink-0 cursor-pointer items-center rounded-full p-1",
				"border-(length:--zupy-edge-width) border-edge bg-surface shadow-[inset_0_2px_0_rgb(0_0_0/0.08)]",
				"transition-colors duration-(--zupy-duration-base) data-checked:bg-primary",
				focusRing,
				disabledStyle,
				className,
			)}
			{...props}
		>
			<BaseSwitch.Thumb
				className={cn(
					"raised depth-sm block size-5 rounded-full bg-card",
					"transition-transform duration-(--zupy-duration-slow) ease-pop",
					"data-checked:translate-x-[calc(1.5rem_-_2*var(--zupy-edge-width))]",
				)}
			/>
		</BaseSwitch.Root>
	);
}
