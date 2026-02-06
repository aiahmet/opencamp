#!/usr/bin/env node
/**
 * OpenCamp Curriculum CLI Tool
 *
 * ROADMAP Week 2: Markdown curriculum system + CLI tools
 *
 * Commands:
 * - opencamp create: Create new lesson/challenge/project
 * - opencamp validate: Validate YAML schema and markdown
 * - opencamp preview: Preview lesson content locally
 *
 * Usage:
 *   opencamp create <type> <name>
 *   opencamp validate <file>
 *   opencamp preview <file>
 */

import { Command } from "commander";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

program
  .name("opencamp")
  .description("OpenCamp curriculum management CLI")
  .version("1.0.0");

// Type definitions
type CurriculumItemType = "lesson" | "challenge" | "debug" | "project";

interface CurriculumMetadata {
  id: string;
  title: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number; // minutes
  prerequisites: string[];
  learningObjectives: string[];
  skillTags: string[];
  estimatedMinutes?: number;
  realWorldContext?: string;
  commonPitfalls?: string;
}

interface _ChallengeMetadata extends Omit<CurriculumMetadata, "difficulty"> {
  type: "challenge";
  difficulty: "easy" | "medium" | "hard";
  hasBonus?: boolean;
}

interface _DebugMetadata extends CurriculumMetadata {
  type: "debug";
  errorType: "syntax" | "logic" | "design";
  hints: Array<{
    level: 1 | 2 | 3;
    text: string;
  }>;
  brokenCode: string;
}

interface _ProjectMetadata extends CurriculumMetadata {
  type: "project";
  isPortfolioWorthy?: boolean;
  estimatedHours: number;
  files: Array<{
    path: string;
    description: string;
  }>;
  rubric: Record<string, string>;
}

// Template generators
const TEMPLATES: Record<CurriculumItemType, string> = {
  lesson: `---
id: {{id}}
title: "{{title}}"
difficulty: beginner
duration: {{duration}}
prerequisites: []
learningObjectives:
  - "Understand {{concept}}"
  - "Apply {{concept}} in practice"
  - "Recognize common patterns"
skillTags:
  - {{skillTags}}
estimatedMinutes: {{duration}}
realWorldContext: |
  This concept is used in real-world applications for...
commonPitfalls: |
  - Common mistake 1
  - Common mistake 2
---

# {{title}}

## Overview

[Lesson introduction goes here]

## Learning Objectives

By the end of this lesson, you will be able to:

1. Understand {{concept}}
2. Apply {{concept}} in practice
3. Recognize common patterns

## Content

[Lesson content with code examples]

## Practice

[Practice exercises]

## Summary

[Lesson summary]
`,

  challenge: `---
id: {{id}}
title: "{{title}}"
type: challenge
difficulty: easy
duration: {{duration}}
prerequisites: []
skillTags:
  - {{skillTags}}
estimatedMinutes: {{duration}}
hasBonus: false
---

# {{title}}

## Problem Statement

[Challenge description]

## Requirements

- Requirement 1
- Requirement 2
- Requirement 3

## Starting Code

\`\`\`java
// Your code here
\`\`\`

## Test Cases

The challenge will be tested against the following cases:

1. Test case 1 description
2. Test case 2 description

## Hints

<details>
<summary>Need a hint?</summary>

Hint 1 goes here.
</details>

## Bonus

[Optional bonus challenge]
`,

  debug: `---
id: {{id}}
title: "{{title}}"
type: debug
difficulty: beginner
duration: {{duration}}
prerequisites: []
skillTags:
  - {{skillTags}}
estimatedMinutes: {{duration}}
errorType: logic
hints:
  - level: 1
    text: "Check the variable initialization"
  - level: 2
    text: "The loop condition is incorrect"
  - level: 3
    text: "Initialize the variable before the loop"
brokenCode: |
  public class Solution {
      public int calculate(int n) {
          int sum;
          for (int i = 0; i <= n; i++) {
              sum += i;
          }
          return sum;
      }
  }
---

# {{title}}

## Debug Exercise

### Problem

The following code has a bug. Your task is to find and fix it.

### Broken Code

\`\`\`java
{{brokenCode}}
\`\`\`

### Expected Behavior

When you run the tests, they should all pass.

### Getting Started

1. Read the code carefully
2. Run the tests to see what fails
3. Use the hints if you get stuck
4. Fix the bug and make all tests pass
`,

  project: `---
id: {{id}}
title: "{{title}}"
type: project
difficulty: intermediate
duration: {{duration}}
prerequisites: []
skillTags:
  - {{skillTags}}
estimatedHours: 2
isPortfolioWorthy: false
files:
  - path: "Solution.java"
    description: "Main implementation file"
rubric:
  correctness: "Code produces correct output for all test cases"
  style: "Code follows naming conventions and is well-formatted"
  documentation: "Code includes appropriate comments"
---

# {{title}}

## Project Overview

[Project description]

## Learning Objectives

By completing this project, you will:

1. [Objective 1]
2. [Objective 2]
3. [Objective 3]

## Requirements

### Functional Requirements

- [Requirement 1]
- [Requirement 2]

### Technical Requirements

- Use proper naming conventions
- Include error handling
- Write clean, readable code

## Getting Started

### File Structure

\`\`\`
{{id}}/
├── Solution.java
├── TestRunner.java
└── README.md
\`\`\`

### Instructions

[Step-by-step instructions]

## Testing

Run the tests to verify your implementation:

\`\`\`bash
javac Solution.java TestRunner.java
java TestRunner
\`\`\`

## Submission

Submit your solution when all tests pass.
`,
};

