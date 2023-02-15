require("esbuild")
  .build({
    entryPoints: ["./lambdas/lambda-aa.ts"],
    entryNames: "[dir]/[name]",
    outbase: ".",
    bundle: true,
    minify: true,
    sourcemap: false,
    outdir: "../build",
    platform: "node",
    write: true,
  })
  .catch(() => process.exit());
