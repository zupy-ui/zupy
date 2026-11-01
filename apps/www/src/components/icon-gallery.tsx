import { icons } from "@zupy/icons";

/** Every icon in @zupy/icons, with its export name. */
export function IconGallery() {
	return (
		<div className="not-prose my-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
			{Object.entries(icons).map(([name, Icon]) => (
				<div
					key={name}
					className="flex flex-col items-center gap-3 rounded-xl border-2 border-border bg-card px-3 py-5"
				>
					<Icon size={40} />
					<code className="font-mono text-muted text-xs">{name}</code>
				</div>
			))}
		</div>
	);
}
