import type { Browser } from "puppeteer";
import puppeteer from "puppeteer";

export class BrowserManager {
  private readonly browserURL: string;

  constructor(host: string, port: number | string) {
    this.browserURL = `http://${host}:${port}`;
  }

  async connect(): Promise<Browser> {
    return puppeteer.connect({ browserURL: this.browserURL });
  }
}
