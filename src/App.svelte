<script lang="ts">
  import { tabs } from "slidytabs";
  import { Button } from "$lib/components/ui/button";
  import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
  } from "$lib/components/ui/input-group";
  import { Separator } from "$lib/components/ui/separator";
  import { Tabs, TabsList, TabsTrigger } from "$lib/components/ui/tabs";
  import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "$lib/components/ui/tooltip";
  import Popover from "./Popover.svelte";
  import { dist, scales } from "./util";

  let chosenDistance = $state<number>();
  let scale = $state(scales[1]);
  let input = $state("");
  let inputRef = $state<HTMLInputElement | null>(null);

  const integers = $derived(
    Array.from({ length: 2 ** 13 }, (_, x: number) => ({
      value: x + 1,
      distance: dist(x + 1),
    })).filter((item) =>
      chosenDistance !== undefined
        ? item.distance < chosenDistance ||
          String(item.value / scale.mult) === input
        : true,
    ),
  );

  const scrollToInput = () => {
    const hasInput = input.trim() !== "";
    if (!hasInput) {
      scrollTo(0, 0);
    } else {
      const valuesDivs = Array.from(document.querySelectorAll("div.value"));
      const target = valuesDivs.find((el) => el.textContent.startsWith(input));

      target?.scrollIntoView({
        block: "center",
      });
    }
  };

  $effect(() => {
    void scale;
    void chosenDistance;
    scrollToInput();
  });

  $effect(() => {
    void input;
    chosenDistance = undefined;
  });

  const showEsc = $derived(chosenDistance !== undefined);
  const showEnter = $derived(
    integers.some((item) => String(item.value / scale.mult) === input),
  );

  const focus = () => {
    const number = integers.find(
      (item) => String(item.value / scale.mult) === input,
    );
    if (number != null) {
      chosenDistance = number.distance;
    }
  };
</script>

<svelte:window
  onkeydown={({ key }) => {
    if (key === "Escape") {
      chosenDistance = undefined;
    } else if (input === "" && key.match(/[\d]/)) {
      inputRef?.focus();
    }
  }}
/>

<main class="relative">
  <header
    class="sticky top-0 z-10 shadow-lg bg-white w-full py-6 px-8 flex justify-between z-20"
  >
    <InputGroup class="w-40">
      <InputGroupInput
        bind:ref={inputRef}
        placeholder="Target"
        autofocus
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
      {#if showEsc || showEnter}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <InputGroupAddon align="inline-end">
                <Button
                  size="sm"
                  onclick={() => {
                    console.log("click");
                    if (showEsc) {
                      chosenDistance = undefined;
                    } else if (showEnter) {
                      focus();
                    }
                  }}
                  class="bg-neutral-600 text-neutral-50 rounded text-xs h-6"
                >
                  {#if showEsc}
                    <span class="leading-0">Esc</span>
                  {:else if showEnter}
                    <span class="-mb-0.5">↵</span>
                  {/if}
                </Button>
              </InputGroupAddon>
            </TooltipTrigger>
            <TooltipContent>
              {#if showEsc}
                Show all values
              {:else if showEnter}
                Focus on <span class="font-bold">only</span> rounder values
              {/if}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      {/if}
    </InputGroup>
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
    <div class="w-40 flex justify-end">
      <Popover />
    </div>
  </header>
  <div class="sticky h-0 top-23 -ml-3 mr-3 font-mono text-sm">
    {#each { length: 13 }, i}
      <div class="absolute px-16 inset-0">
        <div class="w-4 text-end" style={`margin-left: ${i * 8}%`}>
          {i}
        </div>
      </div>
    {/each}
  </div>

  <div class="font-mono py-8 color-neutral-800 bg-[oklch(97.5%.075_300)]">
    <div class=".max-w-80">
      {#each { length: 13 }, i}
        <div class="absolute px-16 inset-0 inset-l-2 -inset-r-2">
          <Separator
            orientation="vertical"
            class="bg-neutral-500/50"
            style={`margin-left: ${i * 8}%`}
          />
        </div>
      {/each}
      {#each integers as { value, distance }}
        <div
          class="flex items-center px-16"
          style:background-color={`oklch(${97.5 - 2.5 * distance}% 0.075 300)`}
        >
          <!-- <div class="absolute w-16 p-2 shrink-0 left-0">
            {distance}
          </div> -->
          <div
            style:padding-left={`${distance * 8}%`}
            style:font-size={`${40 - distance * 2}px`}
          >
            <div
              class={[
                "value size-full px-2 z-10 relative",
                input &&
                  String(value / scale.mult).startsWith(input.trim()) &&
                  "bg-yellow-300",
              ]}
            >
              {value / scale.mult}
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</main>
