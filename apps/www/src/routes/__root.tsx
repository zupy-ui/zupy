import {
	createRootRoute,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { RootProvider } from "fumadocs-ui/provider/tanstack";
import { DocsSearchDialog } from "@/components/search";
import { withBase } from "@/lib/shared";
import appCss from "@/styles/app.css?url";

const fonts =
	"https://fonts.googleapis.com/css2?family=Fredoka:wght@400..700&family=Inter:wght@400..900&display=swap";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: "zupy · playful React components" },
			{
				name: "description",
				content:
					"Chunky, tactile React components with hard shadows and springy motion.",
			},
			{ name: "theme-color", content: "#005afd" },
		],
		links: [
			{ rel: "icon", href: withBase("/favicon.ico"), sizes: "48x48" },
			{ rel: "apple-touch-icon", href: withBase("/apple-touch-icon.png") },
			{ rel: "manifest", href: withBase("/site.webmanifest") },
			{ rel: "preconnect", href: "https://fonts.googleapis.com" },
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous",
			},
			{ rel: "stylesheet", href: fonts },
			{ rel: "stylesheet", href: appCss },
		],
	}),
	component: RootComponent,
});

function RootComponent() {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body className="flex min-h-screen flex-col">
				<RootProvider search={{ SearchDialog: DocsSearchDialog }}>
					<Outlet />
				</RootProvider>
				<Scripts />
			</body>
		</html>
	);
}
