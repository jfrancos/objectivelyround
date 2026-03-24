<script lang="ts">
  import { onMount } from "svelte";
  import { InputGroup, InputGroupInput } from "$lib/components/ui/input-group";
  import { getNeighbors } from "./lib/utils";

  let input = $state("1337");
  let inputRef = $state<HTMLInputElement | null>(null);

  const target = $derived(Number(input));
  const neighbors = $derived(getNeighbors(target));

  const EXP = $derived(Math.log2(neighbors[0].number) + 2);

  onMount(() => inputRef?.focus());

  $inspect(neighbors);
</script>

<svelte:window
  onkeydown={({ key }) => {
    if (input === "" && key.match(/[\d]/)) {
      inputRef?.focus();
    }
  }}
/>

<main class=".relative .w-full .overflow-visible">
  <header class="sticky top-0 shadow-lg bg-white p-8 flex justify-center z-20">
    <InputGroup class="w-48">
      <InputGroupInput
        bind:ref={inputRef}
        placeholder="Target"
        bind:value={
          () => input,
          (next) => {
            if (Number.isFinite(Number(next)) && next.trim() === next) {
              input = next;
            }
          }
        }
        onkeydown={({ key }) => {
          if (key === "Enter") {
            focus();
          }
        }}
      />
    </InputGroup>
  </header>
  <div class=".flex .flex-col">
    {#each neighbors as { number, exponent, delta, factor, rank }}
      <div
        class="px-4"
        style:background-color={`oklch(${1 - (0.5 * rank) / (neighbors.length - 1)} 0.1 300)`}
      >
        <div
          class="text-right py-2 relative w-fit"
          style:left={`${(100 * rank) / (neighbors.length - 1)}%`}
          style:transform={`translateX(${(-100 * rank) / (neighbors.length - 1)}%)`}
        >
          <div class="flex items-end flex-col w-fit min-w-0">
            <math class="text-neutral-700/75 text-sm font-sans">
              <mn>{factor}</mn>
              <mo>&times;</mo>
              <msup>
                <mn>2</mn>
                <!-- do 2^(0 + 6) -->
                <mn class="font-semibold text-black text-11px">{exponent}</mn>
              </msup>
            </math>
            <div class={["text-xl font-mono color-neutral-800"]}>
              {number}
            </div>
            <math class="font-sans text-11px">
              <mo class="text-neutral-700/75 relative -top-[0.125em]">
                {delta > 0 ? "+" : delta < 0 ? "−" : ""}
              </mo>
              <mn class="font-semibold text-black">
                {Math.abs(delta)}
              </mn>
            </math>
          </div>
        </div>
      </div>
    {/each}
  </div>
</main>
