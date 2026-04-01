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

	const groups = [];
	let exp: number;
	for (exp = exponent(target, base); base ** exp < target * base; exp++) {
		const factor = base ** exp;
		const upItem = Math.ceil(target / factor) * factor;
		const downItem = Math.floor(target / factor) * factor;
		groups.push(
			(upItem === downItem ? [upItem] : [upItem, downItem])
				.filter((num) => num > 0 && exponent(num / factor, base) === 0)
				.map((num) => ({
					num,
					exp,
					coef: num / factor,
					delta: num - target,
					primary: false,
				}))
				.toSorted(
					(a, b) => Math.abs(a.delta) - Math.abs(b.delta) || b.num - a.num,
				),
		);
	}

	let delta = Infinity;
	for (const group of groups.toReversed()) {
		if (Math.abs(group[0].delta) < delta) {
			group[0].primary = true;
			delta = Math.abs(group[0].delta);
		}
	}

	return groups
		.flat()
		.map((item) => ({ ...item, rank: exp - item.exp - 1 }))
		.toSorted((a, b) => a.num - b.num);
};

// other domains?
// linkedin?
// awesome sites?
