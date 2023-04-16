import { config } from "../config/index.js";
import { Logger } from "../logger/index.js";
import { sleep } from "../utils/sleep.js";

import type { ElementHandle, Page } from "puppeteer";

export class Vacancy {
  constructor(
    private readonly page: Page,
    private readonly element: ElementHandle
  ) {}

  public async apply(): Promise<void> {
    try {
      Logger.log(
        `Processing vacancy: ${await this.element.evaluate(
          (el) => el.outerHTML
        )}`
      );

      await this.clickVacancy();
      await sleep(1000);

      await this.handleRelocationWarning();
      await this.fillTextArea();
      await this.submitVacancyResponse();
    } catch (error) {
      Logger.error(`Error: can not respond to vacancy.`, error);
    }
  }

  private async clickVacancy(): Promise<void> {
    await this.element.click();
  }

  private async handleRelocationWarning(): Promise<void> {
    const relocationButton = await this.page.$(
      config.SELECTOR.RELOCATION_BUTTON
    );

    if (relocationButton) {
      Logger.log("Handling relocation warning");
      await relocationButton.click();
      await sleep(1000);
    } else {
      Logger.log("No relocation warning found");
    }
  }

  private async fillTextArea(): Promise<void> {
    const textarea = await this.page.$(config.SELECTOR.TEXTAREA);

    if (textarea) {
      Logger.log("Filling text area");
      await textarea.type(config.FILLER.TEXTAREA, { delay: 100 });
    } else {
      Logger.log("No text area found");
    }
  }

  private async submitVacancyResponse(): Promise<void> {
    const submitButton = await this.page.$(config.SELECTOR.SUBMIT_BUTTON);

    if (submitButton) {
      Logger.log("Submitting vacancy response");
      await submitButton.click();
      await sleep(1000);
    } else {
      Logger.log("No submit button found");
    }
  }
}
