import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";
import summary from "rollup-plugin-summary";

export default {
	input: "dist/ti-editor.js",
	output: {
		file: "dist/ti-editor.bundled.js",
		format: "esm",
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
};
