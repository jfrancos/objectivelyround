<script lang="ts">
  import Fraction from "fraction.js";

  const padding = (i: number) => `${dist(i) * 16}px`;
  const fontSize = (i: number) => `${32 - dist(i) * 1.5}px`;

  const dist = (x: number) => {
    while (x % 1 !== 0) x *= 2;
    return Math.clz32(x & -x) - Math.clz32(x);
  };
</script>

<main class="p-8 font-mono">
  {#each Array.from({ length: 15 }, (_, x: number) => x + 1) as i}
    <div style:padding-left={padding(i)} style:font-size={fontSize(i)}>
      {new Fraction(i / 16).toFraction()}
    </div>
  {/each}
  {#each Array.from({ length: 2 ** 16 }, (_, x: number) => x + 1).filter((n) => n % 2 === 0 || n === 1) as i}
    <div style:padding-left={padding(i)} style:font-size={fontSize(i)}>
      {i}
    </div>
  {/each}
</main>
