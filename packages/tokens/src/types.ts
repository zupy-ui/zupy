/** Semantic color roles. Components only ever reference these, never raw hex values. */
export type ColorRole =
	| "background"
	| "foreground"
	| "muted"
	| "surface"
	| "card"
	| "border"
	| "edge"
	| "ring"
	| "primary"
	| "primary-foreground"
	| "accent"
	| "accent-foreground"
	| "success"
	| "success-foreground"
	| "warning"
	| "warning-foreground"
	| "danger"
	| "danger-foreground";

export type Palette = Record<ColorRole, string>;

/** The physical "feel" of a theme: how thick the outline is and how far things lift and sink. */
export interface Shape {
	/** Outline width on raised elements, e.g. `2px`. `0px` for borderless themes. */
	edgeWidth: string;
	/** Height of the hard drop shadow under raised elements. */
	lift: string;
	/** How far a raised element sinks when pressed. Usually a bit less than `lift`. */
	press: string;
	/** 0 for flat fills, 1 for glossy gradient fills with a highlight edge. */
	gloss: number;
	radius: { sm: string; md: string; lg: string; xl: string };
}

export interface Theme {
	name: string;
	light: Palette;
	dark: Palette;
	shape: Shape;
}
