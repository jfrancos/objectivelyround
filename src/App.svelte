<script lang="ts">
  // import { tabs } from "slidytabs";
  import { onMount } from "svelte";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Tabs, TabsList, TabsTrigger } from "$lib/components/ui/tabs";
  import { round } from "$lib/roundings";
  import boston from "./assets/boston.svg";
  import Exposition from "./Exposition.svelte";

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
      <!-- <Input
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
      /> -->
    </div>
    <div class="flex gap-4">
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
      <Tabs value="rem">
        <TabsList>
          <TabsTrigger value="scale">0.25rem</TabsTrigger>
          <TabsTrigger value="rem">rem</TabsTrigger>
          <TabsTrigger value="px">px</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
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
    class={["underline text-purple-700", showLimit || "invisible"]}
    target="_blank"
    href="https://github.com/jfrancos/objectivelyround/issues"
    >Tell me about your BigInt use case</a
  >
</header>
<main class="flex-1">
  {#if !targetInput}
    <Exposition bind:showBase />
    <div class="flex justify-center py-6 font-medium">Target = 1337px</div>
  {/if}

  {#each neighbors as { num, exp, delta, coef, rank, primary }}
    {@const max = Math.max(...neighbors.map((item) => item.rank))}
    {@const percentage = max === 0 ? 0.5 : rank / max}
    <div
      class="flex relative"
      style:background-color={`oklch(${0.9375 - 0.375 * percentage} 0.134 301.5)`}
    >
      <div
        class="inset-y-0 absolute"
        style:background-color={`oklch(${0.9375 - 0.375 * percentage} 0.134 211.5)`}
        style:width={`${(100 * num) / neighbors[neighbors.length - 1].num}%`}
        style:max-width={`${num}px`}
      ></div>
      <div
        class="relative flex items-end flex-col px-12"
        style:left={`${100 * percentage}%`}
        style:transform={`translateX(${-100 * percentage}%)`}
      >
        <div class="h-6 flex items-end .pb-0.5">
          <math class="text-neutral-600 text-sm font-sans">
            <mn>{formatNumber(coef)}px</mn>
            <mo>&times;</mo>
            <msup>
              <mn>{!targetInput ? 2 : base}</mn>
              <mn class="font-black text-neutral-950 .text-0.6875rem">{exp}</mn>
            </msup>
          </math>
        </div>
        <div
          class={[
            "text-lg font-mono",
            primary ? "text-neutral-900" : "text-neutral-600",
          ]}
        >
          {num / 4} ·
          {num / 16}rem ·
          {num}px
        </div>
        <div class="text-sm text-neutral-600 h-6 leading-tight">
          {#if delta === 0}
            <div class="text-neutral-800">Target</div>
          {:else}
            <math class="font-sans">
              <mn>{formatNumber(num - delta)}px</mn>
              <mo>
                {delta > 0 ? "+" : delta < 0 ? "−" : ""}
              </mo>
              <mn class="text-neutral-950 font-semibold">
                {formatNumber(Math.abs(delta))}px
              </mn>
            </math>
          {/if}
        </div>
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
      class="hover:text-[oklch(.797_0.134_211.5)]"
      variant="ghost"
      href="https://github.com/jfrancos"
      target="_blank"
      rel="noreferrer"
      aria-label="Github"
    >
      <div class="size-6 i-mdi:github"></div>
    </Button>
    <Button
      class="hover:text-[oklch(.797_0.134_211.5)]"
      variant="ghost"
      href="https://jfrancos.github.io/music.html"
      target="_blank"
      rel="noreferrer"
      aria-label="Music"
    >
      <div class="size-6 i-mdi:music"></div>
    </Button>
    <Button
      class="hover:text-[oklch(.797_0.134_211.5)]"
      variant="ghost"
      href="mailto:justinfrancos@gmail.com"
      aria-label="Email"
    >
      <div class="size-6 i-mdi:email-outline"></div>
    </Button>
  </div>
</footer>
