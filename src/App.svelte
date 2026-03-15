<script lang="ts">
  import Fraction from "fraction.js";
  import { tabs } from "slidytabs";
  import Tabs from "$lib/components/ui/tabs/tabs.svelte";
  import TabsList from "$lib/components/ui/tabs/tabs-list.svelte";
  import TabsTrigger from "$lib/components/ui/tabs/tabs-trigger.svelte";

  const dist = (x: number) => {
    while (!Number.isInteger(x)) x *= 2;
    return Math.clz32(x & -x) - Math.clz32(x);
  };

  const fractions = Array.from({ length: 16 }, (_, x: number) => ({
    value: new Fraction(x + 1, 16).toFraction(),
    distance: dist(x + 1),
  }));
  const integers = Array.from({ length: 2 ** 12 }, (_, x: number) => ({
    value: (x + 1) * 2,
    distance: dist((x + 1) * 2),
  }));

  type Scale = "tw" | "px" | "rem";
  let scale = $state<Scale>("tw");

  $inspect(scale);
  console.log(Math.max(...integers.map((item) => item.distance)));
</script>

<main>
  <header class="sticky top-0 z-10 shadow-lg bg-white w-full py-6 px-12">
    <Tabs bind:value={() => scale, (next) => (scale = next)} {@attach tabs()}>
      <TabsList>
        <TabsTrigger class="min-w-0 flex-1 px-6" value="px">px</TabsTrigger>
        <TabsTrigger class="min-w-0 flex-1 px-6" value="tw">tw (4px)</TabsTrigger>
        <TabsTrigger class="min-w-0 flex-1 px-6" value="rem">rem (16px)</TabsTrigger>
      </TabsList>
    </Tabs>
  </header>
  <div class="font-mono py-8 color-purple-950 bg-purple-50">
    <div class="max-w-80">
      {#each [...fractions, ...integers] as { value, distance }}
        <div class="flex items-center px-16">
          <div class="absolute w-16 p-2 shrink-0 left-0">
            {distance}
          </div>
          <div
            style:padding-left={`${distance * 8}%`}
            style:font-size={`${40 - distance * 2}px`}
          >
            {value}
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
