import { cn, Segmented, SegmentedItem } from "@zupy/ui";
import { usePathname } from "fumadocs-core/framework";
import type * as PageTree from "fumadocs-core/page-tree";
import {
	SidebarFolder,
	SidebarFolderContent,
	SidebarFolderLink,
	SidebarFolderTrigger,
	SidebarItem,
} from "fumadocs-ui/components/sidebar/base";
import type { SidebarPageTreeComponents } from "fumadocs-ui/components/sidebar/page-tree";
import { ChevronDown, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
	type ComponentProps,
	type ReactNode,
	useSyncExternalStore,
} from "react";

const isActive = (url: string, pathname: string) =>
	url.replace(/\/$/, "") === pathname.replace(/\/$/, "");

/** Sidebar rows: muted text, a soft hover, and the active page as a raised accent pill. */
const rowClass = cn(
	"flex h-9 w-full items-center gap-2 rounded-md px-3 text-start",
	"font-display font-medium text-[0.9375rem] text-muted transition-colors duration-(--zupy-duration-fast)",
	"hover:bg-surface hover:text-foreground [&_svg]:size-4 [&_svg]:shrink-0",
	"data-[active=true]:raised data-[active=true]:filled data-[active=true]:depth-sm",
	"data-[active=true]:font-semibold data-[active=true]:text-accent-foreground",
	"data-[active=true]:[--zupy-fill:var(--zupy-accent)] data-[active=true]:hover:text-accent-foreground",
);

function Item({ item }: { item: PageTree.Item }) {
	const pathname = usePathname();
	return (
		<SidebarItem
			href={item.url}
			external={item.external}
			active={isActive(item.url, pathname)}
			icon={item.icon}
			className={cn(rowClass, "my-0.5")}
		>
			{item.name}
		</SidebarItem>
	);
}

function Separator({ item }: { item: PageTree.Separator }) {
	return (
		<p className="mt-6 mb-1.5 flex items-center gap-2 px-3 font-display font-semibold text-muted text-xs uppercase tracking-wider first:mt-0 [&_svg]:size-3.5">
			{item.icon}
			{item.name}
		</p>
	);
}

function Folder({
	item,
	children,
}: {
	item: PageTree.Folder;
	children: ReactNode;
}) {
	const pathname = usePathname();
	const index = item.index;
	const chevron = (
		<ChevronDown className="ms-auto transition-transform duration-(--zupy-duration-base) ease-pop in-data-[panel-open]:rotate-180" />
	);
	return (
		<SidebarFolder
			defaultOpen={item.defaultOpen}
			collapsible={item.collapsible}
		>
			{index ? (
				<SidebarFolderLink
					href={index.url}
					active={isActive(index.url, pathname)}
					className={rowClass}
				>
					{item.icon}
					{item.name}
					{chevron}
				</SidebarFolderLink>
			) : (
				<SidebarFolderTrigger className={rowClass}>
					{item.icon}
					{item.name}
					{chevron}
				</SidebarFolderTrigger>
			)}
			<SidebarFolderContent className="ms-4 border-border border-s-2 ps-2">
				{children}
			</SidebarFolderContent>
		</SidebarFolder>
	);
}

export const sidebarComponents: Partial<SidebarPageTreeComponents> = {
	Item,
	Separator,
	Folder,
};

/** The wordmark: a tiny raised tile with the brand letter. */
export function NavTitle({ className, ...props }: ComponentProps<"a">) {
	return (
		<a
			href="/"
			// Fumadocs passes its own sizing; ours goes last so the wordmark stays chunky.
			className={cn(
				className,
				"inline-flex items-center gap-2 font-bold font-display text-xl tracking-tight",
			)}
			{...props}
		>
			<span className="raised filled depth-sm inline-flex size-7 items-center justify-center rounded-sm text-accent-foreground text-base [--zupy-fill:var(--zupy-accent)]">
				z
			</span>
			zupy
		</a>
	);
}

const subscribe = () => () => {};

/** Light/dark toggle. Ignores the classes Fumadocs passes, which would flatten the Segmented. */
export function ThemeSwitch() {
	const { resolvedTheme, setTheme } = useTheme();
	const mounted = useSyncExternalStore(
		subscribe,
		() => true,
		() => false,
	);
	return (
		<Segmented
			aria-label="Color theme"
			value={mounted && resolvedTheme ? resolvedTheme : "light"}
			onValueChange={setTheme}
			className="ms-auto"
		>
			<SegmentedItem value="light" aria-label="Light" className="h-8 px-2.5">
				<Sun className="size-4" />
			</SegmentedItem>
			<SegmentedItem value="dark" aria-label="Dark" className="h-8 px-2.5">
				<Moon className="size-4" />
			</SegmentedItem>
		</Segmented>
	);
}
