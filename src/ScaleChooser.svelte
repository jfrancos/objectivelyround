<script lang="ts">
  import { tabs } from "slidytabs";
  import { Tabs, TabsList, TabsTrigger } from "$lib/components/ui/tabs";

  let { scale = $bindable() } = $props();

  const scales = [
    { label: "px", mult: 1 },
    { label: "tw (4px)", mult: 4 },
    { label: "rem (16px)", mult: 16 },
  ];
</script>

<Tabs
  bind:value={
    () => scales.find((item) => item.mult === scale)?.label,
    (next) => (scale = scales.find((item) => item.label === next)?.mult)
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
