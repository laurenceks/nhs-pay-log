import * as esbuild from "esbuild";
import path from "path";
import { dirname } from "dirname-filename-esm";

const __dirname = dirname(import.meta);

esbuild
    .build({
        bundle: true,
        entryPoints: [path.resolve(__dirname, "./src/server/app.ts")],
        external: [
            /*
            // unused consolidate engines
            "velocityjs",
            "tinyliquid",
            "liquid-node",
            "jade",
            "then-jade",
            "dust",
            "dustjs-helpers",
            "dustjs-linkedin",
            "swig",
            "swig-templates",
            "razor-tmpl",
            "atpl",
            "liquor",
            "twig",
            "ejs",
            "eco",
            "jazz",
            "jqtpl",
            "hamljs",
            "hamlet",
            "whiskers",
            "haml-coffee",
            "hogan.js",
            "templayed",
            "qejs",
            "walrus",
            "just",
            "ect",
            "mote",
            "toffee",
            "dot",
            "util",
            "bracket-template",
            "ractive",
            "nunjucks",
            "htmling",
            "plates",
            "arc-templates/dist/es5",
            "vash",
            "slm",
            "babel-core",
            "marko",
            "teacup/lib/express",
            "coffee-script",
            "vm",
            "squirrelly",
            "twing",
*/
        ],
        outdir: path.resolve(__dirname, "./dist/server"),
        platform: "node",
    })
    .then((_r) => {
        console.log("Server build complete");
    })
    .catch((e) => {
        console.error(e);
        process.exit(0);
    })
    .finally(() => process.exit(1));
