import {
	Avatar,
	Badge,
	Button,
	Checkbox,
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
	Form,
	Heading,
	IconButton,
	Input,
	Kbd,
	Radio,
	RadioGroup,
	Segmented,
	SegmentedItem,
	Switch,
	Text,
	Textarea,
	Tile,
	Card as ZupyCard,
} from "@zupy/ui";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { Heart, Plus, Settings } from "lucide-react";
import type { MDXComponents } from "mdx/types";
import { Preview } from "@/components/preview";

export function getMDXComponents(components?: MDXComponents) {
	return {
		...defaultMdxComponents,
		Preview,
		Avatar,
		Badge,
		Button,
		// `Card` stays Fumadocs' link card; zupy's Card is `ZupyCard` in MDX.
		ZupyCard,
		Checkbox,
		Field,
		FieldDescription,
		FieldError,
		FieldLabel,
		Form,
		Heading,
		IconButton,
		Input,
		Kbd,
		Radio,
		RadioGroup,
		Segmented,
		SegmentedItem,
		Switch,
		Text,
		Textarea,
		Tile,
		Heart,
		Plus,
		Settings,
		...components,
	} satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
	type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
