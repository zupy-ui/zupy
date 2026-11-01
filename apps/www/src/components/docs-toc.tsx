import { cn } from "@zupy/ui";
import { TOCItem } from "fumadocs-core/toc";
import {
	TOCScrollArea,
	useActiveAnchor,
	useTOCItems,
} from "fumadocs-ui/components/toc";
import type { TOCProps } from "fumadocs-ui/layouts/docs/page/slots/toc";

/**
 * "On this page" in zupy style: a small uppercase label like the sidebar's section headings, and
 * the section you're reading as a raised card pill with primary text.
 */
export function DocsTOC({ container, header, footer }: TOCProps) {
	const items = useTOCItems();
	const activeAnchor = useActiveAnchor();

	if (items.length === 0 && !header && !footer) {
		// Keeps the grid column so the page width doesn't jump.
		return (
			<div
				id="nd-toc-placeholder"
				className="hidden xl:layout:[--fd-toc-width:268px]"
			/>
		);
	}

	return (
		<div
			id="nd-toc"
			{...container}
			className={cn(
				// Layout classes copied from Fumadocs' TOC so the docs grid keeps working.
				"sticky top-(--fd-docs-row-1) flex h-[calc(var(--fd-docs-height)-var(--fd-docs-row-1))] w-(--fd-toc-width) flex-col pe-4 pt-12 pb-2 [grid-area:toc] max-xl:hidden xl:layout:[--fd-toc-width:268px]",
				container?.className,
			)}
		>
			{header}
			<p className="mb-2 px-4 font-display font-semibold text-muted text-xs uppercase tracking-wider">
				On this page
			</p>
			<TOCScrollArea>
				{/* Inset so the scroll area doesn't clip the pill's outline and shadow. */}
				<nav className="flex flex-col gap-1 px-1 pt-0.5 pb-2">
					{items.map((item) => (
						<TOCItem
							key={item.url}
							href={item.url}
							data-current={item.url === `#${activeAnchor}`}
							className={cn(
								"flex min-h-8 items-center rounded-md px-3 py-1 font-display font-medium text-muted text-sm",
								"transition-[background-color] duration-(--zupy-duration-fast) hover:bg-surface hover:text-foreground",
								item.depth > 2 && "ms-3 text-[0.8125rem]",
								"data-[current=true]:raised data-[current=true]:filled data-[current=true]:depth-sm",
								"data-[current=true]:font-semibold data-[current=true]:text-primary",
								"data-[current=true]:[--zupy-fill:var(--zupy-card)] data-[current=true]:hover:text-primary",
							)}
						>
							{item.title}
						</TOCItem>
					))}
				</nav>
			</TOCScrollArea>
			{footer}
		</div>
	);
}
