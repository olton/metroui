import {build, context} from 'esbuild'
import progress from "@olton/esbuild-plugin-progress";
import autoprefixer from "@olton/esbuild-plugin-autoprefixer";
import {lessLoader} from "esbuild-plugin-less";
import {replace} from "esbuild-plugin-replace";
import unlink from "@olton/esbuild-plugin-unlink";
import pkg from "./package.json" with {type: "json"};

const production = process.env.MODE === "production"
const banner = `
/*!
 ███╗   ███╗███████╗████████╗██████╗  ██████╗     ██╗   ██╗██╗
 ████╗ ████║██╔════╝╚══██╔══╝██╔══██╗██╔═══██╗    ██║   ██║██║
 ██╔████╔██║█████╗     ██║   ██████╔╝██║   ██║    ██║   ██║██║
 ██║╚██╔╝██║██╔══╝     ██║   ██╔══██╗██║   ██║    ██║   ██║██║
 ██║ ╚═╝ ██║███████╗   ██║   ██║  ██║╚██████╔╝    ╚██████╔╝██║
 ╚═╝     ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝      ╚═════╝ ╚═╝                                                             

 * Metro UI v${pkg.version} Components Library  (https://metroui.org.ua)
 * Copyright 2012-${new Date().getFullYear()} by Serhii Pimenov
 * Licensed under MIT
 */
`

let ctx = await context({
    entryPoints: ['./source/default.js'],
    outfile: './lib/metro.js',
    bundle: true,
    minify: false,
    sourcemap: true,
    banner: {
        js: banner
    },
    plugins: [
        progress({
            text: 'Building Metro UI...',
            succeedText: 'Library compiled in %s ms! Watching for changes...'
        }),
        lessLoader(),
        autoprefixer(),
        replace({
            '__BUILD_TIME__': new Date().toLocaleString(),
            '__VERSION__': pkg.version,
        })
    ],
})

let ctxIcons = await context({
    entryPoints: ['./source/icons.js'],
    outfile: './lib/icons.js',
    bundle: true,
    minify: production,
    sourcemap: false,
    plugins: [
        progress({
            text: 'Building Metro UI icons...',
            succeedText: 'Icons compiled in %s ms! Watching for changes...'
        }),
        lessLoader(),
        unlink({
            files: ['./lib/icons.js']
        })
    ],
})

await Promise.all([
    await ctx.watch(),
    await ctxIcons.watch(),
])

