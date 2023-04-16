import { config } from "../config/index.js";
import { Logger } from "../logger/index.js";

import { BrowserManager } from "./browser-manager.js";
import { VacancyResponder } from "./vacancy-responder.js";

import type { Browser } from "puppeteer";

async function main(): Promise<void> {
  const browserManager = new BrowserManager(
    config.BROWSER.HOST,
    config.BROWSER.PORT
  );
  const browser: Browser = await browserManager.connect();

  const [page] = await browser.pages();

  await page.setViewport({ width: 1280, height: 800 });

  const vacancyResponder = new VacancyResponder(page);

  while (true) {
    try {
      await page.waitForSelector(
        config.SELECTOR.VACANCY ||
          config.SELECTOR.MULTIPLE_TEXTAREAS ||
          config.SELECTOR.AFTER_MULTIPLE_TEXTAREAS,
        { timeout: 10000 }
      );

      await vacancyResponder.respondToVacancies();
    } catch (error) {
      Logger.error(
        `Error: can not find vacancies on the page. Go to the page with vacancies and try again.`,
        error
      );
    }
  }
}

main();
