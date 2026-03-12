<script lang="ts">
  const dist = (x: number) => {
    while (x % 1 !== 0) x *= 2;
    const result = 1 + Math.clz32(x & -x) - Math.clz32(x);
    console.log(result);
    return result;
  };
</script>

<main class="h-dvh p-8">
  {#each { length: 16 }, i}
    <div style:padding-left={`${dist(i / 16) * 32}px`}>{i / 16}</div>
  {/each}
  {#each { length: 2048 }, i}
    <div style:padding-left={`${dist(i + 1) * 32}px`}>{i + 1}</div>
  {/each}
</main>
