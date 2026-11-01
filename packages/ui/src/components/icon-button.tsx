import { Button, type ButtonProps } from "@/components/button";
import { cn } from "@/lib/cn";

const iconSizes = {
	sm: "size-9 px-0",
	md: "size-11 px-0",
	lg: "size-14 px-0",
} as const;

export interface IconButtonProps extends ButtonProps {
	/** Required: an icon alone has no text for screen readers. */
	"aria-label": string;
}

/**
 * A square button holding a single icon.
 *
 * @example
 * <IconButton aria-label="Settings" variant="secondary">
 *   <GearIcon />
 * </IconButton>
 */
export function IconButton({ size, className, ...props }: IconButtonProps) {
	return (
		<Button
			size={size}
			className={cn(iconSizes[size ?? "md"], className)}
			{...props}
		/>
	);
}
