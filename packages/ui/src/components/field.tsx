import { Field as BaseField } from "@base-ui/react/field";
import { cn } from "@/lib/cn";

export interface FieldProps extends Omit<BaseField.Root.Props, "className"> {
	className?: string;
}

/**
 * Groups a label, a control and its messages, and wires them together for accessibility and validation.
 *
 * @example
 * <Field>
 *   <FieldLabel>Display name</FieldLabel>
 *   <Input required />
 *   <FieldDescription>Shown on your profile.</FieldDescription>
 *   <FieldError>Pick a name first.</FieldError>
 * </Field>
 */
export function Field({ className, ...props }: FieldProps) {
	return (
		<BaseField.Root
			className={cn("flex w-full flex-col gap-1.5", className)}
			{...props}
		/>
	);
}

export interface FieldLabelProps
	extends Omit<BaseField.Label.Props, "className"> {
	className?: string;
}

export function FieldLabel({ className, ...props }: FieldLabelProps) {
	return (
		<BaseField.Label
			className={cn(
				"font-display font-semibold text-foreground text-sm data-disabled:opacity-50",
				className,
			)}
			{...props}
		/>
	);
}

export interface FieldDescriptionProps
	extends Omit<BaseField.Description.Props, "className"> {
	className?: string;
}

export function FieldDescription({
	className,
	...props
}: FieldDescriptionProps) {
	return (
		<BaseField.Description
			className={cn("text-muted text-sm", className)}
			{...props}
		/>
	);
}

export interface FieldErrorProps
	extends Omit<BaseField.Error.Props, "className"> {
	className?: string;
}

/** Shown only when the control is invalid. Pass `match` to target one validity state. */
export function FieldError({ className, ...props }: FieldErrorProps) {
	return (
		<BaseField.Error
			className={cn("animate-shake font-medium text-danger text-sm", className)}
			{...props}
		/>
	);
}
