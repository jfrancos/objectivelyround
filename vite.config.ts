import path from "node:path";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import {
	presetIcons,
	presetWebFonts,
	presetWind4,
	transformerVariantGroup,
} from "unocss";
import unoCSS from "unocss/vite";
import presetAnimations from "unocss-preset-animations";
import { presetShadcn } from "unocss-preset-shadcn";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		svelte(),
		unoCSS({
			presets: [
				presetWind4,
				presetAnimations,
				presetShadcn,
				presetIcons,
				presetWebFonts({
					provider: "fontsource",
					fonts: {
						inter: { name: "Inter" },
					},
				}),
			],
			transformers: [transformerVariantGroup()],
		}),
	],
	resolve: {
		alias: {
			$lib: path.resolve("./src/lib"),
		},
	},
});