// Validation functions
function validateYAML(content: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

  if (!frontmatterMatch) {
    return { valid: false, errors: ["No YAML frontmatter found"] };
  }

  const yaml = frontmatterMatch[1];
  if (!yaml) {
    return { valid: false, errors: ["Empty YAML frontmatter"] };
  }

  // Check for required fields
  const requiredFields = ["id", "title", "difficulty", "duration"];
  for (const field of requiredFields) {
    if (!yaml.includes(`${field}:`)) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Validate ID format
  const idMatch = yaml.match(/id:\s*([a-z0-9-]+)/);
  if (!idMatch) {
    errors.push("Invalid ID format. Use lowercase letters, numbers, and hyphens.");
  }

  // Validate difficulty
  const difficultyMatch = yaml.match(/difficulty:\s*(beginner|intermediate|advanced|easy|medium|hard)/);
  if (!difficultyMatch) {
    errors.push("Invalid difficulty. Must be: beginner, intermediate, advanced, easy, medium, or hard");
  }

  // Validate duration is a number
  const durationMatch = yaml.match(/duration:\s*(\d+)/);
  if (!durationMatch) {
    errors.push("Invalid duration. Must be a positive number (minutes for lessons/challenges, hours for projects)");
  }

  // Check for learningObjectives array
  if (!yaml.includes("learningObjectives:") && !yaml.includes("objectives:")) {
    errors.push("Missing learningObjectives array");
  }

  return { valid: errors.length === 0, errors };
}

function validateMarkdown(content: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check for proper heading structure
  const hasH1 = /^#\s+.+$/m.test(content);
  if (!hasH1) {
    errors.push("Missing main heading (# Title)");
  }

  // Check for code blocks with language specification
  const codeBlocks = content.match(/```(\w+)?\n/g);
  if (codeBlocks) {
    for (const block of codeBlocks) {
      if (block === "```\n" || block === "```") {
        errors.push("Code block missing language specification (e.g., ```java)");
      }
    }
  }

  // Check for proper list formatting
  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Check for list items without proper spacing
    if (line && /^[*-]\s/.test(line)) {
      const prevLine = i > 0 ? lines[i - 1] : undefined;
      if (prevLine && prevLine.trim() !== "" && !/^[*-]\s/.test(prevLine)) {
        // List item after non-empty line that's not a list - might need blank line
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

// CLI Commands
program
  .command("create <type> <name>")
  .description("Create a new curriculum item")
  .option("-d, --difficulty <level>", "Difficulty level", "beginner")
  .option("-D, --duration <minutes>", "Duration in minutes", "10")
  .option("-o, --output <dir>", "Output directory", "./content")
  .action(async (type: CurriculumItemType, name: string, options) => {
    const { difficulty, duration, output } = options;

    // Create output directory if it doesn't exist
    if (!fs.existsSync(output)) {
      fs.mkdirSync(output, { recursive: true });
    }

    // Generate ID from name
    const id = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Get template
    const template = TEMPLATES[type];
    if (!template) {
      console.error(`Unknown type: ${type}`);
      console.error(`Valid types: ${Object.keys(TEMPLATES).join(", ")}`);
      process.exit(1);
    }

    // Replace placeholders
    const content = template
      .replace(/\{\{id\}\}/g, id)
      .replace(/\{\{title\}\}/g, name)
      .replace(/\{\{difficulty\}\}/g, difficulty)
      .replace(/\{\{duration\}\}/g, duration)
      .replace(/\{\{concept\}\}/g, name.toLowerCase())
      .replace(/\{\{skillTags\}\}/g, type);

    // Determine file extension
    const ext = type === "lesson" ? "md" : "md";
    const filename = `${id}.${ext}`;
    const filepath = path.join(output, filename);

    // Write file
    fs.writeFileSync(filepath, content);

    console.log(`✅ Created ${type}: ${filepath}`);
    console.log(`   ID: ${id}`);
    console.log(`   Edit the file and run 'opencamp validate ${filepath}' when ready.`);
  });

program
  .command("validate <file>")
  .description("Validate a curriculum file")
  .action((file: string) => {
    const filepath = path.resolve(file);

    if (!fs.existsSync(filepath)) {
      console.error(`❌ File not found: ${filepath}`);
      process.exit(1);
    }

    const content = fs.readFileSync(filepath, "utf8");

    console.log(`Validating: ${filepath}`);

    // Validate YAML
    const yamlResult = validateYAML(content);
    if (!yamlResult.valid) {
      console.error("❌ YAML validation failed:");
      yamlResult.errors.forEach((error) => console.error(`   - ${error}`));
    } else {
      console.log("✅ YAML validation passed");
    }

    // Validate Markdown
    const mdResult = validateMarkdown(content);
    if (!mdResult.valid) {
      console.error("❌ Markdown validation failed:");
      mdResult.errors.forEach((error) => console.error(`   - ${error}`));
    } else {
      console.log("✅ Markdown validation passed");
    }

    // Overall status
    if (yamlResult.valid && mdResult.valid) {
      console.log("\n✅ All validations passed!");
    } else {
      console.log("\n❌ Validation failed. Please fix the errors above.");
      process.exit(1);
    }
  });

program
  .command("preview <file>")
  .description("Preview a curriculum file in a local server")
  .option("-p, --port <port>", "Port to run server on", "3000")
  .action(async (file: string, options) => {
    const filepath = path.resolve(file);

    if (!fs.existsSync(filepath)) {
      console.error(`❌ File not found: ${filepath}`);
      process.exit(1);
    }

    console.log(`🔧 Preview server for: ${filepath}`);
    console.log(`   Starting server on http://localhost:${options.port}`);
    console.log("\n⚠️  Note: Full preview server implementation coming soon.");
    console.log("   For now, you can use a markdown preview tool like:");
    console.log("   - VS Code: Ctrl+K V (open preview to the side)");
    console.log("   - CLI: grip (GitHub Readme Instant Preview)");
    console.log("   - Web: https://stackedit.io/");
  });

program.parse();
