<script lang="ts">
  import Fraction from "fraction.js";

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

  console.log(Math.max(...integers.map((item) => item.distance)));
</script>

<main class="p-8 font-mono">
  {#each [...fractions, ...integers] as { value, distance }}
    <div
      style:padding-left={`${distance}rem`}
      style:font-size={`${40 - distance * 2}px`}
    >
      {value}
    </div>
  {/each}
</main>
