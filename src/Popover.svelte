<script lang="ts">
  import { buttonVariants } from "$lib/components/ui/button";

  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "$lib/components/ui/popover";
</script>

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
      This is the idea behind <strong>Tailwind’s spacing scale</strong>: most
      designs can be expressed with a small set of well-chosen values, and
      arbitrary values are there only when you truly need them.
    </p>
  </PopoverContent>
</Popover>
