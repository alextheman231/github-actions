from manim import Scene, Text, Code, ORANGE, DOWN, VGroup, ORIGIN


class PatchItUp(Scene):
    def construct(self):
        title = Text("PATCH IT UP", font="Trattatello", color=ORANGE)
        code = Code(
            code_string="""
Run pnpm run build
> @alextheman/github-actions@6.3.0 build
> tsdown

ℹ entry: src/index.ts
ℹ target: node22.0.0
ℹ tsconfig: tsconfig.json
ℹ Build start
ℹ Cleaning 6 files
ℹ [CJS] dist/index.cjs      21.32 kB │ gzip:  7.07 kB
ℹ [CJS] dist/index.cjs.map  84.02 kB │ gzip: 18.84 kB
ℹ [CJS] 2 files, total: 105.33 kB
ℹ [CJS] dist/index.d.cts  21.82 kB │ gzip: 4.53 kB
ℹ [CJS] 1 files, total: 21.82 kB
✔ Build complete in 1781ms
ℹ [ESM] dist/index.js      17.93 kB │ gzip:  6.46 kB
ℹ [ESM] dist/index.js.map  80.25 kB │ gzip: 18.25 kB
ℹ [ESM] dist/index.d.ts    21.82 kB │ gzip:  4.53 kB
ℹ [ESM] 3 files, total: 120.00 kB
✔ Build complete in 1785ms

Run pnpm run lint
✖ Error: Cannot find action './.github/actions/lint-ci.yml'

Error: Process completed with exit code 1.
""",
            language="bash",
            background="rectangle",
            paragraph_config={"font": "Monospace"},
        ).scale(0.68)

        group = VGroup(title, code).arrange(DOWN, buff=0.4).move_to(ORIGIN)
        title.shift(0.15 * DOWN)
        self.add(group)
