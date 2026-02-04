import { defineSchema } from "convex/server";
import { userTables } from "./schema/users";
import { curriculumTables } from "./schema/curriculum";
import { contentTables } from "./schema/content";
import { socialTables } from "./schema/social";
import { executionTables } from "./schema/execution";

export default defineSchema({
  ...userTables,
  ...curriculumTables,
  ...contentTables,
  ...socialTables,
  ...executionTables,
});
