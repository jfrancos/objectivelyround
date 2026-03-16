<script lang="ts">
  import { tabs } from "slidytabs";
  import { Button, buttonVariants } from "$lib/components/ui/button";
  import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
  } from "$lib/components/ui/input-group";
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "$lib/components/ui/popover";
  import { Tabs, TabsList, TabsTrigger } from "$lib/components/ui/tabs";
  import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "$lib/components/ui/tooltip";

  const dist = (x: number) => {
    while (!Number.isInteger(x)) x *= 2;
    return Math.clz32(x & -x) - Math.clz32(x);
  };

  let chosenDistance = $state<number>();

  const integers = $derived(
    Array.from({ length: 2 ** 12 }, (_, x: number) => ({
      value: x + 1,
      distance: dist(x + 1),
    })).filter((item) =>
      chosenDistance !== undefined
        ? item.distance < chosenDistance ||
          String(item.value / scale.mult) === input
        : true,
    ),
  );

  const scales = [
    { label: "px", mult: 1 },
    { label: "tw (4px)", mult: 4 },
    { label: "rem (16px)", mult: 16 },
  ];

  let scale = $state(scales[1]);
  let input = $state("");

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
    }
  }}
/>

<main>
  <header
    class="sticky top-0 z-10 shadow-lg bg-white w-full py-6 px-8 flex justify-between"
  >
    <InputGroup class="w-40">
      <InputGroupInput
        placeholder="Target"
        autofocus
        bind:value={input}
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
      <Popover>
        <PopoverTrigger class={[buttonVariants({ variant: "ghost" })]}>
          <span aria-label="info" class="i-lucide-info size-5"></span>
        </PopoverTrigger>
        <PopoverContent class="max-w-sm text-sm leading-relaxed space-y-3">
          <p>
            When small visual differences are imperceptible, choosing from a
            <strong>tiered set of binary subdivision points</strong>
            (powers of two and their binary subdivisions) provides an objective tie-breaker
            and helps prevent decision fatigue.
          </p>

          <p>
            Instead of debating arbitrary values like <code>932px</code> vs
            <code>937px</code>, you snap to a nearby “round” value like
            <code>936px</code>.
          </p>

          <p>
            An added benefit is that fewer unique values make their way into the
            stylesheet, reducing both design entropy and the total number of CSS
            classes that need to be shipped.
          </p>

          <p>
            This is the idea behind <strong>Tailwind’s spacing scale</strong>:
            most designs can be expressed with a small set of well-chosen
            values, and arbitrary values are there only when you truly need
            them.
          </p>
        </PopoverContent>
      </Popover>
    </div>
  </header>
  <div class="font-mono py-8 color-neutral-800 bg-[oklch(97.5%.075_300)]">
    <div class=".max-w-80">
      {#each integers as { value, distance }}
        <div
          class="flex items-center px-16"
          style:background-color={`oklch(${97.5 - 2.5 * distance}% 0.075 300)`}
        >
          <div class="absolute w-16 p-2 shrink-0 left-0">
            {distance}
          </div>
          <div
            style:padding-left={`${distance * 8}%`}
            style:font-size={`${40 - distance * 2}px`}
          >
            <div
              class={[
                "value size-full",
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
