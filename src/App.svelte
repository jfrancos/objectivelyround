<script lang="ts">
  import Fraction from "fraction.js";

  const dist = (x: number) => {
    while (x % 1 !== 0) x *= 2;
    return Math.clz32(x & -x) - Math.clz32(x);
  };
</script>

<main class="p-8">
  {#each Array.from({ length: 15 }, (_, x: number) => x + 1) as i}
    <div
      style:padding-left={`${dist(i / 16) * 24}px`}
      style:font-size={`${32 - dist(i) * 2}px`}
    >
      {new Fraction(i / 16).toFraction()}
    </div>
  {/each}
  {#each Array.from({ length: 4096 }, (_, x: number) => x + 1).filter((n) => n % 2 === 0 || n === 1) as i}
    <div
      style:padding-left={`${dist(i) * 24}px`}
      style:font-size={`${32 - dist(i) * 2}px`}
    >
      {i}
    </div>
  {/each}
</main>
