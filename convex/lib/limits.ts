// Constants and utilities for rate limiting and quotas
import { formatInTimeZone } from "date-fns-tz";
import { addDays } from "date-fns";

export const LIMITS = {
  dailyRunLimit: 50,
  perMinuteRunLimit: 10,
  outputLimitBytes: 262144, // 256KB
  defaultTimeoutMs: 10000,
  defaultCpu: 0.5,
  defaultMemoryMb: 256,
};

const BERLIN_TIMEZONE = "Europe/Berlin";

/**
 * Get today's date string in Berlin timezone (YYYY-MM-DD format)
 * Uses date-fns-tz for proper timezone handling including DST transitions
 */
export function getTodayBerlin(): string {
  return formatInTimeZone(new Date(), BERLIN_TIMEZONE, "yyyy-MM-dd");
}

/**
 * Get the timestamp of next midnight in Berlin timezone
 * Uses date-fns-tz for accurate timezone-aware calculations
 */
export function getNextMidnightBerlinMs(): number {
  const nowInBerlin = formatInTimeZone(new Date(), BERLIN_TIMEZONE, "yyyy-MM-dd");
  const tomorrowMidnight = addDays(new Date(nowInBerlin), 1);
  const tomorrowInBerlin = formatInTimeZone(tomorrowMidnight, BERLIN_TIMEZONE, "yyyy-MM-dd HH:mm:ss");
  const [datePart, timePart] = tomorrowInBerlin.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute, second] = timePart.split(":").map(Number);

  return new Date(year, month - 1, day, hour, minute, second).getTime();
}

/**
 * Standard error types for consistent error handling across the application
 */

// Execution limit errors (rate limiting, quota exceeded)
export class ExecutionLimitError extends Error {
  code: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details: Record<string, any>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(code: "RATE_LIMITED" | "QUOTA_EXCEEDED", details: Record<string, any>) {
    super(code === "RATE_LIMITED"
      ? `Rate limit exceeded. Try again in ${Math.ceil(details.retryAfterMs / 1000)}s.`
      : `Daily run limit reached. Resets at ${new Date(details.resetsAtMs).toLocaleTimeString()}.`
    );
    this.code = code;
    this.details = details;
    this.name = "ExecutionLimitError";
  }
}

// Authentication errors
export class AuthenticationError extends Error {
  constructor(message: string = "Unauthenticated") {
    super(message);
    this.name = "AuthenticationError";
  }
}

// Authorization errors (insufficient permissions)
export class AuthorizationError extends Error {
  constructor(message: string = "Insufficient permissions") {
    super(message);
    this.name = "AuthorizationError";
  }
}

// Not found errors (resource doesn't exist)
export class NotFoundError extends Error {
  constructor(resource: string) {
    super(`${resource} not found`);
    this.name = "NotFoundError";
  }
}

// Validation errors (invalid input)
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

// Bad request errors (invalid state for operation)
export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function throwFriendly(code: "RATE_LIMITED" | "QUOTA_EXCEEDED", details: Record<string, any>): never {
  throw new ExecutionLimitError(code, details);
}
