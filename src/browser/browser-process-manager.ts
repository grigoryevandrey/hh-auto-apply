import { config } from "../config/index.js";
import { Logger } from "../logger/index.js";

import type { BrowserConfig } from "./browser-config.js";

import puppeteer from "puppeteer";

export class BrowserProcessManager {
  constructor(private readonly browserConfig: BrowserConfig) {}

  public async launchBrowser(): Promise<void> {
    Logger.log("Launching browser...");
    const userDataDir = this.browserConfig.getUserDataDir();
    const browser = await this.createBrowserInstance(userDataDir);

    const pages = await browser.pages();
    Logger.log(`Found ${pages.length} existing pages.`);

    if (pages.length === 0) {
      await this.openNewPage(browser, config.DEFAULT_URL);
    } else {
      await this.handleExistingPages(pages, browser);
    }
  }

  private async createBrowserInstance(
    userDataDir: string
  ): Promise<puppeteer.Browser> {
    Logger.log("Creating browser instance...");

    const args = [
      `--remote-debugging-port=${config.BROWSER.PORT}`,
      "--start-maximized",
      "--start-fullscreen",
      `--user-data-dir=${userDataDir}`,
      "--restore-last-session",
    ];

    return puppeteer.launch({
      headless: false,
      args,
      defaultViewport: null,
      ignoreDefaultArgs: ["--disable-extensions"],
    });
  }

  private async handleExistingPages(
    pages: puppeteer.Page[],
    browser: puppeteer.Browser
  ): Promise<void> {
    Logger.log("Handling existing pages...");

    const hasNonEmptyTab = await this.hasNonEmptyTab(pages);

    if (hasNonEmptyTab) {
      Logger.log("Non-empty tab found, closing about:blank pages.");
      await this.closeAboutBlankPages(pages);
    } else {
      Logger.log("No non-empty tab found, navigating to default URL.");
    }

    const newPages = await browser.pages();
    Logger.log(
      `After handling existing pages, ${newPages.length} pages remain.`
    );

    if (newPages.length === 0) {
      await this.openNewPage(browser, config.DEFAULT_URL);
    }
  }

  private async closeAboutBlankPages(pages: puppeteer.Page[]): Promise<void> {
    Logger.log("Closing about:blank pages...");

    let closedCount = 0;
    for (const page of pages) {
      if (page.url() === "about:blank") {
        await page.close();
        closedCount++;
      }
    }
    Logger.log(`Closed ${closedCount} about:blank pages.`);
  }

  private async openNewPage(
    browser: puppeteer.Browser,
    url: string
  ): Promise<void> {
    Logger.log(`Opening new page with URL: ${url}`);

    const page = await browser.newPage();
    await page.goto(url);

    Logger.log("New page opened successfully.");
  }

  private async hasNonEmptyTab(pages: puppeteer.Page[]): Promise<boolean> {
    Logger.log("Checking for non-empty tabs...");

    for (const page of pages) {
      if (page.url() !== "about:blank") {
        Logger.log(`Non-empty tab found with URL: ${page.url()}.`);
        return true;
      }
    }

    Logger.log("No non-empty tabs found.");
    return false;
  }
}
