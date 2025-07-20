import fs from "fs";
import path from "path";
import { createWriteStream, WriteStream } from "fs";
import { promisify } from "util";
import zlib from "zlib";
import { env } from "../config/env";

const gzip = promisify(zlib.gzip);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

/**
 * Configuration for log rotation
 */
export interface LogRotationConfig {
  maxSize: number; // Max size in bytes before rotation
  maxFiles: number; // Max number of log files to keep
  maxAge: number; // Max age in days
  compress: boolean; // Compress rotated logs
  logDirectory: string; // Directory to store logs
  filePrefix: string; // Prefix for log files
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: LogRotationConfig = {
  maxSize: 10 * 1024 * 1024, // 10MB
  maxFiles: 10,
  maxAge: 30, // 30 days
  compress: true,
  logDirectory: path.join(process.cwd(), "logs"),
  filePrefix: "app",
};

/**
 * Rotating file logger
 */
export class RotatingFileLogger {
  private config: LogRotationConfig;
  private currentStream: WriteStream | null = null;
  private currentFile: string | null = null;
  private bytesWritten: number = 0;

  constructor(config: Partial<LogRotationConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.ensureLogDirectory();
  }

  /**
   * Ensure log directory exists
   */
  private ensureLogDirectory(): void {
    if (!fs.existsSync(this.config.logDirectory)) {
      fs.mkdirSync(this.config.logDirectory, { recursive: true });
    }
  }

  /**
   * Get current log file name
   */
  private getCurrentLogFileName(): string {
    const date = new Date().toISOString().split("T")[0];
    return path.join(this.config.logDirectory, `${this.config.filePrefix}-${date}.log`);
  }

  /**
   * Initialize or rotate the log file
   */
  private async initializeStream(): Promise<void> {
    const fileName = this.getCurrentLogFileName();

    // If it's a new day or first run, rotate
    if (fileName !== this.currentFile) {
      await this.rotate();
    }

    // Check if current file needs rotation due to size
    if (this.currentFile && this.bytesWritten >= this.config.maxSize) {
      await this.rotate();
    }

    // Create new stream if needed
    if (!this.currentStream) {
      this.currentFile = fileName;
      this.currentStream = createWriteStream(fileName, { flags: "a" });
      
      // Get current file size
      try {
        const stats = await stat(fileName);
        this.bytesWritten = stats.size;
      } catch {
        this.bytesWritten = 0;
      }
    }
  }

  /**
   * Write log entry
   */
  async write(level: string, message: string, data?: any): Promise<void> {
    await this.initializeStream();

    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...(data && { data }),
      pid: process.pid,
    };

    const line = JSON.stringify(logEntry) + "\n";
    const bytes = Buffer.byteLength(line);

    return new Promise((resolve, reject) => {
      if (!this.currentStream) {
        reject(new Error("No log stream available"));
        return;
      }

      this.currentStream.write(line, (error) => {
        if (error) {
          reject(error);
        } else {
          this.bytesWritten += bytes;
          resolve();
        }
      });
    });
  }

  /**
   * Rotate log files
   */
  private async rotate(): Promise<void> {
    // Close current stream
    if (this.currentStream) {
      await new Promise<void>((resolve) => {
        this.currentStream!.end(() => resolve());
      });
      this.currentStream = null;
    }

    // Compress the current file if it exists and compression is enabled
    if (this.currentFile && fs.existsSync(this.currentFile) && this.config.compress) {
      await this.compressFile(this.currentFile);
    }

    // Clean up old files
    await this.cleanupOldFiles();

    // Reset state
    this.currentFile = null;
    this.bytesWritten = 0;
  }

  /**
   * Compress a log file
   */
  private async compressFile(filePath: string): Promise<void> {
    try {
      const content = await fs.promises.readFile(filePath);
      const compressed = await gzip(content);
      const gzPath = `${filePath}.gz`;
      
      await writeFile(gzPath, compressed);
      await unlink(filePath);
    } catch (error) {
      console.error(`Failed to compress log file ${filePath}:`, error);
    }
  }

  /**
   * Clean up old log files
   */
  private async cleanupOldFiles(): Promise<void> {
    try {
      const files = await readdir(this.config.logDirectory);
      const logFiles = files.filter((f) => 
        f.startsWith(this.config.filePrefix) && 
        (f.endsWith(".log") || f.endsWith(".log.gz"))
      );

      // Get file stats
      const fileStats = await Promise.all(
        logFiles.map(async (file) => {
          const filePath = path.join(this.config.logDirectory, file);
          const stats = await stat(filePath);
          return { file, path: filePath, mtime: stats.mtime };
        })
      );

      // Sort by modification time (newest first)
      fileStats.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

      // Remove files beyond maxFiles limit
      const filesToDelete = fileStats.slice(this.config.maxFiles);

      // Also remove files older than maxAge
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.config.maxAge);

      for (const fileInfo of fileStats) {
        if (
          filesToDelete.includes(fileInfo) ||
          fileInfo.mtime < cutoffDate
        ) {
          try {
            await unlink(fileInfo.path);
          } catch (error) {
            console.error(`Failed to delete old log file ${fileInfo.path}:`, error);
          }
        }
      }
    } catch (error) {
      console.error("Failed to cleanup old log files:", error);
    }
  }

  /**
   * Close the logger
   */
  async close(): Promise<void> {
    if (this.currentStream) {
      await new Promise<void>((resolve) => {
        this.currentStream!.end(() => resolve());
      });
      this.currentStream = null;
    }
  }
}

/**
 * Global file logger instance
 */
let fileLogger: RotatingFileLogger | null = null;

/**
 * Initialize file logging
 */
export function initializeFileLogging(config?: Partial<LogRotationConfig>): void {
  if (env.NODE_ENV === "production") {
    fileLogger = new RotatingFileLogger(config);
  }
}

/**
 * Write to file log
 */
export async function writeToFileLog(
  level: string,
  message: string,
  data?: any
): Promise<void> {
  if (fileLogger) {
    try {
      await fileLogger.write(level, message, data);
    } catch (error) {
      console.error("Failed to write to log file:", error);
    }
  }
}

/**
 * Close file logger
 */
export async function closeFileLogger(): Promise<void> {
  if (fileLogger) {
    await fileLogger.close();
    fileLogger = null;
  }
}