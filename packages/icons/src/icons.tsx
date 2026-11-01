import { createIcon, dot } from "@/create-icon";

/** A speech bubble saying hello. Good for intros, chat and onboarding. */
export const HelloIcon = createIcon("HelloIcon", {
	body: "M8 3h8a5 5 0 0 1 5 5v3a5 5 0 0 1-5 5h-4.5l-4 3.5v-3.8A5 5 0 0 1 3 11V8a5 5 0 0 1 5-5z",
	details: (
		<>
			<circle cx="9.5" cy="8.5" r="1.2" {...dot} />
			<circle cx="14.5" cy="8.5" r="1.2" {...dot} />
			<path d="M9.5 11.6c1.4 1.3 3.6 1.3 5 0" />
		</>
	),
});

/** A box with an arrow dropping into it. Good for install, download and save. */
export const InstallIcon = createIcon("InstallIcon", {
	body: "M4 11h16v7a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 18z",
	outside: (
		<>
			<path d="M12 2.5v6" />
			<path d="M9 6l3 3 3-3" />
		</>
	),
	details: <path d="M10 15.5h4" />,
});

/** A paint palette with three dabs. Good for themes and appearance settings. */
export const ThemeIcon = createIcon("ThemeIcon", {
	body: "M12 3a9 9 0 1 0 0 18c1.3 0 2-.9 2-1.9 0-.6-.3-1-.6-1.4-.4-.4-.6-.8-.6-1.4 0-1.1.9-2 2-2h2.3a4 4 0 0 0 3.9-4C21 6.3 17 3 12 3z",
	details: (
		<>
			<circle cx="7.5" cy="11" r="1.3" {...dot} />
			<circle cx="9.5" cy="7" r="1.3" {...dot} />
			<circle cx="14.5" cy="7" r="1.3" {...dot} />
		</>
	),
});

/** A friendly robot head. Good for AI, bots and automation. */
export const RobotIcon = createIcon("RobotIcon", {
	body: "M8 7.5h8a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-4a4 4 0 0 1 4-4z",
	outside: (
		<>
			<path d="M12 7.5V4.5" />
			<circle cx="12" cy="3.5" r="1.4" {...dot} />
			<path d="M2 12.5v2M22 12.5v2" />
		</>
	),
	details: (
		<>
			<circle cx="9.5" cy="12.5" r="1.3" {...dot} />
			<circle cx="14.5" cy="12.5" r="1.3" {...dot} />
			<path d="M10.5 16h3" />
		</>
	),
});

/** A house with a round door. */
export const HomeIcon = createIcon("HomeIcon", {
	body: "M4 10.5 12 4l8 6.5V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z",
	details: <path d="M10 20v-4a2 2 0 0 1 4 0v4" />,
});

/** A magnifying glass with a glint. */
export const SearchIcon = createIcon("SearchIcon", {
	body: "M10.5 3.5a7 7 0 1 1 0 14 7 7 0 0 1 0-14z",
	outside: <path d="M15.8 15.8l4.7 4.7" strokeWidth={3} />,
	details: <path d="M7.5 10a3 3 0 0 1 3-3" />,
});

/** A bell for notifications. */
export const BellIcon = createIcon("BellIcon", {
	body: "M12 3a6 6 0 0 1 6 6v3.5l1.8 3a1 1 0 0 1-.9 1.5H5.1a1 1 0 0 1-.9-1.5l1.8-3V9a6 6 0 0 1 6-6z",
	outside: <path d="M10 20.5a2 2 0 0 0 4 0" />,
	details: <path d="M9 9a3 3 0 0 1 3-3" />,
});

/** A plump heart. Good for likes and favorites. */
export const HeartIcon = createIcon("HeartIcon", {
	body: "M12 20s-8-4.6-8-10.2A4.3 4.3 0 0 1 8.3 5.5c1.6 0 2.9.8 3.7 2 .8-1.2 2.1-2 3.7-2A4.3 4.3 0 0 1 20 9.8C20 15.4 12 20 12 20z",
	details: <path d="M7.2 10a2 2 0 0 1 1.8-1.8" />,
});

/** A rounded star. Good for ratings and highlights. */
export const StarIcon = createIcon("StarIcon", {
	body: "M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.8l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z",
});

/** A person: head and shoulders. */
export const UserIcon = createIcon("UserIcon", {
	body: "M12 3.5a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM4.5 20a7.5 6 0 0 1 15 0z",
});

/**
 * Every icon by name, for galleries and lookups by string.
 * In app code import icons by name instead, so unused ones are left out of the bundle.
 */
export const icons = {
	BellIcon,
	HeartIcon,
	HelloIcon,
	HomeIcon,
	InstallIcon,
	RobotIcon,
	SearchIcon,
	StarIcon,
	ThemeIcon,
	UserIcon,
};

export type IconName = keyof typeof icons;
