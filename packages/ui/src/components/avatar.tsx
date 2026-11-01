import { Avatar as BaseAvatar } from "@base-ui/react/avatar";
import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export const avatarVariants = cva(
	[
		"relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden",
		"border-(length:--zupy-edge-width) border-edge bg-accent font-display font-semibold text-accent-foreground",
	],
	{
		variants: {
			size: {
				sm: "size-8 text-xs",
				md: "size-10 text-sm",
				lg: "size-14 text-lg",
				xl: "size-20 text-2xl",
			},
			shape: {
				circle: "rounded-full",
				square: "rounded-lg",
			},
		},
		defaultVariants: { size: "md", shape: "circle" },
	},
);

export interface AvatarProps
	extends Omit<BaseAvatar.Root.Props, "className">,
		VariantProps<typeof avatarVariants> {
	/** Image URL. When missing or broken, the fallback is shown. */
	src?: string;
	/** Who this is. Used as alt text and to build initials. */
	name: string;
	/** Shown when there is no image. Defaults to the initials of `name`. */
	fallback?: ReactNode;
	className?: string;
}

function initials(name: string) {
	return name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase() ?? "")
		.join("");
}

/**
 * A picture of a person, with their initials when there is no image.
 *
 * @example
 * <Avatar name="Maya Lin" src="/maya.png" />
 * <Avatar name="Sam" size="lg" fallback="🦊" />
 */
export function Avatar({
	src,
	name,
	fallback,
	size,
	shape,
	className,
	...props
}: AvatarProps) {
	return (
		<BaseAvatar.Root
			className={cn(avatarVariants({ size, shape }), className)}
			{...props}
		>
			{src ? (
				<BaseAvatar.Image
					src={src}
					alt={name}
					className="size-full object-cover"
				/>
			) : null}
			<BaseAvatar.Fallback>
				<span aria-hidden>{fallback ?? initials(name)}</span>
				<span className="sr-only">{name}</span>
			</BaseAvatar.Fallback>
		</BaseAvatar.Root>
	);
}
