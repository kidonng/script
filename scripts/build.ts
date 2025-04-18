import { config } from './config.ts'

for await (const context of config) {
  await context.rebuild()
  await context.dispose()
}
