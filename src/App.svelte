<script lang="ts">
  // import { tabs } from "slidytabs";
  import { onMount } from "svelte";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Tabs, TabsList, TabsTrigger } from "$lib/components/ui/tabs";
  import { round } from "$lib/roundings";
  import boston from "./assets/boston.svg";
  import Exposition from "./Exposition.svelte";

  const scales = [
    { label: "quarter-rem", scale: 4 },
    { label: "rem", scale: 16 },
    { label: "px", scale: 1 },
  ] as const;
  let scaleInput = $state<"quarter-rem" | "rem" | "px">("px");
  let scale = $derived(scales.find((item) => item.label === scaleInput)?.scale);
  let targetInput = $state<number | null>(null);
  let target = $derived<number>(targetInput ?? 1337);
  let baseInput = $state<number | null>(2);
  let base = $derived<number>(
    targetInput === null || (baseInput ?? 0) < 2 ? 2 : (baseInput ?? 2),
  );
  // let showBase = $state(false);
  let inputRef = $state<HTMLInputElement | null>(null);
  let showLimit = $state(false);
  const neighbors = $derived(
    targetInput && target > 0 && base >= 2
      ? round((scale ?? 1) * target, base)
      : round(1337, 2),
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
    // if (key === "b") {
    //   baseInput = 2;
    //   showBase = !showBase;
    // } else
    if (
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
    <div class="flex-1"></div>
    <!-- <div class={["flex-1", showBase || "invisible"]}> -->
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
    <!-- </div> -->
    <div class="flex flex-col sm:flex-row gap-4 sm:gap-8 items-center">
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
      <Tabs bind:value={scaleInput}>
        <TabsList class="*:min-w-0 *:px-4">
          <!-- {#each scales as { label }} -->
          <TabsTrigger value="quarter-rem" aria-label="quarter-rem"
            ><math class="font-sans text-[17px] font-medium relative top-px">
              <mfrac><mi>rem</mi><mn>4</mn></mfrac>
            </math></TabsTrigger
          >
          <TabsTrigger value="rem" class="leading-none"
            ><div class="relative bottom-px">rem</div></TabsTrigger
          >
          <TabsTrigger value="px"
            ><div class="relative bottom-px">px</div></TabsTrigger
          >
          <!-- {/each} -->
        </TabsList>
      </Tabs>
    </div>
    <div class="flex-1 flex justify-end">
      <Button
        aria-label="github repository"
        variant="ghost"
        class="relative -right-2.5 hover:text-cyan-600"
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
    <!-- <Exposition bind:showBase /> -->
    <Exposition />
    <div class="flex justify-center pb-4 text-lg font-medium">1337px</div>
  {/if}

  {#each neighbors as { num, exp, delta, coef, rank, primary }}
    {@const max = Math.max(...neighbors.map((item) => item.rank))}
    {@const percentage = max === 0 ? 0.5 : rank / max}
    {@const deemphisized = `oklch(${0.5 - 0.2375 * percentage} 0 0)`}
    {@const dimmed = `oklch(${0.6 - 0.15 * percentage} 0 0)`}
    <!-- {console.log(percentage)} -->
    <div
      class="flex relative"
      style:background-color={`oklch(${0.95 - 0.3 * percentage} ${0.04 + 0.02685 * percentage} 331.53)`}
    >
      <div
        class="inset-y-0 absolute"
        style:background-color={`oklch(${0.95 - 0.3 * percentage} ${0.04 + 0.0937 * percentage} 211.53)`}
        style:width={`${(100 * num) / neighbors[neighbors.length - 1].num}%`}
        style:max-width={`${num}px`}
      ></div>
      <div
        class="relative flex items-end flex-col px-12"
        style:left={`${100 * percentage}%`}
        style:transform={`translateX(${-100 * percentage}%)`}
      >
        <div class="h-6 flex items-end .pb-0.5">
          <math class="text-sm font-sans font-light" style:color={deemphisized}>
            <mn>{formatNumber(coef)}px</mn>
            <mo>&times;</mo>
            <msup>
              <mn>{!targetInput ? 2 : base}</mn>
              <mn class="font-bold text-black">{exp}</mn>
            </msup>
          </math>
        </div>
        <div
          class={[
            "text-lg font-mono flex gap-2 items-center",
            primary && "text-black",
          ]}
          style:color={primary ? undefined : dimmed}
        >
          {#if delta === 0}
            <math>
              <mrow class="flex items-center font-mono">
                <mn>{num / 4}</mn>
                <mfrac><mi>rem</mi><mn>4</mn></mfrac>
              </mrow>
            </math>·<span>{num / 16}rem</span>·<span>{num}px</span>
          {:else if scaleInput === "px"}
            {num}px
          {:else if scaleInput === "rem"}
            {num / 16}rem
          {:else if scaleInput === "quarter-rem"}
            <span class="relative left-1.5">{num / 4}</span>
            <math>
              <mrow class="flex items-center font-mono">
                <mfrac><mi>rem</mi><mn>4</mn></mfrac>
              </mrow>
            </math>
          {/if}
        </div>
        <div class="text-sm h-6 leading-tight" style:color={deemphisized}>
          {#if delta === 0}
            <div class="text-neutral-900">Target</div>
          {:else}
            <math class="font-sans font-light">
              <mn>{formatNumber(num - delta)}px</mn>
              <mo>
                {delta > 0 ? "+" : delta < 0 ? "−" : ""}
              </mo>
              <mn class="text-black font-medium">
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
      <a
        href="https://oklch.beauty"
        target="_blank"
        rel="noreferrer"
        class="hover:text-cyan-600">oklch.beauty</a
      >
      <a
        href="https://slidytabs.dev"
        target="_blank"
        rel="noreferrer"
        class="hover:text-cyan-600">slidytabs.dev</a
      >
    </div>
  </div>
  <div class="flex flex-col">
    <img alt="Boston skyline" class="opacity-50 h-32 -mt-8" src={boston} />
    <div class="flex flex-col gap-1 items-center">
      <p>Made with love in Camberville, MA</p>
      <p>
        If you find this project helpful,
        <a
          rel="noreferrer"
          class="underline hover:text-cyan-600"
          target="_blank"
          href="https://github.com/jfrancos/objectivelyround"
          >please consider giving it a ⭐!</a
        >
      </p>
    </div>
  </div>
  <div class="flex gap-2 flex-1 justify-end">
    <Button
      class="hover:text-cyan-600"
      variant="ghost"
      href="https://github.com/jfrancos"
      target="_blank"
      rel="noreferrer"
      aria-label="Github"
    >
      <div class="size-6! i-mdi:github"></div>
    </Button>
    <Button
      class="hover:text-cyan-600"
      variant="ghost"
      href="https://jfrancos.github.io/music.html"
      target="_blank"
      rel="noreferrer"
      aria-label="Music"
    >
      <div class="size-6! i-mdi:music"></div>
    </Button>
    <Button
      class="hover:text-cyan-600"
      variant="ghost"
      href="mailto:justinfrancos@gmail.com"
      aria-label="Email"
    >
      <div class="size-6! i-mdi:email-outline"></div>
    </Button>
  </div>
</footer>
