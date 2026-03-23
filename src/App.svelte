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
  <!-- <div class="sticky h-0 top-23 .-ml-3 .mr-3 font-mono text-sm">
    {#each { length: EXP }, i}
      <div class="absolute .px-16 inset-0">
        <div class="w-4 text-end" style={`margin-left: ${(i / EXP) * 100}%`}>
          {EXP - i - 1}
        </div>
      </div>
    {/each}
  </div> -->

  <div
    style:grid-template-columns={`repeat(${EXP}, minmax(0, 1fr))`}
    class="font-mono py-8 color-neutral-800 .bg-[oklch(97.5%.075_300)] .w-full .overflow-visible grid .grid-flow-row .gap-x-px"
  >
    <!-- {#each { length: EXP }, i}
      <div class="absolute .px-16 inset-0 .inset-l-2 .-inset-r-2">
        <Separator
          orientation="vertical"
          class="bg-neutral-500/50"
          style={`margin-left: ${(i / EXP) * 100}%`}
        />
      </div>
    {/each} -->
    {#each neighbors as { number, timesDivisibleBy2: distance, delta, factor }}
      <div
        style:background-color={`oklch(${97.5 - 2.5 * (EXP - distance - 1)}% 0.075 300)`}
        style:grid-column={`1 / ${EXP - distance}`}
      ></div>
      <div
        class="text-right"
        style:background-color={`oklch(${97.5 - 2.5 * (EXP - distance - 1)}% 0.075 300)`}
        style:grid-column={`${EXP - distance} / -1`}
      >
        <div class="flex items-end flex-col w-fit">
          <math class="text-neutral-700/75 text-sm font-mono">
            <mn>{factor}</mn>
            <mo>&times;</mo>
            <msup>
              <mn>2</mn>
              <mn class="font-bold text-black text-11px">{distance}</mn>
            </msup>
          </math>
          <div
            class={[
              "value .size-fit .px-2 relative .mx-16 text-xl w-full overflow-visible",
              // input &&
              //   String(number / scale).startsWith(input.trim()) &&
              //   "bg-yellow-300",
            ]}
          >
            {number}
          </div>
          <div class="text-11px font-bold">
            {delta > 0 ? "+" : ""}{delta}
          </div>
        </div>
      </div>
    {/each}
  </div>
</main>
<!-- // style:padding-left={`${((EXP - distance - 1) / EXP) * 100}%`} -->
