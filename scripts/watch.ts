import { config } from './config.ts'

// Note: does not detect header changes, need to manually restart
for await (const context of config) {
  await context.watch()
}
