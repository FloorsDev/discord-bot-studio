import chalk from "chalk";

export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  SUCCESS = "SUCCESS",
}

class Logger {
  private debugMode: boolean;

  constructor(debugMode = false) {
    this.debugMode = debugMode;
  }

  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private log(level: LogLevel, message: string, data?: any): void {
    const timestamp = this.getTimestamp();
    let colored = "";

    switch (level) {
      case LogLevel.DEBUG:
        colored = chalk.gray(`${timestamp} [${level}] ${message}`);
        break;
      case LogLevel.INFO:
        colored = chalk.blue(`${timestamp} [${level}] ${message}`);
        break;
      case LogLevel.WARN:
        colored = chalk.yellow(`${timestamp} [${level}] ${message}`);
        break;
      case LogLevel.ERROR:
        colored = chalk.red(`${timestamp} [${level}] ${message}`);
        break;
      case LogLevel.SUCCESS:
        colored = chalk.green(`${timestamp} [${level}] ${message}`);
        break;
    }

    console.log(colored);
    if (data) console.log(chalk.gray(JSON.stringify(data, null, 2)));
  }

  debug(message: string, data?: any): void {
    if (this.debugMode) this.log(LogLevel.DEBUG, message, data);
  }

  info(message: string, data?: any): void {
    this.log(LogLevel.INFO, message, data);
  }

  warn(message: string, data?: any): void {
    this.log(LogLevel.WARN, message, data);
  }

  error(message: string, error?: any): void {
    this.log(LogLevel.ERROR, message, error);
  }

  success(message: string, data?: any): void {
    this.log(LogLevel.SUCCESS, message, data);
  }

  discord(event: string, message: string, data?: any): void {
    this.info(`[DISCORD] ${event}: ${message}`, data);
  }
}

export const logger = new Logger(process.env.DEBUG_MODE === "true");
export default logger;
