/**
 * Standard error types for consistent error handling across the application
 *
 * Usage:
 * - Import the specific error class you need
 * - Throw with a descriptive message
 * - Frontend can check error.name or error.constructor to handle specific error types
 */

// Re-export all error types from limits.ts
export {
  ExecutionLimitError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ValidationError,
  BadRequestError,
} from "./limits";

