<script lang="ts">
    const {
        exp,
        coef,
        parens = false,
        class: className = "",
    } = $props<{
        exp: number;
        coef: number;
        parens?: boolean;
        class?: string;
    }>();
</script>

<math class={["font-sans color-neutral-600", className]}>
    {#if parens}
        <mo>(</mo>
    {/if}
    <mn>{coef}</mn>
    <mo>×</mo>
    <msup>
        <mn>2</mn>
        <mn class="font-semibold color-neutral-950">{exp}</mn>
    </msup>
    {#if parens}
        <mo class="relative right-0.375">)</mo>
    {/if}
</math>
