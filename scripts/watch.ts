import { config } from "./config";

// Note: does not detect header changes, need to manually restart
for await (const context of config) {
  await context.watch();
}
