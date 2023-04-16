import { config } from "../config/index.js";

import * as path from "node:path";

export class BrowserConfig {
  public getUserDataDir(): string {
    return path.join(config.ROOT_PATH, "chrome-debug-profile");
  }
}
