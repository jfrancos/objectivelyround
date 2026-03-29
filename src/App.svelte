<script lang="ts">
  import { onMount } from "svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { Input } from "$lib/components/ui/input";
  import { round } from "./lib/utils";

  let base = $state(2);
  let showBase = $state(true);
  let target = $state(1337);
  let inputRef = $state<HTMLInputElement | null>(null);
  let showLimit = $state(false);
  const neighbors = $derived(
    target > 0 && base >= 2 ? round(target, base) : [],
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
    if (key === "b") {
      base = 2;
      showBase = !showBase;
    } else if (target === null && key.match(/[\d]/)) {
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
        onblur={() => {
          if ((base ?? 0) < 2) base = 2;
        }}
        autocomplete="off"
        inputmode="numeric"
        min={2}
        class="md:w-24 w-20"
        placeholder="Base"
        type="number"
        bind:value={
          () => base,
          (next) => {
            if (target * next <= 2 ** 50) {
              base = next === null ? next : Math.abs(Math.trunc(next));
              showLimit = false;
            } else {
              showLimit = true;
            }
          }
        }
      />
    </div>
    <Input
      autocomplete="off"
      inputmode="numeric"
      class="w-32 md:w-48"
      type="number"
      placeholder="Target"
      bind:ref={inputRef}
      bind:value={
        () => target,
        (next) => {
          if (next * base <= 2 ** 50) {
            target = next === null ? next : Math.abs(Math.trunc(next));
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
    target="_blank"
    class={["underline color-purple-700", showLimit || "invisible"]}
    href="https://github.com/jfrancos/objectivelyround/issues"
    >Tell me about your BigInt use case</a
  >
</header>
<main>
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
            <mn>{base}</mn>
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
          <mn>{formatNumber(target)}</mn>
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

<!-- Early versions of Tailwind encouraged the use of a curated/constrained system of widths/padding/etc.  This wasn't just about stylesheet bulk: using a constrained system helps increase visual consistency and reduce desision fatigue.

Tailwind sizing follows the best practice of using rem units instead of px, and the curated values were chosen based on the default font size being (by definition) 1rem which (by default) equals 16px.  Centering around 16px units, the curated values included powers of 2, and some dyadically-spaced values between powers of two.  The larger the scale, the more spaced out those curated values were.

Combining these facts and this historical system, I persaonlly use a general heuristic to determine optimum sizes: for any ballpark number I'm considering, use the roundest nearby number possible, where round is defined* as "number of times you can divide by 2".

For example: 1337 is divisible by 2 zero times.  But nearby 1344, being equal to 21 x 2^6, is divisible by 2 6 times - a roundness-level increase of 6.  Visually, 1344px (84rem) is identical to 1337px (83.5625rem).  If I ever see 1337px in a figma doc I am absolutely rounding to 1344px without a second thought (sorry Kass!**).


This site is a tool that takes a target value and shows you successive base-2 roundings of that value.  For fun, you can also explore what rounding looks like in any arbitrary base - click here or press "b" to toggle that interface.


*Roundness is inherently contingent on whatever base you're using.  In base 10, successive roundings of 1337 are 1340, 1300, 1000: we increase the number of times we can divide the number by our base (10).  Defining roundness by how many times you can divide by two, just means we're doing our rounding in base 2 instead of base 10.

**If not 1280px / 80rem / 5 x 2^8 -->
