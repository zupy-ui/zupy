import { Button, Card, cn } from "@zupy/ui";
import {
	Backdrop,
	Display,
	Enter,
	Pop,
	pressed,
	usePress,
	useStep,
	Zoom,
} from "@/components/kit";
import { pop } from "@/lib/anim";
import { useTime } from "@/lib/frame";
import { code, codeLines, SECONDS_PER_BEAT } from "@/timeline";

/** Install, import, press: the code types itself and the button it describes comes alive. */
export function Code() {
	const { since } = useTime();
	const words = [
		{ at: code.install, text: "Install." },
		{ at: code.import, text: "Import." },
		{ at: code.press, text: "Press." },
	];
	const presses = useStep(code.presses);
	const amount = usePress(code.presses);
	const count = presses + 1;
	const lastPress = code.presses[presses];
	return (
		<Enter from="right">
			<Backdrop tone="paper">
				<div className="absolute inset-0 flex items-center gap-24 pl-40">
					<div className="flex w-[520px] flex-col gap-2">
						{words.map((word, index) => (
							<Pop key={word.text} at={word.at} origin="left center">
								<Display
									className={cn(
										"text-[132px]",
										index === words.length - 1 && "text-primary",
									)}
								>
									{word.text}
								</Display>
							</Pop>
						))}
					</div>
					<Zoom by={1.9}>
						<Card padding="none" className="w-[560px] overflow-hidden">
							<div className="flex flex-col gap-3 bg-surface p-5 font-mono text-[15px] leading-relaxed">
								<Typed at={code.install} prefix="$ " text={codeLines.install} />
								<div className="h-px bg-border" />
								<Typed at={code.import} text={codeLines.import} tokens />
								<Typed at={code.usage} text={codeLines.usage} tokens />
							</div>
							<div className="flex h-[150px] items-center justify-center gap-6 border-border border-t-2">
								{since(code.press) >= 0 ? (
									<>
										<Pop at={code.press}>
											<Button size="lg" {...pressed(amount)}>
												Press me
											</Button>
										</Pop>
										<Counter
											count={count}
											since={lastPress === undefined ? -1 : since(lastPress)}
										/>
									</>
								) : (
									<span className="font-display font-semibold text-muted">
										Preview
									</span>
								)}
							</div>
						</Card>
					</Zoom>
				</div>
			</Backdrop>
		</Enter>
	);
}

function Counter({ count, since }: { count: number; since: number }) {
	const { scale } = pop(since, 0.26);
	return (
		<span
			className="inline-block w-14 text-center font-bold font-display text-5xl tabular-nums"
			style={{ transform: `scale(${count > 0 ? scale : 1})` }}
		>
			{count}
		</span>
	);
}

/** Types `text` one character at a time from `at`, with a caret while typing. */
function Typed({
	at,
	text,
	prefix,
	tokens,
}: {
	at: number;
	text: string;
	prefix?: string;
	tokens?: boolean;
}) {
	const { since } = useTime();
	const t = since(at);
	if (t < 0) return <div className="h-[1.6em]" />;
	const shown = Math.min(text.length, Math.floor(t / code.typeRate));
	const typing =
		shown < text.length || t < shown * code.typeRate + SECONDS_PER_BEAT;
	return (
		<div className="whitespace-pre">
			{prefix ? <span className="text-muted">{prefix}</span> : null}
			{tokens ? (
				<Highlight text={text.slice(0, shown)} />
			) : (
				text.slice(0, shown)
			)}
			{typing ? (
				<span className="ml-px inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] rounded-[2px] bg-primary" />
			) : null}
		</div>
	);
}

/** A tiny highlighter: strings muted, keywords and tags in primary. */
function Highlight({ text }: { text: string }) {
	const parts = text.split(/("[^"]*"?|\bimport\b|\bfrom\b|<\/?Button>?)/g);
	return (
		<>
			{parts.map((part, index) => {
				const key = `${index}-${part}`;
				if (part.startsWith('"')) {
					return (
						<span key={key} className="text-muted">
							{part}
						</span>
					);
				}
				if (/^(import|from|<\/?Button>?)$/.test(part)) {
					return (
						<span key={key} className="font-semibold text-primary">
							{part}
						</span>
					);
				}
				return <span key={key}>{part}</span>;
			})}
		</>
	);
}
