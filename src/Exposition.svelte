<script lang="ts">
    // import Button from "$lib/components/ui/button/button.svelte";
    import {
        Popover,
        PopoverContent,
        PopoverTrigger,
    } from "$lib/components/ui/popover";
    import Pow2Form from "./Pow2Form.svelte";
    import RemPx from "./RemPx.svelte";

    let { showBase = $bindable() } = $props();
</script>

<div
    class="max-w-224 mx-auto flex flex-col gap-8 text-neutral-800 px-4 md:px-8 py-8"
>
    <header class="flex flex-col gap-4">
        <h1
            class="text-3xl font-bold tracking-tight text-center text-neutral-900"
        >
            Base-2 Rounding
        </h1>
        <p class="text-xl text-neutral-900 text-center font-medium">
            A CSS Spacing and Sizing Meta-System
        </p>
        <p class="text-center text-sm text-neutral-900">
            <Popover
                ><PopoverTrigger class="underline decoration-dotted">
                    In the new world of bracketless arbitrary Tailwind values</PopoverTrigger
                ><PopoverContent
                    class="bg-foreground text-background text-xs text-balance rounded-md px-3 py-2 w-fit max-w-64"
                    >Also relevant for UnoCSS, a historically value-agnostic
                    utility-class tool
                </PopoverContent>
            </Popover>
        </p>
    </header>
    <section class="flex flex-col gap-4">
        <p>
            Early versions of Tailwind CSS encouraged use of a
            <a
                rel="noreferrer"
                class="underline"
                target="_blank"
                href="https://v3.tailwindcss.com/docs/customizing-spacing#default-spacing-scale"
                >curated, constrained system of widths</a
            >, padding values, and other sizes. This had multiple benefits:
            fewer stylesheet rules, more visual consistency, and less decision
            fatigue.
        </p>

        <!-- <p>
        Tailwind follows the common best practice of using <code>rem</code>
        instead of <code>px</code>. A page’s base font size is, by definition,
        <code>1rem</code>, and <code>1rem</code> is typically <code>16px</code>.
        Thus, when thinking in <code>px</code>, it’s useful to keep
        <code>16px</code> as a base unit in mind.
      </p> -->

        <p>
            Using <RemPx px={16} /> as an anchor, Tailwind’s curated values included
            powers of two, with selected intermediate values. As the numbers got
            larger, spacing between them also increased:
        </p>

        <div class="flex justify-evenly flex-wrap gap-6 p-1">
            <div class="flex flex-col w-fit gap-0.5">
                <div class="font-medium text-center">Smaller scale</div>
                <div
                    class="grid grid-cols-[auto_auto] gap-x-2 items-baseline text-right"
                >
                    <RemPx px={16} />
                    <Pow2Form coef={1} exp={4} parens class="text-sm" />
                    <RemPx px={20} />
                    <Pow2Form coef={5} exp={2} parens class="text-sm" />
                    <RemPx px={24} />
                    <Pow2Form coef={3} exp={3} parens class="text-sm" />
                    <RemPx px={28} />
                    <Pow2Form coef={7} exp={2} parens class="text-sm" />
                </div>
            </div>

            <div class="flex flex-col w-fit gap-0.5">
                <div class="font-medium text-center">Larger scale</div>
                <div
                    class="grid grid-cols-[auto_auto] gap-x-2 items-baseline text-right"
                >
                    <RemPx px={256} />
                    <Pow2Form coef={1} exp={8} parens class="text-sm" />
                    <RemPx px={288} />
                    <Pow2Form coef={9} exp={5} parens class="text-sm" />
                    <RemPx px={320} />
                    <Pow2Form coef={5} exp={6} parens class="text-sm" />
                    <RemPx px={384} />
                    <Pow2Form coef={3} exp={7} parens class="text-sm" />
                </div>
            </div>
        </div>

        <p>
            These curated values preferred rounder numbers, with “round”
            <a href="#note-base-2-round" id="ref-base-2-round">
                <span class="underline decoration-dotted">defined</span><sup
                    >*</sup
                >
            </a>
            as how many times a number can be divided by 2 (shown above as the exponent
            on 2). With Tailwind
            <a
                rel="noreferrer"
                class="underline"
                target="_blank"
                href="https://x.com/adamwathan/status/1847360035548012856"
                >no longer requiring brackets for arbitrary values</a
            >, I still apply this general idea: when choosing a size, or
            interpreting existing sizes from a source like Figma, prefer
            base-2-rounder numbers.
        </p>

        <p>
            When designing, this means feeling out a size by moving among nearby
            base-2-round values: I might try <code>16rem</code>, then
            <code>8rem</code>, then <code>12rem</code>, and so on until it looks
            right.
        </p>

        <p>
            When interpreting a Figma doc, it means allowing some principled
            rounding instead of staying pixel-perfect. If I see a value like
            <code>1337px</code>, I’ll look for the base-2-roundest nearby number
            that preserves the original intent. In this case, perhaps
            <code>1344px</code>.
        </p>

        <p>
            1337 is divisible by 2 zero times. But nearby 1344 <Pow2Form
                coef={21}
                exp={6}
                parens
                class="-mr-0.375"
            /> is divisible by 2 six times: a roundness-level increase of 6. Short
            of a side-by-side comparison, <code>1344px</code> (<code>84rem</code
            >) is indistinguishable from
            <code>1337px</code> (<code>83.5625rem</code>). So if I ever
            encounter <code>1337px</code>, I’ll probably nudge that to
            <code>1344px</code>.
        </p>

        <p>
            This site takes a target value and shows you its successive base-2
            roundings. If a number is dimmed, it means there’s an equally round
            or rounder number that’s closer to the target. Below is what that
            looks like for 1337.
            <!-- For fun, you can also explore rounding in
            arbitrary bases;
            <Button
                variant="secondary"
                size="xs"
                class="text-sm"
                onclick={() => (showBase = !showBase)}>click here</Button
            > or press “b” to toggle that interface. -->
        </p>

        <p>
            If you find this useful,
            <a
                rel="noreferrer"
                class="underline"
                target="_blank"
                href="https://github.com/jfrancos/objectivelyround"
                >please star the repo</a
            >.
        </p>

        <p class="text-xs" id="note-base-2-round">
            * Roundness is always relative to a base. In base 10, successive
            roundings of 1337 are 1340, 1300, and 1000: each step increases the
            number of times it can be divided by 10. Defining roundness by how
            many times a number can be divided by 2 just means we’re rounding in
            base 2 (the smallest base for which rounding has meaning) instead of
            base 10.
            <a href="#ref-base-2-round" aria-label="Back to reference">↩</a>
        </p>
    </section>
</div>
