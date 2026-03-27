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

const exponent = (x: number, divisor: number) => {
	let count = 0;
	for (let n = x; n % divisor === 0; n /= divisor) count++;
	return count;
};

export const round = (target: number, base: number) => {
	if (base < 2) {
		throw new Error("Rounding has no meaning for base < 2");
	}
	const items: { exp: number; num: number; coef: number; delta: number }[] = [];
	let exp: number;
	for (exp = exponent(target, base); base ** exp < target * base; exp++) {
		const factor = base ** exp;
		const upItem = Math.ceil(target / factor) * factor;
		const downItem = Math.floor(target / factor) * factor;

		for (const num of upItem === downItem ? [upItem] : [upItem, downItem]) {
			if (num > 0 && exponent(num / factor, base) === 0) {
				const coef = num / factor;
				const delta = num - target;
				items.push({ num, exp, coef, delta });
			}
		}
	}

	return items
		.map((item) => ({ ...item, rank: exp - item.exp - 1 }))
		.toSorted((a, b) => a.num - b.num);
};
