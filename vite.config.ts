import { svelte } from "@sveltejs/vite-plugin-svelte";
import { presetWind4 } from "unocss";
import unoCSS from "unocss/vite";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte(), unoCSS({ presets: [presetWind4()] })],
});
