<script lang="ts">
  import Fraction from "fraction.js";

  const padding = (i: number) => `${i * 16}px`;
  const fontSize = (i: number) => `${32 - i * 1.5}px`;

  const dist = (x: number) => {
    while (!Number.isInteger(x)) x *= 2;
    return Math.clz32(x & -x) - Math.clz32(x);
  };
</script>

<main class="p-8 font-mono">
  {#each Array.from({ length: 16 }, (_, x: number) => x + 1) as i}
    <div
      style:padding-left={padding(dist(i))}
      style:font-size={fontSize(dist(i))}
    >
      {new Fraction(i, 16).toFraction()}
    </div>
  {/each}
  {#each Array.from( { length: 2 ** 14 }, (_, x: number) => ({ x: (x + 1) * 2, dist: dist((x + 1) * 2) }), ) as i}
    <div
      style:padding-left={padding(i.dist)}
      style:font-size={fontSize(i.dist)}
    >
      {i.x}
    </div>
  {/each}
</main>
