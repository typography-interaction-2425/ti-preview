import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";
import { defineConfig } from "rollup";
import summary from "rollup-plugin-summary";

export default defineConfig({
	input: "dist/index.js",
	output: {
		format: "esm",
		dir: "dist/bundled",
		manualChunks: {
			lit: ["lit"],
			codemirror: [
				"codemirror",
				"@codemirror/lang-html",
				"@codemirror/view",
				"@codemirror/state",
				"@codemirror/lang-css",
			],
		},
	},
	onwarn(warning) {
		if (warning.code !== "THIS_IS_UNDEFINED") {
			console.error(`(!) ${warning.message}`);
		}
	},
	plugins: [
		replace({ preventAssignment: false, "Reflect.decorate": "undefined" }),
		resolve(),
		terser({
			ecma: 2021,
			module: true,
			warnings: true,
			mangle: {
				properties: {
					regex: /^__/,
				},
			},
		}),
		summary(),
	],
});
