<script lang="ts">
  import { onMount } from "svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import { Input } from "$lib/components/ui/input";
  import { round } from "./lib/utils";

  let baseInput = $state<number | null>(2);
  let base = $derived(Math.max(baseInput ?? 2, 2));
  let showBase = $state(true);
  let target = $state(1337);
  let inputRef = $state<HTMLInputElement | null>(null);
  let showLimit = $state(false);
  const neighbors = $derived(target ? round(target, base) : []);
  onMount(() => inputRef?.focus());
  // $inspect(neighbors).with((_, item) =>
  //   console.log(JSON.stringify(item, undefined, 2)),
  // );
  $inspect(base);
  const formatNumber = (number: number) =>
    number.toLocaleString(undefined, { useGrouping: "min2" });
</script>

<svelte:window
  onkeydown={({ key }) => {
    if (key === "b") {
      showBase = !showBase;
    } else if (target === null && key.match(/[\d]/)) {
      inputRef?.focus();
    }
  }}
/>

<header
  class="sticky top-0 shadow-lg py-2 bg-white flex z-10 text-xs font-medium text-nowrap items-center px-4 md:px-8 flex-col gap-2"
>
  <div class={[showLimit || "invisible", "text-neutral-600"]}>
    Input is capped at <math class="font-sans font-semibold text-neutral-800">
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
          if ((baseInput ?? 0) < 2) baseInput = 2;
        }}
        min={2}
        class="md:w-24 w-20"
        placeholder="Base"
        type="number"
        bind:value={
          () => baseInput,
          (next) => {
            if (next === null) {
              baseInput = null;
            } else if (target * next <= 2 ** 50) {
              baseInput = Math.trunc(next);
              showLimit = false;
            } else {
              showLimit = true;
            }
          }
        }
      />
    </div>
    <Input
      class="w-32 md:w-48"
      type="number"
      placeholder="Target"
      bind:ref={inputRef}
      bind:value={
        () => target,
        (next) => {
          if (next * base <= 2 ** 50) {
            target = next === null ? next : Math.trunc(next);
            showLimit = false;
          } else {
            showLimit = true;
          }
        }
      }
    />
    <div class="flex-1 flex justify-end">
      <Button
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
{#each neighbors as { num, exp, delta, coef, rank }}
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
        <mn>{formatNumber(target)}</mn>
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
