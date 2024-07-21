import { config } from "./config";

// Note: does not detect header changes, need to manually restart
// @ts-expect-error https://github.com/microsoft/TypeScript/issues/59030
for await (const context of config) {
  await context.watch();
}
