import { BrowserConfig } from "./browser-config.js";
import { BrowserProcessManager } from "./browser-process-manager.js";

const browserConfig = new BrowserConfig();
const browserProcessManager = new BrowserProcessManager(browserConfig);

browserProcessManager.launchBrowser();
