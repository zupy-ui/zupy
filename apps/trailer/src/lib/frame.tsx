import { createContext, type ReactNode, useContext } from "react";
import { beatToFrame, FPS, FRAMES_PER_BEAT } from "@/timeline";

interface Clock {
	/** Frames since the enclosing scene started. */
	frame: number;
}

const ClockContext = createContext<Clock>({ frame: 0 });

/** Local time inside the nearest `Scene`, in frames, seconds and beats. */
export function useTime() {
	const { frame } = useContext(ClockContext);
	const seconds = frame / FPS;
	const beat = frame / FRAMES_PER_BEAT;
	return {
		frame,
		seconds,
		beat,
		/** Seconds since `cueBeat` (negative before it). */
		since: (cueBeat: number) => seconds - (cueBeat * FRAMES_PER_BEAT) / FPS,
	};
}

/** Provides the global frame. */
export function ClockProvider({
	frame,
	children,
}: {
	frame: number;
	children: ReactNode;
}) {
	return <ClockContext value={{ frame }}>{children}</ClockContext>;
}

/**
 * Renders its children only between two beats (relative to the parent clock) and restarts the
 * clock at `from`. `lead` mounts it that many beats early (its clock is negative then), so an
 * entrance can land exactly on the downbeat. `tail` keeps it mounted after `to`.
 */
export function Scene({
	from,
	to,
	lead = 0,
	tail = 0,
	children,
}: {
	from: number;
	to: number;
	lead?: number;
	tail?: number;
	children: ReactNode;
}) {
	const { frame } = useContext(ClockContext);
	const start = beatToFrame(from);
	if (frame < beatToFrame(from - lead) || frame >= beatToFrame(to + tail)) {
		return null;
	}
	return (
		<ClockContext value={{ frame: frame - start }}>{children}</ClockContext>
	);
}
