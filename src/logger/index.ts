/* eslint-disable no-console */
export class Logger {
  static log(message: string): void {
    console.log(message);
  }

  static error(message: string, error?: unknown): void {
    if (error) {
      if (error instanceof Error) {
        console.error(`${message}. Error: ${error.message}`);
      } else {
        console.error(`${message}. Error: ${error}`);
      }
    } else {
      console.error(message);
    }
  }
}
