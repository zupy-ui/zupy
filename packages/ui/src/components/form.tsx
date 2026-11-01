import { Form as BaseForm } from "@base-ui/react/form";
import { cn } from "@/lib/cn";

export interface FormProps extends Omit<BaseForm.Props, "className"> {
	className?: string;
}

/**
 * A form that validates its `Field`s and shows their `FieldError`s instead of the browser's bubbles.
 *
 * @example
 * <Form onFormSubmit={(values) => save(values)}>
 *   <Field name="email">
 *     <FieldLabel>Email</FieldLabel>
 *     <Input type="email" required />
 *     <FieldError />
 *   </Field>
 *   <Button type="submit">Save</Button>
 * </Form>
 */
export function Form({ className, ...props }: FormProps) {
	return (
		<BaseForm className={cn("flex flex-col gap-4", className)} {...props} />
	);
}
