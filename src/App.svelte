<script lang="ts">
  import Fraction from "fraction.js";
  import { tabs } from "slidytabs";
  import { Input } from "$lib/components/ui/input";
  import Tabs from "$lib/components/ui/tabs/tabs.svelte";
  import TabsList from "$lib/components/ui/tabs/tabs-list.svelte";
  import TabsTrigger from "$lib/components/ui/tabs/tabs-trigger.svelte";

  const dist = (x: number) => {
    while (!Number.isInteger(x)) x *= 2;
    return Math.clz32(x & -x) - Math.clz32(x);
  };

  // const fractions = Array.from({ length: 16 }, (_, x: number) => ({
  //   value: new Fraction(x + 1, 16).toFraction(),
  //   distance: dist(x + 1),
  // }));
  const integers = Array.from({ length: 2 ** 12 }, (_, x: number) => ({
    value: x + 1,
    distance: dist(x + 1),
  }));

  const scales = [
    { label: "px", mult: 1 },
    { label: "TW (4px)", mult: 4 },
    { label: "rem (16px)", mult: 16 },
  ];

  type Scale = "tw" | "px" | "rem";
  let scale = $state(scales[1]);
  let input = $state("");

  const scrollToInput = () => {
    const valuesDivs = Array.from(document.querySelectorAll("div.value"));
    // if (input === "") {
    //   valuesDivs[0].scrollIntoView({
    //     behavior: "instant",
    //     block: "center",
    //   });
    // }
    const targets =
      input.trim() === ""
        ? []
        : valuesDivs.filter((el) => el.textContent.startsWith(input));

    const notTargets =
      input.trim() === ""
        ? valuesDivs
        : valuesDivs.filter((el) => !el.textContent.startsWith(input));

    for (const div of targets) {
      div.classList.add("bg-yellow-300");
    }

    for (const div of notTargets) {
      div.classList.remove("bg-yellow-300");
    }

    targets[0]?.scrollIntoView({
      // behavior: "smooth",
      block: "center",
    });
  };

  $effect(() => {
    void scale;
    scrollToInput();
  });

  console.log(Math.max(...integers.map((item) => item.distance)));
</script>

<main>
  <header
    class="sticky top-0 z-10 shadow-lg bg-white w-full py-6 px-8 flex justify-between"
  >
    <Input class="w-32" autofocus bind:value={input} />
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
