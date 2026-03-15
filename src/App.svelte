<script lang="ts">
  import { tabs } from "slidytabs";
  import { Input } from "$lib/components/ui/input";
  import Tabs from "$lib/components/ui/tabs/tabs.svelte";
  import TabsList from "$lib/components/ui/tabs/tabs-list.svelte";
  import TabsTrigger from "$lib/components/ui/tabs/tabs-trigger.svelte";

  const dist = (x: number) => {
    while (!Number.isInteger(x)) x *= 2;
    return Math.clz32(x & -x) - Math.clz32(x);
  };

  let chosenDistance = $state<number>();

  const integers = $derived(
    Array.from({ length: 2 ** 12 }, (_, x: number) => ({
      value: x + 1,
      distance: dist(x + 1),
    })).filter((item) =>
      chosenDistance
        ? item.distance < chosenDistance ||
          String(item.value / scale.mult) === input
        : true,
    ),
  );

  const scales = [
    { label: "px", mult: 1 },
    { label: "TW (4px)", mult: 4 },
    { label: "rem (16px)", mult: 16 },
  ];

  let scale = $state(scales[1]);
  let input = $state("");

  const scrollToInput = () => {
    const hasInput = input.trim() !== "";
    const valuesDivs = Array.from(document.querySelectorAll("div.value"));
    const targets = hasInput
      ? valuesDivs.filter((el) => el.textContent.startsWith(input))
      : [];

    const notTargets = hasInput
      ? valuesDivs.filter((el) => !el.textContent.startsWith(input))
      : valuesDivs;

    for (const div of targets) {
      div.classList.add("bg-yellow-300");
    }
    for (const div of notTargets) {
      div.classList.remove("bg-yellow-300");
    }

    (hasInput ? targets[0] : valuesDivs[0])?.scrollIntoView({
      block: "center",
    });
  };

  $effect(() => {
    void scale;
    void chosenDistance;
    scrollToInput();
  });
</script>

<svelte:window
  onkeydown={({ key }) => {
    if (key === "Escape") {
      chosenDistance = undefined;
    }
  }}
/>

<main>
  <header
    class="sticky top-0 z-10 shadow-lg bg-white w-full py-6 px-8 flex justify-between"
  >
    <Input
      class="w-32"
      autofocus
      bind:value={input}
      onkeydown={({ key }) => {
        if (key === "Enter") {
          const number = integers.find(
            (item) => String(item.value / scale.mult) === input,
          );
          // Stricter rule??
          if (number != null) {
            chosenDistance = number.distance;
          }
        }
      }}
    />
    <Tabs
      bind:value={
        () => scale.label,
        (next) => {
          scale = scales.find((item) => item.label === next) ?? scales[1];
        }
      }
      {@attach tabs()}
    >
      <TabsList>
        {#each scales as scale}
          <TabsTrigger class="min-w-0 flex-1 px-6" value={scale.label}>
            {scale.label}
          </TabsTrigger>
        {/each}
      </TabsList>
    </Tabs>
  </header>
  <div class="font-mono py-8 color-neutral-800 bg-[oklch(97.5%.075_300)]">
    <div class=".max-w-80">
      {#each integers as { value, distance }}
        <div
          class="flex items-center px-16"
          style:background-color={`oklch(${97.5 - 2.5 * distance}% 0.075 300)`}
        >
          <div class="absolute w-16 p-2 shrink-0 left-0">
            {distance}
          </div>
          <div
            style:padding-left={`${distance * 8}%`}
            style:font-size={`${40 - distance * 2}px`}
          >
            <div class="value size-full">
              {value / scale.mult}
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</main>

When small visual differences are imperceptible, choosing from a tiered set of
binary subdivision points (powers of two and their binary subdivisions) provides
an objective tie-breaker. Instead of debating arbitrary values like 932px vs
937px, you snap to a nearby “round” value like 936px. An added benefit is that
fewer unique values make their way into the stylesheet, reducing both design
entropy and the total number of CSS classes that need to be shipped.
