import { icons } from "@zupy/icons";
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
import type { MDXComponents } from "mdx/types";
import { IconGallery } from "@/components/icon-gallery";
import { Preview } from "@/components/preview";

export function getMDXComponents(components?: MDXComponents) {
	return {
		...defaultMdxComponents,
		...icons,
		Preview,
		IconGallery,
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
		...components,
	} satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
	type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
