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

const timesDivisibleBy2 = (x: number) => {
	let count = 0;
	for (let n = x; n % 2 === 0; n /= 2) count++;
	return count;
};

const isPowerOf2 = (x: number) =>
	Number.isSafeInteger(x) && x > 0 && (BigInt(x) & (BigInt(x) - 1n)) === 0n;

export const round = (target: number) => {
	let exp = timesDivisibleBy2(target);
	const items: {
		number: number;
		exponent: number;
		coef: number;
		delta: number;
	}[] = [];

	while (2 ** exp <= target * 2) {
		const factor = 2 ** exp;
		const upItem = Math.ceil(target / factor) * factor;
		const downItem = Math.floor(target / factor) * factor;
		const useUp = timesDivisibleBy2(upItem / factor) === 0;
		const item = useUp ? upItem : downItem;

		if (isPowerOf2(item / 2) && item - target > target - item / 2) break;
		items.push({
			number: item,
			exponent: exp,
			coef: item / factor,
			delta: item - target,
		});

		exp++;
	}

	return items
		.toReversed()
		.map((item, rank) => ({ ...item, rank }))
		.toSorted((a, b) => a.number - b.number);
};
