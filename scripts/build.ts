import { config } from "./config";

// @ts-expect-error https://github.com/microsoft/TypeScript/issues/59030
for await (const context of config) {
  await context.rebuild();
  await context.dispose();
}
