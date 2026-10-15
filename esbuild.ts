import * as esbuild from "esbuild";
import path from "path";
import { dirname } from "dirname-filename-esm";
import * as fs from "fs";

const __dirname = dirname(import.meta);

const pdfkitFonts = {
    name: "pdfkit-fonts",
    setup(build) {
        const fontDir = path
            .resolve(__dirname, "./node_modules/pdfkit/js/standard-fonts")
            .replace(/\\/g, "/");

        build.onLoad(
            { filter: /node_modules[\\/]pdfkit[\\/].*\.(c?js|mjs)$/ },
            async (args) => {
                const src = await fs.promises.readFile(args.path, "utf8");
                if (!src.includes("#standard-fonts/")) return;

                const names = new Set();
                const body = src.replace(
                    /\b[\w$]+\(\s*(["'])#standard-fonts\/([^"']+)\1\s*\)/g,
                    (_m, _q, name) => {
                        names.add(name);
                        return `__sf_${name}`;
                    }
                );

                const imports = [...names]
                    .map((n) => `import __sf_${n} from "${fontDir}/${n}.cjs";`)
                    .join("\n");

                return { contents: `${imports}\n${body}`, loader: "js" };
            }
        );
    },
};

esbuild
    .build({
        bundle: true,
        entryPoints: [path.resolve(__dirname, "./src/server/app.ts")],
        outdir: path.resolve(__dirname, "./dist/server"),
        platform: "node",
        mainFields: ["main"],
        banner: {
            js: 'const __importMetaUrl = require("url").pathToFileURL(__filename).href;',
        },
        define: {
            "import.meta.url": "__importMetaUrl",
        },
        plugins: [pdfkitFonts],
    })
    .then((_r) => {
        fs.cpSync(
            path.resolve(__dirname, "./node_modules/pdfkit/js/data"),
            path.resolve(__dirname, "./dist/server/data"),
            { recursive: true }
        );
        fs.cpSync(
            path.resolve(__dirname, "./src/server/utils/fonts"),
            path.resolve(__dirname, "./dist/server/fonts"),
            { recursive: true }
        );
        console.log("Server build complete");
        process.exit(0);
    })
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
