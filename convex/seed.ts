import { internalMutation } from "./_generated/server";
import { validateTestSuiteLanguage } from "./lib/validation";

export const seed = internalMutation({
  handler: async (ctx) => {
    // Create or get language
    const existingLanguage = await ctx.db
      .query("languages")
      .withIndex("by_slug", (q) => q.eq("slug", "java"))
      .first();

    let languageId;
    if (existingLanguage) {
      languageId = existingLanguage._id;
    } else {
      languageId = await ctx.db.insert("languages", {
        slug: "java",
        name: "Java",
        editorConfig: {
          monacoLanguageId: "java",
        },
      });
    }

    // Create or get track
    const existingTrack = await ctx.db
      .query("tracks")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "java-fundamentals")
      )
      .first();

    let trackId;
    if (existingTrack) {
      trackId = existingTrack._id;
    } else {
      trackId = await ctx.db.insert("tracks", {
        languageId,
        slug: "java-fundamentals",
        title: "Java Fundamentals",
        description: "Learn the basics of Java programming language",
        level: "beginner",
        order: 1,
      });
    }

    // Create or get module
    const existingModule = await ctx.db
      .query("modules")
      .withIndex("by_track_slug", (q) =>
        q.eq("trackId", trackId).eq("slug", "basics")
      )
      .first();

    let moduleId;
    if (existingModule) {
      moduleId = existingModule._id;
    } else {
      moduleId = await ctx.db.insert("modules", {
        trackId,
        slug: "basics",
        title: "Basics",
        description: "Introduction to Java variables, types, and basic concepts",
        order: 1,
      });
    }

    // Create lesson: Variables & Types
    const existingLesson = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "variables-and-types")
      )
      .first();

    if (!existingLesson) {
      const lessonContent = `# Variables & Types in Java

Java is a strongly typed language, meaning every variable must have a declared type.

## Primitive Types

Java has eight primitive types:

- \`byte\`: 8-bit integer (-128 to 127)
- \`short\`: 16-bit integer (-32,768 to 32,767)
- \`int\`: 32-bit integer (-2,147,483,648 to 2,147,483,647)
- \`long\`: 64-bit integer
- \`float\`: Single-precision 32-bit floating point
- \`double\`: Double-precision 64-bit floating point
- \`boolean\`: true or false
- \`char\`: Single 16-bit Unicode character

### Example

\`\`\`java
int age = 25;
double price = 19.99;
boolean isStudent = true;
char grade = 'A';
long distance = 1000000000L;
float pi = 3.14f;
\`\`\`

## String Type

The \`String\` class is used for text:

\`\`\`java
String greeting = "Hello, World!";
String name = "Alice";
\`\`\`

## Type Inference (Java 10+)

Java 10 introduced \`var\` for local variable type inference:

\`\`\`java
var message = "Hello";  // Compiler infers String
var count = 42;         // Compiler infers int
\`\`\`

## Constants

Use \`final\` keyword for constants:

\`\`\`java
final int MAX_SCORE = 100;
final double PI = 3.14159;
\`\`\`
`;

      await ctx.db.insert("curriculumItems", {
        moduleId,
        languageId,
        kind: "lesson",
        slug: "variables-and-types",
        title: "Variables & Types",
        order: 1,
        content: lessonContent,
      });
    }

    // Create test suite for challenge
    const existingTestSuite = await ctx.db
      .query("testSuites")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "add-two-numbers")
      )
      .first();

    let testSuiteId;
    if (existingTestSuite) {
      testSuiteId = existingTestSuite._id;
    } else {
      const testSuiteDefinition = {
        type: "java",
        entrypoint: "Solution",
        method: "add",
        signature: "static int add(int a, int b)",
        tests: [
          { input: [1, 2], output: 3 },
          { input: [-5, 7], output: 2 },
          { input: [0, 0], output: 0 },
        ],
      };

      testSuiteId = await ctx.db.insert("testSuites", {
        languageId,
        slug: "add-two-numbers",
        title: "Add Two Numbers (Public Tests)",
        definition: testSuiteDefinition,
      });
    }

    // Create challenge: Add Two Numbers
    const existingChallenge = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "add-two-numbers")
      )
      .first();

    if (!existingChallenge) {
      const starterCode = `public class Solution {
  public static int add(int a, int b) {
    // TODO: Implement this method
    return 0;
  }
}`;

      // Validate test suite belongs to the same language
      await validateTestSuiteLanguage(
        (id) => ctx.db.get(id),
        testSuiteId,
        languageId,
        "curriculum item 'Add Two Numbers'"
      );

      await ctx.db.insert("curriculumItems", {
        moduleId,
        languageId,
        kind: "challenge",
        slug: "add-two-numbers",
        title: "Add Two Numbers",
        order: 2,
        prompt:
          "Implement the \`add\` method that takes two integers and returns their sum.",
        starterCode,
        testSuiteId,
      });
    }

    // Create test suite for Todo CLI project
    const existingTodoTestSuite = await ctx.db
      .query("testSuites")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "todo-cli")
      )
      .first();

    let todoTestSuiteId;
    if (existingTodoTestSuite) {
      todoTestSuiteId = existingTodoTestSuite._id;
    } else {
      const todoTestSuiteDefinition = {
        type: "java",
        entrypoint: "TodoList",
        method: "addTask",
        signature: "static void addTask(String task)",
        tests: [
          { input: ["Buy groceries"], output: null },
          { input: ["Walk the dog"], output: null },
        ],
      };

      todoTestSuiteId = await ctx.db.insert("testSuites", {
        languageId,
        slug: "todo-cli",
        title: "Todo CLI - Public Tests",
        definition: todoTestSuiteDefinition,
      });
    }

    // Create Todo CLI project
    const existingTodoProject = await ctx.db
      .query("projects")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "todo-cli")
      )
      .first();

    if (!existingTodoProject) {
      const todoInstructions = `# Todo CLI Project

Build a simple console-based todo list application in Java.

## Requirements

Your application should support:
1. Adding tasks to the list
2. Listing all tasks
3. Marking tasks as completed
4. Deleting tasks

## Implementation

You have two main files:
- \`TodoList.java\`: The main class with task management methods
- \`Main.java\`: The console interface for user interaction

## Getting Started

1. The \`TodoList\` class should store tasks and provide methods to manipulate them
2. The \`Main\` class should read user input and call appropriate methods
3. Test your code by running it and checking the output

## Tips

- Use an \`ArrayList<String>\` to store tasks
- Use \`Scanner\` for reading user input
- Handle edge cases like empty lists, invalid inputs
`;

      const initialFiles = [
        {
          path: "TodoList.java",
          content: `import java.util.ArrayList;

public class TodoList {
    private ArrayList<String> tasks;
    private ArrayList<Boolean> completed;

    public TodoList() {
        tasks = new ArrayList<>();
        completed = new ArrayList<>();
    }

    public void addTask(String task) {
        if (task != null && !task.trim().isEmpty()) {
            tasks.add(task);
            completed.add(false);
            System.out.println("Added: " + task);
        }
    }

    public void listTasks() {
        if (tasks.isEmpty()) {
            System.out.println("No tasks yet!");
        } else {
            System.out.println("\\nYour Tasks:");
            for (int i = 0; i < tasks.size(); i++) {
                String status = completed.get(i) ? "[✓]" : "[ ]";
                System.out.println((i + 1) + ". " + status + " " + tasks.get(i));
            }
        }
    }

    public void markCompleted(int index) {
        if (index >= 1 && index <= tasks.size()) {
            completed.set(index - 1, true);
            System.out.println("Marked as completed: " + tasks.get(index - 1));
        } else {
            System.out.println("Invalid task number!");
        }
    }

    public void deleteTask(int index) {
        if (index >= 1 && index <= tasks.size()) {
            String deletedTask = tasks.remove(index - 1);
            completed.remove(index - 1);
            System.out.println("Deleted: " + deletedTask);
        } else {
            System.out.println("Invalid task number!");
        }
    }

    public int getTaskCount() {
        return tasks.size();
    }
}
`,
        },
        {
          path: "Main.java",
          content: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        TodoList todoList = new TodoList();
        Scanner scanner = new Scanner(System.in);
        boolean running = true;

        System.out.println("=== Todo CLI ===");
        System.out.println("Commands: add, list, done, delete, exit");

        while (running) {
            System.out.print("\\n> ");
            String input = scanner.nextLine().trim();

            if (input.isEmpty()) {
                continue;
            }

            String[] parts = input.split("\\s+", 2);
            String command = parts[0].toLowerCase();
            String argument = parts.length > 1 ? parts[1] : "";

            switch (command) {
                case "add":
                    if (!argument.isEmpty()) {
                        todoList.addTask(argument);
                    } else {
                        System.out.println("Usage: add <task>");
                    }
                    break;

                case "list":
                    todoList.listTasks();
                    break;

                case "done":
                    try {
                        int index = Integer.parseInt(argument);
                        todoList.markCompleted(index);
                    } catch (NumberFormatException e) {
                        System.out.println("Usage: done <task number>");
                    }
                    break;

                case "delete":
                    try {
                        int index = Integer.parseInt(argument);
                        todoList.deleteTask(index);
                    } catch (NumberFormatException e) {
                        System.out.println("Usage: delete <task number>");
                    }
                    break;

                case "exit":
                    running = false;
                    System.out.println("Goodbye!");
                    break;

                default:
                    System.out.println("Unknown command: " + command);
                    System.out.println("Available: add, list, done, delete, exit");
            }
        }

        scanner.close();
    }
}
`,
        },
      ];

      const todoRubric = [
        { id: "1", text: "Add tasks to the list" },
        { id: "2", text: "List all tasks" },
        { id: "3", text: "Mark tasks as completed" },
        { id: "4", text: "Delete tasks" },
        { id: "5", text: "Handle edge cases (empty input, invalid numbers)" },
      ];

      // Validate test suite belongs to the same language
      await validateTestSuiteLanguage(
        (id) => ctx.db.get(id),
        todoTestSuiteId,
        languageId,
        "project 'Todo CLI'"
      );

      await ctx.db.insert("projects", {
        languageId,
        slug: "todo-cli",
        title: "Todo CLI",
        description: "Build a simple console-based todo list application",
        instructions: todoInstructions,
        initialFiles,
        rubric: todoRubric,
        testSuiteId: todoTestSuiteId,
        order: 1,
      });
    }

    // ============================================
    // PYTHON CONTENT
    // ============================================

    // Create or get Python language
    const existingPythonLanguage = await ctx.db
      .query("languages")
      .withIndex("by_slug", (q) => q.eq("slug", "python"))
      .first();

    let pythonLanguageId;
    if (existingPythonLanguage) {
      pythonLanguageId = existingPythonLanguage._id;
    } else {
      pythonLanguageId = await ctx.db.insert("languages", {
        slug: "python",
        name: "Python",
        editorConfig: {
          monacoLanguageId: "python",
        },
      });
    }

    // Create or get Python track
    const existingPythonTrack = await ctx.db
      .query("tracks")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", pythonLanguageId).eq("slug", "python-fundamentals")
      )
      .first();

    let pythonTrackId;
    if (existingPythonTrack) {
      pythonTrackId = existingPythonTrack._id;
    } else {
      pythonTrackId = await ctx.db.insert("tracks", {
        languageId: pythonLanguageId,
        slug: "python-fundamentals",
        title: "Python Fundamentals",
        description: "Learn the basics of Python programming language",
        level: "beginner",
        order: 1,
      });
    }

    // Create or get Python module
    const existingPythonModule = await ctx.db
      .query("modules")
      .withIndex("by_track_slug", (q) =>
        q.eq("trackId", pythonTrackId).eq("slug", "basics")
      )
      .first();

    let pythonModuleId;
    if (existingPythonModule) {
      pythonModuleId = existingPythonModule._id;
    } else {
      pythonModuleId = await ctx.db.insert("modules", {
        trackId: pythonTrackId,
        slug: "basics",
        title: "Basics",
        description: "Introduction to Python variables, types, and basic concepts",
        order: 1,
      });
    }

    // Create Python lesson: Variables & Types
    const existingPythonLesson = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", pythonLanguageId).eq("slug", "variables-and-types")
      )
      .first();

    if (!existingPythonLesson) {
      const pythonLessonContent = `# Variables & Types in Python

Python is a dynamically typed language, meaning variables do not require explicit type declarations.

## Basic Types

Python has several built-in data types:

- \`int\`: Integer numbers (e.g., \`42\`, \`-10\`)
- \`float\`: Floating-point numbers (e.g., \`3.14\`, \`-0.001\`)
- \`str\`: Text strings (e.g., \`"Hello"\`, \`'world'\`)
- \`bool\`: Boolean values \`True\` or \`False\`
- \`None\`: Represents absence of value

### Example

\`\`\`python
age = 25
price = 19.99
is_student = True
name = "Alice"
\`\`\`

## Type Conversion

You can convert between types using built-in functions:

\`\`\`python
x = int("123")     # 123
y = float("3.14")  # 3.14
s = str(42)        # "42"
\`\`\`

## Constants

Python doesn't have true constants, but by convention, uppercase names indicate constants:

\`\`\`python
MAX_SCORE = 100
PI = 3.14159
\`\`\`

## Dynamic Typing

You can reassign variables with different types:

\`\`\`python
x = 10        # x is int
x = "hello"   # x is now str
\`\`\`
`;

      await ctx.db.insert("curriculumItems", {
        moduleId: pythonModuleId,
        languageId: pythonLanguageId,
        kind: "lesson",
        slug: "variables-and-types",
        title: "Variables & Types",
        order: 1,
        content: pythonLessonContent,
      });
    }

    // Create Python test suite for add-two-numbers challenge
    const existingPythonTestSuite = await ctx.db
      .query("testSuites")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", pythonLanguageId).eq("slug", "add-two-numbers")
      )
      .first();

    let pythonTestSuiteId;
    if (existingPythonTestSuite) {
      pythonTestSuiteId = existingPythonTestSuite._id;
    } else {
      const pythonTestSuiteDefinition = {
        type: "python",
        entrypoint: "solution.py",
        function: "add",
        tests: [
          { input: [1, 2], output: 3 },
          { input: [-5, 7], output: 2 },
          { input: [0, 0], output: 0 },
        ],
      };

      pythonTestSuiteId = await ctx.db.insert("testSuites", {
        languageId: pythonLanguageId,
        slug: "add-two-numbers",
        title: "Add Two Numbers (Public Tests)",
        definition: pythonTestSuiteDefinition,
      });
    }

    // Create Python challenge: Add Two Numbers
    const existingPythonChallenge = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", pythonLanguageId).eq("slug", "add-two-numbers")
      )
      .first();

    if (!existingPythonChallenge) {
      const pythonStarterCode = `def add(a: int, b: int) -> int:
    # TODO: Implement this function
    return 0
`;

      // Validate test suite belongs to the same language
      await validateTestSuiteLanguage(
        (id) => ctx.db.get(id),
        pythonTestSuiteId,
        pythonLanguageId,
        "curriculum item 'Add Two Numbers (Python)'"
      );

      await ctx.db.insert("curriculumItems", {
        moduleId: pythonModuleId,
        languageId: pythonLanguageId,
        kind: "challenge",
        slug: "add-two-numbers",
        title: "Add Two Numbers",
        order: 2,
        prompt:
          "Implement the \`add\` function that takes two integers and returns their sum.",
        starterCode: pythonStarterCode,
        testSuiteId: pythonTestSuiteId,
      });
    }

    // Create Python test suite for Todo CLI project
    const existingPythonTodoTestSuite = await ctx.db
      .query("testSuites")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", pythonLanguageId).eq("slug", "todo-cli-py")
      )
      .first();

    let pythonTodoTestSuiteId;
    if (existingPythonTodoTestSuite) {
      pythonTodoTestSuiteId = existingPythonTodoTestSuite._id;
    } else {
      const pythonTodoTestSuiteDefinition = {
        type: "python",
        entrypoint: "solution.py",
        function: "add_task",
        tests: [
          { input: ["Buy groceries"], output: null },
          { input: ["Walk the dog"], output: null },
        ],
      };

      pythonTodoTestSuiteId = await ctx.db.insert("testSuites", {
        languageId: pythonLanguageId,
        slug: "todo-cli-py",
        title: "Todo CLI (Python) - Public Tests",
        definition: pythonTodoTestSuiteDefinition,
      });
    }

    // Create Python Todo CLI project
    const existingPythonTodoProject = await ctx.db
      .query("projects")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", pythonLanguageId).eq("slug", "todo-cli-py")
      )
      .first();

    if (!existingPythonTodoProject) {
      const pythonTodoInstructions = `# Todo CLI Project (Python)

Build a simple console-based todo list application in Python.

## Requirements

Your application should support:
1. Adding tasks to the list
2. Listing all tasks
3. Marking tasks as completed
4. Deleting tasks

## Implementation

You have two main files:
- \`solution.py\`: Contains the TodoList class with task management methods
- \`main.py\`: The console interface for user interaction

## Getting Started

1. The \`TodoList\` class should store tasks and provide methods to manipulate them
2. The \`main.py\` should read user input and call appropriate methods
3. Test your code by running \`python main.py\` and checking the output

## Tips

- Use a \`list\` to store tasks
- Use \`input()\` for reading user input
- Handle edge cases like empty lists, invalid inputs
- You can use a separate list to track completion status
`;

      const pythonInitialFiles = [
        {
          path: "solution.py",
          content: `class TodoList:
    def __init__(self):
        self.tasks = []
        self.completed = []

    def add_task(self, task: str) -> None:
        """Add a new task to the list."""
        if task and task.strip():
            self.tasks.append(task)
            self.completed.append(False)
            print(f"Added: {task}")

    def list_tasks(self) -> None:
        """Display all tasks with their status."""
        if not self.tasks:
            print("No tasks yet!")
        else:
            print("\\nYour Tasks:")
            for i in range(len(self.tasks)):
                status = "[✓]" if self.completed[i] else "[ ]"
                print(f"{i + 1}. {status} {self.tasks[i]}")

    def mark_completed(self, index: int) -> None:
        """Mark a task as completed by its 1-based index."""
        if 1 <= index <= len(self.tasks):
            self.completed[index - 1] = True
            print(f"Marked as completed: {self.tasks[index - 1]}")
        else:
            print("Invalid task number!")

    def delete_task(self, index: int) -> None:
        """Delete a task by its 1-based index."""
        if 1 <= index <= len(self.tasks):
            deleted_task = self.tasks.pop(index - 1)
            self.completed.pop(index - 1)
            print(f"Deleted: {deleted_task}")
        else:
            print("Invalid task number!")
`,
        },
        {
          path: "main.py",
          content: `from solution import TodoList

def main():
    todo_list = TodoList()
    running = True

    print("=== Todo CLI ===")
    print("Commands: add, list, done, delete, exit")

    while running:
        try:
            user_input = input("\\n> ").strip()
        except EOFError:
            break

        if not user_input:
            continue

        parts = user_input.split(maxsplit=1)
        command = parts[0].lower()
        argument = parts[1] if len(parts) > 1 else ""

        if command == "add":
            if argument:
                todo_list.add_task(argument)
            else:
                print("Usage: add <task>")

        elif command == "list":
            todo_list.list_tasks()

        elif command == "done":
            if argument:
                try:
                    index = int(argument)
                    todo_list.mark_completed(index)
                except ValueError:
                    print("Usage: done <task number>")
            else:
                print("Usage: done <task number>")

        elif command == "delete":
            if argument:
                try:
                    index = int(argument)
                    todo_list.delete_task(index)
                except ValueError:
                    print("Usage: delete <task number>")
            else:
                print("Usage: delete <task number>")

        elif command == "exit":
            running = False
            print("Goodbye!")

        else:
            print(f"Unknown command: {command}")
            print("Available: add, list, done, delete, exit")

if __name__ == "__main__":
    main()
`,
        },
      ];

      const pythonTodoRubric = [
        { id: "1", text: "Add tasks to the list" },
        { id: "2", text: "List all tasks" },
        { id: "3", text: "Mark tasks as completed" },
        { id: "4", text: "Delete tasks" },
        { id: "5", text: "Handle edge cases (empty input, invalid numbers)" },
      ];

      // Validate test suite belongs to the same language
      await validateTestSuiteLanguage(
        (id) => ctx.db.get(id),
        pythonTodoTestSuiteId,
        pythonLanguageId,
        "project 'Todo CLI (Python)'"
      );

      await ctx.db.insert("projects", {
        languageId: pythonLanguageId,
        slug: "todo-cli-py",
        title: "Todo CLI (Python)",
        description: "Build a simple console-based todo list application in Python",
        instructions: pythonTodoInstructions,
        initialFiles: pythonInitialFiles,
        rubric: pythonTodoRubric,
        testSuiteId: pythonTodoTestSuiteId,
        order: 1,
      });
    }

    return {
      success: true,
      message: "Seed completed successfully",
    };
  },
});
