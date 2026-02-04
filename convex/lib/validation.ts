import { validateHandle as validateHandleImpl } from "./identifiers";
import { Id } from "../_generated/dataModel";

export function validateHandleAndThrow(input: string): void {
  const result = validateHandleImpl(input);
  if (!result.valid) {
    throw new Error(result.error || "Invalid handle");
  }
}

export function checkHandleUnique(
  username: string | null | undefined,
  existingUserId: string,
  foundUser: { _id: string } | null
): void {
  if (foundUser && foundUser._id !== existingUserId) {
    throw new Error("Handle is already taken");
  }
}

/**
 * Validates that a test suite belongs to the specified language.
 * This ensures data integrity when assigning testSuites to curriculum items or projects.
 * @throws Error if the test suite doesn't exist or doesn't belong to the specified language
 */
export async function validateTestSuiteLanguage(
  getDb: (id: Id<"testSuites">) => Promise<{ languageId: Id<"languages"> } | null>,
  testSuiteId: Id<"testSuites">,
  expectedLanguageId: Id<"languages">,
  context: string
): Promise<void> {
  const testSuite = await getDb(testSuiteId);

  if (!testSuite) {
    throw new Error(`Test suite not found: ${context}`);
  }

  if (testSuite.languageId !== expectedLanguageId) {
    throw new Error(
      `Test suite language mismatch in ${context}: ` +
      `test suite belongs to language ${testSuite.languageId} ` +
      `but expected language ${expectedLanguageId}`
    );
  }
}
