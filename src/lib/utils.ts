import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any }
	? Omit<T, "children">
	: T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & {
	ref?: U | null;
};
type Item = {
	number: number;
	timesDivisibleBy2: number;
};

const timesDivisibleBy2 = (x: number) => {
	let count = 0;
	for (let n = x; n % 2 === 0; n /= 2) count++;
	return count;
};

const isPowerOf2 = (x: number) => {
	if (x < 1 || !Number.isInteger(x)) return false;
	while (x % 2 === 0) x /= 2;
	return x === 1;
};

const findNext = (
	start: number,
	step: -1 | 1,
	min: number,
): Item | undefined => {
	const factor = 2 ** min;

	const number =
		step === 1
			? Math.ceil(start / factor) * factor
			: Math.floor(start / factor) * factor;

	if (number < 1) return;

	return {
		number,
		timesDivisibleBy2: min + timesDivisibleBy2(number / factor),
	};
};

export const getNeighbors = (target: number): Item[] => {
	const middle = {
		number: target,
		timesDivisibleBy2: timesDivisibleBy2(target),
	};

	const walk = (step: -1 | 1) => {
		const items: Item[] = [];
		let min = middle.timesDivisibleBy2 + 1;
		let start = target + step;

		while (true) {
			const next = findNext(start, step, min);
			if (!next) return items;
			items[step === -1 ? "unshift" : "push"](next);
			if (isPowerOf2(next.number)) return items;
			min = next.timesDivisibleBy2 + 1;
			start = next.number + step;
		}
	};

	return [...walk(-1), middle, ...walk(1)];
};
