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
  <div
    style:grid-template-columns={`repeat(${EXP}, minmax(0, 1fr))`}
    class="color-neutral-800 grid"
  >
    {#each neighbors as { number, timesDivisibleBy2: distance, delta, factor }}
      <div
        style:background-color={`oklch(${97.5 - 2.5 * (EXP - distance - 1)}% 0.075 300)`}
        style:grid-column={`1 / ${EXP - distance}`}
      ></div>
      <div
        class="text-right py-1"
        style:background-color={`oklch(${97.5 - 2.5 * (EXP - distance - 1)}% 0.075 300)`}
        style:grid-column={`${EXP - distance} / -1`}
      >
        <div class="flex items-end flex-col w-fit">
          <math class="text-neutral-700/75 text-sm font-sans">
            <mn>{factor}</mn>
            <mo>&times;</mo>
            <msup>
              <mn>2</mn>
              <!-- do 2^(0 + 6) -->
              <mn class="font-semibold text-black text-11px">{distance}</mn>
            </msup>
          </math>
          <div class={["text-xl font-mono"]}>
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
    {/each}
  </div>
</main>
