<script lang="ts">
  import { onMount } from "svelte";
  import { Input } from "$lib/components/ui/input";
  import { getNeighbors } from "./lib/utils";

  let input = $state(1337);
  let inputRef = $state<HTMLInputElement | null>(null);
  let showLimit = $state(false);
  const neighbors = $derived(input ? getNeighbors(input) : []);
  onMount(() => inputRef?.focus());

  $inspect(input);
</script>

<svelte:window
  onkeydown={({ key }) => {
    if (input === null && key.match(/[\d]/)) {
      inputRef?.focus();
    }
  }}
/>

<header
  class="sticky top-0 shadow-lg py-2 bg-white flex justify-center z-10 flex flex-col items-center gap-2 text-xs font-medium text-nowrap"
>
  <div class={[showLimit || "invisible"]}>
    You’ve reached the artificial limit of <math class="font-sans font-medium"
      ><msup><mn>2</mn><mn>48</mn></msup></math
    >
  </div>
  <Input
    max={16}
    class="w-48"
    type="number"
    placeholder="Target"
    bind:ref={inputRef}
    bind:value={
      () => input,
      (next) => {
        if (next <= 2 ** 48) {
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
    >Tell me about your use case</a
  >
</header>
{#each neighbors as { number, exponent, delta, factor, rank }}
  {@const percentage = rank / (neighbors.length - 1)}
  <div
    class="px-4 h-20 flex items-center"
    style:background-color={`oklch(${1 - 0.375 * percentage} 0.1 300)`}
  >
    <div
      class="relative flex items-end flex-col"
      style:left={`${100 * percentage}%`}
      style:transform={`translateX(${-100 * percentage}%)`}
    >
      <math class="text-neutral-600 text-sm font-sans">
        <mn>{factor}</mn>
        <mo>&times;</mo>
        <msup>
          <mn>2</mn>
          <mn class="font-semibold text-black text-11px">{exponent}</mn>
        </msup>
      </math>
      <div class="text-xl font-mono color-neutral-800">
        {number}
      </div>
      <math class="font-sans text-11px">
        <mo class="text-neutral-600 relative -top-[0.125em]">
          {delta > 0 ? "+" : delta < 0 ? "−" : ""}
        </mo>
        <mn class="font-semibold text-black">
          {Math.abs(delta)}
        </mn>
      </math>
    </div>
  </div>
{/each}
