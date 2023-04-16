import { config } from "../config/index.js";
import { Logger } from "../logger/index.js";
import { sleep } from "../utils/sleep.js";

import type { Page } from "puppeteer";

export class DetailedInfoPage {
  constructor(private readonly page: Page) {}

  public async isOnPage(): Promise<boolean> {
    const textAreas = await this.page.$$(config.SELECTOR.MULTIPLE_TEXTAREAS);
    return textAreas.length > 1;
  }

  public async fillMultipleTextAreas(): Promise<void> {
    const textAreas = await this.page.$$(config.SELECTOR.MULTIPLE_TEXTAREAS);

    for (const textarea of textAreas) {
      await textarea.type(config.FILLER.TEXTAREA, { delay: 100 });
    }

    const submitButton = await this.page.$(
      config.SELECTOR.MULTIPLE_SUBMIT_BUTTON
    );

    if (submitButton) {
      Logger.log("Submitting multiple text areas form");

      await submitButton.click();
      await sleep(1000);
    } else {
      Logger.log("No multiple text areas submit button found");
    }
  }
}
