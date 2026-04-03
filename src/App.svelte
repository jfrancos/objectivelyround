<script lang="ts">
  import { onMount } from "svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { Input } from "$lib/components/ui/input";
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "$lib/components/ui/popover";
  import boston from "./assets/boston.svg";
  import { round } from "./lib/utils";
  import Pow2Form from "./Pow2Form.svelte";
  import RemPx from "./RemPx.svelte";

  let targetInput = $state<number | null>(null);
  let target = $derived<number>(targetInput ?? 1337);
  let baseInput = $state<number | null>(2);
  let base = $derived<number>(
    targetInput === null || (baseInput ?? 0) < 2 ? 2 : (baseInput ?? 2),
  );
  let showBase = $state(false);
  let inputRef = $state<HTMLInputElement | null>(null);
  let showLimit = $state(false);
  const neighbors = $derived(
    target > 0 && base >= 2 ? round(target, base) : round(1337, 2),
  );
  onMount(() => inputRef?.focus());
  // $inspect(neighbors).with((_, item) =>
  //   console.log(JSON.stringify(item, undefined, 2)),
  // );
  const formatNumber = (number: number) =>
    number.toLocaleString(undefined, { useGrouping: "min2" });
</script>

<svelte:window
  onkeydown={({ key }) => {
    const active = document.activeElement;
    if (key === "b") {
      baseInput = 2;
      showBase = !showBase;
    } else if (
      targetInput === null &&
      key.match(/[\d]/) &&
      !(active?.localName === "input" && active !== inputRef)
    ) {
      inputRef?.focus();
    }
  }}
/>

<header
  class="sticky top-0 shadow-lg py-2 bg-white flex z-10 text-xs font-medium text-nowrap items-center px-4 md:px-8 flex-col gap-2"
>
  <div class={[showLimit || "invisible", "color-neutral-600"]}>
    Input is capped at <math class="font-sans font-semibold color-neutral-800">
      <mi>target</mi>
      <mo>×</mo>
      <mi>base</mi>
      <mo>≤</mo>
      <msup>
        <mn>2</mn>
        <mn>50</mn>
      </msup>
    </math>
  </div>
  <div class="flex justify-between w-full">
    <div class={["flex-1", showBase || "invisible"]}>
      <Input
        onblur={() => (baseInput = (baseInput ?? 0) < 2 ? 2 : baseInput)}
        autocomplete="off"
        inputmode="numeric"
        min={2}
        class={[
          "md:w-24 w-20",
          targetInput === null &&
            baseInput !== null &&
            baseInput !== 2 &&
            "line-through opacity-50",
        ]}
        placeholder="Base"
        type="number"
        bind:value={
          () => baseInput,
          (next) => {
            if (target * (next ?? 0) <= 2 ** 50) {
              baseInput = next === null ? next : Math.abs(Math.trunc(next));
              showLimit = false;
            } else {
              showLimit = true;
            }
          }
        }
      />
    </div>
    <Input
      onblur={() => (targetInput = target < 1 ? null : targetInput)}
      autocomplete="off"
      inputmode="numeric"
      class="w-40 md:w-48"
      type="number"
      placeholder="Target"
      bind:ref={inputRef}
      bind:value={
        () => targetInput,
        (next) => {
          if ((next ?? 0) * base <= 2 ** 50) {
            targetInput = next === null ? next : Math.abs(Math.trunc(next));
            showLimit = false;
          } else {
            showLimit = true;
          }
        }
      }
    />
    <div class="flex-1 flex justify-end">
      <Button
        aria-label="github repository"
        variant="ghost"
        class="relative -right-2.5"
        href="https://github.com/jfrancos/objectivelyround"
        target="_blank"
      >
        <div class="i-mdi:github text-2xl"></div>
      </Button>
    </div>
  </div>
  <a
    class={["underline color-purple-700", showLimit || "invisible"]}
    target="_blank"
    href="https://github.com/jfrancos/objectivelyround/issues"
    >Tell me about your BigInt use case</a
  >
