import { readFileSync } from 'node:fs'
import { globbySync } from 'globby'
import { context } from 'esbuild'
import { execa } from 'execa'

const { stdout: commit } = await execa`git rev-parse HEAD`

const delimiter = '// ==/UserScript=='
function getBanner(path: string) {
  const content = readFileSync(path, 'utf8')
  return (
    `${content.slice(0, content.indexOf(delimiter))
    }// @commit      ${commit}\n${
    delimiter}`
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
