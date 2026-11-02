import {
	Avatar,
	Badge,
	Button,
	Card,
	Checkbox,
	cn,
	IconButton,
	Input,
	Segmented,
	SegmentedItem,
	Switch,
} from "@zupy/ui";
import {
	Bell,
	ChartNoAxesColumn,
	FolderKanban,
	Home,
	Inbox,
	type LucideIcon,
	Plus,
	Search,
	Settings,
	TrendingDown,
	TrendingUp,
	Users,
} from "lucide-react";
import { useState } from "react";

type Range = "week" | "month" | "year";

const nav: { label: string; icon: LucideIcon; count?: number }[] = [
	{ label: "Overview", icon: Home },
	{ label: "Projects", icon: FolderKanban },
	{ label: "Inbox", icon: Inbox, count: 4 },
	{ label: "Team", icon: Users },
	{ label: "Reports", icon: ChartNoAxesColumn },
	{ label: "Settings", icon: Settings },
];

const data: Record<
	Range,
	{
		stats: { label: string; value: string; change: number }[];
		chart: { label: string; value: number }[];
	}
> = {
	week: {
		stats: [
			{ label: "Revenue", value: "$12.4k", change: 8.2 },
			{ label: "New signups", value: "318", change: 12.5 },
			{ label: "Active users", value: "2,104", change: -1.4 },
		],
		chart: [
			{ label: "Mon", value: 42 },
			{ label: "Tue", value: 58 },
			{ label: "Wed", value: 51 },
			{ label: "Thu", value: 74 },
			{ label: "Fri", value: 88 },
			{ label: "Sat", value: 36 },
			{ label: "Sun", value: 29 },
		],
	},
	month: {
		stats: [
			{ label: "Revenue", value: "$48.9k", change: 14.1 },
			{ label: "New signups", value: "1,240", change: 6.3 },
			{ label: "Active users", value: "6,870", change: 3.8 },
		],
		chart: [
			{ label: "W1", value: 61 },
			{ label: "W2", value: 70 },
			{ label: "W3", value: 55 },
			{ label: "W4", value: 92 },
		],
	},
	year: {
		stats: [
			{ label: "Revenue", value: "$512k", change: 32.7 },
			{ label: "New signups", value: "14.8k", change: 21.0 },
			{ label: "Active users", value: "9,315", change: 18.4 },
		],
		chart: [
			{ label: "Jan", value: 30 },
			{ label: "Feb", value: 34 },
			{ label: "Mar", value: 41 },
			{ label: "Apr", value: 39 },
			{ label: "May", value: 52 },
			{ label: "Jun", value: 58 },
			{ label: "Jul", value: 55 },
			{ label: "Aug", value: 63 },
			{ label: "Sep", value: 70 },
			{ label: "Oct", value: 78 },
			{ label: "Nov", value: 84 },
			{ label: "Dec", value: 96 },
		],
	},
};

const activity = [
	{ name: "Priya Shah", action: "upgraded to Pro", time: "2m ago" },
	{ name: "Leo Martins", action: "invited 3 teammates", time: "18m ago" },
	{ name: "Ana Ruiz", action: "opened a support ticket", time: "1h ago" },
	{ name: "Sam Okafor", action: "exported a report", time: "3h ago" },
];

const projects: {
	name: string;
	owner: string;
	status: "On track" | "At risk" | "Done";
	progress: number;
}[] = [
	{
		name: "Website refresh",
		owner: "Priya Shah",
		status: "On track",
		progress: 72,
	},
	{
		name: "Mobile onboarding",
		owner: "Leo Martins",
		status: "At risk",
		progress: 38,
	},
	{ name: "Billing v2", owner: "Ana Ruiz", status: "Done", progress: 100 },
	{
		name: "Help center",
		owner: "Sam Okafor",
		status: "On track",
		progress: 54,
	},
];

const statusVariant = {
	"On track": "primary",
	"At risk": "warning",
	Done: "success",
} as const;

