import { cn } from "@zupy/ui";
import { withBase } from "@/lib/shared";

/** The zupy mark. `size` is its width and height in pixels; the parent link carries the label. */
export function Logo({
	size = 32,
	className,
}: {
	size?: number;
	className?: string;
}) {
	return (
		<img
			src={withBase("/logo.webp")}
			alt=""
			width={size}
			height={size}
			className={cn("shrink-0", className)}
		/>
	);
}
