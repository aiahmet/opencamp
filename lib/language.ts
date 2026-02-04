/**
 * Language utilities for file extensions, templates, and Monaco Editor integration
 * Shared between frontend and backend
 */

/**
 * Mapping of Monaco language IDs to file extensions
 */
export const LANGUAGE_EXTENSIONS: Record<string, string> = {
  // JavaScript/TypeScript
  javascript: ".js",
  typescript: ".ts",
  javascriptreact: ".jsx",
  typescriptreact: ".tsx",

  // Python
  python: ".py",

  // Java
  java: ".java",

  // C/C++
  c: ".c",
  cpp: ".cpp",
  csharp: ".cs",

  // Go
  go: ".go",

  // Rust
  rust: ".rs",

  // Ruby
  ruby: ".rb",

  // PHP
  php: ".php",

  // Swift
  swift: ".swift",

  // Kotlin
  kotlin: ".kt",
  kotlin_script: ".kts",

  // Shell
  shell: ".sh",
  powershell: ".ps1",

  // Web
  html: ".html",
  css: ".css",
  scss: ".scss",
  less: ".less",

  // Data
  json: ".json",
  xml: ".xml",
  yaml: ".yaml",
  toml: ".toml",

  // Markdown
  markdown: ".md",

  // SQL
  sql: ".sql",

  // Dart
  dart: ".dart",

  // Other
  plaintext: ".txt",
} as const;

/**
 * File templates for different languages
 */
export const LANGUAGE_FILE_TEMPLATES: Record<string, (fileName: string) => string> = {
  python: (fileName) => `# ${fileName}\n\n# TODO: Implement\n`,
  java: (fileName) => `public class ${fileName} {\n  // TODO: Implement\n}\n`,
  javascript: (fileName) => `// ${fileName}\n\n// TODO: Implement\n`,
  typescript: (fileName) => `// ${fileName}\n\n// TODO: Implement\n`,
  go: (fileName) => `package main\n\n// ${fileName}\n// TODO: Implement\n`,
  rust: (fileName) => `// ${fileName}\n\n// TODO: Implement\n`,
  c: (fileName) => `/* ${fileName} */\n\n// TODO: Implement\n`,
  cpp: (fileName) => `// ${fileName}\n\n// TODO: Implement\n`,
  csharp: (fileName) => `// ${fileName}\n\n// TODO: Implement\n`,
  ruby: (fileName) => `# ${fileName}\n\n# TODO: Implement\n`,
  php: (fileName) => `<?php\n// ${fileName}\n// TODO: Implement\n`,
  swift: (fileName) => `// ${fileName}\n\n// TODO: Implement\n`,
  kotlin: (fileName) => `// ${fileName}\n\n// TODO: Implement\n`,
  shell: (fileName) => `#!/bin/bash\n# ${fileName}\n\n# TODO: Implement\n`,
  powershell: (fileName) => `# ${fileName}\n\n# TODO: Implement\n`,
  html: (fileName) => `<!-- ${fileName} -->\n\n<!-- TODO: Implement -->\n`,
  css: (fileName) => `/* ${fileName} */\n\n/* TODO: Implement */\n`,
  scss: (fileName) => `// ${fileName}\n\n// TODO: Implement\n`,
  less: (fileName) => `/* ${fileName} */\n\n/* TODO: Implement */\n`,
  json: () => `{\n  // TODO: Implement\n}\n`,
  xml: (fileName) => `<!-- ${fileName} -->\n\n<!-- TODO: Implement -->\n`,
  yaml: () => `# TODO: Implement\n`,
  toml: () => `# TODO: Implement\n`,
  markdown: (fileName) => `# ${fileName}\n\nTODO: Implement\n`,
  sql: (fileName) => `-- ${fileName}\n\n-- TODO: Implement\n`,
  dart: (fileName) => `// ${fileName}\n\n// TODO: Implement\n`,
  plaintext: (fileName) => `// ${fileName}\n\n// TODO: Implement\n`,
} as const;

/**
 * Get the file extension for a given Monaco language ID
 * @param monacoLanguageId - The Monaco Editor language ID
 * @returns The file extension (including the dot), or ".txt" as default
 */
export function getFileExtension(monacoLanguageId: string): string {
  return LANGUAGE_EXTENSIONS[monacoLanguageId] || ".txt";
}

/**
 * Get the file template content for a given Monaco language ID
 * @param monacoLanguageId - The Monaco Editor language ID
 * @param fileName - The name of the file (without extension)
 * @returns The template content for the file
 */
export function getFileTemplate(monacoLanguageId: string, fileName: string): string {
  const template = LANGUAGE_FILE_TEMPLATES[monacoLanguageId];
  return template ? template(fileName) : `// ${fileName}\n\n// TODO: Implement\n`;
}

/**
 * Combined function to get both extension and template for a new file
 * @param monacoLanguageId - The Monaco Editor language ID
 * @param fileName - The name of the file (without extension)
 * @returns An object with the full path and template content
 */
export function getNewFileDetails(monacoLanguageId: string, fileName: string): {
  path: string;
  content: string;
} {
  const extension = getFileExtension(monacoLanguageId);
  const content = getFileTemplate(monacoLanguageId, fileName);

  return {
    path: `${fileName}${extension}`,
    content,
  };
}
