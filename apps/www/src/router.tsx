import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { NotFound } from "@/components/not-found";
import { basePath } from "@/lib/shared";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
	return createTanStackRouter({
		routeTree,
		basepath: basePath.replace(/\/$/, "") || "/",
		defaultPreload: "intent",
		scrollRestoration: true,
		defaultNotFoundComponent: NotFound,
	});
}
