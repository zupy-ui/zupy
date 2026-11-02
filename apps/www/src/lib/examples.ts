import type { ComponentType } from "react";
import { Dashboard1 } from "@/components/examples/dashboard-1";

export interface Example {
	/** URL segment: `/examples/<id>`. */
	id: string;
	title: string;
	description: string;
	/** zupy components the example is built from. */
	components: string[];
	/** Source file, relative to `apps/www/src/components/examples/`. */
	source: string;
	component: ComponentType;
}

export const examples: Example[] = [
	{
		id: "dashboard-1",
		title: "Dashboard 1",
		description:
			"A product dashboard with stats, a revenue chart, projects and a to-do list.",
		components: [
			"Avatar",
			"Badge",
			"Button",
			"Card",
			"Checkbox",
			"IconButton",
			"Input",
			"Segmented",
			"Switch",
		],
		source: "dashboard-1.tsx",
		component: Dashboard1,
	},
];

export function getExample(id: string) {
	return examples.find((example) => example.id === id);
}
