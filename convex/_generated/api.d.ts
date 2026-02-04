/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as certificates from "../certificates.js";
import type * as comments from "../comments.js";
import type * as completion from "../completion.js";
import type * as config from "../config.js";
import type * as contributions from "../contributions.js";
import type * as curriculum from "../curriculum.js";
import type * as discussions from "../discussions.js";
import type * as drafts from "../drafts.js";
import type * as execution from "../execution.js";
import type * as lib_auth from "../lib/auth.js";
import type * as lib_errors from "../lib/errors.js";
import type * as lib_identifiers from "../lib/identifiers.js";
import type * as lib_language from "../lib/language.js";
import type * as lib_limits from "../lib/limits.js";
import type * as lib_quota from "../lib/quota.js";
import type * as lib_rateLimit from "../lib/rateLimit.js";
import type * as lib_runnerSchema from "../lib/runnerSchema.js";
import type * as lib_submissionExecution from "../lib/submissionExecution.js";
import type * as lib_validation from "../lib/validation.js";
import type * as profile from "../profile.js";
import type * as progress from "../progress.js";
import type * as projectProgress from "../projectProgress.js";
import type * as projectSubmissions from "../projectSubmissions.js";
import type * as projectWorkspaces from "../projectWorkspaces.js";
import type * as projects from "../projects.js";
import type * as schema_content from "../schema/content.js";
import type * as schema_curriculum from "../schema/curriculum.js";
import type * as schema_execution from "../schema/execution.js";
import type * as schema_social from "../schema/social.js";
import type * as schema_users from "../schema/users.js";
import type * as seed from "../seed.js";
import type * as submissions from "../submissions.js";
import type * as usage from "../usage.js";
import type * as users from "../users.js";
import type * as versions from "../versions.js";
import type * as votes from "../votes.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  certificates: typeof certificates;
  comments: typeof comments;
  completion: typeof completion;
  config: typeof config;
  contributions: typeof contributions;
  curriculum: typeof curriculum;
  discussions: typeof discussions;
  drafts: typeof drafts;
  execution: typeof execution;
  "lib/auth": typeof lib_auth;
  "lib/errors": typeof lib_errors;
  "lib/identifiers": typeof lib_identifiers;
  "lib/language": typeof lib_language;
  "lib/limits": typeof lib_limits;
  "lib/quota": typeof lib_quota;
  "lib/rateLimit": typeof lib_rateLimit;
  "lib/runnerSchema": typeof lib_runnerSchema;
  "lib/submissionExecution": typeof lib_submissionExecution;
  "lib/validation": typeof lib_validation;
  profile: typeof profile;
  progress: typeof progress;
  projectProgress: typeof projectProgress;
  projectSubmissions: typeof projectSubmissions;
  projectWorkspaces: typeof projectWorkspaces;
  projects: typeof projects;
  "schema/content": typeof schema_content;
  "schema/curriculum": typeof schema_curriculum;
  "schema/execution": typeof schema_execution;
  "schema/social": typeof schema_social;
  "schema/users": typeof schema_users;
  seed: typeof seed;
  submissions: typeof submissions;
  usage: typeof usage;
  users: typeof users;
  versions: typeof versions;
  votes: typeof votes;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
