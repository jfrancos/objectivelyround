export const dist = (x: number) => Math.clz32(x & -x) - Math.clz32(x);

export const scales = [
	{ label: "px", mult: 1 },
	{ label: "tw (4px)", mult: 4 },
	{ label: "rem (16px)", mult: 16 },
];
