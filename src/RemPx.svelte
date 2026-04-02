<script lang="ts">
    const { px, symbol = "/" } = $props<{ px: number; symbol?: string }>();
</script>

<span><code>{px / 16}rem</code> {symbol} <code>{px}px</code></span>
