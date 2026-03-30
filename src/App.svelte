<script lang="ts">
  import { onMount } from "svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { Input } from "$lib/components/ui/input";
  import { round } from "./lib/utils";

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
      class="w-32 md:w-48"
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
<main>
  {#if !targetInput}
    <div
      class="max-w-224 mx-auto pt-12 pb-4 flex flex-col gap-4 text-neutral-700 px-4 md:px-8"
    >
      <p>
        Early versions of Tailwind encouraged a <a
          class="underline"
          target="_blank"
          href="https://v3.tailwindcss.com/docs/width"
          >curated, constrained system of widths</a
        >, padding values, and other sizes. This wasn’t just about stylesheet
        bulk: a constrained system improves visual consistency and reduces
        decision fatigue.
      </p>

      <p>
        Tailwind follows the common best practice of using <code>rem</code>
        instead of
        <code>px</code>. A page’s base font size is by definition
        <code>1rem</code>, and <code>1rem</code> is typically
        <code>16px</code>. Centered around
        <code>16px</code>, Tailwind’s curated values included powers of two,
        with intermediate values placed at dyadic intervals between them—for
        example, 96px between 64px and 128px, then 80px between 64px and 96px.
        As values got larger, the spacing between curated options also
        increased.
      </p>

      <p>
        Taking that historical system as inspiration, I use a simple heuristic
        for choosing sizes: Given a ballpark value, choose the roundest nearby
        number possible, where “round” is defined* as how many times the number
        can be divided by 2.
      </p>

      <p>
        For example, 1337 is divisible by 2 zero times. But nearby 1344, which
        is
        <math class="font-sans -mr-0.375">
          <mn>21</mn>
          <mo>×</mo>
          <msup>
            <mn>2</mn>
            <mn>6</mn>
          </msup>
        </math>, is divisible by 2 six times: a roundness-level increase of 6.
        Visually, 1344px (84rem) is indistinguishable from 1337px (83.5625rem).
        If I ever saw 1337px in a Figma doc, I'd absolutely round that to
        1344px** without a second thought (sorry Kass).
      </p>

      <p>
        This site takes a target value and shows you its successive base-2
        roundings. Below is what that looks like for 1337. For fun, you can also
        explore rounding in arbitrary bases;
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

      <p class="text-xs">
        * Roundness is always relative to a base. In base 10, successive
        roundings of 1337 are 1340, 1300, and 1000: each step increases the
        number of times it can be divided by 10. Defining roundness by how many
        times a number can be divided by 2 just means we’re rounding in base 2
        (the smallest base for which rounding has meaning) instead of base 10.
      </p>

      <p class="text-xs">
        ** If not <code>1280px</code> / <code>80rem</code><math
          class="font-sans ml-2"
        >
          <mo>(</mo>
          <mn>5</mn>
          <mo>×</mo>
          <msup>
            <mn>2</mn>
            <mn>8</mn>
          </msup><mo class="relative right-0.375">)</mo>
        </math>
      </p>
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
            primary ? "color-neutral-800" : "color-neutral-600",
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
