import { config } from "./config";

for await (const context of config) {
  await context.rebuild();
  await context.dispose();
}
