export enum LogLevel {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  DEBUG = "DEBUG",
}

export class Logger {
  private static instance: Logger
  private isDevelopment: boolean

  private constructor() {
    this.isDevelopment = process.env.NODE_ENV === "development"
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  public info(message: string, data?: any): void {
    this.log(LogLevel.INFO, message, data)
  }

  public warn(message: string, data?: any): void {
    this.log(LogLevel.WARN, message, data)
  }

  public error(message: string, error?: any): void {
    this.log(LogLevel.ERROR, message, error)
  }

  public debug(message: string, data?: any): void {
    if (this.isDevelopment) {
      this.log(LogLevel.DEBUG, message, data)
    }
  }

  private log(level: LogLevel, message: string, data?: any): void {
    const timestamp = new Date().toISOString()
    const logMessage = `[${timestamp}] [${level}] ${message}`

    switch (level) {
      case LogLevel.ERROR:
        console.error(logMessage)
        if (data) console.error(data)
        break
      case LogLevel.WARN:
        console.warn(logMessage)
        if (data) console.warn(data)
        break
      case LogLevel.INFO:
        console.info(logMessage)
        if (data) console.info(data)
        break
      case LogLevel.DEBUG:
        console.debug(logMessage)
        if (data) console.debug(data)
        break
    }
  }
}

export const logger = Logger.getInstance()
