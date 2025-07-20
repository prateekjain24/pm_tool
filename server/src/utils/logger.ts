import { isDevelopment, isTest } from "../config/env";
import { writeToFileLog } from "./logRotation";

/**
 * Log levels
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

/**
 * Log level names for display
 */
const LOG_LEVEL_NAMES: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: "DEBUG",
  [LogLevel.INFO]: "INFO",
  [LogLevel.WARN]: "WARN",
  [LogLevel.ERROR]: "ERROR",
};

/**
 * Log level colors for console output
 */
const LOG_LEVEL_COLORS: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: "\x1b[90m", // Gray
  [LogLevel.INFO]: "\x1b[36m",  // Cyan
  [LogLevel.WARN]: "\x1b[33m",  // Yellow
  [LogLevel.ERROR]: "\x1b[31m", // Red
};

const RESET_COLOR = "\x1b[0m";

/**
 * Get current log level based on environment
 */
function getCurrentLogLevel(): LogLevel {
  if (isTest) return LogLevel.ERROR;
  if (isDevelopment) return LogLevel.DEBUG;
  
  const envLevel = process.env.LOG_LEVEL?.toUpperCase();
  if (envLevel && envLevel in LogLevel) {
    return LogLevel[envLevel as keyof typeof LogLevel];
  }
  
  return LogLevel.INFO;
}

const currentLogLevel = getCurrentLogLevel();

/**
 * Logger interface
 */
export interface Logger {
  debug(data: any, message?: string): void;
  info(data: any, message?: string): void;
  warn(data: any, message?: string): void;
  error(data: any, message?: string): void;
}

/**
 * Formats log data for output
 */
function formatLogData(data: any): string {
  if (typeof data === "string") {
    return data;
  }
  
  if (data instanceof Error) {
    return isDevelopment && data.stack ? data.stack : data.message;
  }
  
  try {
    return JSON.stringify(data, null, isDevelopment ? 2 : 0);
  } catch {
    return String(data);
  }
}

/**
 * Creates a logger instance with a specific namespace
 */
export function getLogger(namespace: string): Logger {
  const log = (level: LogLevel, data: any, message?: string) => {
    if (level < currentLogLevel) {
      return;
    }
    
    const timestamp = new Date().toISOString();
    const levelName = LOG_LEVEL_NAMES[level];
    const color = LOG_LEVEL_COLORS[level];
    
    // Format the log entry
    const prefix = `${color}[${timestamp}] [${levelName}] [${namespace}]${RESET_COLOR}`;
    
    // Console output
    if (message) {
      console.log(`${prefix} ${message}`);
      if (data !== undefined && data !== null) {
        console.log(formatLogData(data));
      }
    } else {
      console.log(`${prefix} ${formatLogData(data)}`);
    }
    
    // File output in production
    if (!isDevelopment && !isTest) {
      const logMessage = message || formatLogData(data);
      const logData = message ? data : undefined;
      
      writeToFileLog(levelName, `[${namespace}] ${logMessage}`, logData)
        .catch(err => console.error("Failed to write to log file:", err));
    }
  };
  
  return {
    debug: (data: any, message?: string) => log(LogLevel.DEBUG, data, message),
    info: (data: any, message?: string) => log(LogLevel.INFO, data, message),
    warn: (data: any, message?: string) => log(LogLevel.WARN, data, message),
    error: (data: any, message?: string) => log(LogLevel.ERROR, data, message),
  };
}

/**
 * Root logger instance
 */
export const logger = getLogger("app");