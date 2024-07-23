import { readFileSync } from 'node:fs'
import { globbySync } from 'globby'
import { context } from 'esbuild'
import { execa } from 'execa'

const { stdout: commit } = await execa`git rev-parse HEAD`

const delimiter = '// ==/UserScript=='
function getBanner(path: string) {
  return (
    // eslint-disable-next-line prefer-template
    readFileSync(path, 'utf8').split(delimiter)[0]
    + `// @commit      ${commit}\n`
    + delimiter
  )
}

export const config = globbySync('source/*/*.user.ts{,x}').map(script =>
  context({
    entryPoints: [script],
    bundle: true,
    banner: {
      js: getBanner(script),
    },
    outdir: 'dist',
    plugins: [
      {
        name: 'Build Time',
        setup: build =>
          build.onEnd(() =>
            console.log(`${new Date().toLocaleTimeString()} Built ${script}`),
          ),
      },
    ],
  }),
)
