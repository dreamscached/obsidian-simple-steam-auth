import { TsconfigPathsPlugin } from "@esbuild-plugins/tsconfig-paths";
import esbuild from "esbuild";
import esbuildSvelte from "esbuild-svelte";

import { sveltePreprocess } from "svelte-preprocess";

import builtins from "builtin-modules";
import process from "process";

const banner = `/*
Thank you for using Simple Steam Auth! You're currently viewing a generated
bundled .js file. Feel free to view (and contribute to) the source code at
our Github repository: https://github.com/dreamscached/obsidian-simple-steam-auth
*/
`;

const prod = process.argv[2] === "production";

const context = await esbuild.context({
	banner: {
		js: banner
	},
	entryPoints: ["./src/main.ts"],
	outfile: "./dist/main.js",
	bundle: true,
	external: [
		"obsidian",
		"electron",
		"@codemirror/autocomplete",
		"@codemirror/collab",
		"@codemirror/commands",
		"@codemirror/language",
		"@codemirror/lint",
		"@codemirror/search",
		"@codemirror/state",
		"@codemirror/view",
		"@lezer/common",
		"@lezer/highlight",
		"@lezer/lr",
		// We have our own impl bundled for web
		...[...builtins].filter((it) => it !== "buffer")
	],
	plugins: [
		TsconfigPathsPlugin({ tsconfig: "./tsconfig.json" }),
		esbuildSvelte({
			preprocess: sveltePreprocess(),
			compilerOptions: {
				css: "injected"
			}
		})
	],
	format: "cjs",
	target: "es2018",
	logLevel: "info",
	sourcemap: prod ? false : "inline",
	// License acknoledgements are in NOTICE
	legalComments: "none",
	treeShaking: true,
	minify: prod
});

if (prod) {
	await context.rebuild();
	process.exit(0);
} else {
	await context.watch();
}
