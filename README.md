# ObjectivelyRound

ObjectivelyRound is a tool for finding “rounder” spacing and sizing values.

Instead of treating roundness in the usual base-10 sense, it looks at roundness in terms of divisibility by 2: values that can be halved more times while staying whole are treated as rounder. This makes it useful for spacing and sizing systems inspired by historically curated scales like Tailwind’s.

Live site: [objectivelyround.com](https://objectivelyround.com)

## Development

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
```