const initialTodos = [
	{ id: 1, title: "Review Q4 roadmap", done: true },
	{ id: 2, title: "Reply to Leo about onboarding", done: false },
	{ id: 3, title: "Approve billing copy", done: false },
];

/** A small product dashboard composed entirely from zupy components. */
export function Dashboard1() {
	const [active, setActive] = useState("Overview");
	const [range, setRange] = useState<Range>("week");
	const [todos, setTodos] = useState(initialTodos);
	const [alerts, setAlerts] = useState(true);
	const { stats, chart } = data[range];
	const peak = Math.max(...chart.map((point) => point.value));

	return (
		<div className="flex min-h-screen flex-col bg-background text-foreground lg:flex-row">
			<aside className="flex flex-col gap-6 border-border border-b-2 bg-card p-4 lg:sticky lg:top-0 lg:h-screen lg:w-60 lg:shrink-0 lg:border-r-2 lg:border-b-0 lg:p-5">
				<div className="flex items-center gap-3">
					<span className="raised flex size-10 items-center justify-center rounded-lg bg-primary font-bold font-display text-primary-foreground">
						A
					</span>
					<span className="font-display font-semibold text-xl">Acme</span>
				</div>
				<nav
					aria-label="Dashboard"
					className="flex gap-1 overflow-x-auto lg:flex-col"
				>
					{nav.map(({ label, icon: Icon, count }) => (
						<Button
							key={label}
							variant="ghost"
							size="sm"
							aria-current={active === label ? "page" : undefined}
							onClick={() => setActive(label)}
							className={cn(
								"shrink-0 justify-start",
								active === label && "bg-surface text-primary",
							)}
						>
							<Icon /> {label}
							{count ? (
								<Badge variant="accent" className="ml-auto">
									{count}
								</Badge>
							) : null}
						</Button>
					))}
				</nav>
				<Card variant="sunken" padding="sm" className="mt-auto hidden lg:block">
					<p className="font-display font-semibold">Upgrade to Pro</p>
					<p className="mt-1 text-muted text-sm">
						Unlock unlimited projects and reports.
					</p>
					<Button size="sm" variant="accent" className="mt-3 w-full">
						Upgrade
					</Button>
				</Card>
			</aside>

			<main className="flex min-w-0 flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
				<header className="flex flex-wrap items-center gap-3">
					<div className="mr-auto">
						<p className="text-muted text-sm">Good morning, Alex</p>
						<h1 className="font-display font-semibold text-3xl tracking-tight">
							{active}
						</h1>
					</div>
					<div className="relative w-full sm:w-56">
						<Search
							className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted"
							aria-hidden
						/>
						<Input placeholder="Search" aria-label="Search" className="pl-9" />
					</div>
					<IconButton variant="secondary" size="md" aria-label="Notifications">
						<Bell />
					</IconButton>
					<Avatar name="Alex Morgan" size="md" />
				</header>

				<div className="flex flex-wrap items-center justify-between gap-3">
					<Segmented
						value={range}
						onValueChange={(value) => setRange(value as Range)}
						aria-label="Date range"
					>
						<SegmentedItem value="week">Week</SegmentedItem>
						<SegmentedItem value="month">Month</SegmentedItem>
						<SegmentedItem value="year">Year</SegmentedItem>
					</Segmented>
					<Button size="sm">
						<Plus /> New project
					</Button>
				</div>

				<div className="grid gap-4 sm:grid-cols-3">
					{stats.map(({ label, value, change }) => {
						const up = change >= 0;
						const Trend = up ? TrendingUp : TrendingDown;
						return (
							<Card key={label} padding="sm">
								<p className="text-muted text-sm">{label}</p>
								<p className="mt-1 font-display font-semibold text-3xl tabular-nums">
									{value}
								</p>
								<Badge variant={up ? "success" : "danger"} className="mt-3">
									<Trend aria-hidden /> {up ? "+" : ""}
									{change}%
								</Badge>
							</Card>
						);
					})}
				</div>

				<div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
					<Card>
						<div className="flex items-center justify-between">
							<h3 className="font-display font-semibold text-xl">Revenue</h3>
							<span className="text-muted text-sm capitalize">
								This {range}
							</span>
						</div>
						<div
							role="img"
							aria-label={`Revenue by ${range === "year" ? "month" : range === "month" ? "week" : "day"}, peaking at ${peak}`}
							className="mt-6 flex h-48 items-end gap-2 sm:gap-3"
						>
							{chart.map((point) => (
								<div
									key={point.label}
									className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
								>
									<div
										className={cn(
											"raised depth-sm w-full rounded-t-md motion-safe:transition-[height] motion-safe:duration-300",
											point.value === peak ? "bg-primary" : "bg-surface",
										)}
										style={{ height: `${(point.value / peak) * 100}%` }}
									/>
									<span className="text-muted text-xs">{point.label}</span>
								</div>
							))}
						</div>
					</Card>

					<Card>
						<h3 className="font-display font-semibold text-xl">
							Recent activity
						</h3>
						<ul className="mt-4 flex flex-col gap-4">
							{activity.map((item) => (
								<li key={item.name} className="flex items-center gap-3">
									<Avatar name={item.name} size="sm" />
									<p className="min-w-0 flex-1 text-sm">
										<span className="font-semibold">{item.name}</span>{" "}
										<span className="text-muted">{item.action}</span>
									</p>
									<span className="shrink-0 text-muted text-xs">
										{item.time}
									</span>
								</li>
							))}
						</ul>
					</Card>
				</div>

				<div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
					<Card padding="none" className="overflow-hidden">
						<h3 className="border-border border-b-2 px-5 py-4 font-display font-semibold text-xl sm:px-6">
							Projects
						</h3>
						<div className="overflow-x-auto">
							<table className="w-full text-left text-sm">
								<thead className="text-muted">
									<tr>
										<th className="px-5 py-3 font-medium sm:px-6">Name</th>
										<th className="px-3 py-3 font-medium">Owner</th>
										<th className="px-3 py-3 font-medium">Status</th>
										<th className="px-5 py-3 font-medium sm:px-6">Progress</th>
									</tr>
								</thead>
								<tbody>
									{projects.map((project) => (
										<tr key={project.name} className="border-border border-t-2">
											<td className="px-5 py-3 font-semibold sm:px-6">
												{project.name}
											</td>
											<td className="px-3 py-3">
												<span className="flex items-center gap-2 whitespace-nowrap">
													<Avatar name={project.owner} size="sm" />
													{project.owner}
												</span>
											</td>
											<td className="px-3 py-3">
												<Badge variant={statusVariant[project.status]}>
													{project.status}
												</Badge>
											</td>
											<td className="px-5 py-3 sm:px-6">
												<div className="flex items-center gap-2">
													<div
														role="progressbar"
														aria-label={`${project.name} progress`}
														aria-valuemin={0}
														aria-valuemax={100}
														aria-valuenow={project.progress}
														className="h-2.5 w-24 overflow-hidden rounded-full bg-surface"
													>
														<div
															className="h-full rounded-full bg-primary"
															style={{ width: `${project.progress}%` }}
														/>
													</div>
													<span className="text-muted tabular-nums">
														{project.progress}%
													</span>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</Card>

					<Card>
						<h3 className="font-display font-semibold text-xl">To do</h3>
						<ul className="mt-4 flex flex-col gap-3">
							{todos.map((todo) => (
								<li key={todo.id}>
									<label className="flex cursor-pointer items-center gap-3 text-sm">
										<Checkbox
											checked={todo.done}
											onCheckedChange={(done) =>
												setTodos((list) =>
													list.map((item) =>
														item.id === todo.id ? { ...item, done } : item,
													),
												)
											}
										/>
										<span
											className={cn(todo.done && "text-muted line-through")}
										>
											{todo.title}
										</span>
									</label>
								</li>
							))}
						</ul>
						<label className="mt-6 flex items-center justify-between gap-3 border-border border-t-2 pt-4 text-sm">
							Email me daily alerts
							<Switch checked={alerts} onCheckedChange={setAlerts} />
						</label>
					</Card>
				</div>
			</main>
		</div>
	);
}
