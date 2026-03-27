<script lang="ts">
  import { onMount } from "svelte";
  import { Input } from "$lib/components/ui/input";
  import { round } from "./lib/utils";

  const base = 10;
  let input = $state(1337);
  let inputRef = $state<HTMLInputElement | null>(null);
  let showLimit = $state(false);
  const neighbors = $derived(input ? round(input, base) : []);
  onMount(() => inputRef?.focus());
  // $inspect(neighbors).with((_, item) =>
  //   console.log(JSON.stringify(item, undefined, 2)),
  // );

  const formatNumber = (number: number) =>
    number.toLocaleString(undefined, { useGrouping: "min2" });
</script>

<svelte:window
  onkeydown={({ key }) => {
    if (input === null && key.match(/[\d]/)) {
      inputRef?.focus();
    }
  }}
/>

<header
  class="sticky top-0 shadow-lg py-2 bg-white flex z-10 flex flex-col items-center gap-2 text-xs font-medium text-nowrap"
>
  <div class={[showLimit || "invisible"]}>
    For safety reasons, the input is capped at <math
      class="font-sans font-medium"
    >
      <msup><mn>2</mn><mn>50</mn></msup>
    </math>
  </div>
  <Input
    class="w-48"
    type="number"
    placeholder="Target"
    bind:ref={inputRef}
    bind:value={
      () => input,
      (next) => {
        if (next <= 2 ** 50) {
          input = next;
          showLimit = false;
        } else {
          showLimit = true;
        }
      }
    }
  />
  <a
    target="_blank"
    class={["underline color-purple-700", showLimit || "invisible"]}
    href="https://github.com/jfrancos/objectivelyround/issues"
    >Tell me about your BigInt use case</a
  >
</header>
{#each neighbors as { num, exp, delta, coef, rank }}
  {@const percentage =
    rank /
    (Math.max(...neighbors.map((item) => item.rank)) -
      Math.min(...neighbors.map((item) => item.rank)))}
  <div
    class="px-6 h-20 flex items-center"
    style:background-color={`oklch(${1 - 0.375 * percentage} 0.1 300)`}
  >
    <div
      class="relative flex items-end flex-col"
      style:left={`${100 * percentage}%`}
      style:transform={`translateX(${-100 * percentage}%)`}
    >
      <math class="text-neutral-600 text-sm font-sans">
        <mn>{formatNumber(coef)}</mn>
        <mo>&times;</mo>
        <msup>
          <mn>{base}</mn>
          <mn class="font-bold text-black text-0.6875rem">{exp}</mn>
        </msup>
      </math>
      <div class="text-xl font-mono color-neutral-800">
        {formatNumber(num)}
      </div>
      <math
        class={[
          "font-sans text-0.6875rem text-neutral-600",
          delta === 0 && "hidden",
        ]}
      >
        <mn>{formatNumber(input)}</mn>
        <mo>
          {delta > 0 ? "+" : delta < 0 ? "−" : ""}
        </mo>
        <mn class="font-bold text-black">
          {formatNumber(Math.abs(delta))}
        </mn>
      </math>
    </div>
  </div>
{/each}
