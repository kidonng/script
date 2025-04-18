import { globSync, readFileSync } from 'node:fs'
import { context } from 'esbuild'
import exec from 'nanoexec'

const { stdout: commit } = await exec('git', ['rev-parse', 'HEAD'])
const { stdout: commitCount } = await exec('git', ['rev-list', '--count', 'HEAD'])

const delimiter = '// ==/UserScript=='
function getBanner(path: string) {
  return (
    readFileSync(path, 'utf8')
      .split(delimiter)[0]
      .replace(
        /(@version.+)/,
        `$1.${commitCount.toString().trim()}-${commit.toString().slice(0, 7)}`,
      )
      + delimiter
  )
}

export const config = globSync('source/*/*.user.ts{,x}').map(script =>
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
