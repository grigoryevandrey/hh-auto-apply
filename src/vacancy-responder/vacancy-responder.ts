import * as readline from "readline";

import { config } from "../config/index.js";

import { DetailedInfoPage } from "./detailed-info-page.js";
import { Vacancy } from "./vacancy.js";

import type { ElementHandle, Page } from "puppeteer";

export class VacancyResponder {
  private readonly rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  constructor(private readonly page: Page) {}

  public waitForEnter(message: string): Promise<void> {
    return new Promise((resolve) => {
      this.rl.question(message, () => {
        resolve();
      });
    });
  }

  public async respondToVacancies(): Promise<void> {
    const isAfterMultipleTextAreas = await this.page.$(
      config.SELECTOR.AFTER_MULTIPLE_TEXTAREAS
    );

    if (isAfterMultipleTextAreas) {
      await this.goBackInBrowser(2);
    }

    const detailedInfoPage = new DetailedInfoPage(this.page);

    let vacancyElements = await this.page.$$(config.SELECTOR.VACANCY);

    while (vacancyElements.length > 0) {
      const vacancies = vacancyElements.map(
        (element) => new Vacancy(this.page, element)
      );

      for (const vacancy of vacancies) {
        await vacancy.apply();

        if (await detailedInfoPage.isOnPage()) {
          await detailedInfoPage.fillMultipleTextAreas();
        }
      }

      await this.goToNextPage();
      vacancyElements = await this.page.$$(config.SELECTOR.VACANCY);
    }
  }

  private async goBackInBrowser(steps: number): Promise<void> {
    for (let i = 0; i < steps; i++) {
      await this.page.goBack({ waitUntil: "networkidle0" });
    }
  }

  private async goToNextPage(): Promise<void> {
    const nextPageButton: ElementHandle | null = await this.page.$(
      config.SELECTOR.PAGER_NEXT
    );
    if (nextPageButton) {
      await nextPageButton.click();
      await this.page.waitForNavigation({ waitUntil: "networkidle0" });
    }
  }
}
