import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { appName, gitConfig } from "@/lib/shared";

export function baseOptions(): BaseLayoutProps {
	return {
		nav: {
			title: (
				<span className="font-display font-bold text-lg tracking-tight">
					{appName}
				</span>
			),
		},
		githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
	};
}
