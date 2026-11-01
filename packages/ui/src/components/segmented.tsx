import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import { ToggleGroup as BaseToggleGroup } from "@base-ui/react/toggle-group";
import { cn } from "@/lib/cn";
import { disabledStyle, focusRing } from "@/lib/styles";

export interface SegmentedProps
	extends Omit<
		BaseToggleGroup.Props,
		"className" | "value" | "defaultValue" | "onValueChange" | "multiple"
	> {
	/** The selected item. Use with `onValueChange` to control it. */
	value?: string;
	defaultValue?: string;
	onValueChange?: (value: string) => void;
	className?: string;
}

/**
 * Pick one of a few options, like a game mode or a tab. One item is always selected.
 *
 * @example
 * <Segmented defaultValue="daily">
 *   <SegmentedItem value="daily">Daily</SegmentedItem>
 *   <SegmentedItem value="weekly">Weekly</SegmentedItem>
 *   <SegmentedItem value="all">All time</SegmentedItem>
 * </Segmented>
 */
export function Segmented({
	value,
	defaultValue,
	onValueChange,
	className,
	...props
}: SegmentedProps) {
	return (
		<BaseToggleGroup
			value={value === undefined ? undefined : [value]}
			defaultValue={defaultValue === undefined ? undefined : [defaultValue]}
			onValueChange={(next) => {
				// Ignore deselecting the active item so one option is always picked.
				const picked = next[0];
				if (typeof picked === "string") onValueChange?.(picked);
			}}
			className={cn(
				"inline-flex w-fit gap-1 rounded-lg border-2 border-border bg-surface p-1",
				className,
			)}
			{...props}
		/>
	);
}

export interface SegmentedItemProps
	extends Omit<BaseToggle.Props, "className" | "value"> {
	value: string;
	className?: string;
}

export function SegmentedItem({ className, ...props }: SegmentedItemProps) {
	return (
		<BaseToggle
			className={cn(
				"inline-flex h-9 cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap rounded-md px-4",
				"font-display font-semibold text-muted text-sm transition-colors duration-(--zupy-duration-fast) hover:text-foreground",
				"data-pressed:raised data-pressed:filled data-pressed:depth-sm data-pressed:text-accent-foreground data-pressed:[--zupy-fill:var(--zupy-accent)]",
				focusRing,
				disabledStyle,
				className,
			)}
			{...props}
		/>
	);
}