</header>
<main class="flex-1">
  {#if !targetInput}
    <div
      class="max-w-224 mx-auto flex flex-col gap-8 text-neutral-800 px-4 md:px-8 py-8"
    >
      <header class="flex flex-col gap-4">
        <h1
          class="text-3xl font-bold tracking-tight text-center color-neutral-900"
        >
          Base-2 Rounding
        </h1>
        <p class="text-xl text-neutral-900 text-center font-medium">
          A CSS Spacing and Sizing Meta-System
        </p>
        <p class="text-center text-sm text-neutral-900">
          In the new world of bracketless arbitrary Tailwind values
        </p>
      </header>
      <section class="flex flex-col gap-4">
        <p>
          Early versions of <Popover
            ><PopoverTrigger class="underline decoration-dotted"
              >Tailwind CSS</PopoverTrigger
            ><PopoverContent
              class="bg-foreground text-background text-xs text-balance rounded-md px-3 py-2 w-fit max-w-64"
              >Tailwind CSS is a standard framework for styling HTML with CSS.</PopoverContent
            >
          </Popover> encouraged use of a
          <a
            rel="noreferrer"
            class="underline"
            target="_blank"
            href="https://v3.tailwindcss.com/docs/customizing-spacing#default-spacing-scale"
            >curated, constrained system of widths</a
          >, padding values, and other sizes. This had multiple benefits: fewer
          stylesheet rules, more visual consistency, and less decision fatigue.
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
          powers of two, with selected intermediate values. As the numbers got larger,
          spacing between them also increased:
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
          These historical curated values preferred round numbers, with “round”
          <a href="#note-base-2-round" id="ref-base-2-round">
            <span class="underline decoration-dotted">defined</span><sup>*</sup>
          </a>
          as how many times a number can be divided by 2 (shown above as the exponent).
          With Tailwind
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
          <code>1337px</code>, I’ll look for the roundest nearby number that
          preserves the original intent. In this case, perhaps
          <code>1344px</code>.
        </p>

        <p>
          1337 is divisible by 2 zero times. But nearby 1344 <Pow2Form
            coef={21}
            exp={6}
            parens
            class="-mr-0.375"
          /> is divisible by 2 six times: a roundness-level increase of 6. Visually,
          <code>1344px</code> (<code>84rem</code>) is indistinguishable from
          <code>1337px</code> (<code>83.5625rem</code>). So if I ever encounter
          <code>1337px</code>, I’ll probably nudge it to <code>1344px</code>.
        </p>

        <p>
          This site takes a target value and shows you its successive base-2
          roundings. If a number is dimmed, it means there’s an equally round or
          rounder number that’s closer to the target. Below is what that looks
          like for 1337. For fun, you can also explore rounding in arbitrary
          bases;
          <Button
            variant="link"
            class="-mx-2"
            onclick={() => (showBase = !showBase)}>click here</Button
          > or press “b” to toggle that interface.
        </p>

        <p>
          If you find this useful,
          <a
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
    <div class="flex justify-center py-4 font-medium">Target = 1337</div>
  {/if}

  {#each neighbors as { num, exp, delta, coef, rank, primary }}
    {@const max = Math.max(...neighbors.map((item) => item.rank))}
    {@const percentage = max === 0 ? 0.5 : rank / max}
    <div
      class="px-6 h-20 flex items-center"
      style:background-color={`oklch(${1 - 0.375 * percentage} 0.1 300)`}
    >
      <div
        class="relative flex items-end flex-col"
        style:left={`${100 * percentage}%`}
        style:transform={`translateX(${-100 * percentage}%)`}
      >
        <math class="color-neutral-600 text-sm font-sans">
          <mn>{formatNumber(coef)}</mn>
          <mo>&times;</mo>
          <msup>
            <mn>{!targetInput ? 2 : base}</mn>
            <mn class="font-black color-black text-0.6875rem">{exp}</mn>
          </msup>
        </math>
        <div
          class={[
            "text-xl font-mono",
            primary ? "color-black" : "color-neutral-600",
          ]}
        >
          {formatNumber(num)}
        </div>
        <math
          class={[
            "font-sans text-0.6875rem color-neutral-600",
            delta === 0 && "hidden",
          ]}
        >
          <mn>{formatNumber(num - delta)}</mn>
          <mo>
            {delta > 0 ? "+" : delta < 0 ? "−" : ""}
          </mo>
          <mn class="color-neutral-800 font-semibold">
            {formatNumber(Math.abs(delta))}
          </mn>
        </math>
      </div>
    </div>
  {/each}
</main>
<footer
  class="py-4 max-w-256 w-full mx-auto px-4 md:px-8 flex text-xs sm:items-end sm:justify-evenly [&_a]:underline pb-4 flex-wrap sm:flex-row flex-col items-center sm:gap-0 gap-8"
>
  <div class="flex-1">
    <div class="flex flex-col items-center gap-2 whitespace-nowrap w-fit">
      Other projects:
      <a href="https://oklch.beauty" target="_blank" rel="noreferrer"
        >oklch.beauty</a
      >
      <a href="https://slidytabs.dev" target="_blank" rel="noreferrer"
        >slidytabs.dev</a
      >
    </div>
  </div>
  <div class="flex flex-col">
    <img alt="Boston skyline" class="opacity-50 h-32 -mt-8" src={boston} />
    Made with love in Camberville, MA
  </div>
  <div class="flex gap-2 flex-1 justify-end">
    <Button
      class="hover:text-#529BBA"
      variant="ghost"
      href="https://github.com/jfrancos"
      target="_blank"
      rel="noreferrer"
      aria-label="Github"
    >
      <div class="size-6 i-mdi:github"></div>
    </Button>
    <Button
      class="hover:text-#529BBA"
      variant="ghost"
      href="https://jfrancos.github.io/music.html"
      target="_blank"
      rel="noreferrer"
      aria-label="Music"
    >
      <div class="size-6 i-mdi:music"></div>
    </Button>
    <Button
      class="hover:text-#529BBA"
      variant="ghost"
      href="mailto:justinfrancos@gmail.com"
      aria-label="Email"
    >
      <div class="size-6 i-mdi:email-outline"></div>
    </Button>
  </div>
</footer>

<!--
linkedin?
tailwind hover: a primary mechanism for applying css to html
-->
