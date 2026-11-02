import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { githubUrl } from "@/lib/shared";

export function baseOptions(): BaseLayoutProps {
	return {
		githubUrl,
		links: [{ text: "Examples", url: "/examples" }],
	};
}
