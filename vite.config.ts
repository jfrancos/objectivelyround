import path from "node:path";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { presetIcons, presetWind4, transformerVariantGroup } from "unocss";
import unoCSS from "unocss/vite";
import presetAnimations from "unocss-preset-animations";
import { presetShadcn } from "unocss-preset-shadcn";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		svelte(),
		unoCSS({
			presets: [presetWind4, presetAnimations, presetShadcn, presetIcons],
			transformers: [transformerVariantGroup()],
			preflights: [
				{
					getCSS: () => `
        code {
          font-size: 0.9375em;
          background: #eee;
          padding-inline: 0.25rem;
          border-radius: 0.25rem;
        }
      `,
				},
			],
		}),
	],
	resolve: {
		alias: {
			$lib: path.resolve("./src/lib"),
		},
	},
});
