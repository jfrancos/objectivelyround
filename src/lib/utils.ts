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
	delta: number;
	number: number;
	exponent: number;
	factor: number;
	rank: number;
};

type UnrankedItem = Omit<Item, "rank">;

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
): UnrankedItem | undefined => {
	const factor = 2 ** min;

	const number =
		step === 1
			? Math.ceil(start / factor) * factor
			: Math.floor(start / factor) * factor;

	if (number < 1) return;

	const exponent = min + timesDivisibleBy2(number / factor);

	return {
		number,
		exponent,
		factor: number / 2 ** exponent,
		delta: 0,
	};
};

export const getNeighbors = (target: number): Item[] => {
	const middle: UnrankedItem = {
		number: target,
		exponent: timesDivisibleBy2(target),
		factor: target / 2 ** timesDivisibleBy2(target),
		delta: 0,
	};

	const walk = (step: -1 | 1) => {
		const items: UnrankedItem[] = [];
		let min = middle.exponent + 1;
		let start = target + step;

		while (true) {
			const next = findNext(start, step, min);
			if (!next) return items;
			items[step === -1 ? "unshift" : "push"]({
				...next,
				delta: next.number - target,
			});
			if (isPowerOf2(next.number)) return items;
			min = next.exponent + 1;
			start = next.number + step;
		}
	};

	const items = [...walk(-1), middle, ...walk(1)];

	const exponentsDesc = [...new Set(items.map((x) => x.exponent))].sort(
		(a, b) => b - a,
	);

	const rankByExponent = new Map(
		exponentsDesc.map((exponent, rank) => [exponent, rank]),
	);

	return items.map((item) => ({
		...item,
		rank: rankByExponent.get(item.exponent) ?? Infinity,
	}));
};
