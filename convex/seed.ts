import { internalMutation } from "./_generated/server";
import { validateTestSuiteLanguage } from "./lib/validation";

 export const seed = internalMutation({
  handler: async (ctx) => {
    // Helper constant for debug exercises
    const hintsPlaceholder = "Click hint buttons below to reveal them one at a time. Start with Level 1 for a subtle hint.";

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

    // Create or get module: Getting Started (Module 1)
    const existingGettingStartedModule = await ctx.db
      .query("modules")
      .withIndex("by_track_slug", (q) =>
        q.eq("trackId", trackId).eq("slug", "getting-started")
      )
      .first();

    let gettingStartedModuleId;
    if (existingGettingStartedModule) {
      gettingStartedModuleId = existingGettingStartedModule._id;
    } else {
      gettingStartedModuleId = await ctx.db.insert("modules", {
        trackId,
        slug: "getting-started",
        title: "Getting Started",
        description: "Introduction to programming and Java setup",
        order: 1,
        estimatedHours: 4,
        skillTags: ["setup", "first-program", "output"],
      });
    }

    // Create or get module: Variables & Data Types (Module 2)
    const existingVariablesModule = await ctx.db
      .query("modules")
      .withIndex("by_track_slug", (q) =>
        q.eq("trackId", trackId).eq("slug", "variables-and-types")
      )
      .first();

    let variablesModuleId;
    if (existingVariablesModule) {
      variablesModuleId = existingVariablesModule._id;
    } else {
      variablesModuleId = await ctx.db.insert("modules", {
        trackId,
        slug: "variables-and-types",
        title: "Variables & Data Types",
        description: "Understanding Java variables, primitive types, and type conversions",
        order: 2,
        estimatedHours: 5,
        skillTags: ["variables", "types", "casting", "strings"],
      });
    }

    // Create or get module: Basics (Module 3)
    const existingBasicsModule = await ctx.db
      .query("modules")
      .withIndex("by_track_slug", (q) =>
        q.eq("trackId", trackId).eq("slug", "basics")
      )
      .first();

    let basicsModuleId;
    if (existingBasicsModule) {
      basicsModuleId = existingBasicsModule._id;
    } else {
      basicsModuleId = await ctx.db.insert("modules", {
        trackId,
        slug: "basics",
        title: "Basics",
        description: "Introduction to Java variables, types, and basic concepts",
        order: 3,
        estimatedHours: 4,
        skillTags: ["operators", "precedence", "logic"],
      });
    }

    // ============================================
    // GETTING STARTED MODULE CONTENT
    // ============================================

    // Lesson 1.1: What is Programming & Java Overview
    const existingProgrammingOverviewLesson = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "programming-overview")
      )
      .first();

    if (!existingProgrammingOverviewLesson) {
      const programmingOverviewContent = `# What is Programming & Java Overview

## What You Will Learn

By the end of this lesson, you will be able to:
- Explain what programming is in plain language
- Describe why Java is still widely used in modern software
- Distinguish between JDK, JRE, and JVM
- Identify realistic beginner expectations for learning Java

## What is Programming?

Programming is the process of creating instructions for computers to follow. Just like a recipe tells a chef how to cook a dish, code tells a computer how to perform tasks.

### Why Programming Matters

- **Solves problems**: Automate repetitive tasks and solve complex problems
- **Builds products**: Create websites, apps, games, and software systems
- **Drives innovation**: Powers AI, space exploration, medical research, and more
- **Career opportunities**: High demand for skilled programmers across industries

## Brief History of Java

Java was created by **James Gosling** at Sun Microsystems in **1995**. It was originally called "Oak" but later renamed to Java after the coffee. In 2010, Oracle Corporation acquired Sun Microsystems and now maintains Java.

Key milestones:
- **1995**: Java 1.0 released
- **2004**: Java 5 introduced major features (generics, annotations)
- **2014**: Java 8 with lambda expressions and streams
- **2017**: Java 9 introduced the module system
- **2021**: Java 17 LTS (Long-Term Support)
- **2023**: Java 21 LTS with pattern matching and virtual threads

## Java's Key Features

### Platform Independent (Write Once, Run Anywhere)

Java code compiles to **bytecode**, which runs on any device with a Java Virtual Machine (JVM). This means you can write code on Windows and run it on Mac, Linux, or embedded devices without modification.

### Object-Oriented Programming (OOP)

Java is built on OOP principles:
- **Classes**: Blueprints for creating objects
- **Objects**: Instances of classes with state and behavior
- **Encapsulation**: Bundling data and methods together
- **Inheritance**: Reusing code through class hierarchy
- **Polymorphism**: Objects can take many forms

### Robust and Secure

- **Strong type checking**: Catches errors at compile time
- **Garbage collection**: Automatic memory management prevents memory leaks
- **No pointers**: Eliminates common memory-related bugs
- **Security features**: Bytecode verification, sandbox environment for applets

## Where Java is Used

| Domain | Examples |
|--------|----------|
| **Enterprise** | Banking systems, e-commerce platforms, CRM software |
| **Android** | Millions of Android apps (though Kotlin is now preferred) |
| **Big Data** | Apache Hadoop, Apache Spark, Flink |
| **Web Backend** | Spring Boot, Jakarta EE, microservices |
| **Scientific** | Weather prediction, genome analysis |
| **Embedded** | Smart cards, IoT devices |

## Java Ecosystem: JDK, JRE, and JVM

Understanding the three main components:

1. **JDK (Java Development Kit)** - Development tools + JRE + compiler
2. **JRE (Java Runtime Environment)** - JVM + libraries + utilities  
3. **JVM (Java Virtual Machine)** - Executes Java bytecode

### JDK (Java Development Kit)
- Complete development environment
- Includes compiler (javac), debugger, and other tools
- Needed to **write** and **compile** Java programs
- Download: [Oracle JDK](https://www.oracle.com/java/technologies/downloads/) or [OpenJDK](https://openjdk.org/)

### JRE (Java Runtime Environment)
- Runtime environment for running Java applications
- Includes JVM and Java libraries
- Historically distributed separately, but now usually used via a full JDK install
- For this course, install a JDK so you have both runtime + compiler tools

### JVM (Java Virtual Machine)
- Executes Java bytecode
- Provides platform independence
- Performs memory management (garbage collection)
- Optimizes code through Just-In-Time (JIT) compilation

## Why Learn Java in 2025?

Despite being around for decades, Java remains one of the most popular programming languages:

- **Stable and mature**: Decades of development mean it's reliable
- **Massive ecosystem**: Huge library ecosystem and community support
- **Enterprise standard**: Most large companies use Java for backend systems
- **Active development**: Regular updates with new features (Java 21+)
- **Good career prospects**: Consistent demand for Java developers
- **Foundation for other languages**: Learning Java makes it easier to pick up C#, Kotlin, and other JVM languages

## Prerequisites

**Good news: You don't need any prior programming experience!**

To succeed in this course, you'll need:
- Basic computer literacy (using files, folders, and applications)
- A computer with internet access
- Patience and willingness to experiment
- About 10-15 hours per week for coursework

### Recommended Setup

- **Operating System**: Windows, macOS, or Linux all work well
- **Text Editor/IDE**: We'll set this up in the next lesson
- **Java Version**: JDK 17 or 21 (LTS versions are recommended)

## Common Pitfalls

- ❌ Thinking you need to memorize everything immediately
- ✅ Focus on understanding concepts and look up details as needed

- ❌ Getting frustrated when things don't work the first time
- ✅ Debugging is a normal part of programming—each error teaches you something

- ❌ Skipping the basics to "get to the cool stuff"
- ✅ The fundamentals are the foundation for everything else

## Try It Yourself

Before moving on, let's think about programming:

1. **Think of a daily task** you do (e.g., making coffee, checking email)
2. **Break it down** into 5-10 specific steps
3. **Write them down** in order

This is essentially what programming does—breaking down complex tasks into simple, executable steps!

## What's Next?

In the next lesson, we'll set up your development environment so you can start writing and running Java code.
`;

      await ctx.db.insert("curriculumItems", {
        moduleId: gettingStartedModuleId,
        languageId,
        kind: "lesson",
        slug: "programming-overview",
        title: "What is Programming & Java Overview",
        order: 1,
        content: programmingOverviewContent,
      });
    }

    // Lesson 1.2: Setting Up Development Environment
    const existingSetupEnvironmentLesson = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "setup-environment")
      )
      .first();

    if (!existingSetupEnvironmentLesson) {
      const setupEnvironmentContent = `# Setting Up Development Environment

## Installing JDK (Java Development Kit)

### Choosing a JDK Version

For this course, we recommend **JDK 17** or **JDK 21** (both are LTS - Long-Term Support versions). They're stable and will be supported for years.

### Installation by Operating System

#### Windows

1. Download JDK from [Oracle](https://www.oracle.com/java/technologies/downloads/) or adoptium.net
2. Run the installer (.exe file)
3. Follow the installation wizard (use default settings)
4. Verify installation by opening Command Prompt and typing:
   \`\`\`bash
   java -version
   javac -version
   \`\`\`

#### macOS

1. Download JDK from [Oracle](https://www.oracle.com/java/technologies/downloads/) or adoptium.net
2. Open the .dmg file and run the installer
3. Follow the on-screen instructions
4. Verify installation by opening Terminal and typing:
   \`\`\`bash
   java -version
   javac -version
   \`\`\`

#### Linux (Ubuntu/Debian)

\`\`\`bash
# Update package list
sudo apt update

# Install OpenJDK 17
sudo apt install openjdk-17-jdk

# Verify installation
java -version
javac -version
\`\`\`

### Setting Environment Variables

#### Windows

1. Search for "Edit the system environment variables"
2. Click "Environment Variables"
3. Under "System variables", find \`JAVA_HOME\`:
   - If it exists, click Edit
   - If not, click New
4. Set the value to your JDK path (e.g., \`C:\\\\Program Files\\\\Java\\\\jdk-17\`)
5. Edit the \`Path\` variable and add \`%JAVA_HOME%\\\\bin\`

#### macOS and Linux

Add these lines to your shell configuration (\`~/.bashrc\` or \`~/.zshrc\`):

\`\`\`bash
export JAVA_HOME=/path/to/jdk
export PATH=$JAVA_HOME/bin:$PATH
\`\`\`

Then reload your configuration:

\`\`\`bash
source ~/.bashrc  # or source ~/.zshrc
\`\`\`

## Choosing an IDE (Integrated Development Environment)

While you can write Java in any text editor, an IDE makes development much easier.

### IntelliJ IDEA (Recommended)

**Pros**: Best Java support, smart code completion, powerful refactoring
**Cons**: Heavier resource usage

Download: [jetbrains.com/idea](https://www.jetbrains.com/idea/)

1. Download the Community Edition (free)
2. Install and launch IntelliJ
3. Select "New Project" → "Java"
4. Choose your JDK location
5. Create your first project

### Eclipse

**Pros**: Free, open-source, widely used in enterprise
**Cons**: Slightly dated interface

Download: [eclipse.org](https://www.eclipse.org/downloads/)

### VS Code with Java Extension Pack

**Pros**: Lightweight, customizable, many extensions
**Cons**: Requires more setup for full Java features

Setup:
1. Download [VS Code](https://code.visualstudio.com/)
2. Install the "Extension Pack for Java" from the Extensions panel
3. VS Code will prompt you to install a JDK if needed

## Command-Line Development

Before diving into an IDE, let's understand how Java works from the command line.

### Your First Project Structure

Create a folder for your project:

\`\`\`bash
mkdir java-course
cd java-course
mkdir src
\`\`\`

### Creating a Java File

Create a file named \`HelloWorld.java\` in the \`src\` folder:

\`\`\`java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
\`\`\`

### Compiling and Running

From the project root directory:

\`\`\`bash
# Compile (creates HelloWorld.class)
javac src/HelloWorld.java

# Run
java -cp src HelloWorld
\`\`\`

**Important notes:**
- The class name must match the filename (case-sensitive)
- \`javac\` compiles source code (.java) to bytecode (.class)
- \`java\` runs the compiled bytecode

## Using the Convex Platform for Exercises

Throughout this course, you'll use the built-in code editor to complete exercises.

### How It Works

1. **Read the lesson** to learn the concept
2. **Try the example** in the code editor
3. **Run the code** to see the output
4. **Complete exercises** to practice what you learned
5. **Run tests** to verify your solution

### Benefits of Using Convex

- No setup required: Everything runs in the browser
- Instant feedback: See output immediately
- Integrated tests: Verify your code works correctly
- Progress tracking: Keep track of your learning journey

## Common Pitfalls

### Installation Issues

❌ **Problem**: \`java\` command not found after installation

✅ **Solution**: Check that JAVA_HOME and PATH are set correctly

### Version Conflicts

❌ **Problem**: Multiple Java versions installed, wrong one being used

✅ **Solution**: Use \`java -version\` to check, and update PATH if needed

### IDE Not Finding JDK

❌ **Problem**: IDE can't locate the Java installation

✅ **Solution**: In IDE settings, manually set the JDK path

## Try It Yourself

1. Install JDK on your machine
2. Set up environment variables (if needed)
3. Choose and install an IDE
4. Create a \`HelloWorld.java\` file
5. Compile and run it from the command line

## Quick Reference

| Command | Purpose |
|---------|---------|
| \`java -version\` | Check Java version |
| \`javac -version\` | Check compiler version |
| \`javac File.java\` | Compile a Java file |
| \`java ClassName\` | Run a compiled Java program |
| \`mkdir folder\` | Create a directory |
| \`cd folder\` | Change directory |

## What's Next?

Now that your environment is ready, let's write your first Java program!
`;

      await ctx.db.insert("curriculumItems", {
        moduleId: gettingStartedModuleId,
        languageId,
        kind: "lesson",
        slug: "setup-environment",
        title: "Setting Up Development Environment",
        order: 2,
        content: setupEnvironmentContent,
      });
    }

    // Lesson 1.3: Your First Java Program (Hello World)
    const existingHelloWorldLesson = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "hello-world")
      )
      .first();

    if (!existingHelloWorldLesson) {
      const helloWorldContent = `# Your First Java Program (Hello World)

## What You Will Learn

By the end of this lesson, you will be able to:
- Explain each part of a minimal Java program
- Write and run a valid \`main\` method
- Compile and execute Java from the command line
- Diagnose the most common first-program errors

## Basic Java Program Structure

Let's break down the classic "Hello World" program:

\`\`\`java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
\`\`\`

### Line by Line Explanation

\`\`\`java
public class HelloWorld {
\`\`\`
- \`public\`: Access modifier, means this class can be accessed from anywhere
- \`class\`: Keyword to declare a class
- \`HelloWorld\`: The class name (must match the filename)
- \`{ }\`: Braces define the scope of the class

\`\`\`java
    public static void main(String[] args) {
\`\`\`
- \`public\`: The method can be called from anywhere
- \`static\`: The method belongs to the class, not an instance
- \`void\`: The method doesn't return a value
- \`main\`: The method name—Java looks for this to start execution
- \`String[] args\`: An array of command-line arguments

**This is the entry point of any Java application!**

\`\`\`java
        System.out.println("Hello, World!");
\`\`\`
- \`System\`: A built-in class
- \`out\`: A static field representing standard output
- \`println\`: A method that prints text and moves to the next line

### Class Declaration Rules

1. **Filename must match class name** (case-sensitive)
   - File: \`HelloWorld.java\` → Class: \`HelloWorld\`
   - File: \`MyProgram.java\` → Class: \`MyProgram\`

2. **Use PascalCase** for class names (first letter of each word capitalized)

3. **One public class per file** (at most)

## The main() Method

The \`main\` method is where Java starts executing your program. It must have this exact signature:

\`\`\`java
public static void main(String[] args)
\`\`\`

### What Each Part Means

| Part | Meaning |
|------|---------|
| \`public\` | Accessible from anywhere |
| \`static\` | Can be called without creating an object |
| \`void\` | Returns nothing |
| \`main\` | The name Java looks for |
| \`String[] args\` | Command-line arguments |

### Alternative main() Signatures

These are also valid:

\`\`\`java
public static void main(String args[])        // Old style array declaration
public static void main(String... args)       // Varargs syntax
\`\`\`

## Printing Output

### System.out.println()

Prints text and adds a newline at the end:

\`\`\`java
System.out.println("Hello");
System.out.println("World");
\`\`\`

Output:
\`\`\`
Hello
World
\`\`\`

### System.out.print()

Prints text **without** adding a newline:

\`\`\`java
System.out.print("Hello ");
System.out.print("World!");
\`\`\`

Output:
\`\`\`
Hello World!
\`\`\`

### System.out.printf()

Formatted printing (like C's printf):

\`\`\`java
String name = "Alice";
int age = 25;
System.out.printf("Name: %s, Age: %d%n", name, age);
\`\`\`

Output:
\`\`\`
Name: Alice, Age: 25
\`\`\`

## Compiling and Running from Command Line

### Step 1: Create the File

Save this code in a file named \`HelloWorld.java\`:

\`\`\`java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
\`\`\`

### Step 2: Compile

\`\`\`bash
javac HelloWorld.java
\`\`\`

This creates a file called \`HelloWorld.class\` containing bytecode.

### Step 3: Run

\`\`\`bash
java HelloWorld
\`\`\`

**Note**: Don't include the .class extension when running!

### Output

\`\`\`
Hello, World!
\`\`\`

## Common Errors and How to Fix Them

### Error 1: Class name doesn't match filename

**Error**:
\`\`\`
HelloWorld.java:1: error: class HelloWorld is public, should be declared in a file named HelloWorld.java
public class HelloWorld {
\`\`\`

**Cause**: File is named \`hello.java\` but class is \`HelloWorld\`

**Fix**: Rename the file to \`HelloWorld.java\`

### Error 2: Missing semicolon

**Error**:
\`\`\`
HelloWorld.java:3: error: ';' expected
    System.out.println("Hello, World!")
\`\`\`

**Cause**: Every statement in Java must end with a semicolon

**Fix**: Add a semicolon at the end

\`\`\`java
System.out.println("Hello, World!");  // Add this semicolon
\`\`\`

### Error 3: Wrong main method signature

**Error**:
\`\`\`
Error: Main method not found in class HelloWorld, please define the main method as:
   public static void main(String[] args)
\`\`\`

**Cause**: The main method signature is incorrect

**Fix**: Ensure exact match:
\`\`\`java
public static void main(String[] args)
\`\`\`

### Error 4: Missing closing brace

**Error**:
\`\`\`
HelloWorld.java:5: error: reached end of file while parsing
}
\`\`\`

**Cause**: Missing a closing brace \`}\`

**Fix**: Count opening and closing braces—ensure they match

## Java Naming Conventions

Following naming conventions makes code readable and professional.

| Type | Convention | Examples |
|------|------------|----------|
| Classes | PascalCase | \`HelloWorld\`, \`StringCalculator\` |
| Methods | camelCase | \`calculateSum\`, \`printMessage\` |
| Variables | camelCase | \`firstName\`, \`totalCount\` |
| Constants | UPPER_SNAKE_CASE | \`MAX_SIZE\`, \`PI\` |
| Packages | lowercase | \`com.example.myapp\` |

### Why Naming Matters?

- ❌ Bad: \`int x\`, \`String s1\`, \`class c\`
- ✅ Good: \`int age\`, \`String firstName\`, \`class Calculator\`

## Comments in Java

Comments are ignored by the compiler—they're for human readers.

### Single-line Comments

Use \`//\` for comments on one line:

\`\`\`java
public class HelloWorld {
    public static void main(String[] args) {
        // This is a comment
        System.out.println("Hello, World!");  // This prints a message
    }
}
\`\`\`

### Multi-line Comments

Use \`/* */\` for comments spanning multiple lines:

\`\`\`java
/*
 * This is a multi-line comment.
 * It can span multiple lines.
 * Useful for documenting code.
 */
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
\`\`\`

### Javadoc Comments

Use \`/** */\` for documentation that can be extracted to HTML:

\`\`\`java
/**
 * This is a Javadoc comment.
 * It describes the class or method.
 * 
 * @author Your Name
 * @version 1.0
 */
public class HelloWorld {
    /**
     * The main method is the entry point of the program.
     * 
     * @param args Command-line arguments
     */
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
\`\`\`

## Common Pitfalls

### Forgetting the Public Class

❌ **Wrong**:
\`\`\`java
class HelloWorld {  // Missing public
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
\`\`\`

✅ **Right**:
\`\`\`java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
\`\`\`

### Using Wrong Print Method

❌ **Wrong** (no newline after each):
\`\`\`java
System.out.print("Hello");
System.out.print("World");
// Output: HelloWorld
\`\`\`

✅ **Right** (each on new line):
\`\`\`java
System.out.println("Hello");
System.out.println("World");
// Output:
// Hello
// World
\`\`\`

## Try It Yourself

### Exercise 1: Personal Greeting

Modify the Hello World program to greet you by name:

\`\`\`java
public class PersonalGreeting {
    public static void main(String[] args) {
        // Your code here
    }
}
\`\`\`

Expected output:
\`\`\`
Hello, Alice!
Welcome to Java programming.
\`\`\`

### Exercise 2: Pattern Printing

Create a program that prints a simple pattern:

\`\`\`java
public class PatternPrinter {
    public static void main(String[] args) {
        // Your code here
    }
}
\`\`\`

Expected output:
\`\`\`
*
**
***
****
*****
\`\`\`

## Quick Reference

| Code | Purpose |
|------|---------|
| \`class ClassName {}\` | Define a class |
| \`public static void main(String[] args) {}\` | Entry point |
| \`System.out.println()\` | Print with newline |
| \`System.out.print()\` | Print without newline |
| \`System.out.printf()\` | Formatted printing |
| \`// comment\` | Single-line comment |
| \`/* comment */\` | Multi-line comment |

## What's Next?

You've written and run your first Java program! Now let's practice fixing common errors in the next challenge.
`;

      await ctx.db.insert("curriculumItems", {
        moduleId: gettingStartedModuleId,
        languageId,
        kind: "lesson",
        slug: "hello-world",
        title: "Your First Java Program (Hello World)",
        order: 3,
        content: helloWorldContent,
      });
    }

    // Challenge 1.4: Fix Hello World (compilation errors)
    const existingFixHelloWorldChallenge = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "fix-hello-world")
      )
      .first();

    let fixHelloWorldTestSuiteId;
    const existingFixHelloWorldTestSuite = await ctx.db
      .query("testSuites")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "fix-hello-world")
      )
      .first();

    if (existingFixHelloWorldTestSuite) {
      fixHelloWorldTestSuiteId = existingFixHelloWorldTestSuite._id;
    } else {
      const fixHelloWorldTestSuiteDefinition = {
        type: "java",
        entrypoint: "HelloWorld",
        tests: [
          {
            name: "Missing semicolon test",
            check: "compilation",
            description: "The code should compile without errors. Check for missing semicolons.",
          },
          {
            name: "Class name test",
            check: "compilation",
            description: "The class name must match the filename exactly.",
          },
          {
            name: "Main method test",
            check: "compilation",
            description: "The main method must have the correct signature: public static void main(String[] args)",
          },
          {
            name: "String literal test",
            check: "compilation",
            description: "String literals must be properly quoted.",
          },
          {
            name: "Braces test",
            check: "compilation",
            description: "All opening braces must have corresponding closing braces.",
          },
        ],
      };

      fixHelloWorldTestSuiteId = await ctx.db.insert("testSuites", {
        languageId,
        slug: "fix-hello-world",
        title: "Fix Hello World - Public Tests",
        definition: fixHelloWorldTestSuiteDefinition,
      });
    }

    if (!existingFixHelloWorldChallenge) {
      const fixHelloWorldStarterCode = `public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!")
    }
}
// This code has compilation errors - fix them!
// Expected output: Hello, World!`;

      await validateTestSuiteLanguage(
        (id) => ctx.db.get(id),
        fixHelloWorldTestSuiteId,
        languageId,
        "curriculum item 'Fix Hello World'"
      );

      await ctx.db.insert("curriculumItems", {
        moduleId: gettingStartedModuleId,
        languageId,
        kind: "challenge",
        slug: "fix-hello-world",
        title: "Fix Compilation Errors in Hello World",
        order: 4,
        prompt: `Fix all the compilation errors in the provided Hello World program.

The program should compile successfully and print:
\`\`\`
Hello, World!
\`\`\`

Common errors to look for:
- Missing semicolons at the end of statements
- Class name mismatch with filename
- Missing or incorrect main method signature
- String literal issues (missing quotes)
- Missing closing braces

Hint: The code has exactly 1 compilation error - a missing semicolon on line 3.`,
        starterCode: fixHelloWorldStarterCode,
        testSuiteId: fixHelloWorldTestSuiteId,
      });
    }

    // Challenge 1.5: Debug Hello World (syntax errors)
    const existingDebugHelloWorldChallenge = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "debug-hello-world")
      )
      .first();

    let debugHelloWorldTestSuiteId;
    const existingDebugHelloWorldTestSuite = await ctx.db
      .query("testSuites")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "debug-hello-world")
      )
      .first();

    if (existingDebugHelloWorldTestSuite) {
      debugHelloWorldTestSuiteId = existingDebugHelloWorldTestSuite._id;
    } else {
      const debugHelloWorldTestSuiteDefinition = {
        type: "java",
        entrypoint: "HelloWorldDebug",
        tests: [
          {
            name: "Package declaration test",
            check: "compilation",
            description: "Package declarations should be at the top, before imports.",
          },
          {
            name: "Access modifier test",
            check: "compilation",
            description: "The class should have the correct access modifier (public).",
          },
          {
            name: "Import statement test",
            check: "compilation",
            description: "Import statements should use the correct syntax.",
          },
          {
            name: "Main method signature test",
            check: "compilation",
            description: "The main method must have the exact signature: public static void main(String[] args)",
          },
          {
            name: "Variable declaration test",
            check: "compilation",
            description: "Variable declarations should have correct types and syntax.",
          },
        ],
      };

      debugHelloWorldTestSuiteId = await ctx.db.insert("testSuites", {
        languageId,
        slug: "debug-hello-world",
        title: "Debug Hello World - Public Tests",
        definition: debugHelloWorldTestSuiteDefinition,
      });
    }

    if (!existingDebugHelloWorldChallenge) {
      const debugHelloWorldStarterCode = `import java.util.Scanner

public class HelloWorldDebug {
    public static void main(String args) {
        String message = "Hello, World!";
        Int count = 1;
        System.out.println(message);
    }
}
// This code has subtle syntax errors - debug them!
// Expected output: Hello, World!
//
// Hints:
// 1. Check the import statement - is it complete?
// 2. Check the main method signature - is it correct?
// 3. Check the variable types - 'Int' is not a valid Java type
// 4. Check for proper semicolons`;

      await validateTestSuiteLanguage(
        (id) => ctx.db.get(id),
        debugHelloWorldTestSuiteId,
        languageId,
        "curriculum item 'Debug Hello World'"
      );

      await ctx.db.insert("curriculumItems", {
        moduleId: gettingStartedModuleId,
        languageId,
        kind: "challenge",
        slug: "debug-hello-world",
        title: "Debug Hello World - Syntax Errors",
        order: 5,
        prompt: `Debug the provided code to fix all syntax errors.

The program should compile successfully and print:
\`\`\`
Hello, World!
\`\`\`

This exercise focuses on finding and fixing subtle syntax errors:
- Improper package or import statements
- Wrong access modifiers
- Incorrect import statements
- Malformed main method signature
- Mixed up variable declarations

The test will verify that your code compiles correctly without checking specific output.

Hint: There are 3 syntax errors to find:
1. Missing semicolon on import statement
2. Incorrect main method parameter type
3. Invalid type 'Int' (should be lowercase 'int')
`,
        starterCode: debugHelloWorldStarterCode,
        testSuiteId: debugHelloWorldTestSuiteId,
      });
    }

    // ============================================
    // CALCULATOR CLI PROJECT (Module 1)
    // ============================================

    // Project 1.6: Calculator CLI
    const existingCalculatorTestSuite = await ctx.db
      .query("testSuites")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "calculator-cli")
      )
      .first();

    let calculatorTestSuiteId;
    if (existingCalculatorTestSuite) {
      calculatorTestSuiteId = existingCalculatorTestSuite._id;
    } else {
      const calculatorTestSuiteDefinition = {
        type: "java",
        entrypoint: "Calculator",
        tests: [
          {
            method: "add",
            input: [5, 3],
            output: 8,
            description: "Add two positive numbers",
          },
          {
            method: "add",
            input: [-5, 10],
            output: 5,
            description: "Add negative and positive numbers",
          },
          {
            method: "subtract",
            input: [10, 3],
            output: 7,
            description: "Subtract two numbers",
          },
          {
            method: "multiply",
            input: [4, 5],
            output: 20,
            description: "Multiply two numbers",
          },
          {
            method: "divide",
            input: [10, 2],
            output: 5,
            description: "Divide two numbers",
          },
          {
            method: "divide",
            input: [10, 0],
            output: null,
            description: "Handle division by zero",
            exception: true,
          },
        ],
      };

      calculatorTestSuiteId = await ctx.db.insert("testSuites", {
        languageId,
        slug: "calculator-cli",
        title: "Calculator CLI - Public Tests",
        definition: calculatorTestSuiteDefinition,
      });
    }

    const existingCalculatorProject = await ctx.db
      .query("projects")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "calculator-cli")
      )
      .first();

    if (!existingCalculatorProject) {
      const calculatorInstructions = `# Calculator CLI Project

Build a command-line calculator that performs basic arithmetic operations.

## Project Overview

You will create a simple calculator that can add, subtract, multiply, and divide numbers. The calculator will run in a command-line interface and allow users to perform multiple operations before exiting.

## Requirements

Your calculator application must:

1. **Support four basic operations**: add, subtract, multiply, divide
2. **Handle division by zero gracefully**: Display an error message without crashing
3. **Allow multiple operations in one session**: User can keep calculating until they choose to exit
4. **Provide clear user prompts**: Guide the user through the interface
5. **Support an exit command**: Allow users to quit the calculator

## Project Structure

You will work with two main files:

### Calculator.java
Contains the Calculator class with arithmetic methods.

### Main.java
Contains the CLI interface that interacts with the user.

## Getting Started

1. Review the provided initial files
2. Implement the Calculator class methods
3. Complete the CLI interface in Main.java
4. Test your calculator with various inputs

## Implementation Details

### Calculator Class Requirements

Your \`Calculator\` class should include the following methods:

\`\`\`java
public class Calculator {
    /**
     * Adds two numbers.
     * 
     * @param a First number
     * @param b Second number
     * @return The sum of a and b
     */
    public double add(double a, double b) {
        // TODO: Implement
    }

    /**
     * Subtracts the second number from the first.
     * 
     * @param a First number
     * @param b Second number
     * @return The difference of a and b
     */
    public double subtract(double a, double b) {
        // TODO: Implement
    }

    /**
     * Multiplies two numbers.
     * 
     * @param a First number
     * @param b Second number
     * @return The product of a and b
     */
    public double multiply(double a, double b) {
        // TODO: Implement
    }

    /**
     * Divides the first number by the second.
     * Throws an exception if dividing by zero.
     * 
     * @param a First number
     * @param b Second number
     * @return The quotient of a and b
     * @throws ArithmeticException if b is zero
     */
    public double divide(double a, double b) throws ArithmeticException {
        // TODO: Implement
    }
}
\`\`\`

### Main Class Requirements

Your \`Main\` class should:

1. Create a \`Calculator\` instance
2. Create a \`Scanner\` to read user input
3. Display a welcome message and menu
4. Loop until the user chooses to exit
5. Handle user commands and display results

## User Interface Example

\`\`\`
=== Calculator CLI ===
Available operations: add, subtract, multiply, divide
Type 'exit' to quit

> add
Enter first number: 5
Enter second number: 3
Result: 8.0

> subtract
Enter first number: 10
Enter second number: 4
Result: 6.0

> divide
Enter first number: 10
Enter second number: 0
Error: Cannot divide by zero!

> exit
Goodbye!
\`\`\`

## Error Handling

1. **Division by zero**: Display a clear error message and continue
2. **Invalid numbers**: Handle non-numeric input gracefully
3. **Unknown commands**: Display available commands and continue

## Tips

- Use \`Scanner.nextDouble()\` or \`Scanner.nextDouble()\` to read numbers
- Use a \`switch\` statement or \`if-else\` to handle operations
- Use a \`while\` loop to keep the calculator running
- Use \`try-catch\` blocks for error handling
- Format output with \`String.format()\` or \`System.out.printf()\` for better display

## Testing Your Calculator

Test with these cases:
- Addition: 5 + 3 = 8
- Subtraction: 10 - 4 = 6
- Multiplication: 4 * 5 = 20
- Division: 10 / 2 = 5
- Division by zero: 10 / 0 → Error message
- Negative numbers: -5 + 10 = 5
- Decimal numbers: 3.5 * 2 = 7.0

## Rubric

Your project will be evaluated based on:

1. **Calculator class implementation** (25%)
   - All four methods correctly implemented
   - Proper return types and parameters
   - Handles division by zero with exception

2. **CLI interface** (25%)
   - Clear prompts and messages
   - Correctly parses user input
   - Displays results clearly

3. **Error handling** (25%)
   - Graceful handling of division by zero
   - Handles invalid user input
   - Prevents crashes

4. **Code quality** (25%)
   - Follows Java naming conventions
   - Includes Javadoc comments
   - Clean, readable code
   - Proper indentation and spacing
`;

      const calculatorInitialFiles = [
        {
          path: "Calculator.java",
          content: `/**
 * A simple calculator that performs basic arithmetic operations.
 */
public class Calculator {

    /**
     * Adds two numbers.
     * 
     * @param a First number
     * @param b Second number
     * @return The sum of a and b
     */
    public double add(double a, double b) {
        return a + b;
    }

    /**
     * Subtracts the second number from the first.
     * 
     * @param a First number
     * @param b Second number
     * @return The difference of a and b
     */
    public double subtract(double a, double b) {
        return a - b;
    }

    /**
     * Multiplies two numbers.
     * 
     * @param a First number
     * @param b Second number
     * @return The product of a and b
     */
    public double multiply(double a, double b) {
        return a * b;
    }

    /**
     * Divides the first number by the second.
     * Throws an exception if dividing by zero.
     * 
     * @param a First number
     * @param b Second number
     * @return The quotient of a and b
     * @throws ArithmeticException if b is zero
     */
    public double divide(double a, double b) throws ArithmeticException {
        if (b == 0) {
            throw new ArithmeticException("Cannot divide by zero");
        }
        return a / b;
    }
}
`,
        },
        {
          path: "Main.java",
          content: `import java.util.Scanner;

/**
 * Command-line interface for the Calculator class.
 * Provides an interactive menu for performing arithmetic operations.
 */
public class Main {
    public static void main(String[] args) {
        Calculator calculator = new Calculator();
        Scanner scanner = new Scanner(System.in);
        boolean running = true;

        System.out.println("=== Calculator CLI ===");
        System.out.println("Available operations: add, subtract, multiply, divide");
        System.out.println("Type 'exit' to quit\\n");

        while (running) {
            System.out.print("> ");
            String operation = scanner.nextLine().trim().toLowerCase();

            if (operation.equals("exit")) {
                running = false;
                System.out.println("Goodbye!");
                continue;
            }

            double num1, num2;

            try {
                System.out.print("Enter first number: ");
                num1 = scanner.nextDouble();
                System.out.print("Enter second number: ");
                num2 = scanner.nextDouble();
                scanner.nextLine(); // Consume newline
            } catch (Exception e) {
                System.out.println("Error: Invalid input. Please enter valid numbers.\\n");
                scanner.nextLine(); // Clear invalid input
                continue;
            }

            try {
                double result;
                switch (operation) {
                    case "add":
                        result = calculator.add(num1, num2);
                        break;
                    case "subtract":
                        result = calculator.subtract(num1, num2);
                        break;
                    case "multiply":
                        result = calculator.multiply(num1, num2);
                        break;
                    case "divide":
                        result = calculator.divide(num1, num2);
                        break;
                    default:
                        System.out.println("Error: Unknown operation. Use: add, subtract, multiply, divide\\n");
                        continue;
                }
                System.out.printf("Result: %.2f\\n\\n", result);
            } catch (ArithmeticException e) {
                System.out.println("Error: " + e.getMessage() + "\\n");
            }
        }

        scanner.close();
    }
}
`,
        },
      ];

      const calculatorRubric = [
        { id: "1", text: "Calculator class implements all four methods (add, subtract, multiply, divide)" },
        { id: "2", text: "CLI provides clear user prompts and displays results correctly" },
        { id: "3", text: "Division by zero is handled gracefully with an error message" },
        { id: "4", text: "Supports multiple operations in one session with exit command" },
        { id: "5", text: "Code follows Java naming conventions and includes Javadoc comments" },
        { id: "6", text: "Handles invalid user input (non-numeric values, unknown commands)" },
      ];

      await validateTestSuiteLanguage(
        (id) => ctx.db.get(id),
        calculatorTestSuiteId,
        languageId,
        "project 'Calculator CLI'"
      );

      await ctx.db.insert("projects", {
        languageId,
        slug: "calculator-cli",
        title: "Calculator CLI",
        description: "Build a command-line calculator that performs basic arithmetic operations",
        instructions: calculatorInstructions,
        initialFiles: calculatorInitialFiles,
        rubric: calculatorRubric,
        testSuiteId: calculatorTestSuiteId,
        order: 1,
      });
    }

    // ============================================
    // VARIABLES & DATA TYPES MODULE CONTENT
    // ============================================

    // Lesson 2.3: Variable Declaration & Naming
    const existingVariableNamingLesson = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "variable-declaration-naming")
      )
      .first();

    if (!existingVariableNamingLesson) {
      const variableNamingContent = `# Variable Declaration & Naming

Variables store data so you can reuse it later. In Java, you must declare a type and a name.

## Declaring Variables

\`\`\`java
int age = 21;
double price = 19.99;
boolean isMember = true;
char grade = 'A';
\`\`\`

### Declaration vs Initialization

\`\`\`java
int count;       // declaration
count = 10;      // initialization (assignment)
\`\`\`

Local variables **must** be initialized before use.

## Naming Rules

✅ **Valid names**:
- Must start with a letter, underscore, or $
- Can contain letters, digits, underscores, $
- Cannot be a keyword (e.g., \`class\`, \`int\`)

❌ **Invalid names**:
- \`2ndScore\` (starts with a digit)
- \`total-score\` (hyphen not allowed)
- \`class\` (reserved keyword)

## Naming Conventions (Java Style)

- Use **camelCase** for variables and methods
- Use **UPPER_SNAKE_CASE** for constants
- Make names descriptive

\`\`\`java
int numberOfStudents = 28;
double totalRevenue = 1520.75;
final int MAX_RETRIES = 3;
\`\`\`

## Default Values (Fields Only)

Instance variables and class fields get default values:

| Type | Default |
|------|---------|
| \`int\` | 0 |
| \`double\` | 0.0 |
| \`boolean\` | false |
| \`char\` | '\\u0000' |
| \`String\` | null |

Local variables do **not** get defaults:

\`\`\`java
public void demo() {
    int x; // not initialized
    // System.out.println(x); // Compilation error!
}
\`\`\`

## Quick Tips

- Keep names meaningful
- Avoid single-letter names (except \`i\`, \`j\` in loops)
- Use \`final\` when a value should not change

## What's Next?

Let's explore the primitive types and how to pick the right one.
`;

      await ctx.db.insert("curriculumItems", {
        moduleId: variablesModuleId,
        languageId,
        kind: "lesson",
        slug: "variable-declaration-naming",
        title: "Variable Declaration & Naming",
        order: 3,
        content: variableNamingContent,
      });
    }

    // Lesson 2.4: Primitive Types Deep Dive
    const existingPrimitiveTypesLesson = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "primitive-types-deep-dive")
      )
      .first();

    if (!existingPrimitiveTypesLesson) {
      const primitiveTypesContent = `# Primitive Types Deep Dive

Java has eight primitive types. Choosing the right one helps performance and clarity.

## Integer Types

| Type | Size | Range |
|------|------|-------|
| \`byte\` | 8-bit | -128 to 127 |
| \`short\` | 16-bit | -32,768 to 32,767 |
| \`int\` | 32-bit | -2,147,483,648 to 2,147,483,647 |
| \`long\` | 64-bit | Very large range |

\`\`\`java
int population = 1_200_000;
long distanceToSunKm = 149_600_000L;
\`\`\`

## Floating-Point Types

| Type | Size | Precision |
|------|------|-----------|
| \`float\` | 32-bit | ~7 decimal digits |
| \`double\` | 64-bit | ~15 decimal digits |

\`\`\`java
float pi = 3.14f;
double price = 19.99;
\`\`\`

Use \`double\` by default unless memory is critical.

## char and boolean

\`\`\`java
char initial = 'J';
boolean isActive = true;
\`\`\`

## Numeric Literals

Java lets you use underscores for readability:

\`\`\`java
int cardNumber = 1234_5678_9012_3456;
long bytes = 512L;
\`\`\`

## Overflow Example

\`\`\`java
byte b = 127;
b++; // wraps to -128
\`\`\`

## Quick Reference

- Use \`int\` for most integers
- Use \`long\` for large counters, timestamps
- Use \`double\` for decimals
- Use \`boolean\` for true/false
- Use \`char\` for single characters

## What's Next?

Let's learn how Java handles text with \`String\`.
`;

      await ctx.db.insert("curriculumItems", {
        moduleId: variablesModuleId,
        languageId,
        kind: "lesson",
        slug: "primitive-types-deep-dive",
        title: "Primitive Types Deep Dive",
        order: 4,
        content: primitiveTypesContent,
      });
    }

    // Lesson 2.5: Strings & Concatenation
    const existingStringsLesson = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "strings-concatenation")
      )
      .first();

    if (!existingStringsLesson) {
      const stringsContent = `# Strings & Concatenation

\`String\` is a class used to store text. Strings are **immutable**, meaning they cannot be changed after creation.

## Creating Strings

\`\`\`java
String name = "Ava";
String city = new String("Seattle");
\`\`\`

## Concatenation

\`\`\`java
String first = "Hello";
String second = "World";
String message = first + " " + second; // "Hello World"
\`\`\`

## Immutability

\`\`\`java
String s = "Hi";
s = s + " there"; // creates a new String object
\`\`\`

For many concatenations, use \`StringBuilder\`:

\`\`\`java
StringBuilder builder = new StringBuilder();
builder.append("Hello");
builder.append(" ");
builder.append("World");
String result = builder.toString();
\`\`\`

## Common String Methods

\`\`\`java
String text = "OpenCamp";
text.length();        // 8
text.toLowerCase();   // "opencamp"
text.substring(0, 4); // "Open"
text.contains("Camp"); // true
\`\`\`

## Comparing Strings

Use \`.equals()\`, not \`==\`:

\`\`\`java
String a = new String("java");
String b = new String("java");

System.out.println(a == b);      // false (different objects)
System.out.println(a.equals(b)); // true (same content)
\`\`\`

## What's Next?

We'll look at type conversion and casting between primitives.
`;

      await ctx.db.insert("curriculumItems", {
        moduleId: variablesModuleId,
        languageId,
        kind: "lesson",
        slug: "strings-concatenation",
        title: "Strings & Concatenation",
        order: 5,
        content: stringsContent,
      });
    }

    // Lesson 2.6: Type Conversion & Casting
    const existingCastingLesson = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "type-casting-conversion")
      )
      .first();

    if (!existingCastingLesson) {
      const castingContent = `# Type Conversion & Casting

Java converts types in two ways:

## Widening (Implicit)

Safe conversion from smaller to larger types:

\`\`\`java
int a = 42;
double b = a; // 42.0
\`\`\`

## Narrowing (Explicit)

You must cast when converting from larger to smaller:

\`\`\`java
double price = 19.99;
int rounded = (int) price; // 19
\`\`\`

## Casting Can Lose Data

\`\`\`java
long big = 3_000_000_000L;
int small = (int) big; // overflow - data loss
\`\`\`

## char and int

\`\`\`java
char letter = 'A';
int code = letter; // 65
char back = (char) (code + 1); // 'B'
\`\`\`

## Converting Strings to Numbers

\`\`\`java
int age = Integer.parseInt("21");
double price = Double.parseDouble("19.99");
\`\`\`

## Converting Numbers to Strings

\`\`\`java
String countText = String.valueOf(42);
String message = 5 + " items"; // "5 items"
\`\`\`

## Common Pitfalls

- Parsing invalid strings throws \`NumberFormatException\`
- Casting truncates (not rounds)
- Widening is safe, narrowing can lose data

## What's Next?

Time to move into Java basics: operators, input/output, and methods.
`;

      await ctx.db.insert("curriculumItems", {
        moduleId: variablesModuleId,
        languageId,
        kind: "lesson",
        slug: "type-casting-conversion",
        title: "Type Conversion & Casting",
        order: 6,
        content: castingContent,
      });
    }

    // ============================================
    // BASICS MODULE CONTENT
    // ============================================

    // Create lesson: Variables & Types (belongs to Basics module)
    const existingLesson = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "variables-and-types")
      )
      .first();

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

    if (!existingLesson) {
      await ctx.db.insert("curriculumItems", {
        moduleId: basicsModuleId,
        languageId,
        kind: "lesson",
        slug: "variables-and-types",
        title: "Variables & Types",
        order: 1,
        content: lessonContent,
      });
    } else if (!existingLesson.content || !existingLesson.content.includes("```java")) {
      await ctx.db.patch(existingLesson._id, {
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
        moduleId: basicsModuleId,
        languageId,
        kind: "challenge",
        slug: "add-two-numbers",
        title: "Add Two Numbers",
        order: 2,
        difficulty: "easy",
        prompt:
          "Implement a `add` method that takes two integers and returns their sum.\n\n**Bonus:** Can you handle negative numbers correctly?",
        starterCode,
        testSuiteId,
        hasBonus: true,
        skillTags: ["operators", "methods", "arithmetic"],
      });
    }

    // ============================================
    // Module 2.5: Git Fundamentals (NEW)
    // ============================================
    const existingGitModule = await ctx.db
      .query("modules")
      .withIndex("by_track_slug", (q) =>
        q.eq("trackId", trackId).eq("slug", "git-fundamentals")
      )
      .first();

    let gitModuleId;
    if (!existingGitModule) {
      gitModuleId = await ctx.db.insert("modules", {
        trackId,
        slug: "git-fundamentals",
        title: "Git Fundamentals",
        description: "Essential version control for every developer",
        order: 2.5,
        estimatedHours: 3,
        skillTags: ["git", "version-control", "collaboration"],
      });
    } else {
      gitModuleId = existingGitModule._id;
    }

    // Lesson: What is Git and why it matters
    const existingGitOverviewLesson = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "git-overview")
      )
      .first();

    if (!existingGitOverviewLesson) {
      const gitOverviewContent = `# What is Git and Why It Matters

## Understanding Version Control

Version control is like having a time machine for your code. It lets you:
- Save snapshots of your work at any point
- Revert to previous versions if something breaks
- Track who made changes and when
- Work on multiple features simultaneously without conflicts

## Why Git Is Essential

- **Industry standard**: Every tech company uses Git
- **Collaboration**: Work seamlessly with teams
- **Safety**: Never lose work (even if you delete files)
- **Job requirement**: Git skills are tested in almost all technical interviews

## Real World Example

Imagine writing an essay without "Save As" or backups. If you delete a paragraph, it's gone forever. Git is like having automatic backups at every sentence you write, so you can go back to any version.

## Git vs GitHub

- **Git**: The version control tool installed on your computer
- **GitHub/GitLab/Bitbucket**: Cloud services that host Git repositories

Think of Git like your local music library, and GitHub like Spotify where you share it.

## Next Steps

In the next lessons, you'll learn Git commands and how to use them in your daily workflow.
`;
      await ctx.db.insert("curriculumItems", {
        moduleId: gitModuleId,
        languageId,
        kind: "lesson",
        slug: "git-overview",
        title: "What is Git and Why It Matters",
        order: 1,
        content: gitOverviewContent,
        estimatedMinutes: 20,
        skillTags: ["git", "version-control", "concepts"],
        realWorldContext: "Every Java developer job requires Git - it's as essential as knowing how to use a keyboard",
      });
    }

    // Lesson: Basic Git Commands
    const existingGitCommandsLesson = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "git-basic-commands")
      )
      .first();

    if (!existingGitCommandsLesson) {
      const gitCommandsContent = `# Basic Git Commands

## Getting Started with Git

After installing Git, these are the commands you'll use daily.

### Initializing a Repository

\`\`\`bash
git init
\`\`\`
Creates a new Git repository in your current directory. Do this once per project.

### Checking Status

\`\`\`bash
git status
\`\`\`
Shows which files have been modified, added, or are untracked. Run this often to see what's changed.

### Staging Files

\`\`\`bash
git add filename.java
\`\`\`
Moves files to the "staging area", preparing them to be committed.

\`\`\`bash
git add .
\`\`\`
Adds all modified files to staging.

### Committing Changes

\`\`\`bash
git commit -m "Your descriptive message"
\`\`\`
Saves your staged changes with a descriptive message. Think of this as creating a checkpoint.

**Commit Message Best Practices:**
- Use the imperative mood: "Add user login" not "Added user login"
- Keep it to ~50 characters
- Include why, not just what: "Fix null pointer in user service"

### Viewing History

\`\`\`bash
git log
\`\`\`
Shows all your commits with their messages, author, and timestamp.

### Viewing Differences

\`\`\`bash
git diff
\`\`\`
Shows what changes you've made but haven't staged yet.

## Common Workflow

Most Java developers follow this workflow:
1. Make code changes
2. Run \`git status\` to see what changed
3. Run \`git add .\` to stage changes
4. Run \`git commit -m "message"\` to save changes
5. Repeat!

## Real World Example

You're building a Java calculator:
\`\`\`bash
# Edit Calculator.java
git status            # Shows: Calculator.java is modified
git add Calculator.java # Stages the file
git commit -m "Add multiply method"  # Saves your work
# Edit Calculator.java again
git commit -m "Fix bug in division by zero"  # Saves new work
git log               # See your two commits
\`\`\`

## Practice

Try this on a simple project:
1. Create a new directory
2. Run \`git init\`
3. Create a file and add some content
4. Commit the file
5. Modify it and commit again
6. Run \`git log\` to see your history
`;
      await ctx.db.insert("curriculumItems", {
        moduleId: gitModuleId,
        languageId,
        kind: "lesson",
        slug: "git-basic-commands",
        title: "Basic Git Commands",
        order: 2,
        content: gitCommandsContent,
        estimatedMinutes: 30,
        skillTags: ["git", "cli", "workflow"],
        realWorldContext: "The git workflow you learn here is what you'll use daily in any Java development job",
        commonPitfalls: "Forgetting to add files before committing, or committing too frequently with vague messages",
      });
    }

    // Lesson 3.3: Operators & Expressions
    const existingOperatorsLesson = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "operators-expressions")
      )
      .first();

    if (!existingOperatorsLesson) {
      const operatorsContent = `# Operators & Expressions

Operators let you perform calculations and comparisons.

## Arithmetic Operators

\`\`\`java
int a = 10;
int b = 3;

int sum = a + b;      // 13
int diff = a - b;     // 7
int product = a * b;  // 30
int quotient = a / b; // 3 (integer division)
int remainder = a % b; // 1
\`\`\`

## Comparison Operators

\`\`\`java
boolean isEqual = (a == b);
boolean isGreater = (a > b);
boolean isDifferent = (a != b);
\`\`\`

## Logical Operators

\`\`\`java
boolean canVote = age >= 18 && hasId;
boolean freeEntry = isStudent || isSenior;
boolean notMember = !isMember;
\`\`\`

## Increment & Decrement

\`\`\`java
int count = 0;
count++; // 1
count--; // 0
\`\`\`

## Compound Assignment

\`\`\`java
int score = 5;
score += 3; // 8
score *= 2; // 16
\`\`\`

## Operator Precedence

Multiplication and division run before addition/subtraction.

\`\`\`java
int result = 2 + 3 * 4; // 14
int grouped = (2 + 3) * 4; // 20
\`\`\`

## What's Next?

Let's learn how to read input and print formatted output.
`;

      await ctx.db.insert("curriculumItems", {
        moduleId: basicsModuleId,
        languageId,
        kind: "lesson",
        slug: "operators-expressions",
        title: "Operators & Expressions",
        order: 3,
        content: operatorsContent,
      });
    }

    // Lesson 3.4: Input & Output with Scanner
    const existingInputLesson = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "input-output-scanner")
      )
      .first();

    if (!existingInputLesson) {
      const inputContent = `# Input & Output with Scanner

Java uses \`System.out\` for output and \`Scanner\` for input.

## Printing Output

\`\`\`java
System.out.println("Hello!");
System.out.print("Same line ");
System.out.print("still same line");
\`\`\`

## Formatted Output

\`\`\`java
double price = 19.99;
System.out.printf("Price: $%.2f%n", price);
\`\`\`

## Reading Input with Scanner

\`\`\`java
import java.util.Scanner;

Scanner scanner = new Scanner(System.in);

System.out.print("Enter your name: ");
String name = scanner.nextLine();

System.out.print("Enter your age: ");
int age = scanner.nextInt();

System.out.println("Hi " + name + ", age " + age);
\`\`\`

## Common Pitfall: nextLine after nextInt

\`\`\`java
int age = scanner.nextInt();
scanner.nextLine(); // consume newline
String name = scanner.nextLine();
\`\`\`

## What's Next?

We'll use methods to organize code and reuse logic.
`;

      await ctx.db.insert("curriculumItems", {
        moduleId: basicsModuleId,
        languageId,
        kind: "lesson",
        slug: "input-output-scanner",
        title: "Input & Output with Scanner",
        order: 4,
        content: inputContent,
      });
    }

    // Lesson 3.5: Methods & Parameters
    const existingMethodsLesson = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "methods-parameters")
      )
      .first();

    if (!existingMethodsLesson) {
      const methodsContent = `# Methods & Parameters

Methods group code into reusable blocks.

## Defining a Method

\`\`\`java
public static void greet(String name) {
    System.out.println("Hello, " + name);
}
\`\`\`

## Calling a Method

\`\`\`java
greet("Ava");
\`\`\`

## Methods with Return Values

\`\`\`java
public static int add(int a, int b) {
    return a + b;
}

int sum = add(3, 5); // 8
\`\`\`

## Parameters vs Arguments

- **Parameters**: variables in method definition
- **Arguments**: values you pass in

## Pass-by-Value

Java always passes **copies** of values:

\`\`\`java
public static void change(int x) {
    x = 99;
}

int n = 5;
change(n);
System.out.println(n); // still 5
\`\`\`

## What's Next?

We'll explore return values and method overloading.
`;

      await ctx.db.insert("curriculumItems", {
        moduleId: basicsModuleId,
        languageId,
        kind: "lesson",
        slug: "methods-parameters",
        title: "Methods & Parameters",
        order: 5,
        content: methodsContent,
      });
    }

    // Lesson 3.6: Return Values & Overloading
    const existingReturnLesson = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "return-values-overloading")
      )
      .first();

    if (!existingReturnLesson) {
      const returnContent = `# Return Values & Overloading

## Returning Early

\`\`\`java
public static boolean isAdult(int age) {
    if (age >= 18) {
        return true;
    }
    return false;
}
\`\`\`

## Method Overloading

Same method name, different parameter lists:

\`\`\`java
public static int max(int a, int b) {
    return a > b ? a : b;
}

public static double max(double a, double b) {
    return a > b ? a : b;
}
\`\`\`

Overloading is based on:
- Number of parameters
- Types of parameters
- Order of parameters

## Overloading vs Overriding

- **Overloading**: Same class, different params
- **Overriding**: Subclass replaces a parent method (OOP topic)

## What's Next?

Let's understand scope, blocks, and variable lifetime.
`;

      await ctx.db.insert("curriculumItems", {
        moduleId: basicsModuleId,
        languageId,
        kind: "lesson",
        slug: "return-values-overloading",
        title: "Return Values & Overloading",
        order: 6,
        content: returnContent,
      });
    }

    // Lesson 3.7: Scope & Lifetime
    const existingScopeLesson = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "scope-and-lifetime")
      )
      .first();

    if (!existingScopeLesson) {
      const scopeContent = `# Scope & Lifetime

Scope determines **where** a variable can be used.

## Block Scope

\`\`\`java
if (true) {
    int x = 10;
    System.out.println(x);
}
// x is not accessible here
\`\`\`

## Method Scope

Parameters and local variables exist only inside the method.

## Shadowing

\`\`\`java
int value = 5;

void demo() {
    int value = 10; // shadows outer variable
    System.out.println(value); // 10
}
\`\`\`

## final Variables

\`\`\`java
final int MAX_USERS = 100;
// MAX_USERS = 200; // error
\`\`\`

## Tips

- Keep variable scope as small as possible
- Avoid reusing the same name in nested scopes

## What's Next?

We'll cover practical debugging techniques.
`;

      await ctx.db.insert("curriculumItems", {
        moduleId: basicsModuleId,
        languageId,
        kind: "lesson",
        slug: "scope-and-lifetime",
        title: "Scope & Lifetime",
        order: 7,
        content: scopeContent,
      });
    }

    // Lesson 3.8: Debugging Basics
    const existingDebuggingLesson = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "debugging-basics")
      )
      .first();

    if (!existingDebuggingLesson) {
      const debuggingContent = `# Debugging Basics

Errors happen. Debugging is how you find and fix them.

## Compile-Time Errors

These are caught before the program runs:

- Missing semicolons
- Type mismatch
- Undefined variables

## Runtime Errors

These happen while the program runs:

- \`NullPointerException\`
- \`ArrayIndexOutOfBoundsException\`
- \`NumberFormatException\`

## Reading a Stack Trace

The stack trace shows **where** the error occurred.

\`\`\`
Exception in thread "main" java.lang.NumberFormatException
    at java.lang.Integer.parseInt(Integer.java:542)
    at Main.main(Main.java:8)
\`\`\`

Look at the last line pointing to your code.

## Print Debugging

\`\`\`java
System.out.println("Value: " + value);
\`\`\`

Print values to confirm your assumptions.

## Common Strategy

1. Reproduce the bug
2. Isolate the smallest failing case
3. Inspect variables
4. Fix and retest

## What's Next?

You're ready to move into control flow and more complex logic.
`;

      await ctx.db.insert("curriculumItems", {
        moduleId: basicsModuleId,
        languageId,
        kind: "lesson",
        slug: "debugging-basics",
        title: "Debugging Basics",
        order: 8,
        content: debuggingContent,
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

    // Create or get module: Control Flow (Module 4)
    const existingControlFlowModule = await ctx.db
      .query("modules")
      .withIndex("by_track_slug", (q) =>
        q.eq("trackId", trackId).eq("slug", "control-flow")
      )
      .first();

    let controlFlowModuleId;
    if (existingControlFlowModule) {
      controlFlowModuleId = existingControlFlowModule._id;
    } else {
      controlFlowModuleId = await ctx.db.insert("modules", {
        trackId,
        slug: "control-flow",
        title: "Control Flow",
        description: "Mastering if statements, switch expressions, and loops in Java",
        order: 4,
      });
    }

    // ============================================
    // CONTROL FLOW MODULE CONTENT
    // ============================================

    // Lesson 4.1: if-else statements
    const existingIfElseLesson = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "if-else-statements")
      )
      .first();

    if (!existingIfElseLesson) {
      const ifElseContent = `# if-else Statements

Control flow statements determine the order in which code is executed. The most basic form is the \`if\` statement.

## Basic if Statement

An \`if\` statement executes code only when a condition is true:

\`\`\`java
int score = 85;

if (score >= 60) {
    System.out.println("You passed!");
}
\`\`\`

### Syntax

\`\`\`java
if (condition) {
    // code to execute if condition is true
}
\`\`\`

The condition must evaluate to a \`boolean\` (true or false).

## if-else Blocks

An \`else\` block executes when the \`if\` condition is false:

\`\`\`java
int age = 16;

if (age >= 18) {
    System.out.println("You are an adult");
} else {
    System.out.println("You are a minor");
}
\`\`\`

## if-else if-else Chains

For multiple conditions, use \`else if\`:

\`\`\`java
int grade = 85;

if (grade >= 90) {
    System.out.println("A");
} else if (grade >= 80) {
    System.out.println("B");
} else if (grade >= 70) {
    System.out.println("C");
} else if (grade >= 60) {
    System.out.println("D");
} else {
    System.out.println("F");
}
\`\`\`

### How it Works

1. Java checks each condition in order
2. As soon as one condition is true, that block executes
3. No other conditions are checked after a match
4. If no conditions match, the \`else\` block executes (if present)

## Nested if Statements

You can nest \`if\` statements inside other \`if\` statements:

\`\`\`java
int temperature = 25;
boolean isRaining = false;

if (temperature > 20) {
    if (isRaining) {
        System.out.println("It's warm but raining");
    } else {
        System.out.println("Perfect weather!");
    }
} else {
    System.out.println("It's cold");
}
\`\`\`

## Code Blocks with {}

Always use braces \`{ }\` even for single statements:

\`\`\`java
// Good - always use braces
if (x > 0) {
    System.out.println("Positive");
}

// Avoid - missing braces can cause bugs
if (x > 0)
    System.out.println("Positive");
    System.out.println("This always runs!"); // Bug!
\`\`\`

## Common Patterns

### Checking for Null

Always check for null before calling methods on objects:

\`\`\`java
String name = getName(); // might return null

if (name != null) {
    System.out.println(name.length()); // safe to call
} else {
    System.out.println("Name is null");
}
\`\`\`

### Input Validation

Validate user input before processing:

\`\`\`java
int age = scanner.nextInt();

if (age <= 0) {
    System.out.println("Age must be positive");
} else if (age > 120) {
    System.out.println("Age seems unrealistic");
} else {
    // Process valid age
}
\`\`\`

### Range Checking

Check if a value falls within a range:

\`\`\`java
int score = 75;

if (score >= 0 && score <= 100) {
    System.out.println("Valid score");
} else {
    System.out.println("Invalid score");
}
\`\`\`

## Logical Operators

Combine conditions with logical operators:

| Operator | Name | Example | Description |
|----------|------|---------|-------------|
| \`&&\` | AND | \`age >= 18 && age < 65\` | Both must be true |
| \`||\` | OR | \`age < 18 || age >= 65\` | At least one must be true |
| \`!\` | NOT | \`!hasLicense\` | Inverts the boolean |

### Example

\`\`\`java
int age = 25;
boolean hasLicense = true;

if (age >= 18 && hasLicense) {
    System.out.println("Can drive");
}

if (age < 18 || !hasLicense) {
    System.out.println("Cannot drive");
}
\`\`\`

## Short-Circuit Evaluation

\`\`\`java
if (x != 0 && y / x > 10) {
    // If x is 0, the second part is never evaluated
    // This prevents division by zero!
}
\`\`\`

## Common Pitfalls

### Dangling Else Problem

Without braces, \`else\` belongs to the closest \`if\`:

\`\`\`java
// Ambiguous - what does this else belong to?
if (x > 0)
    if (y > 0)
        System.out.println("Both positive");
else
    System.out.println("What is this?");
\`\`\`

Always use braces to avoid this confusion:

\`\`\`java
if (x > 0) {
    if (y > 0) {
        System.out.println("Both positive");
    } else {
        System.out.println("x positive, y non-positive");
    }
} else {
    System.out.println("x non-positive");
}
\`\`\`

### Assignment vs. Comparison

\`\`\`java
// Wrong - assigns value to x
if (x = 5) {
    // Compilation error in Java (but dangerous in C)
}

// Correct - compares values
if (x == 5) {
    // Correct comparison
}
\`\`\`

### Comparing Objects

Use \`.equals()\` for strings, not \`==\`:

\`\`\`java
String s1 = new String("hello");
String s2 = new String("hello");

if (s1 == s2) {
    // False - different objects
}

if (s1.equals(s2)) {
    // True - same content
}
\`\`\`

## Real-World Example: Grade Calculator

\`\`\`java
int score = 85;
char grade;
String message;

if (score >= 90) {
    grade = 'A';
    message = "Excellent!";
} else if (score >= 80) {
    grade = 'B';
    message = "Good job!";
} else if (score >= 70) {
    grade = 'C';
    message = "You passed";
} else if (score >= 60) {
    grade = 'D';
    message = "Barely passed";
} else {
    grade = 'F';
    message = "Study harder!";
}

System.out.println("Grade: " + grade);
System.out.println(message);
\`\`\`

## Try It Yourself

### Exercise 1: Age Classifier

Write a program that classifies a person:

\`\`\`java
int age = 25;
// Your code here
// Output should be one of:
// - "Child" (< 13)
// - "Teenager" (13-19)
// - "Young Adult" (20-35)
// - "Adult" (36-64)
// - "Senior" (65+)
\`\`\`

### Exercise 2: Number Validator

Check if a number is valid and its properties:

\`\`\`java
int num = -15;
// Your code here:
// 1. Check if it's positive, negative, or zero
// 2. Check if it's even or odd (only if not zero)
// 3. Check if it's a multiple of 3
\`\`\`

## Quick Reference

\`\`\`java
// Basic if
if (condition) {
    // code
}

// if-else
if (condition) {
    // code if true
} else {
    // code if false
}

// Multiple conditions
if (condition1) {
    // code
} else if (condition2) {
    // code
} else {
    // default code
}

// Nested
if (outer) {
    if (inner) {
        // code
    }
}

// Logical operators
condition1 && condition2  // AND
condition1 || condition2  // OR
!condition                 // NOT
\`\`\`

## What's Next?

Next, we'll learn about \`switch\` expressions, a more concise way to handle multiple conditions.
`;

      await ctx.db.insert("curriculumItems", {
        moduleId: controlFlowModuleId,
        languageId,
        kind: "lesson",
        slug: "if-else-statements",
        title: "if-else Statements",
        order: 1,
        content: ifElseContent,
      });
    }

    // Lesson 4.2: switch expressions (Java 14+)
    const existingSwitchLesson = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "switch-expressions")
      )
      .first();

    if (!existingSwitchLesson) {
      const switchContent = `# Switch Expressions (Java 14+)

Switch statements and expressions provide a cleaner way to handle multiple conditions, especially when comparing against constant values.

## Traditional switch Statements (Java 8-13)

The classic switch statement uses \`case\` labels and requires \`break\` to prevent fall-through:

\`\`\`java
int dayOfWeek = 3;
String dayName;

switch (dayOfWeek) {
    case 1:
        dayName = "Monday";
        break;
    case 2:
        dayName = "Tuesday";
        break;
    case 3:
        dayName = "Wednesday";
        break;
    case 4:
        dayName = "Thursday";
        break;
    case 5:
        dayName = "Friday";
        break;
    case 6:
        dayName = "Saturday";
        break;
    case 7:
        dayName = "Sunday";
        break;
    default:
        dayName = "Invalid day";
}

System.out.println(dayName);
\`\`\`

### Fall-Through Behavior

Without \`break\`, execution continues to the next case:

\`\`\`java
int month = 2;
int days;

switch (month) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
        days = 31;
        break;
    case 4:
    case 6:
    case 9:
    case 11:
        days = 30;
        break;
    case 2:
        days = 28; // Simplified
        break;
    default:
        days = 0;
}
\`\`\`

## Switch Expressions (Java 14+)

Java 14 introduced switch as an expression with cleaner syntax:

\`\`\`java
int dayOfWeek = 3;
String dayName = switch (dayOfWeek) {
    case 1 -> "Monday";
    case 2 -> "Tuesday";
    case 3 -> "Wednesday";
    case 4 -> "Thursday";
    case 5 -> "Friday";
    case 6 -> "Saturday";
    case 7 -> "Sunday";
    default -> "Invalid day";
};

System.out.println(dayName);
\`\`\`

### Arrow Syntax

The \`->\` arrow syntax makes the code cleaner:
- No \`break\` needed (no fall-through)
- Can be a single expression or a block
- Returns a value

## Multiple Case Labels

You can combine multiple cases with commas:

\`\`\`java
int month = 6;
int days = switch (month) {
    case 1, 3, 5, 7, 8, 10, 12 -> 31;
    case 4, 6, 9, 11 -> 30;
    case 2 -> 28;
    default -> 0;
};

System.out.println("Days: " + days);
\`\`\`

## Using Blocks with yield

When you need multiple statements, use \`{ }\` and \`yield\`:

\`\`\`java
int score = 85;
String result = switch (score / 10) {
    case 10, 9 -> {
        System.out.println("Excellent work!");
        yield "A";
    }
    case 8 -> {
        System.out.println("Good job!");
        yield "B";
    }
    case 7 -> {
        System.out.println("You passed");
        yield "C";
    }
    case 6 -> {
        System.out.println("Barely passed");
        yield "D";
    }
    default -> {
        System.out.println("Study harder");
        yield "F";
    }
};

System.out.println("Grade: " + result);
\`\`\`

### Key Points

- \`yield\` returns a value from a switch expression block
- \`yield\` is not a keyword in traditional switch statements
- The block must end with \`yield\`

## Switch with Strings

Java 7+ supports switch on strings:

\`\`\`java
String command = "start";

switch (command) {
    case "start" -> System.out.println("Starting...");
    case "stop" -> System.out.println("Stopping...");
    case "pause" -> System.out.println("Pausing...");
    case "resume" -> System.out.println("Resuming...");
    default -> System.out.println("Unknown command");
}
\`\`\`

## Switch with Enums

Switch works beautifully with enums:

\`\`\`java
enum Day {
    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
}

Day today = Day.WEDNESDAY;

String message = switch (today) {
    case MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY -> "Work day";
    case SATURDAY, SUNDAY -> "Weekend!";
};

System.out.println(message);
\`\`\`

## Pattern Matching with switch (Java 21+)

Java 21 introduced pattern matching for switch:

\`\`\`java
Object obj = "Hello";

String result = switch (obj) {
    case Integer i -> "Integer: " + i;
    case String s -> "String: " + s;
    case Double d -> "Double: " + d;
    default -> "Unknown type";
};

System.out.println(result);
\`\`\`

## Guarded Cases (Java 21+)

Add conditions to cases with \`when\`:

\`\`\`java
Object obj = "Hello";

String result = switch (obj) {
    case String s when s.length() > 5 -> "Long string";
    case String s -> "Short string: " + s;
    default -> "Not a string";
};

System.out.println(result);
\`\`\`

## When to Use switch vs if-else

### Use switch when:
- Comparing against constant values (integers, strings, enums)
- You have many distinct cases
- The conditions are equality checks

### Use if-else when:
- Conditions involve ranges (<, >, <=, >=)
- You need complex boolean logic (AND, OR)
- Conditions involve multiple variables
- You need to handle null checks

### Examples

\`\`\`java
// Good for switch
String day = "Monday";
switch (day) {
    case "Monday" -> System.out.println("Week start");
    case "Friday" -> System.out.println("Week end");
    default -> System.out.println("Mid-week");
}

// Better for if-else
int score = 85;
if (score >= 90) {
    System.out.println("A");
} else if (score >= 80) {
    System.out.println("B");
}
\`\`\`

## Common Pitfalls

### Forgetting break (traditional switch)

\`\`\`java
// Wrong without break
switch (x) {
    case 1:
        System.out.println("One");
    case 2:
        System.out.println("Two"); // This runs too!
        break;
}
\`\`\`

### Null Values

Switch expressions on nullable types need handling:

\`\`\`java
String text = null;

switch (text) {
    case null -> System.out.println("Null value");
    case "hello" -> System.out.println("Hello!");
    default -> System.out.println("Other");
}
\`\`\`

### Uncovered Cases

All cases must be covered or have a default:

\`\`\`java
enum Color { RED, GREEN, BLUE }

Color c = Color.RED;

String s = switch (c) {
    case RED -> "Red";
    case GREEN -> "Green";
    // Missing BLUE - compilation error!
    // case BLUE -> "Blue";
};
\`\`\`

## Real-World Example: Calculator Command Parser

\`\`\`java
String operation = "add";
double a = 10;
double b = 5;

double result = switch (operation.toLowerCase()) {
    case "add" -> a + b;
    case "subtract" -> a - b;
    case "multiply" -> a * b;
    case "divide" -> {
        if (b == 0) {
            throw new ArithmeticException("Cannot divide by zero");
        }
        yield a / b;
    }
    default -> {
        throw new IllegalArgumentException("Unknown operation: " + operation);
    }
};

System.out.println("Result: " + result);
\`\`\`

## Real-World Example: HTTP Response Handler

\`\`\`java
int statusCode = 404;

String message = switch (statusCode) {
    case 200 -> "OK";
    case 201 -> "Created";
    case 204 -> "No Content";
    case 400 -> "Bad Request";
    case 401 -> "Unauthorized";
    case 403 -> "Forbidden";
    case 404 -> "Not Found";
    case 500 -> "Internal Server Error";
    case 503 -> "Service Unavailable";
    default -> "Unknown Status Code";
};

System.out.println("Status: " + message);
\`\`\`

## Try It Yourself

### Exercise 1: Month to Season

Convert month number to season:

\`\`\`java
int month = 3; // March
String season = switch (month) {
    // Your code here
    // Winter: Dec(12), Jan(1), Feb(2)
    // Spring: Mar(3), Apr(4), May(5)
    // Summer: Jun(6), Jul(7), Aug(8)
    // Fall: Sep(9), Oct(10), Nov(11)
};
\`\`\`

### Exercise 2: Simple Calculator

\`\`\`java
String op = "multiply";
double x = 7;
double y = 3;

double result = switch (op) {
    // Implement: add, subtract, multiply, divide
};
\`\`\`

## Quick Reference

\`\`\`java
// Traditional switch
switch (value) {
    case 1:
        // code
        break;
    default:
        // default code
}

// Switch expression (Java 14+)
String result = switch (value) {
    case 1 -> "one";
    case 2 -> "two";
    default -> "other";
};

// Multiple cases
switch (value) {
    case 1, 2, 3 -> "low";
    case 4, 5, 6 -> "medium";
    default -> "high";
}

// With yield
String result = switch (value) {
    case 1 -> {
        System.out.println("Processing 1");
        yield "one";
    }
    default -> "other";
};

// Pattern matching (Java 21+)
String s = switch (obj) {
    case String str -> "String: " + str;
    case Integer i -> "Integer: " + i;
    default -> "Unknown";
};
\`\`\`

## What's Next?

Now let's learn about loops to repeat code execution.
`;

      await ctx.db.insert("curriculumItems", {
        moduleId: controlFlowModuleId,
        languageId,
        kind: "lesson",
        slug: "switch-expressions",
        title: "Switch Expressions (Java 14+)",
        order: 2,
        content: switchContent,
      });
    }

    // Lesson 4.3: for, while, do-while loops
    const existingLoopsLesson = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "loops")
      )
      .first();

    if (!existingLoopsLesson) {
      const loopsContent = `# Loops: for, while, do-while

Loops allow you to execute code repeatedly. Java provides three types of loops.

## for Loop

The \`for\` loop is ideal when you know how many times to iterate.

### Syntax

\`\`\`java
for (initialization; condition; update) {
    // code to repeat
}
\`\`\`

### Components

| Component | Purpose | Executed |
|-----------|---------|----------|
| Initialization | Set up loop variable | Once, before first iteration |
| Condition | Check if loop continues | Before each iteration |
| Update | Change loop variable | After each iteration |
| Body | Code to execute | When condition is true |

### Basic Example

\`\`\`java
// Print numbers 1 to 5
for (int i = 1; i <= 5; i++) {
    System.out.println(i);
}
\`\`\`

Output:
\`\`\`
1
2
3
4
5
\`\`\`

### Loop Execution Flow

\`\`\`java
for (int i = 1; i <= 5; i++) {
    System.out.println(i);
}
\`\`\`

1. \`int i = 1\` - Initialize i to 1
2. Check \`i <= 5\` (true) → Print 1
3. \`i++\` → i becomes 2
4. Check \`i <= 5\` (true) → Print 2
5. \`i++\` → i becomes 3
6. ... continues until i becomes 6
7. Check \`i <= 5\` (false) → Exit loop

## Enhanced for Loop (for-each)

The enhanced for loop simplifies iterating over arrays and collections:

\`\`\`java
int[] numbers = {10, 20, 30, 40, 50};

for (int num : numbers) {
    System.out.println(num);
}
\`\`\`

### For Arrays

\`\`\`java
String[] fruits = {"apple", "banana", "cherry"};

for (String fruit : fruits) {
    System.out.println("I like " + fruit);
}
\`\`\`

### For Collections

\`\`\`java
import java.util.ArrayList;
import java.util.List;

List<String> names = new ArrayList<>();
names.add("Alice");
names.add("Bob");
names.add("Charlie");

for (String name : names) {
    System.out.println(name);
}
\`\`\`

### When to Use Enhanced For

Use it when you:
- Need to access each element
- Don't need to modify the array
- Don't need the index

\`\`\`java
int[] arr = {1, 2, 3, 4, 5};

// Good - just reading
for (int num : arr) {
    System.out.println(num);
}

// Need index - use traditional for
for (int i = 0; i < arr.length; i++) {
    System.out.println("Index " + i + ": " + arr[i]);
}
\`\`\`

## while Loop

Use \`while\` when you don't know how many iterations you'll need.

### Syntax

\`\`\`java
while (condition) {
    // code to repeat
}
\`\`\`

### Example: Read Until Invalid Input

\`\`\`java
import java.util.Scanner;

Scanner scanner = new Scanner(System.in);
int sum = 0;
int number;

System.out.println("Enter positive numbers (0 to stop):");

while ((number = scanner.nextInt()) > 0) {
    sum += number;
    System.out.println("Sum so far: " + sum);
}

System.out.println("Final sum: " + sum);
\`\`\`

### Example: Password Validation

\`\`\`java
import java.util.Scanner;

Scanner scanner = new Scanner(System.in);
String password;
boolean isValid;

do {
    System.out.print("Enter password: ");
    password = scanner.nextLine();
    isValid = password.length() >= 8;

    if (!isValid) {
        System.out.println("Password must be at least 8 characters");
    }
} while (!isValid);

System.out.println("Password accepted!");
\`\`\`

## do-while Loop

The \`do-while\` loop always executes at least once, even if the condition is false.

### Syntax

\`\`\`java
do {
    // code to repeat
} while (condition);
\`\`\`

### Example: Menu System

\`\`\`java
import java.util.Scanner;

Scanner scanner = new Scanner(System.in);
int choice;

do {
    System.out.println("\\nMenu:");
    System.out.println("1. Add");
    System.out.println("2. Subtract");
    System.out.println("3. Exit");
    System.out.print("Enter choice: ");
    choice = scanner.nextInt();

    switch (choice) {
        case 1:
            System.out.println("Adding...");
            break;
        case 2:
            System.out.println("Subtracting...");
            break;
        case 3:
            System.out.println("Goodbye!");
            break;
        default:
            System.out.println("Invalid choice");
    }
} while (choice != 3);
\`\`\`

### while vs do-while

\`\`\`java
int x = 10;

// while - may not execute
while (x < 5) {
    System.out.println("This won't print");
}

// do-while - always executes once
do {
    System.out.println("This will print once");
} while (x < 5);
\`\`\`

## break and continue

### break - Exit Loop Immediately

\`\`\`java
for (int i = 1; i <= 10; i++) {
    if (i == 5) {
        break; // Exit the loop
    }
    System.out.println(i);
}

// Output: 1 2 3 4
\`\`\`

### continue - Skip to Next Iteration

\`\`\`java
for (int i = 1; i <= 10; i++) {
    if (i % 2 == 0) {
        continue; // Skip even numbers
    }
    System.out.println(i);
}

// Output: 1 3 5 7 9
\`\`\`

### Finding First Match

\`\`\`java
int[] numbers = {3, 7, 2, 9, 4, 1};
int target = 9;
int index = -1;

for (int i = 0; i < numbers.length; i++) {
    if (numbers[i] == target) {
        index = i;
        break; // Found it, no need to continue
    }
}

System.out.println("Found " + target + " at index " + index);
\`\`\`

## Nested Loops

Loops inside loops create powerful patterns.

### Multiplication Table

\`\`\`java
for (int i = 1; i <= 10; i++) {
    for (int j = 1; j <= 10; j++) {
        System.out.printf("%4d", i * j);
    }
    System.out.println();
}
\`\`\`

### Star Patterns

\`\`\`java
// Right triangle
for (int i = 1; i <= 5; i++) {
    for (int j = 1; j <= i; j++) {
        System.out.print("*");
    }
    System.out.println();
}
\`\`\`

Output:
\`\`\`
*
**
***
****
*****
\`\`\`

### Finding Pairs

\`\`\`java
int[] arr = {1, 2, 3, 4, 5};
int target = 7;

for (int i = 0; i < arr.length; i++) {
    for (int j = i + 1; j < arr.length; j++) {
        if (arr[i] + arr[j] == target) {
            System.out.println(arr[i] + " + " + arr[j] + " = " + target);
        }
    }
}
\`\`\`

## Common Patterns

### Summing Values

\`\`\`java
int[] numbers = {10, 20, 30, 40, 50};
int sum = 0;

for (int num : numbers) {
    sum += num;
}

System.out.println("Sum: " + sum);
\`\`\`

### Finding Maximum/Minimum

\`\`\`java
int[] numbers = {5, 2, 9, 1, 7};
int max = numbers[0];
int min = numbers[0];

for (int num : numbers) {
    if (num > max) {
        max = num;
    }
    if (num < min) {
        min = num;
    }
}

System.out.println("Max: " + max);
System.out.println("Min: " + min);
\`\`\`

### Searching Arrays

\`\`\`java
String[] names = {"Alice", "Bob", "Charlie", "Diana"};
String target = "Charlie";
boolean found = false;

for (String name : names) {
    if (name.equals(target)) {
        found = true;
        break;
    }
}

System.out.println(found ? "Found!" : "Not found");
\`\`\`

### Generating Sequences

\`\`\`java
// Fibonacci sequence
int n = 10;
int a = 0, b = 1;

System.out.print("Fibonacci: " + a + " " + b);

for (int i = 2; i < n; i++) {
    int next = a + b;
    System.out.print(" " + next);
    a = b;
    b = next;
}
\`\`\`

### Counting Occurrences

\`\`\`java
String text = "hello world hello java";
String word = "hello";
int count = 0;

String[] words = text.split(" ");

for (String w : words) {
    if (w.equals(word)) {
        count++;
    }
}

System.out.println("'" + word + "' appears " + count + " times");
\`\`\`

## Common Pitfalls

### Infinite Loops

Always ensure the loop condition becomes false:

\`\`\`java
// Dangerous - infinite loop!
for (int i = 0; i < 10; ) {
    System.out.println(i);
    // Missing i++!
}

// Correct
for (int i = 0; i < 10; i++) {
    System.out.println(i);
}
\`\`\`

### Off-by-One Errors

\`\`\`java
int[] arr = {10, 20, 30, 40, 50};

// Wrong - goes out of bounds!
for (int i = 0; i <= arr.length; i++) {
    System.out.println(arr[i]); // ArrayIndexOutOfBoundsException
}

// Correct
for (int i = 0; i < arr.length; i++) {
    System.out.println(arr[i]);
}
\`\`\`

### Empty Loop Bodies

\`\`\`java
// Accidental semicolon creates empty loop
for (int i = 0; i < 10; i++); {
    System.out.println("This only runs once!");
}

// Correct
for (int i = 0; i < 10; i++) {
    System.out.println("This runs 10 times!");
}
\`\`\`

### Modifying Collection While Iterating

\`\`\`java
List<String> list = new ArrayList<>();
list.add("A");
list.add("B");
list.add("C");

// Wrong - ConcurrentModificationException
for (String item : list) {
    if (item.equals("B")) {
        list.remove(item);
    }
}

// Correct - use iterator or traditional for
for (int i = list.size() - 1; i >= 0; i--) {
    if (list.get(i).equals("B")) {
        list.remove(i);
    }
}
\`\`\`

## Real-World Example: Processing Data

\`\`\`java
// Find valid email addresses from a list
String[] emails = {
    "user@example.com",
    "invalid-email",
    "another@example.org",
    "bad",
    "test@test.com"
};

List<String> validEmails = new ArrayList<>();

for (String email : emails) {
    // Simple validation: contains @ and .
    if (email.contains("@") && email.contains(".")) {
        validEmails.add(email);
    }
}

System.out.println("Valid emails: " + validEmails);
\`\`\`

## Try It Yourself

### Exercise 1: Factorial

Calculate factorial of a number:

\`\`\`java
int n = 5;
int factorial = 1;

// Your code here
// 5! = 5 * 4 * 3 * 2 * 1 = 120

System.out.println(n + "! = " + factorial);
\`\`\`

### Exercise 2: Count Vowels

\`\`\`java
String text = "Hello World";
int vowelCount = 0;

// Your code here - count a, e, i, o, u (both cases)

System.out.println("Vowels: " + vowelCount);
\`\`\`

### Exercise 3: Reverse Array

\`\`\`java
int[] original = {1, 2, 3, 4, 5};
int[] reversed = new int[original.length];

// Your code here - reverse the array

System.out.println(Arrays.toString(reversed));
// Should print: [5, 4, 3, 2, 1]
\`\`\`

## Quick Reference

\`\`\`java
// Basic for loop
for (int i = 0; i < 10; i++) {
    // code
}

// Enhanced for loop
for (Type item : collection) {
    // code
}

// while loop
while (condition) {
    // code
}

// do-while loop
do {
    // code
} while (condition);

// break - exit loop
for (int i = 0; i < 10; i++) {
    if (someCondition) break;
}

// continue - skip iteration
for (int i = 0; i < 10; i++) {
    if (someCondition) continue;
}
\`\`\`

## What's Next?

Now let's practice with a FizzBuzz challenge!
`;

      await ctx.db.insert("curriculumItems", {
        moduleId: controlFlowModuleId,
        languageId,
        kind: "lesson",
        slug: "loops",
        title: "Loops: for, while, do-while",
        order: 3,
        content: loopsContent,
      });
    }

    // Challenge 4.4: FizzBuzz (multiple variations)
    const existingFizzBuzzChallenge = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "fizzbuzz")
      )
      .first();

    let fizzBuzzTestSuiteId;
    const existingFizzBuzzTestSuite = await ctx.db
      .query("testSuites")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "fizzbuzz")
      )
      .first();

    if (existingFizzBuzzTestSuite) {
      fizzBuzzTestSuiteId = existingFizzBuzzTestSuite._id;
    } else {
      const fizzBuzzTestSuiteDefinition = {
        type: "java",
        entrypoint: "FizzBuzz",
        tests: [
          {
            method: "fizzBuzz",
            input: [15],
            output: ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"],
            description: "FizzBuzz from 1 to 15",
          },
          {
            method: "fizzBuzz",
            input: [1],
            output: ["1"],
            description: "Single number (not multiple of 3 or 5)",
          },
          {
            method: "fizzBuzz",
            input: [3],
            output: ["1", "2", "Fizz"],
            description: "Multiple of 3",
          },
          {
            method: "fizzBuzz",
            input: [5],
            output: ["1", "2", "Fizz", "4", "Buzz"],
            description: "Multiple of 5",
          },
          {
            method: "fizzBuzz",
            input: [0],
            output: [],
            description: "Edge case: n=0 returns empty array",
          },
          {
            method: "fizzBuzzBang",
            input: [15],
            output: ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"],
            description: "FizzBuzzBang with n=15 (7 is Bang)",
          },
          {
            method: "fizzBuzzBang",
            input: [7],
            output: ["1", "2", "Fizz", "4", "Buzz", "Fizz", "Bang"],
            description: "FizzBuzzBang includes Bang for multiples of 7",
          },
        ],
      };

      fizzBuzzTestSuiteId = await ctx.db.insert("testSuites", {
        languageId,
        slug: "fizzbuzz",
        title: "FizzBuzz - Public Tests",
        definition: fizzBuzzTestSuiteDefinition,
      });
    }

    if (!existingFizzBuzzChallenge) {
      const fizzBuzzStarterCode = `import java.util.ArrayList;
import java.util.List;

public class FizzBuzz {

    /**
     * Basic FizzBuzz implementation.
     * For numbers 1 to n:
     * - Multiples of 3 print "Fizz"
     * - Multiples of 5 print "Buzz"
     * - Multiples of both print "FizzBuzz"
     * - Otherwise print the number
     *
     * @param n The upper limit (inclusive)
     * @return List of strings from 1 to n with FizzBuzz replacements
     */
    public List<String> fizzBuzz(int n) {
        List<String> result = new ArrayList<>();

        for (int i = 1; i <= n; i++) {
            // TODO: Implement FizzBuzz logic
            result.add(String.valueOf(i));
        }

        return result;
    }

    /**
     * FizzBuzzBang variation with an extra condition.
     * - Multiples of 3 print "Fizz"
     * - Multiples of 5 print "Buzz"
     * - Multiples of 7 print "Bang"
     * - Multiples of 3 and 5 print "FizzBuzz"
     * - Multiples of 3 and 7 print "FizzBang"
     * - Multiples of 5 and 7 print "BuzzBang"
     * - Multiples of 3, 5, and 7 print "FizzBuzzBang"
     * - Otherwise print the number
     *
     * @param n The upper limit (inclusive)
     * @return List of strings from 1 to n with FizzBuzzBang replacements
     */
    public List<String> fizzBuzzBang(int n) {
        List<String> result = new ArrayList<>();

        for (int i = 1; i <= n; i++) {
            // TODO: Implement FizzBuzzBang logic
            result.add(String.valueOf(i));
        }

        return result;
    }

    /**
     * Reverse FizzBuzz - from n down to 1.
     *
     * @param n The starting number (inclusive)
     * @return List of strings from n down to 1 with FizzBuzz replacements
     */
    public List<String> fizzBuzzReverse(int n) {
        List<String> result = new ArrayList<>();

        // TODO: Implement reverse FizzBuzz

        return result;
    }

    /**
     * FizzBuzz with custom numbers.
     *
     * @param n The upper limit (inclusive)
     * @param fizzNum Number to replace with "Fizz"
     * @param buzzNum Number to replace with "Buzz"
     * @return List of strings from 1 to n with custom FizzBuzz replacements
     */
    public List<String> fizzBuzzCustom(int n, int fizzNum, int buzzNum) {
        List<String> result = new ArrayList<>();

        // TODO: Implement custom FizzBuzz

        return result;
    }
}
`;

      await validateTestSuiteLanguage(
        (id) => ctx.db.get(id),
        fizzBuzzTestSuiteId,
        languageId,
        "curriculum item 'FizzBuzz'"
      );

      await ctx.db.insert("curriculumItems", {
        moduleId: controlFlowModuleId,
        languageId,
        kind: "challenge",
        slug: "fizzbuzz",
        title: "FizzBuzz (Multiple Variations)",
        order: 4,
        prompt: `Implement the FizzBuzz challenge with multiple variations.

## Basic FizzBuzz

For numbers from 1 to n:
- Multiples of 3 → "Fizz"
- Multiples of 5 → "Buzz"
- Multiples of both (3 and 5) → "FizzBuzz"
- Otherwise → the number as a string

Example (n=15):
\`\`\`
1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, FizzBuzz
\`\`\`

## FizzBuzzBang

Same rules as basic FizzBuzz, but also:
- Multiples of 7 → "Bang"
- Handle all combinations (3&7="FizzBang", 5&7="BuzzBang", 3&5&7="FizzBuzzBang")

Example (n=21):
\`\`\`
1, 2, Fizz, 4, Buzz, Fizz, Bang, 8, Fizz, Buzz, 11, Fizz, 13, 14, FizzBuzz, 16, 17, Fizz, 19, Buzz, FizzBang
\`\`\`

## Reverse FizzBuzz

Same as basic FizzBuzz but count DOWN from n to 1.

Example (n=5):
\`\`\`
Buzz, 4, Fizz, 2, 1
\`\`\`

## Custom FizzBuzz

Use custom numbers for fizz and buzz instead of 3 and 5.

Tips:
- Check for combinations first (both fizz and buzz) before individual checks
- Use \`% (modulus)\` to check divisibility
- Use \`StringBuilder\` to build the output string for complex combinations
- Handle edge cases: n=0 returns empty array, negative n should also return empty array`,
        starterCode: fizzBuzzStarterCode,
        testSuiteId: fizzBuzzTestSuiteId,
      });
    }

    // Debug Exercise 4.5: Fix infinite loop issues
    const existingInfiniteLoopChallenge = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "debug-infinite-loops")
      )
      .first();

    let infiniteLoopTestSuiteId;
    const existingInfiniteLoopTestSuite = await ctx.db
      .query("testSuites")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "debug-infinite-loops")
      )
      .first();

    if (existingInfiniteLoopTestSuite) {
      infiniteLoopTestSuiteId = existingInfiniteLoopTestSuite._id;
    } else {
      const infiniteLoopTestSuiteDefinition = {
        type: "java",
        entrypoint: "LoopDebugger",
        tests: [
          {
            method: "sumFirstN",
            input: [5],
            output: 15,
            description: "Sum of first 5 numbers should be 15",
          },
          {
            method: "sumFirstN",
            input: [10],
            output: 55,
            description: "Sum of first 10 numbers should be 55",
          },
          {
            method: "countEvenNumbers",
            input: [10],
            output: 5,
            description: "Count of even numbers from 1 to 10 should be 5",
          },
          {
            method: "countEvenNumbers",
            input: [20],
            output: 10,
            description: "Count of even numbers from 1 to 20 should be 10",
          },
          {
            method: "findFirstOccurrence",
            input: [[1, 2, 3, 4, 5], 3],
            output: 2,
            description: "First occurrence of 3 in [1,2,3,4,5] is at index 2",
          },
          {
            method: "findFirstOccurrence",
            input: [[1, 2, 3, 4, 5], 6],
            output: -1,
            description: "Element 6 not found should return -1",
          },
          {
            method: "printStars",
            input: [3],
            output: null,
            description: "printStars(3) should print star pattern correctly",
          },
        ],
      };

      infiniteLoopTestSuiteId = await ctx.db.insert("testSuites", {
        languageId,
        slug: "debug-infinite-loops",
        title: "Debug Infinite Loops - Public Tests",
        definition: infiniteLoopTestSuiteDefinition,
      });
    }

    if (!existingInfiniteLoopChallenge) {
      const infiniteLoopStarterCode = `import java.util.ArrayList;
import java.util.List;

public class LoopDebugger {

    /**
     * Problem 1: Sum of first n natural numbers
     * This method has an infinite loop - fix it!
     */
    public int sumFirstN(int n) {
        int sum = 0;
        int i = 1;

        while (i <= n) {
            sum += i;
            // BUG: Missing condition update!
        }

        return sum;
    }

    /**
     * Problem 2: Count even numbers from 1 to n
     * This method has the wrong update expression - fix it!
     */
    public int countEvenNumbers(int n) {
        int count = 0;

        for (int i = 1; i <= n; i--) {
            if (i % 2 == 0) {
                count++;
            }
        }

        return count;
    }

    /**
     * Problem 3: Find first occurrence of target in array
     * This method has off-by-one errors - fix them!
     */
    public int findFirstOccurrence(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Problem 4: Print a star pattern
     * This method has misplaced continue/break - fix it!
     */
    public void printStars(int rows) {
        for (int i = 1; i <= rows; i++) {
            for (int j = 1; j <= i; j++) {
                System.out.print("*");
                break;  // BUG: This breaks too early!
            }
            System.out.println();
        }
    }

    /**
     * Problem 5: Sum of array elements
     * This method has an empty loop body - fix it!
     */
    public int sumArray(int[] arr) {
        int sum = 0;

        for (int i = 0; i < arr.length; i++) ; {
            sum += arr[i];
        }

        return sum;
    }

    /**
     * Problem 6: Print numbers divisible by 3
     * This method has an issue - fix it!
     */
    public void printDivisibleBy3(int n) {
        for (int i = 1; i <= n; i++) {
            if (i % 3 != 0) {
                continue;
            }
            System.out.println(i);
        }
    }
}
// HINT: Check your loop condition and update statements!
// Common issues to look for:
// 1. Missing i++ or i-- in loops
// 2. Wrong comparison operators (i < vs i <=)
// 3. Break/continue in wrong places
// 4. Semicolons after loop declarations
// 5. Infinite while loops`;

      await validateTestSuiteLanguage(
        (id) => ctx.db.get(id),
        infiniteLoopTestSuiteId,
        languageId,
        "curriculum item 'Debug Infinite Loops'"
      );

      await ctx.db.insert("curriculumItems", {
        moduleId: controlFlowModuleId,
        languageId,
        kind: "challenge",
        slug: "debug-infinite-loops",
        title: "Debug Exercise: Fix Infinite Loop Issues",
        order: 5,
        prompt: `Fix the infinite loop and other loop issues in the provided code.

## Problems to Fix

### Problem 1: Infinite while loop
- The \`sumFirstN\` method has an infinite while loop
- The loop variable never gets updated

### Problem 2: Wrong update expression
- The \`countEvenNumbers\` loop decrements instead of increments
- This causes either an infinite loop or incorrect behavior

### Problem 3: Off-by-one errors
- The \`findFirstOccurrence\` method may have off-by-one issues
- Check the loop bounds carefully

### Problem 4: Misplaced break
- The \`printStars\` method has a break in the wrong place
- This prevents the inner loop from working correctly

### Problem 5: Empty loop body
- The \`sumArray\` method has a semicolon after the for loop
- This creates an empty loop body

### Problem 6: Logic error
- The \`printDivisibleBy3\` method has a subtle issue
- The logic seems correct but verify it works as expected

## Common Loop Issues to Look For

1. **Missing loop counter update** - \`i++\` or \`i--\` is missing
2. **Wrong comparison** - Using \`<\` instead of \`<=\` or vice versa
3. **Semicolon after loop** - \`for (int i = 0; i < 10; i++); { }\`
4. **Break in wrong place** - Breaking too early in nested loops
5. **Empty loop body** - Loop body does nothing due to semicolon
6. **Update direction** - Decrementing when you should increment

## Tips

- Check each loop's termination condition
- Ensure loop variables are updated in each iteration
- Verify break/continue are where you intend them to be
- Look for accidental semicolons after loop declarations
- Trace through the loop manually for small inputs`,
        starterCode: infiniteLoopStarterCode,
        testSuiteId: infiniteLoopTestSuiteId,
      });
    }

    // Lesson 4.6: Ternary Operator & Conditional Expressions
    const existingTernaryLesson = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "ternary-operator")
      )
      .first();

    if (!existingTernaryLesson) {
      const ternaryContent = `# Ternary Operator & Conditional Expressions

The ternary operator is a compact way to write simple if-else logic.

## Syntax

\`\`\`java
condition ? valueIfTrue : valueIfFalse;
\`\`\`

## Example

\`\`\`java
int score = 72;
String result = score >= 60 ? "Pass" : "Fail";
\`\`\`

## Nested Ternary (Use Sparingly)

\`\`\`java
int grade = 85;
String letter = grade >= 90 ? "A"
    : grade >= 80 ? "B"
    : grade >= 70 ? "C"
    : "D";
\`\`\`

If it gets hard to read, switch to if-else.

## Ternary vs if-else

Use ternary when:
- The condition is simple
- You're assigning a value
- The expression is short

Use if-else when:
- You need multiple statements
- Logic is complex
- Readability matters more than brevity

## Common Pitfall

Ternary is an **expression**, not a statement:

\`\`\`java
// Good
String label = isActive ? "Active" : "Inactive";

// Not allowed
// isActive ? System.out.println("Yes") : System.out.println("No");
\`\`\`

## What's Next?

Now that you can control flow and loops, let's dive into arrays and strings.
`;

      await ctx.db.insert("curriculumItems", {
        moduleId: controlFlowModuleId,
        languageId,
        kind: "lesson",
        slug: "ternary-operator",
        title: "Ternary Operator & Conditional Expressions",
        order: 6,
        content: ternaryContent,
      });
    }

    // ============================================
    // NUMBER GUESSING GAME PROJECT (Module 4)
    // ============================================

    const existingNumberGuessingTestSuite = await ctx.db
      .query("testSuites")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "number-guessing-game")
      )
      .first();

    let numberGuessingTestSuiteId;
    if (existingNumberGuessingTestSuite) {
      numberGuessingTestSuiteId = existingNumberGuessingTestSuite._id;
    } else {
      const numberGuessingTestSuiteDefinition = {
        type: "java",
        entrypoint: "NumberGuessingGame",
        tests: [
          {
            method: "generateRandomNumber",
            input: [1, 100],
            output: null,
            description: "Generates a random number between 1 and 100",
          },
          {
            method: "checkGuess",
            input: [50, 30],
            output: "too low",
            description: "Guess 30 when answer is 50 is too low",
          },
          {
            method: "checkGuess",
            input: [50, 70],
            output: "too high",
            description: "Guess 70 when answer is 50 is too high",
          },
          {
            method: "checkGuess",
            input: [50, 50],
            output: "correct",
            description: "Guess 50 when answer is 50 is correct",
          },
          {
            method: "isValidGuess",
            input: [50],
            output: true,
            description: "Valid guess within range",
          },
          {
            method: "isValidGuess",
            input: [0],
            output: false,
            description: "Invalid guess (below minimum)",
          },
          {
            method: "isValidGuess",
            input: [101],
            output: false,
            description: "Invalid guess (above maximum)",
          },
          {
            method: "isValidGuess",
            input: [-5],
            output: false,
            description: "Invalid guess (negative)",
          },
        ],
      };

      numberGuessingTestSuiteId = await ctx.db.insert("testSuites", {
        languageId,
        slug: "number-guessing-game",
        title: "Number Guessing Game - Public Tests",
        definition: numberGuessingTestSuiteDefinition,
      });
    }

    const existingNumberGuessingProject = await ctx.db
      .query("projects")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "number-guessing-game")
      )
      .first();

    if (!existingNumberGuessingProject) {
      const numberGuessingInstructions = `# Number Guessing Game

Build a command-line number guessing game where the user tries to guess a randomly generated number.

## Project Overview

You will create an interactive game where:
1. The computer picks a random number between 1 and 100
2. The user tries to guess the number
3. The game provides feedback: "too high", "too low", or "correct"
4. The game tracks the number of guesses
5. The user can play again after winning

## Requirements

Your game must:

1. **Generate a random number** between 1 and 100
2. **Prompt for user guesses** with clear messages
3. **Provide feedback**: "too high", "too low", or "correct"
4. **Track number of guesses** and display it when the user wins
5. **Offer play again option** after each game
6. **Validate input**: Only accept numbers within the valid range
7. **Optional: Difficulty levels** (1-50, 1-100, 1-500)

## Project Structure

You will work with two main files:

### NumberGuessingGame.java
Contains the game logic and helper methods.

### Main.java
Contains the CLI interface that interacts with the user.

## Implementation Details

### NumberGuessingGame Class Requirements

Your \`NumberGuessingGame\` class should include:

\`\`\`java
import java.util.Random;

public class NumberGuessingGame {
    private int targetNumber;
    private int minRange;
    private int maxRange;
    private int guessCount;
    private Random random;

    /**
     * Constructor - initializes the game with default range (1-100)
     */
    public NumberGuessingGame() {
        this(1, 100);
    }

    /**
     * Constructor - initializes the game with custom range
     * 
     * @param min minimum value (inclusive)
     * @param max maximum value (inclusive)
     */
    public NumberGuessingGame(int min, int max) {
        // TODO: Initialize fields
        // TODO: Generate random number
    }

    /**
     * Generates a random number within the game's range
     * 
     * @param min minimum value
     * @param max maximum value
     * @return random number between min and max (inclusive)
     */
    public int generateRandomNumber(int min, int max) {
        // TODO: Implement
    }

    /**
     * Checks if the user's guess is correct, too high, or too low
     * 
     * @param guess the user's guess
     * @return "correct", "too high", or "too low"
     */
    public String checkGuess(int guess) {
        // TODO: Implement
    }

    /**
     * Validates if a guess is within the valid range
     * 
     * @param guess the guess to validate
     * @return true if valid, false otherwise
     */
    public boolean isValidGuess(int guess) {
        // TODO: Implement
    }

    /**
     * Increments the guess counter
     */
    public void incrementGuessCount() {
        // TODO: Implement
    }

    /**
     * Gets the current guess count
     * 
     * @return number of guesses made
     */
    public int getGuessCount() {
        // TODO: Implement
    }

    /**
     * Resets the game with a new random number
     */
    public void reset() {
        // TODO: Implement
    }

    /**
     * Resets the game with a new range
     * 
     * @param min new minimum
     * @param max new maximum
     */
    public void reset(int min, int max) {
        // TODO: Implement
    }

    /**
     * Gets the target number (for testing purposes)
     * 
     * @return the target number
     */
    public int getTargetNumber() {
        return targetNumber;
    }
}
\`\`\`

### Main Class Requirements

Your \`Main\` class should:

1. Create a \`NumberGuessingGame\` instance
2. Create a \`Scanner\` to read user input
3. Display welcome message and game instructions
4. Loop until the user guesses correctly
5. Provide feedback after each guess
6. Display the number of guesses when correct
7. Ask if the user wants to play again
8. Handle invalid input gracefully

## User Interface Example

\`\`\`
=== Number Guessing Game ===
I'm thinking of a number between 1 and 100.
Can you guess what it is?

Enter your guess: 50
Too high! Try again.

Enter your guess: 25
Too low! Try again.

Enter your guess: 37
Too high! Try again.

Enter your guess: 31
Congratulations! You guessed it in 4 guesses!

Play again? (yes/no): yes

=== Number Guessing Game ===
I'm thinking of a number between 1 and 100.
Can you guess what it is?

Enter your guess: abc
Invalid input. Please enter a number.

Enter your guess: 150
Invalid input. Please enter a number between 1 and 100.

Enter your guess: 75
Too high! Try again.
...
\`\`\`

## Optional: Difficulty Levels

Add difficulty selection at the start:

\`\`\`java
Select difficulty:
1. Easy (1-50)
2. Medium (1-100)
3. Hard (1-500)

Enter choice: 2
\`\`\`

## Error Handling

1. **Non-numeric input**: Display error message and prompt again
2. **Out of range**: Display error with valid range and prompt again
3. **Empty input**: Handle gracefully

## Tips

- Use \`Random.nextInt(max - min + 1) + min\` for random numbers in a range
- Use \`scanner.hasNextInt()\` to check if input is a number
- Use \`scanner.nextLine()\` to clear the buffer after reading a number
- Consider using a do-while loop for the main game loop
- Validate input before calling game methods
- Track guess count and display it when the user wins

## Game Logic Flow

\`\`\`
1. Create NumberGuessingGame instance
2. Display welcome message
3. (Optional) Select difficulty
4. Start game loop:
   a. Prompt for guess
   b. Validate input (numbers only, within range)
   c. Check guess
   d. Provide feedback (too high/low/correct)
   e. Increment guess count
   f. If correct:
      - Display congratulations
      - Show number of guesses
      - Ask to play again
      - If yes, reset and continue
      - If no, exit
5. Close scanner and exit
\`\`\`

## Rubric

Your project will be evaluated based on:

1. **Core game logic** (30%)
   - Random number generation works correctly
   - Guess checking (too high/low/correct) is accurate
   - Input validation is proper

2. **Game flow** (25%)
   - Clear prompts and messages
   - Correct feedback after each guess
   - Proper guess tracking

3. **Play again feature** (20%)
   - Allows multiple games in one session
   - Properly resets game state
   - Clear exit option

4. **Error handling** (15%)
   - Handles non-numeric input
   - Handles out-of-range input
   - Prevents crashes

5. **Code quality** (10%)
   - Follows Java naming conventions
   - Includes Javadoc comments
   - Clean, readable code
   - Proper organization

## Testing Your Game

Test with various scenarios:
- Guess correctly on first try
- Guess too low, then too high, then correct
- Enter non-numeric input
- Enter numbers outside range
- Play multiple games
- Test edge cases (1, 100, 0, 101)
`;

      const numberGuessingInitialFiles = [
        {
          path: "NumberGuessingGame.java",
          content: `import java.util.Random;

/**
 * A number guessing game where the user tries to guess a randomly generated number.
 * The game provides feedback ("too high", "too low", or "correct") and tracks guesses.
 */
public class NumberGuessingGame {
    private int targetNumber;
    private int minRange;
    private int maxRange;
    private int guessCount;
    private Random random;

    /**
     * Constructor - initializes the game with default range (1-100)
     */
    public NumberGuessingGame() {
        this(1, 100);
    }

    /**
     * Constructor - initializes the game with custom range
     * 
     * @param min minimum value (inclusive)
     * @param max maximum value (inclusive)
     */
    public NumberGuessingGame(int min, int max) {
        this.minRange = min;
        this.maxRange = max;
        this.random = new Random();
        this.guessCount = 0;
        generateRandomNumber();
    }

    /**
     * Generates a random number within the game's range
     * 
     * @param min minimum value
     * @param max maximum value
     * @return random number between min and max (inclusive)
     */
    public int generateRandomNumber(int min, int max) {
        return random.nextInt(max - min + 1) + min;
    }

    /**
     * Generates a random number within the game's current range
     */
    private void generateRandomNumber() {
        targetNumber = generateRandomNumber(minRange, maxRange);
    }

    /**
     * Checks if the user's guess is correct, too high, or too low
     * 
     * @param guess the user's guess
     * @return "correct", "too high", or "too low"
     */
    public String checkGuess(int guess) {
        if (guess == targetNumber) {
            return "correct";
        } else if (guess > targetNumber) {
            return "too high";
        } else {
            return "too low";
        }
    }

    /**
     * Validates if a guess is within the valid range
     * 
     * @param guess the guess to validate
     * @return true if valid, false otherwise
     */
    public boolean isValidGuess(int guess) {
        return guess >= minRange && guess <= maxRange;
    }

    /**
     * Increments the guess counter
     */
    public void incrementGuessCount() {
        guessCount++;
    }

    /**
     * Gets the current guess count
     * 
     * @return number of guesses made
     */
    public int getGuessCount() {
        return guessCount;
    }

    /**
     * Resets the game with a new random number
     */
    public void reset() {
        reset(minRange, maxRange);
    }

    /**
     * Resets the game with a new range
     * 
     * @param min new minimum
     * @param max new maximum
     */
    public void reset(int min, int max) {
        this.minRange = min;
        this.maxRange = max;
        this.guessCount = 0;
        generateRandomNumber();
    }

    /**
     * Gets the target number (for testing purposes)
     * 
     * @return the target number
     */
    public int getTargetNumber() {
        return targetNumber;
    }

    /**
     * Gets the minimum range value
     * 
     * @return minimum value
     */
    public int getMinRange() {
        return minRange;
    }

    /**
     * Gets the maximum range value
     * 
     * @return maximum value
     */
    public int getMaxRange() {
        return maxRange;
    }
}
`,
        },
        {
          path: "Main.java",
          content: `import java.util.Scanner;

/**
 * Command-line interface for the NumberGuessingGame.
 * Provides an interactive menu for playing the guessing game.
 */
public class Main {
    public static void main(String[] args) {
        NumberGuessingGame game = new NumberGuessingGame();
        Scanner scanner = new Scanner(System.in);
        boolean playing = true;

        System.out.println("=== Number Guessing Game ===");
        System.out.println("I'm thinking of a number between " + 
                          game.getMinRange() + " and " + game.getMaxRange() + ".");
        System.out.println("Can you guess what it is?\\n");

        while (playing) {
            int guess;
            boolean validGuess = false;

            while (!validGuess) {
                System.out.print("Enter your guess: ");

                if (scanner.hasNextInt()) {
                    guess = scanner.nextInt();

                    if (game.isValidGuess(guess)) {
                        game.incrementGuessCount();
                        String result = game.checkGuess(guess);

                        if (result.equals("correct")) {
                            System.out.println("Congratulations! You guessed it in " + 
                                             game.getGuessCount() + " guesses!");
                            validGuess = true;
                        } else {
                            System.out.println(result.substring(0, 1).toUpperCase() + 
                                             result.substring(1) + "! Try again.\\n");
                        }
                    } else {
                        System.out.println("Invalid input. Please enter a number between " + 
                                         game.getMinRange() + " and " + game.getMaxRange() + ".");
                        scanner.nextLine(); // Clear input
                    }
                } else {
                    System.out.println("Invalid input. Please enter a number.");
                    scanner.nextLine(); // Clear invalid input
                }
            }

            System.out.print("\\nPlay again? (yes/no): ");
            String response = scanner.next().trim().toLowerCase();
            scanner.nextLine(); // Consume newline

            if (response.equals("yes") || response.equals("y")) {
                game.reset();
                System.out.println("\\n=== Number Guessing Game ===");
                System.out.println("I'm thinking of a number between " + 
                                  game.getMinRange() + " and " + game.getMaxRange() + ".");
                System.out.println("Can you guess what it is?\\n");
            } else {
                playing = false;
                System.out.println("Thanks for playing! Goodbye!");
            }
        }

        scanner.close();
    }
}
`,
        },
      ];

      const numberGuessingRubric = [
        { id: "1", text: "Game generates random number within specified range" },
        { id: "2", text: "Guess checking returns correct feedback (too high/low/correct)" },
        { id: "3", text: "Input validation handles non-numeric and out-of-range input" },
        { id: "4", text: "Guess count is tracked and displayed correctly" },
        { id: "5", text: "Play again feature allows multiple games and resets properly" },
        { id: "6", text: "CLI provides clear prompts, feedback, and instructions" },
        { id: "7", text: "Code follows Java naming conventions and includes Javadoc" },
      ];

      await validateTestSuiteLanguage(
        (id) => ctx.db.get(id),
        numberGuessingTestSuiteId,
        languageId,
        "project 'Number Guessing Game'"
      );

      await ctx.db.insert("projects", {
        languageId,
        slug: "number-guessing-game",
        title: "Number Guessing Game",
        description: "Build a CLI number guessing game with feedback and guess tracking",
        instructions: numberGuessingInstructions,
        initialFiles: numberGuessingInitialFiles,
        rubric: numberGuessingRubric,
        testSuiteId: numberGuessingTestSuiteId,
        order: 2,
      });
    }

    // ============================================
    // ARRAYS & STRINGS MODULE (Module 5)
    // ============================================

    // Create or get module: Arrays & Strings
    const existingArraysAndStringsModule = await ctx.db
      .query("modules")
      .withIndex("by_track_slug", (q) =>
        q.eq("trackId", trackId).eq("slug", "arrays-and-strings")
      )
      .first();

    let arraysAndStringsModuleId;
    if (existingArraysAndStringsModule) {
      arraysAndStringsModuleId = existingArraysAndStringsModule._id;
    } else {
      arraysAndStringsModuleId = await ctx.db.insert("modules", {
        trackId,
        slug: "arrays-and-strings",
        title: "Arrays & Strings",
        description: "Working with arrays and string manipulation in Java",
        order: 5,
      });
    }

    // Lesson 5.1: Array basics & initialization
    const existingArrayBasicsLesson = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "array-basics")
      )
      .first();

    if (!existingArrayBasicsLesson) {
      const arrayBasicsContent = `# Array Basics & Initialization

## What is an Array?

An array is a **fixed-size collection** of elements of the same type stored in contiguous memory locations. Think of it as a row of boxes where each box can hold one item, and all boxes must hold the same type of item.

### Key Characteristics

- **Fixed size**: Once created, an array's length cannot change
- **Same type**: All elements must be of the same data type
- **0-indexed**: The first element is at index 0
- **Contiguous memory**: Elements are stored next to each other in memory

## Array Declaration Syntax

There are multiple ways to declare arrays in Java:

\`\`\`java
// Method 1: Declare and initialize with values
int[] numbers = {1, 2, 3, 4, 5};

// Method 2: Declare with new keyword
int[] numbers = new int[5];  // Creates array of size 5 with default values

// Method 3: Declare first, initialize later
int[] numbers;
numbers = new int[5];

// Alternative syntax (C-style - less common)
int numbers[] = {1, 2, 3};  // Works but not recommended
\`\`\`

## Array Initialization

### Initialization with Values

\`\`\`java
int[] primes = {2, 3, 5, 7, 11, 13};
double[] prices = {19.99, 29.99, 9.99};
String[] names = {"Alice", "Bob", "Charlie"};
boolean[] flags = {true, false, true};
char[] letters = {'A', 'B', 'C'};
\`\`\`

### Initialization with \`new\`

\`\`\`java
// Specify size only
int[] arr = new int[5];

// Specify size and initialize
int[] arr = new int[]{1, 2, 3, 4, 5};
\`\`\`

## Default Values for Arrays

When you create an array with \`new\` without providing values, Java assigns default values:

| Type | Default Value |
|------|--------------|
| \`byte\`, \`short\`, \`int\`, \`long\` | 0 |
| \`float\`, \`double\` | 0.0 |
| \`boolean\` | false |
| \`char\` | \`'\\u0000'\` (null character) |
| Object types (e.g., \`String[]\`) | \`null\` |

\`\`\`java
int[] numbers = new int[3];        // [0, 0, 0]
double[] decimals = new double[2]; // [0.0, 0.0]
boolean[] flags = new boolean[4];  // [false, false, false, false]
String[] texts = new String[2];    // [null, null]
\`\`\`

## Accessing Array Elements

Arrays use **0-based indexing**:

\`\`\`java
int[] numbers = {10, 20, 30, 40, 50};

System.out.println(numbers[0]);  // 10 (first element)
System.out.println(numbers[2]);  // 30 (third element)
System.out.println(numbers[4]);  // 50 (last element)

// Modifying elements
numbers[1] = 99;  // Now: {10, 99, 30, 40, 50}
\`\`\`

### ArrayIndexOutOfBoundsException

Accessing an index outside the array bounds throws an exception:

\`\`\`java
int[] arr = {1, 2, 3};
System.out.println(arr[3]);  // Runtime exception: index 3, size 3
System.out.println(arr[-1]);  // Runtime exception: index -1
\`\`\`

## Array.length Property

The \`length\` property (not a method!) returns the array size:

\`\`\`java
int[] numbers = {1, 2, 3, 4, 5};
System.out.println(numbers.length);  // 5

// Common pattern: iterating through all elements
for (int i = 0; i < numbers.length; i++) {
    System.out.println(numbers[i]);
}
\`\`\`

**Important**: Use \`length\` (property) for arrays, \`length()\` (method) for strings!

## Iterating Over Arrays

### Traditional For Loop

\`\`\`java
int[] numbers = {1, 2, 3, 4, 5};

for (int i = 0; i < numbers.length; i++) {
    System.out.println("Element at index " + i + ": " + numbers[i]);
}
\`\`\`

### Enhanced For Loop (For-Each)

Best when you only need to read values (not modify or need indices):

\`\`\`java
int[] numbers = {1, 2, 3, 4, 5};

for (int num : numbers) {
    System.out.println(num);
}
\`\`\`

Note: Cannot modify array elements in enhanced for loop, and cannot access index.

## Multidimensional Arrays (2D Arrays)

### Declaring and Initializing 2D Arrays

\`\`\`java
// Method 1: Initialize with values
int[][] matrix = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};

// Method 2: Declare with new keyword
int[][] matrix = new int[3][4];  // 3 rows, 4 columns

// Jagged array (different row lengths)
int[][] jagged = {
    {1, 2},
    {3, 4, 5},
    {6}
};
\`\`\`

### Accessing 2D Array Elements

\`\`\`java
int[][] matrix = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};

System.out.println(matrix[0][0]);  // 1 (first row, first column)
System.out.println(matrix[1][2]);  // 6 (second row, third column)
System.out.println(matrix.length);  // 3 (number of rows)
System.out.println(matrix[0].length); // 3 (number of columns in first row)
\`\`\`

### Iterating Through 2D Arrays

\`\`\`java
int[][] matrix = {{1, 2}, {3, 4}, {5, 6}};

for (int i = 0; i < matrix.length; i++) {
    for (int j = 0; j < matrix[i].length; j++) {
        System.out.print(matrix[i][j] + " ");
    }
    System.out.println();
}
\`\`\`

## Common Array Patterns

### Summing Array Elements

\`\`\`java
int[] numbers = {1, 2, 3, 4, 5};
int sum = 0;

for (int num : numbers) {
    sum += num;
}

System.out.println("Sum: " + sum);  // Sum: 15
\`\`\`

### Finding Minimum and Maximum

\`\`\`java
int[] numbers = {42, 17, 89, 3, 27};

int min = numbers[0];
int max = numbers[0];

for (int num : numbers) {
    if (num < min) {
        min = num;
    }
    if (num > max) {
        max = num;
    }
}

System.out.println("Min: " + min);  // Min: 3
System.out.println("Max: " + max);  // Max: 89
\`\`\`

### Checking for Existence (Linear Search)

\`\`\`java
int[] numbers = {10, 20, 30, 40, 50};
int target = 30;
boolean found = false;

for (int num : numbers) {
    if (num == target) {
        found = true;
        break;
    }
}

System.out.println("Found " + target + ": " + found);  // Found 30: true
\`\`\`

### Reversing an Array

\`\`\`java
int[] numbers = {1, 2, 3, 4, 5};
int left = 0;
int right = numbers.length - 1;

while (left < right) {
    // Swap elements
    int temp = numbers[left];
    numbers[left] = numbers[right];
    numbers[right] = temp;
    left++;
    right--;
}

// Now numbers = {5, 4, 3, 2, 1}
\`\`\`

## Common Pitfalls

### 1. ArrayIndexOutOfBoundsException

\`\`\`java
int[] arr = {1, 2, 3};

// ❌ Wrong - goes beyond last index
for (int i = 0; i <= arr.length; i++) {
    System.out.println(arr[i]);  // Crashes at i = 3
}

// ✅ Correct - stops at last index
for (int i = 0; i < arr.length; i++) {
    System.out.println(arr[i]);
}
\`\`\`

### 2. Confusing length with last index

\`\`\`java
int[] arr = {10, 20, 30};

// ❌ Wrong - length is 3, last index is 2
int lastElement = arr[arr.length];  // Exception!

// ✅ Correct - last index is length - 1
int lastElement = arr[arr.length - 1];  // 30
\`\`\`

### 3. Forgetting to initialize array elements

\`\`\`java
int[] numbers = new int[5];

// ❌ Assuming all values are set
for (int i = 0; i < numbers.length; i++) {
    System.out.println(numbers[i]);  // Prints 0, 0, 0, 0, 0
}

// ✅ Initialize before use
for (int i = 0; i < numbers.length; i++) {
    numbers[i] = i * 10;
}
\`\`\`

### 4. Using wrong loop for modification

\`\`\`java
int[] numbers = {1, 2, 3};

// ❌ Enhanced for loop doesn't modify array
for (int num : numbers) {
    num = num * 2;  // This only changes the local variable 'num'
}
// numbers is still {1, 2, 3}

// ✅ Traditional for loop for modification
for (int i = 0; i < numbers.length; i++) {
    numbers[i] = numbers[i] * 2;
}
// numbers is now {2, 4, 6}
\`\`\`

## Try It Yourself

### Exercise 1: Array Statistics

Write a program that finds the sum, average, min, and max of an array:

\`\`\`java
int[] data = {45, 72, 34, 89, 23, 56, 11, 90, 67, 43};

// TODO: Calculate and print:
// - Sum
// - Average
// - Minimum
// - Maximum
\`\`\`

### Exercise 2: Filter Array

Create a new array containing only even numbers from the original:

\`\`\`java
int[] numbers = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};

// TODO: Create new array with only even numbers
// Expected output: [2, 4, 6, 8, 10]
\`\`\`

## Quick Reference

| Operation | Code |
|-----------|------|
| Declare array | \`int[] arr = new int[5];\` |
| Initialize with values | \`int[] arr = {1, 2, 3};\` |
| Get length | \`arr.length;\` |
| Access element | \`arr[0];\` |
| Traditional loop | \`for (int i = 0; i < arr.length; i++) {}\` |
| Enhanced loop | \`for (int x : arr) {}\` |
| 2D array | \`int[][] matrix = new int[3][3];\` |

## What's Next?

Now that you understand array basics, let's explore built-in array operations like sorting and searching!
`;

      await ctx.db.insert("curriculumItems", {
        moduleId: arraysAndStringsModuleId,
        languageId,
        kind: "lesson",
        slug: "array-basics",
        title: "Array Basics & Initialization",
        order: 1,
        content: arrayBasicsContent,
      });
    }

    // Lesson 5.2: Array operations (sort, search)
    const existingArrayOperationsLesson = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "array-operations")
      )
      .first();

    if (!existingArrayOperationsLesson) {
      const arrayOperationsContent = `# Array Operations (Sort & Search)

## The Arrays Utility Class

Java provides the \`Arrays\` class (in \`java.util\` package) with many helpful methods for working with arrays. Make sure to import it:

\`\`\`java
import java.util.Arrays;
\`\`\`

## Printing Arrays: Arrays.toString()

Printing an array directly shows its memory address, not the contents:

\`\`\`java
int[] numbers = {1, 2, 3, 4, 5};

// ❌ Wrong - prints memory address
System.out.println(numbers);  // [I@7b23d6

// ✅ Correct - prints contents
System.out.println(Arrays.toString(numbers));  // [1, 2, 3, 4, 5]

// Works for multidimensional arrays too
int[][] matrix = {{1, 2}, {3, 4}};
System.out.println(Arrays.deepToString(matrix));  // [[1, 2], [3, 4]]
\`\`\`

## Comparing Arrays: Arrays.equals()

### 1D Arrays

\`\`\`java
int[] a = {1, 2, 3};
int[] b = {1, 2, 3};
int[] c = {1, 2, 4};

System.out.println(Arrays.equals(a, b));  // true
System.out.println(Arrays.equals(a, c));  // false

// Note: .equals() on array references does NOT work!
System.out.println(a.equals(b));  // false (compares references)
\`\`\`

### 2D Arrays

Use \`Arrays.deepEquals()\` for multidimensional arrays:

\`\`\`java
int[][] matrix1 = {{1, 2}, {3, 4}};
int[][] matrix2 = {{1, 2}, {3, 4}};

// ❌ Wrong for 2D
System.out.println(Arrays.equals(matrix1, matrix2));  // false

// ✅ Correct for 2D
System.out.println(Arrays.deepEquals(matrix1, matrix2));  // true
\`\`\`

## Sorting Arrays: Arrays.sort()

### Sorting Primitive Arrays

\`\`\`java
import java.util.Arrays;

int[] numbers = {5, 2, 8, 1, 9, 3};

System.out.println("Before: " + Arrays.toString(numbers));
// Before: [5, 2, 8, 1, 9, 3]

Arrays.sort(numbers);

System.out.println("After: " + Arrays.toString(numbers));
// After: [1, 2, 3, 5, 8, 9]
\`\`\`

**Note**: \`Arrays.sort()\` sorts primitive arrays in **ascending** order using a tuned version of quicksort (dual-pivot quicksort).

### Sorting String Arrays

\`\`\`java
String[] names = {"Charlie", "Alice", "Bob", "David"};

System.out.println("Before: " + Arrays.toString(names));
// Before: [Charlie, Alice, Bob, David]

Arrays.sort(names);

System.out.println("After: " + Arrays.toString(names));
// After: [Alice, Bob, Charlie, David]
\`\`\`

### Sorting Object Arrays (Requires Comparable)

For custom objects, the class must implement \`Comparable\`:

\`\`\`java
public class Student implements Comparable<Student> {
    private String name;
    private int grade;

    public Student(String name, int grade) {
        this.name = name;
        this.grade = grade;
    }

    @Override
    public int compareTo(Student other) {
        // Sort by grade
        return this.grade - other.grade;
    }

    @Override
    public String toString() {
        return name + "(" + grade + ")";
    }
}

// Usage
Student[] students = {
    new Student("Alice", 85),
    new Student("Bob", 92),
    new Student("Charlie", 78)
};

Arrays.sort(students);
// [Charlie(78), Alice(85), Bob(92)]
\`\`\`

## Binary Search: Arrays.binarySearch()

Binary search is much faster than linear search but **requires the array to be sorted** first!

### How It Works

- Time complexity: O(log n) - very fast!
- Requirement: Array must be sorted in ascending order
- Returns: Index of the element if found, negative number if not found

\`\`\`java
import java.util.Arrays;

int[] numbers = {1, 3, 5, 7, 9, 11, 13, 15};

// Search for element that exists
int index = Arrays.binarySearch(numbers, 7);
System.out.println("Index of 7: " + index);  // Index of 7: 3

// Search for element that doesn't exist
index = Arrays.binarySearch(numbers, 6);
System.out.println("Search for 6: " + index);  // -4 (insertion point)
\`\`\`

### Understanding Negative Return Values

If not found, the return value is: \`-(insertion point) - 1\`

The insertion point is the index where the element would be inserted to maintain sorted order.

\`\`\`java
int[] arr = {1, 3, 5, 7, 9};

// Searching for 4
// Would be inserted at index 2
// Returns: -(2) - 1 = -3
int result = Arrays.binarySearch(arr, 4);
System.out.println(result);  // -3
\`\`\`

## Copying Arrays

### Using Arrays.copyOf()

\`\`\`java
int[] original = {1, 2, 3, 4, 5};

// Copy entire array
int[] copy = Arrays.copyOf(original, original.length);
System.out.println(Arrays.toString(copy));  // [1, 2, 3, 4, 5]

// Copy first 3 elements
int[] partial = Arrays.copyOf(original, 3);
System.out.println(Arrays.toString(partial));  // [1, 2, 3]

// Copy to larger array (pads with zeros)
int[] extended = Arrays.copyOf(original, 8);
System.out.println(Arrays.toString(extended));  // [1, 2, 3, 4, 5, 0, 0, 0]
\`\`\`

### Using Arrays.copyOfRange()

\`\`\`java
int[] original = {0, 1, 2, 3, 4, 5, 6, 7, 8, 9};

// Copy elements from index 2 to 6 (exclusive)
int[] subarray = Arrays.copyOfRange(original, 2, 6);
System.out.println(Arrays.toString(subarray));  // [2, 3, 4, 5]
\`\`\`

## Common Patterns

### Finding Duplicates

\`\`\`java
public static void findDuplicates(int[] arr) {
    System.out.print("Duplicates: ");
    for (int i = 0; i < arr.length; i++) {
        for (int j = i + 1; j < arr.length; j++) {
            if (arr[i] == arr[j]) {
                System.out.print(arr[i] + " ");
                break;  // Print each duplicate once
            }
        }
    }
    System.out.println();
}

// Usage
int[] numbers = {1, 2, 3, 2, 4, 5, 3};
findDuplicates(numbers);  // Duplicates: 2 3
\`\`\`

### Removing Duplicates

\`\`\`java
public static int[] removeDuplicates(int[] arr) {
    // First sort the array
    Arrays.sort(arr);
    
    // Count unique elements
    int uniqueCount = 1;
    for (int i = 1; i < arr.length; i++) {
        if (arr[i] != arr[i - 1]) {
            uniqueCount++;
        }
    }
    
    // Create result array
    int[] result = new int[uniqueCount];
    result[0] = arr[0];
    int index = 1;
    
    for (int i = 1; i < arr.length; i++) {
        if (arr[i] != arr[i - 1]) {
            result[index++] = arr[i];
        }
    }
    
    return result;
}

// Usage
int[] numbers = {1, 2, 3, 2, 4, 5, 3};
int[] unique = removeDuplicates(numbers);
System.out.println(Arrays.toString(unique));  // [1, 2, 3, 4, 5]
\`\`\`

## Common Pitfalls

### 1. Using binarySearch on unsorted array

\`\`\`java
int[] unsorted = {5, 3, 1, 4, 2};

// ❌ Wrong - unpredictable results
int index = Arrays.binarySearch(unsorted, 3);
System.out.println(index);  // May return wrong index!

// ✅ Correct - sort first
Arrays.sort(unsorted);
index = Arrays.binarySearch(unsorted, 3);
\`\`\`

### 2. Forgetting Arrays.toString() for printing

\`\`\`java
int[] arr = {1, 2, 3};

// ❌ Prints memory address
System.out.println(arr);  // [I@7b23d6

// ✅ Prints contents
System.out.println(Arrays.toString(arr));  // [1, 2, 3]
\`\`\`

## Try It Yourself

### Exercise 1: Find Second Largest

Write a method to find the second largest element in an array (without sorting):

\`\`\`java
int[] numbers = {12, 35, 1, 10, 34, 1};

// TODO: Find and print the second largest element
// Expected: 34
\`\`\`

### Exercise 2: Rotate Array

Rotate an array to the right by k positions:

\`\`\`java
int[] arr = {1, 2, 3, 4, 5, 6, 7};
int k = 3;

// TODO: Rotate array to the right by k positions
// Expected: [5, 6, 7, 1, 2, 3, 4]
\`\`\`

## Quick Reference

| Operation | Code | Note |
|-----------|------|------|
| Print array | \`Arrays.toString(arr)\` | Use \`deepToString\` for 2D |
| Compare arrays | \`Arrays.equals(a, b)\` | Use \`deepEquals\` for 2D |
| Sort array | \`Arrays.sort(arr)\` | Ascending order |
| Binary search | \`Arrays.binarySearch(arr, key)\` | Array must be sorted |
| Copy array | \`Arrays.copyOf(arr, length)\` | Pads with zeros if longer |
| Copy range | \`Arrays.copyOfRange(arr, from, to)\` | \`to\` is exclusive |

## What's Next?

Now let's dive deep into String manipulation and learn about String immutability!
`;

      await ctx.db.insert("curriculumItems", {
        moduleId: arraysAndStringsModuleId,
        languageId,
        kind: "lesson",
        slug: "array-operations",
        title: "Array Operations (Sort & Search)",
        order: 2,
        content: arrayOperationsContent,
      });
    }

    // Lesson 5.3: String methods & immutability
    const existingStringMethodsLesson = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "string-methods")
      )
      .first();

    if (!existingStringMethodsLesson) {
      const stringMethodsContent = `# String Methods & Immutability

## String Immutability Explained

In Java, **Strings are immutable** - once created, they cannot be changed. This is a fundamental concept that affects how you work with strings.

### What Immutability Means

When you "modify" a String, you're actually creating a **new String** object:

\`\`\`java
String s = "Hello";
s = s + " World";

// The original "Hello" still exists in memory (until garbage collected)
// s now points to a new String object: "Hello World"
\`\`\`

### Why Immutability Matters

1. **Thread safety**: Strings can be safely shared between threads
2. **Security**: Passwords and sensitive data can't be accidentally modified
3. **Caching**: String literals can be cached in the string pool
4. **Hash stability**: String's hash code is cached (important for HashMap)

### Visualizing Immutability

\`\`\`java
String name = "Alice";
name.toUpperCase();  // Creates "ALICE" but doesn't change name
System.out.println(name);  // Still prints "Alice"

name = name.toUpperCase();  // Reassign name to the new String
System.out.println(name);  // Now prints "ALICE"
\`\`\`

## Creating String Objects

### String Literals (String Pool)

\`\`\`java
String s1 = "Hello";        // String literal - stored in string pool
String s2 = "Hello";        // Reuses the same string from pool

System.out.println(s1 == s2);  // true (same reference!)
\`\`\`

The **string pool** is a special area of memory where Java stores string literals to save memory.

### Using \`new\` Keyword

\`\`\`java
String s3 = new String("Hello");  // Creates new object (not in pool)
String s4 = new String("Hello");  // Creates another new object

System.out.println(s3 == s4);  // false (different objects!)
System.out.println(s3.equals(s4));  // true (same content)
\`\`\`

Using \`new String()\` always creates a new object, even if the value exists in the pool.

### String.valueOf() Methods

\`\`\`java
int num = 42;
double d = 3.14;
boolean flag = true;

String s1 = String.valueOf(num);    // "42"
String s2 = String.valueOf(d);      // "3.14"
String s3 = String.valueOf(flag);   // "true"

// Also works with other types
char[] chars = {'H', 'i'};
String s4 = String.valueOf(chars);  // "Hi"
\`\`\`

## Essential String Methods

### Length and Empty Check

\`\`\`java
String s = "Hello World";

System.out.println(s.length());     // 11
System.out.println(s.isEmpty());    // false
System.out.println("".isEmpty());   // true

// Check for empty or null
if (s != null && !s.isEmpty()) {
    System.out.println("String is not empty");
}
\`\`\`

### Accessing Characters

\`\`\`java
String s = "Hello";

// Get character at index
char c = s.charAt(0);  // 'H'
char c2 = s.charAt(4); // 'o'

// Loop through characters
for (int i = 0; i < s.length(); i++) {
    System.out.print(s.charAt(i) + " ");
}
// H e l l o
\`\`\`

### Substring

\`\`\`java
String s = "Hello World";

// From index to end
String sub1 = s.substring(6);  // "World"

// From begin index (inclusive) to end index (exclusive)
String sub2 = s.substring(0, 5);  // "Hello"

// Common pattern: extract first word
String sentence = "Java Programming";
String firstWord = sentence.substring(0, sentence.indexOf(" "));  // "Java"
\`\`\`

**Note**: \`substring(begin, end)\` includes \`begin\` but **excludes** \`end\`.

### Finding Characters and Substrings

\`\`\`java
String s = "Hello World Hello";

// Find first occurrence
int index1 = s.indexOf("World");  // 6
int index2 = s.indexOf("Hello");  // 0
int index3 = s.indexOf("xyz");    // -1 (not found)

// Find from specific index
int index4 = s.indexOf("Hello", 6);  // 12 (second "Hello")

// Find last occurrence
int lastIndex = s.lastIndexOf("Hello");  // 12

// Check if string contains another string
boolean contains = s.contains("World");  // true
boolean contains2 = s.contains("world"); // false (case sensitive)
\`\`\`

### Checking Start and End

\`\`\`java
String filename = "document.txt";
String url = "https://example.com";

boolean startsWith = filename.startsWith("doc");    // true
boolean endsWith = filename.endsWith(".txt");      // true
boolean endsWith2 = url.endsWith(".com");          // true

// Useful for filtering
if (filename.endsWith(".java")) {
    System.out.println("Java source file");
}
\`\`\`

### Case Conversion

\`\`\`java
String s = "Hello World";

String upper = s.toUpperCase();  // "HELLO WORLD"
String lower = s.toLowerCase();  // "hello world"

// Note: Original string is not modified (immutability!)
System.out.println(s);  // "Hello World"
\`\`\`

### Trimming Whitespace

\`\`\`java
String s = "  Hello World  ";

String trimmed = s.trim();
System.out.println("[" + s + "]");       // "[  Hello World  ]"
System.out.println("[" + trimmed + "]");  // "[Hello World]"
\`\`\`

\`trim()\` removes leading and trailing whitespace (spaces, tabs, newlines).

### Replacing Characters and Substrings

\`\`\`java
String s = "Hello World";

// Replace single character
String replaced = s.replace('o', 'a');  // "Hella Warld"

// Replace substring
String replaced2 = s.replace("World", "Java");  // "Hello Java"

// Replace all occurrences (uses regex)
String replaced3 = s.replaceAll("o", "a");  // "Hella Warld"

// Replace first occurrence
String replaced4 = s.replaceFirst("o", "a");  // "Hella World"
\`\`\`

### Splitting Strings

\`\`\`java
String sentence = "Java,Python,C++,JavaScript";

// Split by comma
String[] languages = sentence.split(",");
System.out.println(Arrays.toString(languages));
// [Java, Python, C++, JavaScript]

// Split by space (multiple spaces handled with regex)
String text = "Hello   World   Test";
String[] words = text.split("\\s+");
System.out.println(Arrays.toString(words));
// [Hello, World, Test]

// Split with limit
String data = "1,2,3,4,5";
String[] firstThree = data.split(",", 3);  // Split into max 3 parts
System.out.println(Arrays.toString(firstThree));
// [1, 2, 3,4,5]
\`\`\`

## String Comparison

### equals() vs == (Critical!)

This is the **most common mistake** Java beginners make!

\`\`\`java
String s1 = "Hello";
String s2 = new String("Hello");
String s3 = "Hello";

// == compares references (memory addresses)
System.out.println(s1 == s2);   // false (different objects)
System.out.println(s1 == s3);   // true (same reference from string pool)

// equals() compares content
System.out.println(s1.equals(s2));  // true (same content)
System.out.println(s1.equals(s3));  // true (same content)
\`\`\`

**Rule of thumb**: Always use \`equals()\` to compare string contents!

### equalsIgnoreCase()

\`\`\`java
String s1 = "Hello";
String s2 = "hello";

System.out.println(s1.equals(s2));           // false (case sensitive)
System.out.println(s1.equalsIgnoreCase(s2)); // true (case insensitive)
\`\`\`

### compareTo()

Returns:
- Negative if \`this\` comes before \`other\` lexicographically
- Zero if equal
- Positive if \`this\` comes after \`other\`

\`\`\`java
String s1 = "Apple";
String s2 = "Banana";

System.out.println(s1.compareTo(s2));  // -1 (Apple < Banana)
System.out.println(s2.compareTo(s1));  // 1  (Banana > Apple)
System.out.println(s1.compareTo("Apple"));  // 0 (equal)
\`\`\`

## String Concatenation

### + Operator

\`\`\`java
String firstName = "John";
String lastName = "Doe";
String fullName = firstName + " " + lastName;  // "John Doe"

// Works with other types too
int age = 30;
String message = "Age: " + age;  // "Age: 30"
\`\`\`

**Performance note**: Using \`+\` in a loop creates many temporary String objects. Use \`StringBuilder\` instead.

### concat() Method

\`\`\`java
String s1 = "Hello";
String s2 = " World";
String result = s1.concat(s2);  // "Hello World"

// Same as s1 + s2
\`\`\`

### StringBuilder for Multiple Concatenations

\`\`\`java
// ❌ Inefficient - creates many intermediate objects
String result = "";
for (int i = 0; i < 1000; i++) {
    result += i;  // Creates new String each time
}

// ✅ Efficient - uses mutable StringBuilder
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append(i);
}
String result = sb.toString();
\`\`\`

**Performance comparison**:
- \`+\` in loop: O(n²) time complexity
- \`StringBuilder\`: O(n) time complexity

## Common Patterns

### Checking Palindrome

\`\`\`java
public static boolean isPalindrome(String s) {
    int left = 0;
    int right = s.length() - 1;
    
    while (left < right) {
        if (s.charAt(left) != s.charAt(right)) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}

// Usage
System.out.println(isPalindrome("racecar"));  // true
System.out.println(isPalindrome("hello"));    // false
\`\`\`

### Counting Characters

\`\`\`java
public static Map<Character, Integer> countCharacters(String s) {
    Map<Character, Integer> countMap = new HashMap<>();
    
    for (int i = 0; i < s.length(); i++) {
        char c = s.charAt(i);
        countMap.put(c, countMap.getOrDefault(c, 0) + 1);
    }
    
    return countMap;
}

// Usage
String text = "hello";
Map<Character, Integer> counts = countCharacters(text);
System.out.println(counts);  // {e=1, h=1, l=2, o=1}
\`\`\`

### Counting Words

\`\`\`java
public static int countWords(String sentence) {
    if (sentence == null || sentence.trim().isEmpty()) {
        return 0;
    }
    String[] words = sentence.trim().split("\\s+");
    return words.length;
}

// Usage
System.out.println(countWords("Hello   World   Test"));  // 3
System.out.println(countWords(""));                        // 0
\`\`\`

## Common Pitfalls

### 1. Using == for String comparison

\`\`\`java
String s1 = new String("Hello");
String s2 = new String("Hello");

// ❌ Wrong - compares references
if (s1 == s2) {
    // This block won't execute!
}

// ✅ Correct - compares content
if (s1.equals(s2)) {
    // This block executes
}
\`\`\`

### 2. Trying to modify Strings directly

\`\`\`java
String s = "Hello";

// ❌ Doesn't work - Strings are immutable
s.charAt(0) = 'h';  // Compilation error!

// ✅ Correct - create new String
s = "h" + s.substring(1);  // "hello"
\`\`\`

### 3. Null pointer exceptions

\`\`\`java
String s = null;

// ❌ Throws NullPointerException
int length = s.length();

// ✅ Safe way
int length = (s != null) ? s.length() : 0;
\`\`\`

## Try It Yourself

### Exercise 1: Reverse a String

Write a method to reverse a string without using built-in reverse methods:

\`\`\`java
public static String reverse(String s) {
    // TODO: Implement string reversal
    // Input: "Hello"
    // Output: "olleH"
}
\`\`\`

### Exercise 2: Count Vowels

Count the number of vowels (a, e, i, o, u) in a string (case insensitive):

\`\`\`java
public static int countVowels(String s) {
    // TODO: Count vowels
    // Input: "Hello World"
    // Output: 3
}
\`\`\`

## Quick Reference

| Operation | Method | Example |
|-----------|--------|---------|
| Length | \`s.length()\` | \`"Hello".length()\` → 5 |
| Empty check | \`s.isEmpty()\` | \`"".isEmpty()\` → true |
| Get char | \`s.charAt(i)\` | \`"Hello".charAt(0)\` → 'H' |
| Substring | \`s.substring(start, end)\` | \`"Hello".substring(0,3)\` → "Hel" |
| Index of | \`s.indexOf(str)\` | \`"Hello".indexOf("l")\` → 2 |
| Contains | \`s.contains(str)\` | \`"Hello".contains("ell")\` → true |
| Start/End with | \`s.startsWith(str)\` | \`"Hello".startsWith("He")\` → true |
| Upper case | \`s.toUpperCase()\` | \`"hello".toUpperCase()\` → "HELLO" |
| Lower case | \`s.toLowerCase()\` | \`"Hello".toLowerCase()\` → "hello" |
| Trim | \`s.trim()\` | \`"  hi  ".trim()\` → "hi" |
| Replace | \`s.replace(old, new)\` | \`"hello".replace("l", "x")\` → "hexxo" |
| Split | \`s.split(regex)\` | \`"a,b,c".split(",")\` → ["a","b","c"] |
| Compare | \`s.equals(other)\` | \`"a".equals("a")\` → true |
| Concat | \`s.concat(other)\` | \`"a".concat("b")\` → "ab" |

## What's Next?

Now let's practice finding min/max values in arrays with a coding challenge!
`;

      await ctx.db.insert("curriculumItems", {
        moduleId: arraysAndStringsModuleId,
        languageId,
        kind: "lesson",
        slug: "string-methods",
        title: "String Methods & Immutability",
        order: 3,
        content: stringMethodsContent,
      });
    }

    // Challenge 5.4: Find max/min in array
    const existingFindMinMaxTestSuite = await ctx.db
      .query("testSuites")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "find-min-max")
      )
      .first();

    let findMinMaxTestSuiteId;
    if (existingFindMinMaxTestSuite) {
      findMinMaxTestSuiteId = existingFindMinMaxTestSuite._id;
    } else {
      const findMinMaxTestSuiteDefinition = {
        type: "java",
        entrypoint: "ArrayUtils",
        tests: [
          {
            method: "findMax",
            input: [[1, 2, 3, 4, 5]],
            output: 5,
            description: "Find max in positive numbers",
          },
          {
            method: "findMax",
            input: [[-5, -3, -9, -1]],
            output: -1,
            description: "Find max in negative numbers",
          },
          {
            method: "findMax",
            input: [[-5, 3, 0, 7, -2]],
            output: 7,
            description: "Find max in mixed numbers",
          },
          {
            method: "findMax",
            input: [[5, 5, 5, 5]],
            output: 5,
            description: "Find max with duplicates",
          },
          {
            method: "findMax",
            input: [[42]],
            output: 42,
            description: "Find max with single element",
          },
          {
            method: "findMax",
            input: [[]],
            output: null,
            description: "Empty array should throw exception",
            exception: true,
          },
          {
            method: "findMin",
            input: [[1, 2, 3, 4, 5]],
            output: 1,
            description: "Find min in positive numbers",
          },
          {
            method: "findMin",
            input: [[-5, -3, -9, -1]],
            output: -9,
            description: "Find min in negative numbers",
          },
          {
            method: "findMin",
            input: [[-5, 3, 0, 7, -2]],
            output: -5,
            description: "Find min in mixed numbers",
          },
          {
            method: "findMin",
            input: [[2, 2, 2, 2]],
            output: 2,
            description: "Find min with duplicates",
          },
          {
            method: "findMin",
            input: [[99]],
            output: 99,
            description: "Find min with single element",
          },
          {
            method: "findMin",
            input: [[]],
            output: null,
            description: "Empty array should throw exception",
            exception: true,
          },
          {
            method: "findMax",
            input: [[1.5, 2.7, 0.3, 4.9]],
            output: 4.9,
            description: "Find max in double array",
          },
          {
            method: "findMin",
            input: [[1.5, 2.7, 0.3, 4.9]],
            output: 0.3,
            description: "Find min in double array",
          },
        ],
      };

      findMinMaxTestSuiteId = await ctx.db.insert("testSuites", {
        languageId,
        slug: "find-min-max",
        title: "Find Max/Min in Array - Public Tests",
        definition: findMinMaxTestSuiteDefinition,
      });
    }

    const existingFindMinMaxChallenge = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "find-min-max")
      )
      .first();

    if (!existingFindMinMaxChallenge) {
      const findMinMaxStarterCode = `public class ArrayUtils {
    /**
     * Finds the maximum value in an integer array.
     * 
     * @param arr the array to search
     * @return the maximum value
     * @throws IllegalArgumentException if array is empty
     */
    public static int findMax(int[] arr) {
        // TODO: Implement this method
        throw new UnsupportedOperationException("Not implemented yet");
    }

    /**
     * Finds the minimum value in an integer array.
     * 
     * @param arr the array to search
     * @return the minimum value
     * @throws IllegalArgumentException if array is empty
     */
    public static int findMin(int[] arr) {
        // TODO: Implement this method
        throw new UnsupportedOperationException("Not implemented yet");
    }

    /**
     * Finds the maximum value in a double array.
     * 
     * @param arr the array to search
     * @return the maximum value
     * @throws IllegalArgumentException if array is empty
     */
    public static double findMax(double[] arr) {
        // TODO: Implement this method
        throw new UnsupportedOperationException("Not implemented yet");
    }

    /**
     * Finds the minimum value in a double array.
     * 
     * @param arr the array to search
     * @return the minimum value
     * @throws IllegalArgumentException if array is empty
     */
    public static double findMin(double[] arr) {
        // TODO: Implement this method
        throw new UnsupportedOperationException("Not implemented yet");
    }
}`;

      await validateTestSuiteLanguage(
        (id) => ctx.db.get(id),
        findMinMaxTestSuiteId,
        languageId,
        "curriculum item 'Find Max/Min in Array'"
      );

      await ctx.db.insert("curriculumItems", {
        moduleId: arraysAndStringsModuleId,
        languageId,
        kind: "challenge",
        slug: "find-min-max",
        title: "Find Max/Min in Array",
        order: 4,
        prompt: `Implement the \`ArrayUtils\` class with methods to find the maximum and minimum values in both integer and double arrays.

## Requirements

Your \`ArrayUtils\` class should include four overloaded methods:

1. \`findMax(int[] arr)\` - returns the maximum integer in the array
2. \`findMin(int[] arr)\` - returns the minimum integer in the array
3. \`findMax(double[] arr)\` - returns the maximum double in the array
4. \`findMin(double[] arr)\` - returns the minimum double in the array

## Edge Cases to Handle

- **Empty array**: Throw \`IllegalArgumentException\` with a descriptive message
- **Single element**: Return that element
- **Duplicates**: Return the max/min value (duplicates are fine)
- **All same values**: Return that value

## Implementation Notes

- Do NOT use \`Arrays.sort()\` - implement the search manually
- Do NOT use built-in methods like \`IntStream.max()\` or \`Collections.max()\`
- Use a simple loop to track the current max/min
- Initialize max/min with the first element of the array
- Handle empty arrays before accessing the first element

## Example

\`\`\`java
int[] numbers = {3, 7, 2, 9, 1};
int max = ArrayUtils.findMax(numbers);  // 9
int min = ArrayUtils.findMin(numbers);  // 1

double[] decimals = {3.5, 1.2, 9.7, 4.3};
double maxDec = ArrayUtils.findMax(decimals);  // 9.7
double minDec = ArrayUtils.findMin(decimals);  // 1.2
\`\`\``,
        starterCode: findMinMaxStarterCode,
        testSuiteId: findMinMaxTestSuiteId,
      });
    }

    // Challenge 5.5: Debug Exercise - Fix array index out of bounds
    const existingDebugArrayTestSuite = await ctx.db
      .query("testSuites")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "debug-array-bounds")
      )
      .first();

    let debugArrayTestSuiteId;
    if (existingDebugArrayTestSuite) {
      debugArrayTestSuiteId = existingDebugArrayTestSuite._id;
    } else {
      const debugArrayTestSuiteDefinition = {
        type: "java",
        entrypoint: "ArrayDebug",
        tests: [
          {
            name: "Sum array elements test",
            check: "compilation",
            description: "The sumElements method should compile without errors. Check array boundaries in loops.",
          },
          {
            name: "Find maximum test",
            check: "compilation",
            description: "The findMax method should compile. Ensure loop doesn't exceed array length.",
          },
          {
            name: "Array initialization test",
            check: "compilation",
            description: "Check array initialization size matches usage.",
          },
          {
            name: "2D array access test",
            check: "compilation",
            description: "Verify 2D array access uses correct indices.",
          },
          {
            name: "Edge case handling test",
            check: "compilation",
            description: "Check handling of edge cases like empty arrays.",
          },
        ],
      };

      debugArrayTestSuiteId = await ctx.db.insert("testSuites", {
        languageId,
        slug: "debug-array-bounds",
        title: "Debug Array Index Out of Bounds - Public Tests",
        definition: debugArrayTestSuiteDefinition,
      });
    }

    const existingDebugArrayChallenge = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "debug-array-bounds")
      )
      .first();

    if (!existingDebugArrayChallenge) {
      const debugArrayStarterCode = `public class ArrayDebug {
    /**
     * Sum all elements in an array.
     */
    public static int sumElements(int[] arr) {
        int sum = 0;
        // Bug: loop goes one iteration too many
        for (int i = 0; i <= arr.length; i++) {
            sum += arr[i];
        }
        return sum;
    }

    /**
     * Find the maximum element in an array.
     */
    public static int findMax(int[] arr) {
        int max = 0;
        // Bug: initializes wrong and doesn't handle negative numbers
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] > max) {
                max = arr[i];
            }
        }
        return max;
    }

    /**
     * Reverse an array in place.
     */
    public static void reverseArray(int[] arr) {
        // Bug: confuses length with last index
        for (int i = 0; i < arr.length; i++) {
            int temp = arr[i];
            arr[i] = arr[arr.length];
            arr[arr.length] = temp;
        }
    }

    /**
     * Print diagonal elements of 2D array.
     */
    public static void printDiagonal(int[][] matrix) {
        // Bug: assumes square matrix
        for (int i = 0; i < matrix.length; i++) {
            System.out.println(matrix[i][i]);
        }
    }

    /**
     * Find the average of array elements.
     */
    public static double findAverage(int[] arr) {
        // Bug: doesn't check for empty array
        int sum = 0;
        for (int i = 0; i < arr.length; i++) {
            sum += arr[i];
        }
        return sum / arr.length;
    }
}

// HINTS:
// 1. Remember arrays are 0-indexed - valid indices are 0 to length-1
// 2. Loop condition should be i < arr.length, not i <= arr.length
// 3. When reversing, swap with arr[arr.length - 1 - i], not arr[arr.length]
// 4. For 2D arrays, check both dimensions before accessing
// 5. Always handle empty arrays to avoid exceptions`;

      await validateTestSuiteLanguage(
        (id) => ctx.db.get(id),
        debugArrayTestSuiteId,
        languageId,
        "curriculum item 'Debug Array Index Out of Bounds'"
      );

      await ctx.db.insert("curriculumItems", {
        moduleId: arraysAndStringsModuleId,
        languageId,
        kind: "challenge",
        slug: "debug-array-bounds",
        title: "Debug Array Index Out of Bounds",
        order: 5,
        prompt: `Debug the provided code to fix all array-related errors.

## Bugs to Fix

The \`ArrayDebug\` class has multiple methods with array-related bugs:

1. \`sumElements()\`: Loop goes one iteration too many (causes ArrayIndexOutOfBoundsException)
2. \`findMax()\`: Initialization problem - fails with all negative numbers
3. \`reverseArray()\`: Incorrect index usage when swapping elements
4. \`printDiagonal()\`: Assumes matrix is square without checking
5. \`findAverage()\`: Doesn't check for empty array (causes division by zero or array access issue)

## Common Array Pitfalls to Look For

- **Off-by-one errors**: Using \`<=\` instead of \`<\` in loop conditions
- **Wrong initialization**: Initializing max/min with 0 instead of first element
- **Confusing length with index**: Using \`arr[length]\` instead of \`arr[length - 1]\`
- **Not checking bounds**: Accessing array elements without verifying array is not empty
- **2D array assumptions**: Assuming all rows have the same length

## Hints

1. **Remember arrays are 0-indexed**: Valid indices range from 0 to \`length-1\`
2. **Check your loop boundaries**: Use \`i < arr.length\`, not \`i <= arr.length\`
3. **Initialize with first element**: For min/max, use \`arr[0]\` as initial value
4. **Swap with correct index**: When reversing, swap with element at \`arr.length - 1 - i\`
5. **Handle edge cases**: Check for empty arrays before accessing elements

The test will verify that your code compiles without errors.`,
        starterCode: debugArrayStarterCode,
        testSuiteId: debugArrayTestSuiteId,
      });
    }

    // ============================================
    // CONTACT LIST MANAGER PROJECT (Module 5)
    // ============================================

    const existingContactListTestSuite = await ctx.db
      .query("testSuites")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "contact-list-manager")
      )
      .first();

    let contactListTestSuiteId;
    if (existingContactListTestSuite) {
      contactListTestSuiteId = existingContactListTestSuite._id;
    } else {
      const contactListTestSuiteDefinition = {
        type: "java",
        entrypoint: "ContactManager",
        tests: [
          {
            method: "addContact",
            input: [
              { name: "Alice Smith", phoneNumber: "555-1234", email: "alice@example.com" },
            ],
            output: true,
            description: "Add a new contact successfully",
          },
          {
            method: "addContact",
            input: [
              { name: "Alice Smith", phoneNumber: "555-1234", email: "alice@example.com" },
            ],
            output: false,
            description: "Adding duplicate contact should fail",
          },
          {
            method: "removeContact",
            input: ["Alice Smith"],
            output: true,
            description: "Remove existing contact",
          },
          {
            method: "removeContact",
            input: ["Unknown"],
            output: false,
            description: "Removing non-existent contact should fail",
          },
          {
            method: "findContact",
            input: ["Alice Smith"],
            output: {
              name: "Alice Smith",
              phoneNumber: "555-1234",
              email: "alice@example.com",
            },
            description: "Find existing contact by name",
          },
          {
            method: "findContact",
            input: ["Unknown"],
            output: null,
            description: "Finding non-existent contact returns null",
          },
          {
            method: "listAllContacts",
            input: [],
            output: [],
            description: "List all contacts returns array",
          },
        ],
      };

      contactListTestSuiteId = await ctx.db.insert("testSuites", {
        languageId,
        slug: "contact-list-manager",
        title: "Contact List Manager - Public Tests",
        definition: contactListTestSuiteDefinition,
      });
    }

    const existingContactListProject = await ctx.db
      .query("projects")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "contact-list-manager")
      )
      .first();

    if (!existingContactListProject) {
      const contactListInstructions = `# Contact List Manager (CLI)

Build a comprehensive command-line contact list manager application in Java.

## Project Overview

Create a CLI application that allows users to manage their contacts through various commands. The application will support adding, removing, finding, listing, and searching contacts.

## Requirements

Your contact list manager must support:

1. **Contact management**: Add, remove, find, list, and search contacts
2. **CLI interface**: Interactive command-line interface with clear prompts
3. **Data validation**: Handle invalid inputs gracefully
4. **Multiple search options**: Search by name, email, or phone number
5. **Duplicate prevention**: Prevent adding contacts with duplicate names (or handle them appropriately)

## Project Structure

You will work with three main files:

### Contact.java
Represents a single contact with fields for name, phone number, email, and optional notes.

### ContactManager.java
Contains the logic for managing contacts (add, remove, find, list, search).

### Main.java
Provides the CLI interface for user interaction.

## Getting Started

1. Review the provided initial files
2. Complete the \`Contact\` class with necessary fields and methods
3. Implement all methods in \`ContactManager\`
4. Build the CLI interface in \`Main.java\`
5. Test your application with various scenarios

## Implementation Details

### Contact Class Requirements

Your \`Contact\` class should include:

\`\`\`java
public class Contact {
    private String name;
    private String phoneNumber;
    private String email;
    private String notes;  // Optional

    // Constructor
    public Contact(String name, String phoneNumber, String email) {
        // Initialize fields
    }

    // Optional: Constructor with notes
    public Contact(String name, String phoneNumber, String email, String notes) {
        // Initialize all fields including notes
    }

    // Getters
    public String getName() { }
    public String getPhoneNumber() { }
    public String getEmail() { }
    public String getNotes() { }

    // Setters (for updating contacts)
    public void setName(String name) { }
    public void setPhoneNumber(String phoneNumber) { }
    public void setEmail(String email) { }
    public void setNotes(String notes) { }

    // toString() for displaying contact
    @Override
    public String toString() {
        // Return formatted string with contact details
    }
}
\`\`\`

### ContactManager Class Requirements

Your \`ContactManager\` class should include:

\`\`\`java
import java.util.ArrayList;
import java.util.List;

public class ContactManager {
    private List<Contact> contacts;

    public ContactManager() {
        contacts = new ArrayList<>();
    }

    /**
     * Adds a new contact to the list.
     * 
     * @param contact the contact to add
     * @return true if added successfully, false if contact with same name already exists
     */
    public boolean addContact(Contact contact) {
        // Check for duplicate name
        // If not duplicate, add and return true
        // Otherwise return false
    }

    /**
     * Removes a contact by name.
     * 
     * @param name the name of the contact to remove
     * @return true if removed, false if contact not found
     */
    public boolean removeContact(String name) {
        // Find contact by name
        // If found, remove and return true
        // Otherwise return false
    }

    /**
     * Finds a contact by name (case-insensitive).
     * 
     * @param name the name to search for
     * @return the contact if found, null otherwise
     */
    public Contact findContact(String name) {
        // Search for contact by name (case-insensitive)
        // Return the contact if found
        // Return null if not found
    }

    /**
     * Returns all contacts as a list.
     * 
     * @return list of all contacts
     */
    public List<Contact> listAllContacts() {
        // Return all contacts (copy of list or the list itself)
    }

    /**
     * Searches for contacts matching a query.
     * Searches in name, email, and phone number fields.
     * 
     * @param query the search query
     * @return list of matching contacts
     */
    public List<Contact> searchContacts(String query) {
        // Search in name, email, and phone number (case-insensitive)
        // Return list of all matching contacts
        // Return empty list if no matches
    }
}
\`\`\`

### Main Class Requirements

Your \`Main\` class should provide:

1. A welcome message and menu
2. Command loop that processes user input
3. Input validation and error handling
4. Clear prompts and feedback
5. Exit command to quit

\`\`\`java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        ContactManager manager = new ContactManager();
        Scanner scanner = new Scanner(System.in);
        boolean running = true;

        System.out.println("=== Contact List Manager ===");
        System.out.println("Commands: add, list, find, search, remove, exit");
        System.out.println();

        while (running) {
            System.out.print("> ");
            String input = scanner.nextLine().trim().toLowerCase();

            switch (input) {
                case "add":
                    // Prompt for contact details
                    // Create Contact object
                    // Add to manager
                    // Display success/failure message
                    break;

                case "list":
                    // Get all contacts from manager
                    // Display them in a formatted way
                    // Handle empty contact list
                    break;

                case "find":
                    // Prompt for name
                    // Search using manager.findContact()
                    // Display contact or "not found" message
                    break;

                case "search":
                    // Prompt for search query
                    // Search using manager.searchContacts()
                    // Display all matching contacts
                    break;

                case "remove":
                    // Prompt for name
                    // Remove using manager.removeContact()
                    // Display success/failure message
                    break;

                case "exit":
                    running = false;
                    System.out.println("Goodbye!");
                    break;

                default:
                    System.out.println("Unknown command. Available: add, list, find, search, remove, exit");
            }

            System.out.println();
        }

        scanner.close();
    }
}
\`\`\`

## User Interface Example

\`\`\`
=== Contact List Manager ===
Commands: add, list, find, search, remove, exit

> add
Enter name: Alice Smith
Enter phone number: 555-1234
Enter email: alice@example.com
Enter notes (optional, press Enter to skip): Friend from college
Contact added successfully!

> add
Enter name: Bob Johnson
Enter phone number: 555-5678
Enter email: bob@example.com
Enter notes (optional, press Enter to skip): Colleague
Contact added successfully!

> list
Contacts:
1. Alice Smith - 555-1234 - alice@example.com
   Notes: Friend from college

2. Bob Johnson - 555-5678 - bob@example.com
   Notes: Colleague

> find
Enter name to find: Alice
Found: Alice Smith
Phone: 555-1234
Email: alice@example.com
Notes: Friend from college

> search
Enter search query: 555
Found 2 matches:
1. Alice Smith - 555-1234
2. Bob Johnson - 555-5678

> remove
Enter name of contact to remove: Alice Smith
Contact removed successfully!

> exit
Goodbye!
\`\`\`

## Error Handling

Handle these scenarios gracefully:

1. **Empty inputs**: Prompt user again or show error
2. **Duplicate contacts**: Show message that contact already exists
3. **Contact not found**: Show appropriate message when finding/removing
4. **Invalid phone/email formats**: Basic validation (optional)
5. **Empty contact list**: Show message when listing with no contacts

## Optional Enhancements

If you finish early, consider adding:

1. **Data persistence**: Save/load contacts from a file
2. **Edit contact**: Modify existing contact details
3. **Export contacts**: Export to CSV or text file
4. **Sort contacts**: Sort by name alphabetically
5. **Contact groups**: Organize contacts into categories

## Testing Your Application

Test these scenarios:

1. Add multiple contacts
2. Try adding duplicate (should be prevented)
3. List all contacts
4. Find existing contact
5. Find non-existent contact
6. Search by name, email, or phone
7. Remove existing contact
8. Try removing non-existent contact
9. Handle empty input
10. Test with notes (optional)

## Rubric

Your project will be evaluated based on:

1. **Contact class implementation** (15%)
   - All required fields present
   - Proper constructor(s)
   - Getters and setters
   - toString() method for display

2. **ContactManager methods** (30%)
   - addContact() works correctly
   - removeContact() works correctly
   - findContact() works correctly (case-insensitive)
   - listAllContacts() returns correct data
   - searchContacts() searches multiple fields

3. **CLI interface** (25%)
   - Clear prompts and messages
   - All commands implemented
   - Input validation
   - User-friendly output formatting

4. **Error handling** (15%)
   - Handles duplicate contacts
   - Handles contact not found
   - Handles empty inputs
   - Prevents crashes

5. **Code quality** (15%)
   - Follows Java naming conventions
   - Includes Javadoc comments
   - Clean, readable code
   - Proper indentation and organization
`;

      const contactListInitialFiles = [
        {
          path: "Contact.java",
          content: `/**
 * Represents a contact in the contact list.
 */
public class Contact {
    private String name;
    private String phoneNumber;
    private String email;
    private String notes;

    /**
     * Creates a new contact without notes.
     * 
     * @param name the contact's name
     * @param phoneNumber the contact's phone number
     * @param email the contact's email address
     */
    public Contact(String name, String phoneNumber, String email) {
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.notes = null;
    }

    /**
     * Creates a new contact with notes.
     * 
     * @param name the contact's name
     * @param phoneNumber the contact's phone number
     * @param email the contact's email address
     * @param notes optional notes about the contact
     */
    public Contact(String name, String phoneNumber, String email, String notes) {
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.notes = notes;
    }

    // Getters
    public String getName() {
        return name;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public String getNotes() {
        return notes;
    }

    // Setters
    public void setName(String name) {
        this.name = name;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    /**
     * Returns a string representation of the contact.
     * 
     * @return formatted contact information
     */
    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(name).append(" - ").append(phoneNumber).append(" - ").append(email);
        if (notes != null && !notes.isEmpty()) {
            sb.append("\\n   Notes: ").append(notes);
        }
        return sb.toString();
    }
}
`,
        },
        {
          path: "ContactManager.java",
          content: `import java.util.ArrayList;
import java.util.List;

/**
 * Manages a collection of contacts.
 * Provides methods to add, remove, find, list, and search contacts.
 */
public class ContactManager {
    private List<Contact> contacts;

    /**
     * Creates a new ContactManager with an empty contact list.
     */
    public ContactManager() {
        contacts = new ArrayList<>();
    }

    /**
     * Adds a new contact to the list.
     * Prevents duplicate contacts with the same name.
     * 
     * @param contact the contact to add
     * @return true if added successfully, false if contact with same name already exists
     */
    public boolean addContact(Contact contact) {
        // Check for duplicate name (case-insensitive)
        for (Contact c : contacts) {
            if (c.getName().equalsIgnoreCase(contact.getName())) {
                return false;  // Duplicate found
            }
        }
        contacts.add(contact);
        return true;
    }

    /**
     * Removes a contact by name.
     * 
     * @param name the name of the contact to remove
     * @return true if removed, false if contact not found
     */
    public boolean removeContact(String name) {
        for (int i = 0; i < contacts.size(); i++) {
            if (contacts.get(i).getName().equalsIgnoreCase(name)) {
                contacts.remove(i);
                return true;
            }
        }
        return false;
    }

    /**
     * Finds a contact by name (case-insensitive).
     * 
     * @param name the name to search for
     * @return the contact if found, null otherwise
     */
    public Contact findContact(String name) {
        for (Contact contact : contacts) {
            if (contact.getName().equalsIgnoreCase(name)) {
                return contact;
            }
        }
        return null;
    }

    /**
     * Returns all contacts as a list.
     * 
     * @return list of all contacts
     */
    public List<Contact> listAllContacts() {
        return new ArrayList<>(contacts);
    }

    /**
     * Searches for contacts matching a query.
     * Searches in name, email, and phone number fields (case-insensitive).
     * 
     * @param query the search query
     * @return list of matching contacts
     */
    public List<Contact> searchContacts(String query) {
        List<Contact> results = new ArrayList<>();
        String queryLower = query.toLowerCase();

        for (Contact contact : contacts) {
            if (contact.getName().toLowerCase().contains(queryLower) ||
                contact.getEmail().toLowerCase().contains(queryLower) ||
                contact.getPhoneNumber().contains(queryLower)) {
                results.add(contact);
            }
        }

        return results;
    }

    /**
     * Returns the number of contacts in the list.
     * 
     * @return the contact count
     */
    public int getContactCount() {
        return contacts.size();
    }
}
`,
        },
        {
          path: "Main.java",
          content: `import java.util.List;
import java.util.Scanner;

/**
 * Command-line interface for the Contact List Manager.
 */
public class Main {
    public static void main(String[] args) {
        ContactManager manager = new ContactManager();
        Scanner scanner = new Scanner(System.in);
        boolean running = true;

        System.out.println("=== Contact List Manager ===");
        System.out.println("Commands: add, list, find, search, remove, exit\\n");

        while (running) {
            System.out.print("> ");
            String command = scanner.nextLine().trim().toLowerCase();

            switch (command) {
                case "add":
                    handleAddContact(manager, scanner);
                    break;

                case "list":
                    handleListContacts(manager);
                    break;

                case "find":
                    handleFindContact(manager, scanner);
                    break;

                case "search":
                    handleSearchContacts(manager, scanner);
                    break;

                case "remove":
                    handleRemoveContact(manager, scanner);
                    break;

                case "exit":
                    running = false;
                    System.out.println("Goodbye!");
                    break;

                default:
                    System.out.println("Unknown command. Available: add, list, find, search, remove, exit");
            }

            if (running) {
                System.out.println();
            }
        }

        scanner.close();
    }

    private static void handleAddContact(ContactManager manager, Scanner scanner) {
        System.out.print("Enter name: ");
        String name = scanner.nextLine().trim();

        System.out.print("Enter phone number: ");
        String phone = scanner.nextLine().trim();

        System.out.print("Enter email: ");
        String email = scanner.nextLine().trim();

        System.out.print("Enter notes (optional, press Enter to skip): ");
        String notes = scanner.nextLine().trim();
        if (notes.isEmpty()) {
            notes = null;
        }

        Contact contact = new Contact(name, phone, email, notes);
        if (manager.addContact(contact)) {
            System.out.println("Contact added successfully!");
        } else {
            System.out.println("Error: Contact with this name already exists.");
        }
    }

    private static void handleListContacts(ContactManager manager) {
        List<Contact> contacts = manager.listAllContacts();

        if (contacts.isEmpty()) {
            System.out.println("No contacts yet.");
            return;
        }

        System.out.println("Contacts:");
        for (int i = 0; i < contacts.size(); i++) {
            System.out.println((i + 1) + ". " + contacts.get(i).toString());
            if (i < contacts.size() - 1) {
                System.out.println();
            }
        }
    }

    private static void handleFindContact(ContactManager manager, Scanner scanner) {
        System.out.print("Enter name to find: ");
        String name = scanner.nextLine().trim();

        Contact contact = manager.findContact(name);
        if (contact != null) {
            System.out.println("Found: " + contact.getName());
            System.out.println("Phone: " + contact.getPhoneNumber());
            System.out.println("Email: " + contact.getEmail());
            if (contact.getNotes() != null) {
                System.out.println("Notes: " + contact.getNotes());
            }
        } else {
            System.out.println("Contact not found.");
        }
    }

    private static void handleSearchContacts(ContactManager manager, Scanner scanner) {
        System.out.print("Enter search query: ");
        String query = scanner.nextLine().trim();

        List<Contact> results = manager.searchContacts(query);
        if (results.isEmpty()) {
            System.out.println("No matches found.");
        } else {
            System.out.println("Found " + results.size() + " match(es):");
            for (int i = 0; i < results.size(); i++) {
                System.out.println((i + 1) + ". " + results.get(i).getName() + " - " + results.get(i).getPhoneNumber());
            }
        }
    }

    private static void handleRemoveContact(ContactManager manager, Scanner scanner) {
        System.out.print("Enter name of contact to remove: ");
        String name = scanner.nextLine().trim();

        if (manager.removeContact(name)) {
            System.out.println("Contact removed successfully!");
        } else {
            System.out.println("Error: Contact not found.");
        }
    }
}
`,
        },
      ];

      const contactListRubric = [
        { id: "1", text: "Contact class implements all required fields (name, phoneNumber, email, notes) with proper constructors, getters, setters, and toString()" },
        { id: "2", text: "ContactManager correctly implements addContact(), removeContact(), findContact(), listAllContacts(), and searchContacts() methods" },
        { id: "3", text: "CLI interface provides clear prompts, handles all commands (add, list, find, search, remove, exit) with user-friendly output" },
        { id: "4", text: "Error handling gracefully manages duplicate contacts, contact not found, empty inputs, and prevents crashes" },
        { id: "5", text: "Code follows Java naming conventions, includes Javadoc comments, and is clean and readable" },
        { id: "6", text: "Search functionality works correctly across name, email, and phone number fields with case-insensitive matching" },
      ];

      await validateTestSuiteLanguage(
        (id) => ctx.db.get(id),
        contactListTestSuiteId,
        languageId,
        "project 'Contact List Manager'"
      );

      await ctx.db.insert("projects", {
        languageId,
        slug: "contact-list-manager",
        title: "Contact List Manager (CLI)",
        description: "Build a comprehensive command-line contact list manager application",
        instructions: contactListInstructions,
        initialFiles: contactListInitialFiles,
        rubric: contactListRubric,
        testSuiteId: contactListTestSuiteId,
        order: 5,
      });
    }

    // ============================================
    // TRACK 2: OBJECT-ORIENTED PROGRAMMING
    // ============================================

    // Create track: Object-Oriented Programming
    const existingOOPTrack = await ctx.db
      .query("tracks")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "object-oriented-programming")
      )
      .first();

    let oopTrackId;
    if (existingOOPTrack) {
      oopTrackId = existingOOPTrack._id;
    } else {
      oopTrackId = await ctx.db.insert("tracks", {
        languageId,
        slug: "object-oriented-programming",
        title: "Object-Oriented Programming",
        description: "Master OOP principles: classes, objects, inheritance, polymorphism, and more",
        level: "intermediate",
        order: 2,
      });
    }

    // Module 6: Classes & Objects
    const existingClassesObjectsModule = await ctx.db
      .query("modules")
      .withIndex("by_track_slug", (q) =>
        q.eq("trackId", oopTrackId).eq("slug", "classes-and-objects")
      )
      .first();

    let classesObjectsModuleId;
    if (existingClassesObjectsModule) {
      classesObjectsModuleId = existingClassesObjectsModule._id;
    } else {
      classesObjectsModuleId = await ctx.db.insert("modules", {
        trackId: oopTrackId,
        slug: "classes-and-objects",
        title: "Classes & Objects",
        description: "Understanding class structure, fields, constructors, and methods",
        order: 1,
      });
    }

    // Module 7: Encapsulation & Access Modifiers
    const existingEncapsulationModule = await ctx.db
      .query("modules")
      .withIndex("by_track_slug", (q) =>
        q.eq("trackId", oopTrackId).eq("slug", "encapsulation-access-modifiers")
      )
      .first();

    let encapsulationModuleId;
    if (existingEncapsulationModule) {
      encapsulationModuleId = existingEncapsulationModule._id;
    } else {
      encapsulationModuleId = await ctx.db.insert("modules", {
        trackId: oopTrackId,
        slug: "encapsulation-access-modifiers",
        title: "Encapsulation & Access Modifiers",
        description: "Private, public, protected, getters, setters, and immutability",
        order: 2,
      });
    }

    // Module 8: Inheritance & Polymorphism
    const existingInheritanceModule = await ctx.db
      .query("modules")
      .withIndex("by_track_slug", (q) =>
        q.eq("trackId", oopTrackId).eq("slug", "inheritance-polymorphism")
      )
      .first();

    let inheritanceModuleId;
    if (existingInheritanceModule) {
      inheritanceModuleId = existingInheritanceModule._id;
    } else {
      inheritanceModuleId = await ctx.db.insert("modules", {
        trackId: oopTrackId,
        slug: "inheritance-polymorphism",
        title: "Inheritance & Polymorphism",
        description: "Extends keyword, method overriding, and dynamic method dispatch",
        order: 3,
      });
    }

    // Module 9: Abstraction & Interfaces
    const existingAbstractionModule = await ctx.db
      .query("modules")
      .withIndex("by_track_slug", (q) =>
        q.eq("trackId", oopTrackId).eq("slug", "abstraction-interfaces")
      )
      .first();

    let _abstractionModuleId;
    if (existingAbstractionModule) {
      _abstractionModuleId = existingAbstractionModule._id;
    } else {
      _abstractionModuleId = await ctx.db.insert("modules", {
        trackId: oopTrackId,
        slug: "abstraction-interfaces",
        title: "Abstraction & Interfaces",
        description: "Abstract classes, interfaces, and default methods",
        order: 4,
      });
    }

    // Module 10: Advanced OOP Concepts
    const existingAdvancedOOPModule = await ctx.db
      .query("modules")
      .withIndex("by_track_slug", (q) =>
        q.eq("trackId", oopTrackId).eq("slug", "advanced-oop-concepts")
      )
      .first();

    let _advancedOOPModuleId;
    if (existingAdvancedOOPModule) {
      _advancedOOPModuleId = existingAdvancedOOPModule._id;
    } else {
      _advancedOOPModuleId = await ctx.db.insert("modules", {
        trackId: oopTrackId,
        slug: "advanced-oop-concepts",
        title: "Advanced OOP Concepts",
        description: "Nested classes, enums, and the final keyword",
        order: 5,
      });
    }

    // ============================================
    // TRACK 3: JAVA COLLECTIONS FRAMEWORK
    // ============================================

    const existingCollectionsTrack = await ctx.db
      .query("tracks")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "java-collections-framework")
      )
      .first();

    let collectionsTrackId;
    if (existingCollectionsTrack) {
      collectionsTrackId = existingCollectionsTrack._id;
    } else {
      collectionsTrackId = await ctx.db.insert("tracks", {
        languageId,
        slug: "java-collections-framework",
        title: "Java Collections Framework",
        description: "Master Lists, Sets, Maps, Queues, and collection utilities",
        level: "intermediate",
        order: 3,
      });
    }

    // Module 11: List Interface
    const existingListModule = await ctx.db
      .query("modules")
      .withIndex("by_track_slug", (q) =>
        q.eq("trackId", collectionsTrackId).eq("slug", "list-interface")
      )
      .first();

    let listModuleId;
    if (existingListModule) {
      listModuleId = existingListModule._id;
    } else {
      listModuleId = await ctx.db.insert("modules", {
        trackId: collectionsTrackId,
        slug: "list-interface",
        title: "List Interface",
        description: "ArrayList, LinkedList, iterators, and common list operations",
        order: 1,
      });
    }

    // Module 12: Set Interface
    const existingSetModule = await ctx.db
      .query("modules")
      .withIndex("by_track_slug", (q) =>
        q.eq("trackId", collectionsTrackId).eq("slug", "set-interface")
      )
      .first();

    let _setModuleId;
    if (existingSetModule) {
      _setModuleId = existingSetModule._id;
    } else {
      _setModuleId = await ctx.db.insert("modules", {
        trackId: collectionsTrackId,
        slug: "set-interface",
        title: "Set Interface",
        description: "HashSet, LinkedHashSet, TreeSet, and custom comparators",
        order: 2,
      });
    }

    // Module 13: Map Interface
    const existingMapModule = await ctx.db
      .query("modules")
      .withIndex("by_track_slug", (q) =>
        q.eq("trackId", collectionsTrackId).eq("slug", "map-interface")
      )
      .first();

    let _mapModuleId;
    if (existingMapModule) {
      _mapModuleId = existingMapModule._id;
    } else {
      _mapModuleId = await ctx.db.insert("modules", {
        trackId: collectionsTrackId,
        slug: "map-interface",
        title: "Map Interface",
        description: "HashMap, TreeMap, LinkedHashMap, and multi-value maps",
        order: 3,
      });
    }

    // Module 14: Queue & Stack
    const existingQueueStackModule = await ctx.db
      .query("modules")
      .withIndex("by_track_slug", (q) =>
        q.eq("trackId", collectionsTrackId).eq("slug", "queue-stack")
      )
      .first();

    let _queueStackModuleId;
    if (existingQueueStackModule) {
      _queueStackModuleId = existingQueueStackModule._id;
    } else {
      _queueStackModuleId = await ctx.db.insert("modules", {
        trackId: collectionsTrackId,
        slug: "queue-stack",
        title: "Queue & Stack",
        description: "PriorityQueue, Deque, ArrayDeque, and stack operations",
        order: 4,
      });
    }

    // Module 15: Collections Utilities
    const existingCollectionsUtilitiesModule = await ctx.db
      .query("modules")
      .withIndex("by_track_slug", (q) =>
        q.eq("trackId", collectionsTrackId).eq("slug", "collections-utilities")
      )
      .first();

    let _collectionsUtilitiesModuleId;
    if (existingCollectionsUtilitiesModule) {
      _collectionsUtilitiesModuleId = existingCollectionsUtilitiesModule._id;
    } else {
      _collectionsUtilitiesModuleId = await ctx.db.insert("modules", {
        trackId: collectionsTrackId,
        slug: "collections-utilities",
        title: "Collections Utilities",
        description: "Collections class, streams, and functional operations",
        order: 5,
      });
    }

    // ============================================
    // MODULE 19: MODERN JAVA FEATURES (NEW)
    // ============================================
    const existingModernJavaModule = await ctx.db
      .query("modules")
      .withIndex("by_track_slug", (q) =>
        q.eq("trackId", collectionsTrackId).eq("slug", "modern-java-features")
      )
      .first();

    let modernJavaModuleId;
    if (existingModernJavaModule) {
      modernJavaModuleId = existingModernJavaModule._id;
    } else {
      modernJavaModuleId = await ctx.db.insert("modules", {
        trackId: collectionsTrackId,
        slug: "modern-java-features",
        title: "Modern Java Features",
        description: "Records, pattern matching, text blocks, and other Java 14-21 features",
        order: 6,
        estimatedHours: 5,
        skillTags: ["records", "pattern-matching", "text-blocks", "modern-java"],
      });
    }

    // Lesson: Records (Java 14+)
    const existingRecordsLesson = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "java-records")
      )
      .first();

    if (!existingRecordsLesson) {
      const recordsContent = `# Java Records (Java 14+)

## What Are Records?

Records are a concise way to create immutable data carrier classes. They automatically generate:
- Constructor
- Getters
- \`equals()\`, \`hashCode()\`, and \`toString()\`

## Traditional Class vs Record

**Traditional approach:**
\`\`\`java
public class Person {
    private final String name;
    private final int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() { return name; }
    public int getAge() { return age; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Person person = (Person) o;
        return age == person.age && Objects.equals(name, person.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, age);
    }

    @Override
    public String toString() {
        return "Person[name=" + name + ", age=" + age + "]";
    }
}
\`\`\`

**With records:**
\`\`\`java
public record Person(String name, int age) {}
\`\`\`

## When to Use Records

Use records for:
- **Data transfer objects** (DTOs) in APIs
- **Configuration** objects
- **Response objects** in REST APIs
- **Immutable data structures**

Don't use records for:
- Classes needing mutable state
- Classes with complex business logic
- Classes requiring custom constructors beyond the compact one

## Real World Example

In a REST API, you might have:
\`\`\`java
// Request
public record UserRequest(String username, String email, String password) {}

// Response
public record UserResponse(long id, String username, String email) {}
\`\`\`

## Bonus: Record Methods

You can add custom methods to records:
\`\`\`java
public record Person(String name, int age) {
    public boolean isAdult() {
        return age >= 18;
    }
}
\`\`\`

## Practice

Create a record for a Book with title, author, and year. Add a method to check if it's a classic (published before 2000).
`;
      await ctx.db.insert("curriculumItems", {
        moduleId: modernJavaModuleId,
        languageId,
        kind: "lesson",
        slug: "java-records",
        title: "Java Records (Java 14+)",
        order: 1,
        content: recordsContent,
        estimatedMinutes: 25,
        skillTags: ["records", "immutability", "modern-java"],
        realWorldContext: "Records are increasingly used in modern Java applications, especially in Spring Boot APIs and data transfer objects",
      });
    }

    // Lesson: Enhanced Switch Expressions (Java 14+)
    const existingEnhancedSwitchLesson = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "enhanced-switch")
      )
      .first();

    if (!existingEnhancedSwitchLesson) {
      const switchContent = `# Enhanced Switch Expressions (Java 14+)

## Modern Switch Syntax

Java 14+ allows switches to be **expressions** (return values) instead of just statements.

## Traditional Switch vs Switch Expression

**Traditional (Java 13 and earlier):**
\`\`\`java
String dayType;
switch (day) {
    case MONDAY:
    case TUESDAY:
    case WEDNESDAY:
    case THURSDAY:
    case FRIDAY:
        dayType = "Weekday";
        break;
    case SATURDAY:
    case SUNDAY:
        dayType = "Weekend";
        break;
    default:
        dayType = "Unknown";
}
\`\`\`

**Switch expression (Java 14+):**
\`\`\`java
String dayType = switch (day) {
    case MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY -> "Weekday";
    case SATURDAY, SUNDAY -> "Weekend";
    default -> "Unknown";
};
\`\`\`

## Key Improvements

1. **Returns a value**: No need for a variable
2. **Arrow syntax**: Cleaner than break statements
3. **Comma-separated cases**: Combine multiple values
4. **No fall-through**: Arrow syntax prevents accidental fall-through

## Yield Statement

For complex logic, use \`yield\` instead of arrow:
\`\`\`java
String result = switch (number) {
    case 1 -> yield "One";
    case 2 -> {
        String s = "Two";
        yield s;
    }
    default -> yield "Other";
};
\`\`\`

## Real World Example

API status codes:
\`\`\`java
public String getStatusMessage(int code) {
    return switch (code) {
        case 200 -> "OK";
        case 201 -> "Created";
        case 204 -> "No Content";
        case 400 -> "Bad Request";
        case 404 -> "Not Found";
        case 500 -> "Server Error";
        default -> "Unknown Status";
    };
}
\`\`\`

## Practice

Convert this traditional switch to a switch expression:
\`\`\`java
int score;
switch (grade) {
    case 'A': score = 4; break;
    case 'B': score = 3; break;
    case 'C': score = 2; break;
    default: score = 0;
}
\`\`\`
`;
      await ctx.db.insert("curriculumItems", {
        moduleId: modernJavaModuleId,
        languageId,
        kind: "lesson",
        slug: "enhanced-switch",
        title: "Enhanced Switch Expressions",
        order: 2,
        content: switchContent,
        estimatedMinutes: 20,
        skillTags: ["switch-expressions", "modern-java", "control-flow"],
        realWorldContext: "Switch expressions make code more readable and reduce bugs from missing break statements",
      });
    }

    // Lesson: Pattern Matching for instanceof (Java 16+)
    const existingPatternMatchingLesson = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "pattern-matching")
      )
      .first();

    if (!existingPatternMatchingLesson) {
      const patternMatchingContent = `# Pattern Matching for instanceof (Java 16+)

## Traditional Type Checking

Before Java 16, type checking and casting was verbose:
\`\`\`java
if (obj instanceof String) {
    String s = (String) obj;  // Explicit cast
    System.out.println(s.length());
}
\`\`\`

## Pattern Matching with instanceof

Now you can combine type checking and casting:
\`\`\`java
if (obj instanceof String s) {
    System.out.println(s.length());  // s is already a String!
}
\`\`\`

## Benefits

1. **Less verbose**: No need for explicit casting
2. **Type-safe**: Compiler ensures correctness
3. **Scoped variable**: 's' only exists within the if block

## Real World Example

Processing different shapes:
\`\`\`java
public double calculateArea(Object shape) {
    if (shape instanceof Circle c) {
        return Math.PI * c.radius() * c.radius();
    } else if (shape instanceof Rectangle r) {
        return r.width() * r.height();
    }
    return 0;
}
\`\`\`

## Practice

Convert this traditional code to use pattern matching:
\`\`\`java
if (obj instanceof Integer) {
    Integer i = (Integer) obj;
    System.out.println(i * 2);
} else if (obj instanceof String) {
    String s = (String) obj;
    System.out.println(s.toUpperCase());
}
\`\`\`
`;
      await ctx.db.insert("curriculumItems", {
        moduleId: modernJavaModuleId,
        languageId,
        kind: "lesson",
        slug: "pattern-matching",
        title: "Pattern Matching for instanceof",
        order: 3,
        content: patternMatchingContent,
        estimatedMinutes: 20,
        skillTags: ["pattern-matching", "instanceof", "modern-java"],
        realWorldContext: "Pattern matching reduces boilerplate and makes type-checking code more readable",
      });
    }

    // Lesson: Text Blocks (Java 15+)
    const existingTextBlocksLesson = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "text-blocks")
      )
      .first();

    if (!existingTextBlocksLesson) {
      const textBlocksContent = `# Text Blocks (Java 15+)

## The Problem with String Literals

Multi-line strings in Java were painful:
\`\`\`java
String html = "<html>\\n" +
              "  <body>\\n" +
              "    <h1>Hello</h1>\\n" +
              "  </body>\\n" +
              "</html>";
\`\`\`

## Enter Text Blocks

Text blocks use triple quotes to create multi-line strings:
\`\`\`java
String html = """
    <html>
      <body>
        <h1>Hello</h1>
      </body>
    </html>
    """;
\`\`\`

## Key Features

1. **Automatic indentation**: Java removes common leading whitespace
2. **No need for escape sequences**: Newlines and quotes work naturally
3. **Preserves formatting**: Great for SQL, JSON, HTML

## Real World Examples

**SQL query:**
\`\`\`java
String query = """
    SELECT id, name, email
    FROM users
    WHERE active = true
    ORDER BY name
    """;
\`\`\`

**JSON:**
\`\`\`java
String json = """
    {
      "name": "John",
      "age": 30,
      "city": "New York"
    }
    """;
\`\`\`

**HTML:**
\`\`\`java
String emailTemplate = """
    <div class="email">
      <h1>Welcome, %s!</h1>
      <p>Thanks for signing up.</p>
    </div>
    """.formatted(name);
\`\`\`

## Practice

Create a text block for a JSON object representing a book with title, author, and year fields.
`;
      await ctx.db.insert("curriculumItems", {
        moduleId: modernJavaModuleId,
        languageId,
        kind: "lesson",
        slug: "text-blocks",
        title: "Text Blocks (Java 15+)",
        order: 4,
        content: textBlocksContent,
        estimatedMinutes: 15,
        skillTags: ["text-blocks", "strings", "modern-java"],
        realWorldContext: "Text blocks make working with SQL, JSON, HTML, and other formatted text much cleaner in Java",
      });
    }

    // Challenge: Refactor to use records
    const existingRecordsChallenge = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "refactor-to-records")
      )
      .first();

    let recordsTestSuiteId;
    if (!existingRecordsChallenge) {
      recordsTestSuiteId = await ctx.db.insert("testSuites", {
        languageId,
        slug: "refactor-to-records-tests",
        title: "Refactor to Records Tests",
        definition: {
          type: "java",
          entrypoint: "Solution.java",
          method: "toString",
          signature: "toString()",
          tests: [
            {
              input: [],
              output: "Person[name=Alice, age=30]",
            },
          ],
        },
      });
    } else {
      recordsTestSuiteId = existingRecordsChallenge.testSuiteId;
    }

    if (!existingRecordsChallenge) {
      const recordsPrompt = `Convert the following class to a record:

\`\`\`java
public class Person {
    private final String name;
    private final int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Person person = (Person) o;
        return age == person.age && Objects.equals(name, person.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, age);
    }

    @Override
    public String toString() {
        return "Person[name=" + name + ", age=" + age + "]";
    }
}
\`\`\`

Your record should:
1. Use the \`record\` keyword
2. Have the same functionality as the original class
3. Be much more concise (1 line!)`;
      await ctx.db.insert("curriculumItems", {
        moduleId: modernJavaModuleId,
        languageId,
        kind: "challenge",
        slug: "refactor-to-records",
        title: "Refactor to Records",
        order: 5,
        difficulty: "medium",
        prompt: recordsPrompt,
        starterCode: "// Replace the class below with a record\n",
        ...(recordsTestSuiteId ? { testSuiteId: recordsTestSuiteId } : {}),
        skillTags: ["records", "refactoring", "modern-java"],
      });
    }

    // ============================================
    // TRACK 4: EXCEPTION HANDLING & FILE I/O
    // ============================================

    const existingExceptionIOTrack = await ctx.db
      .query("tracks")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "exception-handling-file-io")
      )
      .first();

    let exceptionIOTrackId;
    if (existingExceptionIOTrack) {
      exceptionIOTrackId = existingExceptionIOTrack._id;
    } else {
      exceptionIOTrackId = await ctx.db.insert("tracks", {
        languageId,
        slug: "exception-handling-file-io",
        title: "Exception Handling & File I/O",
        description: "Error handling, file operations, and data persistence",
        level: "intermediate",
        order: 4,
      });
    }

    // Module 16: Exception Handling
    const existingExceptionModule = await ctx.db
      .query("modules")
      .withIndex("by_track_slug", (q) =>
        q.eq("trackId", exceptionIOTrackId).eq("slug", "exception-handling")
      )
      .first();

    let exceptionModuleId;
    if (existingExceptionModule) {
      exceptionModuleId = existingExceptionModule._id;
    } else {
      exceptionModuleId = await ctx.db.insert("modules", {
        trackId: exceptionIOTrackId,
        slug: "exception-handling",
        title: "Exception Handling",
        description: "try-catch-finally, checked vs unchecked exceptions, custom exceptions",
        order: 1,
      });
    }

    // Module 17: File I/O Basics
    const existingFileIOBasicsModule = await ctx.db
      .query("modules")
      .withIndex("by_track_slug", (q) =>
        q.eq("trackId", exceptionIOTrackId).eq("slug", "file-io-basics")
      )
      .first();

    let _fileIOBasicsModuleId;
    if (existingFileIOBasicsModule) {
      _fileIOBasicsModuleId = existingFileIOBasicsModule._id;
    } else {
      _fileIOBasicsModuleId = await ctx.db.insert("modules", {
        trackId: exceptionIOTrackId,
        slug: "file-io-basics",
        title: "File I/O Basics",
        description: "Reading and writing files, File class, and basic streams",
        order: 1,
      });
    }

    // Module 18: Advanced I/O
    const existingAdvancedIOModule = await ctx.db
      .query("modules")
      .withIndex("by_track_slug", (q) =>
        q.eq("trackId", exceptionIOTrackId).eq("slug", "advanced-io")
      )
      .first();

    let _advancedIOModuleId;
    if (existingAdvancedIOModule) {
      _advancedIOModuleId = existingAdvancedIOModule._id;
    } else {
      _advancedIOModuleId = await ctx.db.insert("modules", {
        trackId: exceptionIOTrackId,
        slug: "advanced-io",
        title: "Advanced I/O",
        description: "Buffered streams, character streams, and NIO basics",
        order: 3,
      });
    }

    // ============================================
    // TRACK 5: JAVA STREAMS & FUNCTIONAL PROGRAMMING
    // ============================================

    const existingStreamsTrack = await ctx.db
      .query("tracks")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "java-streams-functional-programming")
      )
      .first();

    let streamsTrackId;
    if (existingStreamsTrack) {
      streamsTrackId = existingStreamsTrack._id;
    } else {
      streamsTrackId = await ctx.db.insert("tracks", {
        languageId,
        slug: "java-streams-functional-programming",
        title: "Java Streams & Functional Programming",
        description: "Lambda expressions, Stream API, Optional, and modern Java features",
        level: "intermediate-advanced",
        order: 5,
      });
    }

    // Module 19: Lambda Expressions
    const existingLambdaModule = await ctx.db
      .query("modules")
      .withIndex("by_track_slug", (q) =>
        q.eq("trackId", streamsTrackId).eq("slug", "lambda-expressions")
      )
      .first();

    let lambdaModuleId;
    if (existingLambdaModule) {
      lambdaModuleId = existingLambdaModule._id;
    } else {
      lambdaModuleId = await ctx.db.insert("modules", {
        trackId: streamsTrackId,
        slug: "lambda-expressions",
        title: "Lambda Expressions",
        description: "Functional interfaces, lambda syntax, and method references",
        order: 1,
      });
    }

    // Module 20: Stream API Basics
    const existingStreamBasicsModule = await ctx.db
      .query("modules")
      .withIndex("by_track_slug", (q) =>
        q.eq("trackId", streamsTrackId).eq("slug", "stream-api-basics")
      )
      .first();

    let streamBasicsModuleId;
    if (existingStreamBasicsModule) {
      streamBasicsModuleId = existingStreamBasicsModule._id;
    } else {
      streamBasicsModuleId = await ctx.db.insert("modules", {
        trackId: streamsTrackId,
        slug: "stream-api-basics",
        title: "Stream API Basics",
        description: "Creating streams, intermediate operations, and terminal operations",
        order: 2,
      });
    }

    // Module 21: Advanced Streams
    const existingAdvancedStreamsModule = await ctx.db
      .query("modules")
      .withIndex("by_track_slug", (q) =>
        q.eq("trackId", streamsTrackId).eq("slug", "advanced-streams")
      )
      .first();

    let _advancedStreamsModuleId;
    if (existingAdvancedStreamsModule) {
      _advancedStreamsModuleId = existingAdvancedStreamsModule._id;
    } else {
      _advancedStreamsModuleId = await ctx.db.insert("modules", {
        trackId: exceptionIOTrackId,
        slug: "advanced-streams",
        title: "Advanced Streams",
        description: "Parallel streams, lazy evaluation, and stream performance",
        order: 5,
      });
    }

    // Module 22: Optional & Date/Time API
    const existingOptionalDateTimeModule = await ctx.db
      .query("modules")
      .withIndex("by_track_slug", (q) =>
        q.eq("trackId", streamsTrackId).eq("slug", "optional-date-time-api")
      )
      .first();

    let _optionalDateTimeModuleId;
    if (existingOptionalDateTimeModule) {
      _optionalDateTimeModuleId = existingOptionalDateTimeModule._id;
    } else {
      _optionalDateTimeModuleId = await ctx.db.insert("modules", {
        trackId: exceptionIOTrackId,
        slug: "optional-datetime",
        title: "Optional & Date Time API",
        description: "Optional class, LocalDateTime, and modern date handling",
        order: 6,
      });
    }

    // ============================================
    // TRACK 6: DATABASE & JDBC
    // ============================================

    const existingJDBCTrack = await ctx.db
      .query("tracks")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "database-jdbc")
      )
      .first();

    let jdbcTrackId;
    if (existingJDBCTrack) {
      jdbcTrackId = existingJDBCTrack._id;
    } else {
      jdbcTrackId = await ctx.db.insert("tracks", {
        languageId,
        slug: "database-jdbc",
        title: "Database & JDBC",
        description: "SQL fundamentals, JDBC, connection pooling, and ORM concepts",
        level: "advanced",
        order: 6,
      });
    }

    // Module 23: SQL Fundamentals
    const existingSQLModule = await ctx.db
      .query("modules")
      .withIndex("by_track_slug", (q) =>
        q.eq("trackId", jdbcTrackId).eq("slug", "sql-fundamentals")
      )
      .first();

    let _sqlModuleId;
    if (existingSQLModule) {
      _sqlModuleId = existingSQLModule._id;
    } else {
      _sqlModuleId = await ctx.db.insert("modules", {
        trackId: jdbcTrackId,
        slug: "sql",
        title: "SQL",
        description: "Basic SQL queries, joins, and database operations",
        order: 1,
      });
    }

    // Module 24: JDBC Basics
    const existingJDBCBasicsModule = await ctx.db
      .query("modules")
      .withIndex("by_track_slug", (q) =>
        q.eq("trackId", jdbcTrackId).eq("slug", "jdbc-basics")
      )
      .first();

    let _jdbcBasicsModuleId;
    if (existingJDBCBasicsModule) {
      _jdbcBasicsModuleId = existingJDBCBasicsModule._id;
    } else {
      _jdbcBasicsModuleId = await ctx.db.insert("modules", {
        trackId: jdbcTrackId,
        slug: "jdbc-basics",
        title: "JDBC Basics",
        description: "Database connections, statements, and result sets",
        order: 2,
      });
    }

    // Module 25: Advanced JDBC
    const existingAdvancedJDBCModule = await ctx.db
      .query("modules")
      .withIndex("by_track_slug", (q) =>
        q.eq("trackId", jdbcTrackId).eq("slug", "advanced-jdbc")
      )
      .first();

    let _advancedJDBCModuleId;
    if (existingAdvancedJDBCModule) {
      _advancedJDBCModuleId = existingAdvancedJDBCModule._id;
    } else {
      _advancedJDBCModuleId = await ctx.db.insert("modules", {
        trackId: jdbcTrackId,
        slug: "advanced-jdbc",
        title: "Advanced JDBC",
        description: "Prepared statements, transactions, and connection pooling",
        order: 3,
      });
    }

    // Module 26: ORM Concepts
    const existingORMModule = await ctx.db
      .query("modules")
      .withIndex("by_track_slug", (q) =>
        q.eq("trackId", jdbcTrackId).eq("slug", "orm-concepts")
      )
      .first();

    let _ormModuleId;
    if (existingORMModule) {
      _ormModuleId = existingORMModule._id;
    } else {
      _ormModuleId = await ctx.db.insert("modules", {
        trackId: jdbcTrackId,
        slug: "orm",
        title: "ORM",
        description: "Object-relational mapping with JPA and Hibernate",
        order: 4,
      });
    }

    // ============================================
    // TRACK 7: WEB DEVELOPMENT BASICS
    // ============================================

    const existingWebDevTrack = await ctx.db
      .query("tracks")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "web-development-basics")
      )
      .first();

    let webDevTrackId;
    if (existingWebDevTrack) {
      webDevTrackId = existingWebDevTrack._id;
    } else {
      webDevTrackId = await ctx.db.insert("tracks", {
        languageId,
        slug: "web-development-basics",
        title: "Web Development Basics",
        description: "HTTP concepts, Servlets, Spring Boot, and web security",
        level: "advanced",
        order: 7,
      });
    }

    // Module 27: HTTP & Web Concepts
    const existingHTTPModule = await ctx.db
      .query("modules")
      .withIndex("by_track_slug", (q) =>
        q.eq("trackId", webDevTrackId).eq("slug", "http-web-concepts")
      )
      .first();

    let _httpModuleId;
    if (existingHTTPModule) {
      _httpModuleId = existingHTTPModule._id;
    } else {
      _httpModuleId = await ctx.db.insert("modules", {
        trackId: webDevTrackId,
        slug: "http",
        title: "HTTP",
        description: "HTTP protocol, request/response handling, and status codes",
        order: 1,
      });
    }

    // Module 28: Java Servlets
    const existingServletsModule = await ctx.db
      .query("modules")
      .withIndex("by_track_slug", (q) =>
        q.eq("trackId", webDevTrackId).eq("slug", "java-servlets")
      )
      .first();

    let _servletsModuleId;
    if (existingServletsModule) {
      _servletsModuleId = existingServletsModule._id;
    } else {
      _servletsModuleId = await ctx.db.insert("modules", {
        trackId: webDevTrackId,
        slug: "servlets",
        title: "Servlets",
        description: "Servlet lifecycle, request/response objects, and annotations",
        order: 2,
      });
    }

    // Module 29: Spring Boot Basics
    const existingSpringBasicsModule = await ctx.db
      .query("modules")
      .withIndex("by_track_slug", (q) =>
        q.eq("trackId", webDevTrackId).eq("slug", "spring-boot-basics")
      )
      .first();

    let springBasicsModuleId;
    if (existingSpringBasicsModule) {
      springBasicsModuleId = existingSpringBasicsModule._id;
    } else {
      springBasicsModuleId = await ctx.db.insert("modules", {
        trackId: webDevTrackId,
        slug: "spring-boot-basics",
        title: "Spring Boot Basics",
        description: "Spring Boot overview, controllers, routing, and dependency injection",
        order: 3,
      });
    }

    // Module 30: Spring Data JPA
    const existingSpringDataModule = await ctx.db
      .query("modules")
      .withIndex("by_track_slug", (q) =>
        q.eq("trackId", webDevTrackId).eq("slug", "spring-data-jpa")
      )
      .first();

    let _springDataModuleId;
    if (existingSpringDataModule) {
      _springDataModuleId = existingSpringDataModule._id;
    } else {
      _springDataModuleId = await ctx.db.insert("modules", {
        trackId: webDevTrackId,
        slug: "spring-data",
        title: "Spring Data",
        description: "Spring Data repositories, JPA integration, and database operations",
        order: 4,
      });
    }

    // Module 31: Security & Validation
    const existingSecurityModule = await ctx.db
      .query("modules")
      .withIndex("by_track_slug", (q) =>
        q.eq("trackId", webDevTrackId).eq("slug", "security-validation")
      )
      .first();

    let _securityModuleId;
    if (existingSecurityModule) {
      _securityModuleId = existingSecurityModule._id;
    } else {
      _securityModuleId = await ctx.db.insert("modules", {
        trackId: webDevTrackId,
        slug: "security",
        title: "Security",
        description: "Spring Security, authentication, and authorization",
        order: 5,
      });
    }

    // ============================================
    // TRACK 8: TESTING & QUALITY
    // ============================================

    const existingTestingTrack = await ctx.db
      .query("tracks")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "testing-quality")
      )
      .first();

    let testingTrackId;
    if (existingTestingTrack) {
      testingTrackId = existingTestingTrack._id;
    } else {
      testingTrackId = await ctx.db.insert("tracks", {
        languageId,
        slug: "testing-quality",
        title: "Testing & Quality",
        description: "Unit testing with JUnit 5, mocking with Mockito, and CI/CD practices",
        level: "advanced",
        order: 8,
      });
    }

    // Module 32: Unit Testing with JUnit 5
    const existingJUnitModule = await ctx.db
      .query("modules")
      .withIndex("by_track_slug", (q) =>
        q.eq("trackId", testingTrackId).eq("slug", "unit-testing-junit")
      )
      .first();

    let junitModuleId;
    if (existingJUnitModule) {
      junitModuleId = existingJUnitModule._id;
    } else {
      junitModuleId = await ctx.db.insert("modules", {
        trackId: testingTrackId,
        slug: "unit-testing-junit",
        title: "Unit Testing with JUnit 5",
        description: "Test structure, assertions, fixtures, and parameterized tests",
        order: 1,
      });
    }

    // Module 33: Mocking with Mockito
    const existingMockitoModule = await ctx.db
      .query("modules")
      .withIndex("by_track_slug", (q) =>
        q.eq("trackId", testingTrackId).eq("slug", "mocking-mockito")
      )
      .first();

    let _mockitoModuleId;
    if (existingMockitoModule) {
      _mockitoModuleId = existingMockitoModule._id;
    } else {
      _mockitoModuleId = await ctx.db.insert("modules", {
        trackId: testingTrackId,
        slug: "mockito",
        title: "Mockito",
        description: "Mocking with Mockito, stubbing, and verification",
        order: 1,
      });
    }

    // Module 34: Code Quality & CI/CD
    const existingQualityModule = await ctx.db
      .query("modules")
      .withIndex("by_track_slug", (q) =>
        q.eq("trackId", testingTrackId).eq("slug", "code-quality-ci-cd")
      )
      .first();

    let _qualityModuleId;
    if (existingQualityModule) {
      _qualityModuleId = existingQualityModule._id;
    } else {
      _qualityModuleId = await ctx.db.insert("modules", {
        trackId: testingTrackId,
        slug: "quality",
        title: "Quality",
        description: "Code quality, static analysis, and refactoring techniques",
        order: 2,
      });
    }

    // ============================================
    // TRACK 9: CAPSTONE PROJECT
    // ============================================

    const existingCapstoneTrack = await ctx.db
      .query("tracks")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "capstone-project")
      )
      .first();

    let capstoneTrackId;
    if (existingCapstoneTrack) {
      capstoneTrackId = existingCapstoneTrack._id;
    } else {
      capstoneTrackId = await ctx.db.insert("tracks", {
        languageId,
        slug: "capstone-project",
        title: "Capstone Project",
        description: "Build a full-stack application from design to deployment",
        level: "job-ready",
        order: 9,
      });
    }

    // Module 35: Project Planning & Design
    const existingPlanningModule = await ctx.db
      .query("modules")
      .withIndex("by_track_slug", (q) =>
        q.eq("trackId", capstoneTrackId).eq("slug", "project-planning-design")
      )
      .first();

    let _planningModuleId;
    if (existingPlanningModule) {
      _planningModuleId = existingPlanningModule._id;
    } else {
      _planningModuleId = await ctx.db.insert("modules", {
        trackId: capstoneTrackId,
        slug: "planning",
        title: "Planning",
        description: "Project planning, requirements analysis, and design patterns",
        order: 1,
      });
    }

    // Module 36: Backend Implementation
    const existingBackendModule = await ctx.db
      .query("modules")
      .withIndex("by_track_slug", (q) =>
        q.eq("trackId", capstoneTrackId).eq("slug", "backend-implementation")
      )
      .first();

    let _backendModuleId;
    if (existingBackendModule) {
      _backendModuleId = existingBackendModule._id;
    } else {
      _backendModuleId = await ctx.db.insert("modules", {
        trackId: capstoneTrackId,
        slug: "backend",
        title: "Backend",
        description: "Backend implementation, API development, and database integration",
        order: 2,
      });
    }

    // Module 37: Frontend Integration
    const existingFrontendModule = await ctx.db
      .query("modules")
      .withIndex("by_track_slug", (q) =>
        q.eq("trackId", capstoneTrackId).eq("slug", "frontend-integration")
      )
      .first();

    let _frontendModuleId;
    if (existingFrontendModule) {
      _frontendModuleId = existingFrontendModule._id;
    } else {
      _frontendModuleId = await ctx.db.insert("modules", {
        trackId: capstoneTrackId,
        slug: "frontend",
        title: "Frontend",
        description: "Frontend integration, responsive design, and user experience",
        order: 3,
      });
    }

    // Module 38: Testing & Deployment
    const existingDeploymentModule = await ctx.db
      .query("modules")
      .withIndex("by_track_slug", (q) =>
        q.eq("trackId", capstoneTrackId).eq("slug", "testing-deployment")
      )
      .first();

    let _deploymentModuleId;
    if (existingDeploymentModule) {
      _deploymentModuleId = existingDeploymentModule._id;
    } else {
      _deploymentModuleId = await ctx.db.insert("modules", {
        trackId: capstoneTrackId,
        slug: "deployment",
        title: "Deployment",
        description: "Deployment strategies, CI/CD, and cloud services",
        order: 4,
      });
    }

    // ============================================
    // CURRICULUM ITEMS - OOP (TRACK 2)
    // ============================================

    // Lesson 6.1: Class Structure & Fields
    const existingClassStructureLesson = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "class-structure-fields")
      )
      .first();

    if (!existingClassStructureLesson) {
      const classStructureContent = `# Class Structure & Fields

## Understanding Classes

A **class** is a blueprint or template for creating objects. It defines:
- **Fields** (instance variables): Data stored in the object
- **Methods**: Behaviors or actions the object can perform
- **Constructors**: Special methods for creating objects

## Basic Class Structure

\`\`\`java
public class Car {
    // Fields (instance variables)
    String make;
    String model;
    int year;
    double mileage;

    // Constructor
    public Car(String make, String model, int year) {
        this.make = make;
        this.model = model;
        this.year = year;
        this.mileage = 0;
    }

    // Method
    public void drive(double miles) {
        this.mileage += miles;
    }

    // Method
    public String getDescription() {
        return year + " " + make + " " + model;
    }
}
\`\`\`

## Fields (Instance Variables)

Fields store the state of an object:

\`\`\`java
public class Student {
    // Public fields (can be accessed directly)
    public String name;
    public int age;

    // Private fields (encapsulated - better practice)
    private double gpa;
    private String major;
}
\`\`\`

### Field Modifiers

| Modifier | Access | Description |
|----------|--------|-------------|
| \`public\` | Everywhere | Can be accessed from any class |
| \`private\` | Class only | Only accessible within the same class |
| \`protected\` | Package + Subclasses | Accessible in package and subclasses |
| (no modifier) | Package only | Accessible only in the same package |

### Static vs Instance Fields

\`\`\`java
public class Counter {
    // Static field - shared by all instances
    private static int totalCount = 0;

    // Instance field - unique to each object
    private int count;

    public Counter() {
        count = 0;
        totalCount++; // All instances share this
    }

    public int getCount() {
        return count;
    }

    public static int getTotalCount() {
        return totalCount;
    }
}
\`\`\`

## Common Pitfalls

❌ **Not initializing fields**: Fields default to \`null\` for objects, \`0\` for numbers
✅ **Always initialize fields** or set them in constructors

❌ **Using public fields**: Breaks encapsulation
✅ **Use private fields** with getters/setters

❌ **Static used incorrectly**: Static fields are shared across ALL instances
✅ **Use instance fields** for object-specific data

## Try It Yourself

1. Create a \`Book\` class with fields: \`title\`, \`author\`, \`isbn\`, \`price\`
2. Add a constructor that initializes all fields
3. Add a method \`getDiscountedPrice(double discount)\` that returns price after discount
4. Create a \`Library\` class with a static field tracking total books

## What's Next?

In the next lesson, we'll dive deeper into constructors and how they properly initialize objects.
`;

      await ctx.db.insert("curriculumItems", {
        moduleId: classesObjectsModuleId,
        languageId,
        kind: "lesson",
        slug: "class-structure-fields",
        title: "Class Structure & Fields",
        order: 1,
        content: classStructureContent,
      });
    }

    // Challenge 6.1: Create a Person class
    const existingPersonClassTestSuite = await ctx.db
      .query("testSuites")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "person-class")
      )
      .first();

    let personClassTestSuiteId;
    if (existingPersonClassTestSuite) {
      personClassTestSuiteId = existingPersonClassTestSuite._id;
    } else {
      const personClassTestSuiteDefinition = {
        type: "java",
        entrypoint: "Person",
        tests: [
          {
            name: "Person class exists with correct fields",
            check: "compilation",
          },
          {
            method: "getName",
            input: [],
            output: "John Doe",
            description: "getName returns the person's name",
          },
          {
            method: "getAge",
            input: [],
            output: 30,
            description: "getAge returns the person's age",
          },
          {
            method: "haveBirthday",
            input: [],
            output: null,
            description: "haveBirthday increments age by 1",
          },
          {
            method: "getAge",
            input: [],
            output: 31,
            description: "Age is incremented after haveBirthday",
          },
        ],
      };

      personClassTestSuiteId = await ctx.db.insert("testSuites", {
        languageId,
        slug: "person-class",
        title: "Person Class - Public Tests",
        definition: personClassTestSuiteDefinition,
      });
    }

    const existingPersonClassChallenge = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "person-class")
      )
      .first();

    if (!existingPersonClassChallenge) {
      const personClassStarterCode = `public class Person {
    // TODO: Add private fields for name (String) and age (int)

    // TODO: Create a constructor that takes name and age as parameters

    // TODO: Create a getName() method that returns the name

    // TODO: Create a getAge() method that returns the age

    // TODO: Create a haveBirthday() method that increments age by 1

    public static void main(String[] args) {
        // Test your Person class
        Person person = new Person("John Doe", 30);
        System.out.println("Name: " + person.getName());
        System.out.println("Age: " + person.getAge());

        person.haveBirthday();
        System.out.println("After birthday: " + person.getAge());
    }
}`;

      await ctx.db.insert("curriculumItems", {
        moduleId: classesObjectsModuleId,
        languageId,
        kind: "challenge",
        slug: "person-class",
        title: "Create a Person Class",
        order: 2,
        prompt: `Create a Person class with the following requirements:

1. **Private fields**:
   - \`name\` (String)
   - \`age\` (int)

2. **Constructor**: Takes \`name\` and \`age\` as parameters and initializes the fields

3. **Methods**:
   - \`getName()\`: Returns the person's name
   - \`getAge()\`: Returns the person's age
   - \`haveBirthday()\`: Increments the age by 1

Your code should pass all the test cases that check:
- The class compiles successfully
- getName() returns the correct name
- getAge() returns the correct age
- haveBirthday() increments the age correctly`,
        starterCode: personClassStarterCode,
        testSuiteId: personClassTestSuiteId,
      });
    }

    // Lesson 7.1: Encapsulation & Access Modifiers
    const existingEncapsulationLesson = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "encapsulation-access-modifiers")
      )
      .first();

    if (!existingEncapsulationLesson) {
      const encapsulationContent = `# Encapsulation & Access Modifiers

## What is Encapsulation?

Encapsulation is the practice of hiding internal details of how an object works and exposing only what's necessary. It's one of the four pillars of OOP.

**Benefits of Encapsulation:**
- **Control**: Control how data is accessed and modified
- **Protection**: Prevent invalid data from being set
- **Flexibility**: Change internal implementation without affecting code that uses the class
- **Security**: Hide sensitive data

## Access Modifiers

Java provides four access modifiers:

| Modifier | Class | Package | Subclass | World |
|----------|-------|---------|----------|-------|
| \`public\` | ✅ | ✅ | ✅ | ✅ |
| \`protected\` | ✅ | ✅ | ✅ | ❌ |
| (default) | ✅ | ✅ | ❌ | ❌ |
| \`private\` | ✅ | ❌ | ❌ | ❌ |

### Public

\`\`\`java
public class Calculator {
    public double add(double a, double b) {
        return a + b;
    }
}
\`\`\`

### Private

\`\`\`java
public class BankAccount {
    private double balance;

    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
        }
    }

    public double getBalance() {
        return balance;
    }
}
\`\`\`

## Getters and Setters

Getters and setters provide controlled access to private fields:

\`\`\`java
public class Employee {
    private String name;
    private double salary;

    // Getter for name
    public String getName() {
        return name;
    }

    // Setter for name
    public void setName(String name) {
        if (name != null && !name.trim().isEmpty()) {
            this.name = name;
        }
    }

    // Getter for salary
    public double getSalary() {
        return salary;
    }

    // Setter for salary with validation
    public void setSalary(double salary) {
        if (salary >= 0) {
            this.salary = salary;
        } else {
            throw new IllegalArgumentException("Salary cannot be negative");
        }
    }
}
\`\`\`

### Why Use Getters/Setters?

1. **Validation**: Ensure data is valid before setting
2. **Computed properties**: Return derived values
3. **Logging**: Track when fields are accessed/modified
4. **Flexibility**: Change implementation later

## Immutability

An immutable object's state cannot be changed after creation:

\`\`\`java
public final class ImmutablePerson {
    private final String name;
    private final int age;

    public ImmutablePerson(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }

    // No setters - object cannot be modified after creation
}
\`\`\`

### Benefits of Immutability
- Thread-safe (can be shared between threads)
- Easier to reason about
- Can be cached safely
- Good for map keys and set elements

## Common Pitfalls

❌ **Public fields**: Direct access breaks encapsulation
✅ **Private fields** with getters/setters

❌ **Setters without validation**: Allow invalid state
✅ **Validate in setters** or make immutable

❌ **Returning mutable references**: Internal state can be modified
✅ **Return copies** or use immutable types

\`\`\`java
// Bad: Returns internal mutable list
public List<String> getItems() {
    return items; // Caller can modify our internal list!
}

// Good: Returns a copy
public List<String> getItems() {
    return new ArrayList<>(items);
}
\`\`\`

## Try It Yourself

1. Create a \`Temperature\` class with:
   - Private field \`celsius\` (double)
   - Constructor with validation (-273.15°C minimum)
   - getCelsius() and setCelsius() with validation
   - getFahrenheit() that computes from celsius
   - setFahrenheit() that converts and stores celsius

2. Make it immutable by removing setters and adding a \`withCelsius()\` method that returns a new object

## What's Next?

Next, we'll explore inheritance - how classes can share and extend behavior from other classes.
`;

      await ctx.db.insert("curriculumItems", {
        moduleId: encapsulationModuleId,
        languageId,
        kind: "lesson",
        slug: "encapsulation-access-modifiers",
        title: "Encapsulation & Access Modifiers",
        order: 1,
        content: encapsulationContent,
      });
    }

    // Challenge 7.1: Refactor for Encapsulation
    const existingEncapsulationChallengeTestSuite = await ctx.db
      .query("testSuites")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "encapsulation-challenge")
      )
      .first();

    let encapsulationChallengeTestSuiteId;
    if (existingEncapsulationChallengeTestSuite) {
      encapsulationChallengeTestSuiteId = existingEncapsulationChallengeTestSuite._id;
    } else {
      const encapsulationChallengeTestSuiteDefinition = {
        type: "java",
        entrypoint: "BankAccount",
        tests: [
          {
            name: "BankAccount class with proper encapsulation",
            check: "compilation",
          },
          {
            method: "getBalance",
            input: [],
            output: 1000.0,
            description: "Initial balance is 1000",
          },
          {
            method: "deposit",
            input: [500.0],
            output: null,
            description: "Deposit 500",
          },
          {
            method: "getBalance",
            input: [],
            output: 1500.0,
            description: "Balance is 1500 after deposit",
          },
          {
            method: "withdraw",
            input: [200.0],
            output: null,
            description: "Withdraw 200",
          },
          {
            method: "getBalance",
            input: [],
            output: 1300.0,
            description: "Balance is 1300 after withdrawal",
          },
        ],
      };

      encapsulationChallengeTestSuiteId = await ctx.db.insert("testSuites", {
        languageId,
        slug: "encapsulation-challenge",
        title: "Encapsulation Challenge - Public Tests",
        definition: encapsulationChallengeTestSuiteDefinition,
      });
    }

    const existingEncapsulationChallenge = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "encapsulation-challenge")
      )
      .first();

    if (!existingEncapsulationChallenge) {
      const encapsulationChallengeStarterCode = `public class BankAccount {
    // TODO: Make balance private
    double balance;

    // TODO: Create constructor with initial balance parameter
    // Validate that balance is not negative

    // TODO: Create getBalance() method

    // TODO: Create deposit(double amount) method
    // - Validate amount is positive
    // - Add amount to balance

    // TODO: Create withdraw(double amount) method
    // - Validate amount is positive
    // - Validate sufficient funds
    // - Subtract amount from balance

    public static void main(String[] args) {
        BankAccount account = new BankAccount(1000);
        System.out.println("Initial balance: " + account.getBalance());

        account.deposit(500);
        System.out.println("After deposit: " + account.getBalance());

        account.withdraw(200);
        System.out.println("After withdrawal: " + account.getBalance());
    }
}`;

      await ctx.db.insert("curriculumItems", {
        moduleId: encapsulationModuleId,
        languageId,
        kind: "challenge",
        slug: "encapsulation-challenge",
        title: "Refactor for Proper Encapsulation",
        order: 2,
        prompt: `Refactor the BankAccount class to use proper encapsulation:

1. **Make \`balance\` private** - should not be accessed directly

2. **Create constructor** that:
   - Takes initial balance as parameter
   - Validates balance is not negative (throw exception if invalid)

3. **Create getBalance()** method that returns current balance

4. **Create deposit(double amount)** method that:
   - Validates amount is positive
   - Adds amount to balance

5. **Create withdraw(double amount)** method that:
   - Validates amount is positive
   - Validates sufficient funds (balance >= amount)
   - Subtracts amount from balance

The tests will verify:
- Balance starts at 1000
- Deposit increases balance correctly
- Withdrawal decreases balance correctly`,
        starterCode: encapsulationChallengeStarterCode,
        testSuiteId: encapsulationChallengeTestSuiteId,
      });
    }

    // Lesson 8.1: Inheritance & Polymorphism
    const existingInheritanceLesson = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "inheritance-polymorphism")
      )
      .first();

    if (!existingInheritanceLesson) {
      const inheritanceContent = `# Inheritance & Polymorphism

## What is Inheritance?

Inheritance allows a class to acquire properties and methods from another class. It promotes code reuse and establishes a natural hierarchy between classes.

**Key Terms:**
- **Superclass (Parent)**: The class being inherited from
- **Subclass (Child)**: The class that inherits
- **extends**: Keyword used to inherit from a class

## Basic Inheritance

\`\`\`java
// Superclass
public class Animal {
    protected String name;
    protected int age;

    public Animal(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public void eat() {
        System.out.println(name + " is eating.");
    }

    public void sleep() {
        System.out.println(name + " is sleeping.");
    }

    public void makeSound() {
        System.out.println(name + " makes a sound.");
    }
}

// Subclass
public class Dog extends Animal {
    private String breed;

    public Dog(String name, int age, String breed) {
        super(name, age); // Call superclass constructor
        this.breed = breed;
    }

    // Override makeSound
    @Override
    public void makeSound() {
        System.out.println(name + " barks: Woof!");
    }

    // New method specific to Dog
    public void fetch() {
        System.out.println(name + " fetches the ball!");
    }
}
\`\`\`

## The \`super\` Keyword

\`super\` refers to the superclass:

\`\`\`java
public class Cat extends Animal {
    public Cat(String name, int age) {
        super(name, age); // Call superclass constructor
    }

    @Override
    public void makeSound() {
        super.makeSound(); // Call superclass method
        System.out.println("Meow!");
    }
}
\`\`\`

## Method Overriding

A subclass can provide a specific implementation of a method that's already defined in its superclass:

\`\`\`java
public class Vehicle {
    public void start() {
        System.out.println("Vehicle starting...");
    }
}

public class Car extends Vehicle {
    @Override
    public void start() {
        System.out.println("Car engine starting with key...");
    }
}
\`\`\`

### @Override Annotation

Always use \`@Override\` when overriding methods:
- **Documents intent**: Shows you meant to override
- **Compile-time checking**: Ensures you actually are overriding
- **Prevents bugs**: Catches typos in method names

## Polymorphism

Polymorphism means "many forms" - objects can take many forms depending on their actual type:

\`\`\`java
Animal myDog = new Dog("Buddy", 3, "Golden Retriever");
Animal myCat = new Cat("Whiskers", 5);

// Same method call, different behavior
myDog.makeSound(); // Output: Buddy barks: Woof!
myCat.makeSound(); // Output: Whiskers makes a sound. Meow!

// Array of different animals
Animal[] zoo = {new Dog("Max", 2), new Cat("Mittens", 4)};
for (Animal animal : zoo) {
    animal.makeSound(); // Each animal makes its own sound
}
\`\`\`

### Dynamic Method Dispatch

The actual method called is determined at runtime based on the object's actual type:

\`\`\`java
public class PaymentProcessor {
    public void processPayment(Payment payment) {
        payment.process(); // Actual type determines which method runs
    }
}

Payment creditCard = new CreditCardPayment();
Payment paypal = new PayPalPayment();

processor.processPayment(creditCard); // Calls CreditCardPayment.process()
processor.processPayment(paypal);     // Calls PayPalPayment.process()
\`\`\`

## instanceof Operator

Check an object's type before casting:

\`\`\`java
public void feedAnimal(Animal animal) {
    animal.eat();

    if (animal instanceof Dog) {
        Dog dog = (Dog) animal;
        dog.fetch(); // Safe to call Dog-specific method
    }
}
\`\`\`

## Common Pitfalls

❌ **Forgetting to call super() in constructors**
✅ **Always call super()** if the superclass doesn't have a no-arg constructor

❌ **Not using @Override**
✅ **Always use @Override** when overriding methods

❌ **Casting without instanceof check**
✅ **Always use instanceof** before casting to avoid ClassCastException

❌ **Hiding methods with static**: Static methods don't override, they hide
✅ **Use instance methods** for polymorphic behavior

## Try It Yourself

1. Create an \`Employee\` superclass with:
   - Fields: name, salary
   - Method: calculateBonus() returning 10% of salary

2. Create \`Manager\` subclass that:
   - Has additional field: bonusPercentage
   - Overrides calculateBonus() to use bonusPercentage
   - Adds method: hireEmployee()

3. Create \`Developer\` subclass that:
   - Has additional field: programmingLanguage
   - Overrides calculateBonus() to return 15%

4. Test polymorphism with an Employee[] array

## What's Next?

Next, we'll explore abstract classes and interfaces - ways to define contracts for classes without providing complete implementations.
`;

      await ctx.db.insert("curriculumItems", {
        moduleId: inheritanceModuleId,
        languageId,
        kind: "lesson",
        slug: "inheritance-polymorphism",
        title: "Inheritance & Polymorphism",
        order: 1,
        content: inheritanceContent,
      });
    }

    // Challenge 8.1: Animal Hierarchy
    const existingAnimalHierarchyTestSuite = await ctx.db
      .query("testSuites")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "animal-hierarchy")
      )
      .first();

    let animalHierarchyTestSuiteId;
    if (existingAnimalHierarchyTestSuite) {
      animalHierarchyTestSuiteId = existingAnimalHierarchyTestSuite._id;
    } else {
      const animalHierarchyTestSuiteDefinition = {
        type: "java",
        entrypoint: "AnimalDemo",
        tests: [
          {
            name: "Animal hierarchy compiles",
            check: "compilation",
          },
        ],
      };

      animalHierarchyTestSuiteId = await ctx.db.insert("testSuites", {
        languageId,
        slug: "animal-hierarchy",
        title: "Animal Hierarchy - Public Tests",
        definition: animalHierarchyTestSuiteDefinition,
      });
    }

    const existingAnimalHierarchyChallenge = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "animal-hierarchy")
      )
      .first();

    if (!existingAnimalHierarchyChallenge) {
      const animalHierarchyStarterCode = `// TODO: Create an Animal class with:
// - Protected fields: name (String), age (int)
// - Constructor that initializes name and age
// - makeSound() method that prints "{name} makes a sound"
// - eat() method that prints "{name} is eating"

// TODO: Create a Dog class that extends Animal:
// - Private field: breed (String)
// - Constructor that takes name, age, and breed
// - Override makeSound() to print "{name} barks: Woof!"
// - Add fetch() method that prints "{name} fetches the ball!"

// TODO: Create a Cat class that extends Animal:
// - Private field: indoor (boolean)
// - Constructor that takes name, age, and indoor
// - Override makeSound() to print "{name} meows: Meow!"
// - Add isIndoor() method that returns the indoor value

public class AnimalDemo {
    public static void main(String[] args) {
        // Test your classes
        Dog dog = new Dog("Buddy", 3, "Golden Retriever");
        Cat cat = new Cat("Whiskers", 5, true);

        dog.makeSound();
        dog.eat();
        dog.fetch();

        cat.makeSound();
        cat.eat();
        System.out.println("Is indoor: " + cat.isIndoor());
    }
}`;

      await ctx.db.insert("curriculumItems", {
        moduleId: inheritanceModuleId,
        languageId,
        kind: "challenge",
        slug: "animal-hierarchy",
        title: "Create an Animal Hierarchy",
        order: 2,
        prompt: `Create an animal hierarchy to practice inheritance:

1. **Animal class** (superclass):
   - Protected fields: \`name\` (String), \`age\` (int)
   - Constructor that initializes name and age
   - \`makeSound()\` method that prints "{name} makes a sound"
   - \`eat()\` method that prints "{name} is eating"

2. **Dog class** (subclass):
   - Extends Animal
   - Private field: \`breed\` (String)
   - Constructor that takes name, age, and breed
   - Override \`makeSound()\` to print "{name} barks: Woof!"
   - Add \`fetch()\` method that prints "{name} fetches the ball!"

3. **Cat class** (subclass):
   - Extends Animal
   - Private field: \`indoor\` (boolean)
   - Constructor that takes name, age, and indoor
   - Override \`makeSound()\` to print "{name} meows: Meow!"
   - Add \`isIndoor()\` method that returns the indoor value

4. **In AnimalDemo main()**:
   - Create a Dog and a Cat
   - Call methods on both to demonstrate polymorphism`,
        starterCode: animalHierarchyStarterCode,
        testSuiteId: animalHierarchyTestSuiteId,
      });
    }

    // ============================================
    // MORE CURRICULUM ITEMS - COLLECTIONS (TRACK 3)
    // ============================================

    // Lesson 11.1: ArrayList vs LinkedList
    const existingListLesson = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "arraylist-linkedlist")
      )
      .first();

    if (!existingListLesson) {
      const listLessonContent = `# ArrayList vs LinkedList

## The List Interface

The \`List\` interface represents an ordered collection that allows duplicates:

\`\`\`java
import java.util.List;
import java.util.ArrayList;
import java.util.LinkedList;

List<String> arrayList = new ArrayList<>();
List<String> linkedList = new LinkedList<>();
\`\`\`

## ArrayList

Based on a dynamic array - stores elements contiguously in memory.

\`\`\`java
List<String> names = new ArrayList<>();
names.add("Alice");
names.add("Bob");
names.add("Charlie");

// Access by index - O(1)
String first = names.get(0);

// Add at specific position
names.add(1, "Anna");

// Remove by index
names.remove(2);

// Size
int size = names.size();
\`\`\`

### ArrayList Characteristics

| Operation | Time Complexity | Description |
|-----------|-----------------|-------------|
| \`get(index)\` | O(1) | Direct access |
| \`add(element)\` | O(1) amortized | May need to resize |
| \`add(index, element)\` | O(n) | Must shift elements |
| \`remove(index)\` | O(n) | Must shift elements |
| \`contains()\` | O(n) | Linear search |

**Best for**: Random access, frequent reading

## LinkedList

Based on a doubly-linked list - elements reference next and previous nodes.

\`\`\`java
List<String> names = new LinkedList<>();
names.add("Alice");
names.add("Bob");
names.add("Charlie");

// Add at beginning - O(1)
((LinkedList<String>) names).addFirst("First");

// Add at end - O(1)
((LinkedList<String>) names).addLast("Last");

// Remove first/last - O(1)
((LinkedList<String>) names).removeFirst();
\`\`\`

### LinkedList Characteristics

| Operation | Time Complexity | Description |
|-----------|-----------------|-------------|
| \`get(index)\` | O(n) | Must traverse |
| \`add(element)\` | O(1) | Just update links |
| \`add(index, element)\` | O(n) | Must find position |
| \`remove(index)\` | O(n) | Must find position |
| \`addFirst()/addLast()\` | O(1) | Direct access |

**Best for**: Frequent insertions/deletions at ends

## Common List Operations

\`\`\`java
List<Integer> numbers = new ArrayList<>();

// Add elements
numbers.add(10);
numbers.add(20);
numbers.add(30);

// Add all from another collection
List<Integer> more = List.of(40, 50);
numbers.addAll(more);

// Access elements
int first = numbers.get(0);
int last = numbers.get(numbers.size() - 1);

// Update element
numbers.set(0, 100);

// Remove by index
numbers.remove(0);

// Remove by value
numbers.remove(Integer.valueOf(30));

// Check if contains
boolean hasTwenty = numbers.contains(20);

// Find index
int index = numbers.indexOf(20);

// Clear all
numbers.clear();

// Check if empty
boolean empty = numbers.isEmpty();
\`\`\`

## Iterating Through Lists

\`\`\`java
List<String> names = new ArrayList<>();
names.add("Alice");
names.add("Bob");
names.add("Charlie");

// For-each loop (preferred)
for (String name : names) {
    System.out.println(name);
}

// Traditional for loop (when index needed)
for (int i = 0; i < names.size(); i++) {
    System.out.println(i + ": " + names.get(i));
}

// Iterator (safe for removal during iteration)
Iterator<String> iterator = names.iterator();
while (iterator.hasNext()) {
    String name = iterator.next();
    if (name.equals("Bob")) {
        iterator.remove(); // Safe removal
    }
}

// forEach with lambda
names.forEach(name -> System.out.println(name));
\`\`\`

## Choosing Between ArrayList and LinkedList

| Use Case | Recommendation |
|----------|----------------|
| Random access (get by index) | ArrayList |
| Frequent reading, few modifications | ArrayList |
| Frequent insertions/deletions at ends | LinkedList |
| Queue/stack behavior | LinkedList |
| Most common cases | ArrayList (default) |

## Common Pitfalls

❌ **Using LinkedList when ArrayList is better**: LinkedList has more overhead per element
✅ **Use ArrayList by default**, only switch if profiling shows benefit

❌ **Removing elements while iterating with for-each**: ConcurrentModificationException
✅ **Use Iterator.remove()** or removeIf()

❌ **Calling get() repeatedly in LinkedList**: O(n) each call
✅ **Use Iterator or enhanced for loop**

\`\`\`java
// Bad - O(n²) for LinkedList!
for (int i = 0; i < list.size(); i++) {
    String s = list.get(i);
}

// Good - O(n)
for (String s : list) {
    // process s
}
\`\`\`

## Try It Yourself

1. Create an \`ArrayList\` of integers and add 1-10
2. Remove all even numbers
3. Add 0 at the beginning and 11 at the end
4. Print the list, its size, and the sum of all elements

## What's Next?

Next, we'll explore the Set interface for storing unique elements without duplicates.
`;

      await ctx.db.insert("curriculumItems", {
        moduleId: listModuleId,
        languageId,
        kind: "lesson",
        slug: "arraylist-linkedlist",
        title: "ArrayList vs LinkedList",
        order: 1,
        content: listLessonContent,
      });
    }

    // Challenge 11.1: Remove Duplicates from List
    const existingRemoveDuplicatesTestSuite = await ctx.db
      .query("testSuites")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "remove-duplicates")
      )
      .first();

    let removeDuplicatesTestSuiteId;
    if (existingRemoveDuplicatesTestSuite) {
      removeDuplicatesTestSuiteId = existingRemoveDuplicatesTestSuite._id;
    } else {
      const removeDuplicatesTestSuiteDefinition = {
        type: "java",
        entrypoint: "ListUtils",
        tests: [
          {
            name: "ListUtils class compiles",
            check: "compilation",
          },
        ],
      };

      removeDuplicatesTestSuiteId = await ctx.db.insert("testSuites", {
        languageId,
        slug: "remove-duplicates",
        title: "Remove Duplicates - Public Tests",
        definition: removeDuplicatesTestSuiteDefinition,
      });
    }

    const existingRemoveDuplicatesChallenge = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "remove-duplicates")
      )
      .first();

    if (!existingRemoveDuplicatesChallenge) {
      const removeDuplicatesStarterCode = `import java.util.*;

public class ListUtils {
    /**
     * Removes duplicate elements from a list while preserving order.
     *
     * @param list The list to process (may contain duplicates)
     * @return A new list with duplicates removed, order preserved
     */
    public static <T> List<T> removeDuplicates(List<T> list) {
        // TODO: Implement this method
        // 1. Create a new list to store unique elements
        // 2. Use a LinkedHashSet to track seen elements (preserves order)
        // 3. Iterate through the input list
        // 4. Add elements to the result if not already seen
        // 5. Return the result list
        return null;
    }

    public static void main(String[] args) {
        // Test with a list of strings
        List<String> names = Arrays.asList(
            "Alice", "Bob", "Alice", "Charlie", "Bob", "David"
        );

        List<String> unique = removeDuplicates(names);
        System.out.println("Original: " + names);
        System.out.println("Unique: " + unique);
        // Expected: [Alice, Bob, Charlie, David]

        // Test with integers
        List<Integer> numbers = Arrays.asList(
            1, 2, 3, 2, 4, 1, 5, 3
        );

        List<Integer> uniqueNumbers = removeDuplicates(numbers);
        System.out.println("Original: " + numbers);
        System.out.println("Unique: " + uniqueNumbers);
        // Expected: [1, 2, 3, 4, 5]
    }
}`;

      await ctx.db.insert("curriculumItems", {
        moduleId: listModuleId,
        languageId,
        kind: "challenge",
        slug: "remove-duplicates",
        title: "Remove Duplicates from List",
        order: 2,
        prompt: `Implement a generic method that removes duplicate elements from a list while preserving order.

Requirements:
1. **Use LinkedHashSet** to track seen elements (preserves insertion order)
2. **Preserve original order** of first occurrences
3. **Return a new list** - don't modify the original
4. **Make it generic** - work with any type T

The method signature:
\`\`\`java
public static <T> List<T> removeDuplicates(List<T> list)
\`\`\`

Example:
- Input: [1, 2, 3, 2, 4, 1, 5]
- Output: [1, 2, 3, 4, 5]

The main method has test code - verify your implementation works correctly.`,
        starterCode: removeDuplicatesStarterCode,
        testSuiteId: removeDuplicatesTestSuiteId,
      });
    }

    // Lesson 19.1: Lambda Expressions
    const existingLambdaLesson = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "lambda-expressions")
      )
      .first();

    if (!existingLambdaLesson) {
      const lambdaLessonContent = `# Lambda Expressions

## What are Lambdas?

Lambda expressions provide a concise way to represent functional interfaces (interfaces with a single abstract method). They enable functional programming in Java.

\`\`\`java
// Before Java 8 - Anonymous inner class
button.addActionListener(new ActionListener() {
    @Override
    public void actionPerformed(ActionEvent e) {
        System.out.println("Button clicked!");
    }
});

// With lambda - Much cleaner!
button.addActionListener(e -> System.out.println("Button clicked!"));
\`\`\`

## Lambda Syntax

\`\`\`java
(parameters) -> { body }
\`\`\`

| Form | Syntax | Example |
|------|--------|---------|
| No parameters | \`()\` | \`() -> System.out.println("Hello")\` |
| One parameter | \`x\` or \` (x)\` | \`x -> x * x\` |
| Multiple parameters | \` (x, y)\` | \` (x, y) -> x + y\` |
| Block body | \`{ return ...; }\` | \`x -> { return x * x; }\` |

## Examples

\`\`\`java
// No parameters
Runnable sayHello = () -> System.out.println("Hello!");
sayHello.run(); // Output: Hello!

// One parameter (parentheses optional for single param)
Predicate<String> isEmpty = s -> s.isEmpty();
boolean result = isEmpty.test(""); // true

// Multiple parameters (parentheses required)
BiFunction<Integer, Integer, Integer> add = (a, b) -> a + b;
int sum = add.apply(5, 3); // 8

// Block body (return keyword required)
Function<Integer, Integer> factorial = n -> {
    if (n <= 1) return 1;
    int result = 1;
    for (int i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
};
\`\`\`

## Common Functional Interfaces

Java provides built-in functional interfaces in \`java.util.function\`:

| Interface | Method | Usage |
|-----------|--------|-------|
| \`Predicate<T>\` | \`boolean test(T t)\` | Filter/check conditions |
| \`Function<T, R>\` | \`R apply(T t)\` | Transform values |
| \`Consumer<T>\` | \`void accept(T t)\` | Process values (no return) |
| \`Supplier<T>\` | \`T get()\` | Generate/provide values |
| \`UnaryOperator<T>\` | \`T apply(T t)\` | Transform same type |
| \`BinaryOperator<T>\` | \`T apply(T t1, T t2)\` | Combine two values |

### Predicate Examples

\`\`\`java
import java.util.function.Predicate;

// Check if string is empty
Predicate<String> isEmpty = String::isEmpty;
Predicate<String> isNotEmpty = isEmpty.negate();

// Chain predicates
Predicate<String> longWord = s -> s.length() > 5;
Predicate<String> startsWithA = s -> s.startsWith("A");

// AND: both conditions
Predicate<String> longAndStartsWithA = longWord.and(startsWithA);

// OR: either condition
Predicate<String> longOrStartsWithA = longWord.or(startsWithA);

// NOT: negate
Predicate<String> notLong = longWord.negate();
\`\`\`

### Function Examples

\`\`\`java
import java.util.function.Function;

// Convert string to length
Function<String, Integer> stringLength = String::length;
int len = stringLength.apply("hello"); // 5

// Chain functions
Function<String, String> upper = String::toUpperCase;
Function<String, String> lower = String::toLowerCase;
Function<String, String> thenUpper = lower.andThen(upper);

// Compose (apply lower first, then upper)
String result = thenUpper.apply("HeLLo"); // "HELLO"

// Primitive specializations avoid autoboxing
IntUnaryOperator square = x -> x * x;
int squared = square.applyAsInt(5); // 25
\`\`\`

## Method References

Method references are shorthand for lambdas that call a single method:

\`\`\`java
// Lambda
list.forEach(s -> System.out.println(s));

// Method reference
list.forEach(System.out::println);
\`\`\`

| Type | Syntax | Lambda equivalent |
|------|--------|-------------------|
| Static method | \`ClassName::method\` | \`args -> ClassName.method(args)\` |
| Instance method | \`instance::method\` | \`args -> instance.method(args)\` |
| Arbitrary instance | \`ClassName::method\` | \` (obj, args) -> obj.method(args)\` |
| Constructor | \`ClassName::new\` | \`args -> new ClassName(args)\` |

\`\`\`java
// Static method reference
Function<String, Integer> parseInt = Integer::parseInt;
// Equivalent to: s -> Integer.parseInt(s)

// Instance method reference
String str = "hello";
Function<Integer, Character> charAt = str::charAt;
// Equivalent to: i -> str.charAt(i)

// Arbitrary instance of particular object
Function<String, String> toUpper = String::toUpperCase;
// Equivalent to: s -> s.toUpperCase()

// Constructor reference
Supplier<List<String>> listSupplier = ArrayList::new;
// Equivalent to: () -> new ArrayList<>()
\`\`\`

## Lambdas with Collections

\`\`\`java
List<String> names = Arrays.asList("Alice", "Bob", "Charlie", "David");

// forEach - perform action on each element
names.forEach(name -> System.out.println("Hello, " + name));

// removeIf - remove elements matching condition
names.removeIf(name -> name.length() < 4);

// replaceAll - transform each element
names.replaceAll(String::toUpperCase);

// sort - sort with comparator
names.sort((a, b) -> a.compareTo(b));
\`\`\`

## Variable Capture

Lambdas can access local variables from the enclosing scope:

\`\`\`java
int threshold = 5;
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

// Local variable must be effectively final
numbers.stream()
       .filter(n -> n > threshold)
       .forEach(System.out::println);
\`\`\`

**Important**: Variables accessed by lambda must be **effectively final** - they don't have to be declared \`final\`, but they can't be modified.

## Common Pitfalls

❌ **Not using effectively final variables**
✅ **Variables accessed in lambdas can't be modified**

❌ **Using return in expression body**: \`x -> return x * 2;\`
✅ **Omit return in expression body**: \`x -> x * 2\`

❌ **Forgetting semicolons in block body**
✅ **Use proper syntax**: \`x -> { return x * 2; }\`

❌ **Overusing lambdas when simple loop is clearer**
✅ **Use lambdas for readability**, not just because they're cool

## Try It Yourself

1. Create a \`Predicate<String>\` that checks if a string is a valid email
2. Create a \`Function<String, String>\` that masks email (user@domain.com -> u***@domain.com)
3. Use method reference to sort a list of strings by length
4. Create a \`BiFunction<Integer, Integer, Integer>\` for GCD calculation

## What's Next?

Next, we'll explore the Stream API - a powerful way to process collections of data declaratively.
`;

      await ctx.db.insert("curriculumItems", {
        moduleId: lambdaModuleId,
        languageId,
        kind: "lesson",
        slug: "lambda-expressions",
        title: "Lambda Expressions",
        order: 1,
        content: lambdaLessonContent,
      });
    }

    // Challenge 19.1: Refactor Loops to Lambdas
    const existingRefactorLambdasTestSuite = await ctx.db
      .query("testSuites")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "refactor-lambdas")
      )
      .first();

    let refactorLambdasTestSuiteId;
    if (existingRefactorLambdasTestSuite) {
      refactorLambdasTestSuiteId = existingRefactorLambdasTestSuite._id;
    } else {
      const refactorLambdasTestSuiteDefinition = {
        type: "java",
        entrypoint: "StreamProcessors",
        tests: [
          {
            name: "StreamProcessors class compiles",
            check: "compilation",
          },
        ],
      };

      refactorLambdasTestSuiteId = await ctx.db.insert("testSuites", {
        languageId,
        slug: "refactor-lambdas",
        title: "Refactor Loops to Lambdas - Public Tests",
        definition: refactorLambdasTestSuiteDefinition,
      });
    }

    const existingRefactorLambdasChallenge = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "refactor-lambdas")
      )
      .first();

    if (!existingRefactorLambdasChallenge) {
      const refactorLambdasStarterCode = `import java.util.*;
import java.util.function.*;

public class StreamProcessors {

    /**
     * TODO: Refactor to use forEach with a lambda or method reference
     * Print each name in the list
     */
    public static void printNames(List<String> names) {
        for (String name : names) {
            System.out.println(name);
        }
    }

    /**
     * TODO: Refactor to use removeIf with a lambda
     * Remove all names shorter than minLength
     */
    public static void removeShortNames(List<String> names, int minLength) {
        Iterator<String> iterator = names.iterator();
        while (iterator.hasNext()) {
            String name = iterator.next();
            if (name.length() < minLength) {
                iterator.remove();
            }
        }
    }

    /**
     * TODO: Refactor to use replaceAll with a lambda
     * Convert all strings to uppercase
     */
    public static void makeAllUppercase(List<String> names) {
        for (int i = 0; i < names.size(); i++) {
            names.set(i, names.get(i).toUpperCase());
        }
    }

    /**
     * TODO: Use a Function to transform a list of strings to their lengths
     * Return a new list with the length of each string
     */
    public static List<Integer> getStringLengths(List<String> strings) {
        // TODO: Use stream().map().collect()
        return null;
    }

    /**
     * TODO: Use a Predicate to filter a list
     * Return only even numbers
     */
    public static List<Integer> filterEvenNumbers(List<Integer> numbers) {
        // TODO: Use stream().filter().collect()
        return null;
    }

    public static void main(String[] args) {
        // Test your refactored methods
        List<String> names = new ArrayList<>(Arrays.asList(
            "Alice", "Bo", "Charlie", "Di", "Eve"
        ));

        System.out.println("=== Original Names ===");
        printNames(names);

        System.out.println("\\n=== After Removing Short Names (min length 3) ===");
        removeShortNames(names, 3);
        printNames(names);

        System.out.println("\\n=== After Uppercase ===");
        makeAllUppercase(names);
        printNames(names);

        System.out.println("\\n=== String Lengths ===");
        List<Integer> lengths = getStringLengths(Arrays.asList("a", "abc", "abcde"));
        System.out.println(lengths); // Expected: [1, 3, 5]

        System.out.println("\\n=== Even Numbers ===");
        List<Integer> evens = filterEvenNumbers(Arrays.asList(1, 2, 3, 4, 5, 6));
        System.out.println(evens); // Expected: [2, 4, 6]
    }
}`;

      await ctx.db.insert("curriculumItems", {
        moduleId: lambdaModuleId,
        languageId,
        kind: "challenge",
        slug: "refactor-lambdas",
        title: "Refactor Loops to Lambdas",
        order: 2,
        prompt: `Refactor the traditional for/while loops to use lambdas and functional interfaces:

1. **printNames()**: Use \`forEach\` with method reference \`System.out::println\`

2. **removeShortNames()**: Use \`removeIf\` with a lambda

3. **makeAllUppercase()**: Use \`replaceAll\` with method reference \`String::toUpperCase\`

4. **getStringLengths()**: Use \`stream().map().collect()\`
   - Map each string to its length using \`String::length\`
   - Collect to a list using \`Collectors.toList()\`

5. **filterEvenNumbers()**: Use \`stream().filter().collect()\`
   - Filter using a lambda \`n -> n % 2 == 0\`
   - Collect to a list

Hints:
- \`List.forEach(Consumer)\` - performs action on each element
- \`List.removeIf(Predicate)\` - removes elements matching predicate
- \`List.replaceAll(UnaryOperator)\` - transforms each element
- \`list.stream().map(Function).collect(Collectors.toList())\`
- \`list.stream().filter(Predicate).collect(Collectors.toList())\``,
        starterCode: refactorLambdasStarterCode,
        testSuiteId: refactorLambdasTestSuiteId,
      });
    }

    // Lesson 20.1: Stream API Basics
    const existingStreamBasicsLesson = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "stream-api-basics")
      )
      .first();

    if (!existingStreamBasicsLesson) {
      const streamBasicsContent = `# Stream API Basics

## What are Streams?

Streams are sequences of elements that support sequential and parallel aggregate operations. They provide a declarative way to process collections of data.

\`\`\`java
List<String> names = Arrays.asList("Alice", "Bob", "Charlie", "David");

// Without streams - imperative style
List<String> longNames = new ArrayList<>();
for (String name : names) {
    if (name.length() > 3) {
        longNames.add(name.toUpperCase());
    }
}

// With streams - declarative style
List<String> result = names.stream()
    .filter(name -> name.length() > 3)
    .map(String::toUpperCase)
    .collect(Collectors.toList());
\`\`\`

## Creating Streams

\`\`\`java
// From a collection
List<String> list = Arrays.asList("a", "b", "c");
Stream<String> stream1 = list.stream();

// From values
Stream<String> stream2 = Stream.of("a", "b", "c");

// From an array
String[] array = {"a", "b", "c"};
Stream<String> stream3 = Arrays.stream(array);

// From a range
IntStream range = IntStream.range(1, 5); // 1, 2, 3, 4
IntStream rangeClosed = IntStream.rangeClosed(1, 5); // 1, 2, 3, 4, 5

// Generate
Stream<Double> randoms = Stream.generate(Math::random).limit(5);

// Iterate
Stream<Integer> numbers = Stream.iterate(0, n -> n + 2).limit(5); // 0, 2, 4, 6, 8
\`\`\`

## Intermediate Operations

Operations that return a new stream - they're lazy (not executed until a terminal operation).

### filter

\`\`\`java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

List<Integer> evens = numbers.stream()
    .filter(n -> n % 2 == 0)
    .collect(Collectors.toList());
// [2, 4, 6, 8, 10]
\`\`\`

### map

\`\`\`java
List<String> names = Arrays.asList("alice", "bob", "charlie");

List<String> capitalized = names.stream()
    .map(String::toUpperCase)
    .collect(Collectors.toList());
// [ALICE, BOB, CHARLIE]
\`\`\`

### flatMap

\`\`\`java
List<List<Integer>> nested = Arrays.asList(
    Arrays.asList(1, 2),
    Arrays.asList(3, 4),
    Arrays.asList(5, 6)
);

List<Integer> flattened = nested.stream()
    .flatMap(List::stream)
    .collect(Collectors.toList());
// [1, 2, 3, 4, 5, 6]

// Split sentences into words
List<String> sentences = Arrays.asList(
    "Hello world",
    "Java streams"
);

List<String> words = sentences.stream()
    .flatMap(s -> Arrays.stream(s.split(" ")))
    .collect(Collectors.toList());
// [Hello, world, Java, streams]
\`\`\`

### distinct

\`\`\`java
List<Integer> numbers = Arrays.asList(1, 2, 2, 3, 3, 3, 4, 5);

List<Integer> unique = numbers.stream()
    .distinct()
    .collect(Collectors.toList());
// [1, 2, 3, 4, 5]
\`\`\`

### sorted

\`\`\`java
List<String> names = Arrays.asList("Charlie", "Alice", "Bob");

List<String> sorted = names.stream()
    .sorted() // Natural order
    .collect(Collectors.toList());
// [Alice, Bob, Charlie]

List<String> reverseSorted = names.stream()
    .sorted(Comparator.reverseOrder())
    .collect(Collectors.toList());
// [Charlie, Bob, Alice]

// Sort by length
List<String> byLength = names.stream()
    .sorted(Comparator.comparingInt(String::length))
    .collect(Collectors.toList());
// [Bob, Alice, Charlie]
\`\`\`

### limit and skip

\`\`\`java
List<Integer> numbers = IntStream.range(1, 11).boxed().toList();

List<Integer> first5 = numbers.stream()
    .limit(5)
    .collect(Collectors.toList());
// [1, 2, 3, 4, 5]

List<Integer> skipFirst5 = numbers.stream()
    .skip(5)
    .collect(Collectors.toList());
// [6, 7, 8, 9, 10]

// Pagination (page 2, size 3)
int page = 2;
int size = 3;
List<Integer> page2 = numbers.stream()
    .skip((page - 1) * size)
    .limit(size)
    .collect(Collectors.toList());
// [4, 5, 6]
\`\`\`

## Terminal Operations

Operations that produce a result or side-effect - they trigger the stream pipeline.

### collect

\`\`\`java
List<String> names = Arrays.asList("Alice", "Bob", "Charlie");

// To list
List<String> list = names.stream()
    .collect(Collectors.toList());

// To set
Set<String> set = names.stream()
    .collect(Collectors.toSet());

// To map
Map<String, Integer> map = names.stream()
    .collect(Collectors.toMap(
        name -> name,
        String::length
    ));
// {Alice=5, Bob=3, Charlie=7}

// Joining strings
String joined = names.stream()
    .collect(Collectors.joining(", "));
// Alice, Bob, Charlie

// Grouping by
Map<Integer, List<String>> byLength = names.stream()
    .collect(Collectors.groupingBy(String::length));
// {3=[Bob], 5=[Alice], 7=[Charlie]}
\`\`\`

### forEach

\`\`\`java
List<String> names = Arrays.asList("Alice", "Bob", "Charlie");

names.stream()
    .forEach(name -> System.out.println("Hello, " + name));

// Method reference version
names.stream()
    .forEach(System.out::println);
\`\`\`

### reduce

\`\`\`java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

// Sum
int sum = numbers.stream()
    .reduce(0, Integer::sum);
// 15

// Product
int product = numbers.stream()
    .reduce(1, (a, b) -> a * b);
// 120

// Concatenate strings
List<String> words = Arrays.asList("Java", " ", "Streams", " ", "API");
String result = words.stream()
    .reduce("", String::concat);
// "Java Streams API"

// Find max
Optional<Integer> max = numbers.stream()
    .reduce(Integer::max);
// Optional[5]
\`\`\`

### match operations

\`\`\`java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

// All elements match?
boolean allPositive = numbers.stream()
    .allMatch(n -> n > 0);
// true

// Any element matches?
boolean anyEven = numbers.stream()
    .anyMatch(n -> n % 2 == 0);
// true

// No elements match?
boolean noneNegative = numbers.stream()
    .noneMatch(n -> n < 0);
// true
\`\`\`

### find operations

\`\`\`java
List<String> names = Arrays.asList("Alice", "Bob", "Charlie", "David");

// Find first matching
Optional<String> first = names.stream()
    .filter(name -> name.length() > 4)
    .findFirst();
// Optional[Alice]

// Find any matching (useful with parallel streams)
Optional<String> any = names.stream()
    .filter(name -> name.startsWith("C"))
    .findAny();
// Optional[Charlie]

// Check if present
first.ifPresent(System.out::println);

// Or provide default
String result = first.orElse("Not found");
\`\`\`

### count

\`\`\`java
List<String> names = Arrays.asList("Alice", "Bob", "Charlie", "David");

long count = names.stream()
    .filter(name -> name.length() > 4)
    .count();
// 2
\`\`\`

## Stream Pipeline

A typical stream pipeline:

\`\`\`java
List<String> result = source.stream()          // 1. Create stream
    .filter(predicate)                        // 2. Intermediate operations
    .map(function)
    .distinct()
    .sorted()
    .collect(Collectors.toList());            // 3. Terminal operation
\`\`\`

**Important**: Streams can only be **consumed once**!

\`\`\`java
Stream<String> stream = names.stream();
stream.forEach(System.out::println);
stream.forEach(System.out::println); // IllegalStateException!
\`\`\`

## Common Pitfalls

❌ **Consuming a stream twice**
✅ **Create a new stream** for each operation

❌ **Using side-effects in forEach** - use collect instead
✅ **Use terminal operations** that return results

❌ **Forgetting that streams are lazy**
✅ **Remember intermediate ops don't execute** without terminal op

❌ **Modifying source while streaming**
✅ **Don't modify collection** during stream operations

## Try It Yourself

1. Create a list of integers 1-20
2. Filter to keep only even numbers
3. Map to squares (n -> n * n)
4. Keep only squares greater than 50
5. Sort in descending order
6. Limit to top 5
7. Collect to a list

Result should be: [400, 324, 256, 196, 144]

## What's Next?

Next, we'll explore advanced stream operations including reduction, parallel streams, and custom collectors.
`;

      await ctx.db.insert("curriculumItems", {
        moduleId: streamBasicsModuleId,
        languageId,
        kind: "lesson",
        slug: "stream-api-basics",
        title: "Stream API Basics",
        order: 1,
        content: streamBasicsContent,
      });
    }

    // Challenge 20.1: Process Student Grades
    const existingStudentGradesTestSuite = await ctx.db
      .query("testSuites")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "process-student-grades")
      )
      .first();

    let studentGradesTestSuiteId;
    if (existingStudentGradesTestSuite) {
      studentGradesTestSuiteId = existingStudentGradesTestSuite._id;
    } else {
      const studentGradesTestSuiteDefinition = {
        type: "java",
        entrypoint: "GradeProcessor",
        tests: [
          {
            name: "GradeProcessor class compiles",
            check: "compilation",
          },
        ],
      };

      studentGradesTestSuiteId = await ctx.db.insert("testSuites", {
        languageId,
        slug: "process-student-grades",
        title: "Process Student Grades - Public Tests",
        definition: studentGradesTestSuiteDefinition,
      });
    }

    const existingStudentGradesChallenge = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "process-student-grades")
      )
      .first();

    if (!existingStudentGradesChallenge) {
      const studentGradesStarterCode = `import java.util.*;
import java.util.stream.*;

class Student {
    private String name;
    private int grade;

    public Student(String name, int grade) {
        this.name = name;
        this.grade = grade;
    }

    public String getName() {
        return name;
    }

    public int getGrade() {
        return grade;
    }

    @Override
    public String toString() {
        return name + ": " + grade;
    }
}

public class GradeProcessor {

    /**
     * TODO: Use streams to find students with grade >= threshold
     * Return list of student names
     */
    public static List<String> getPassingStudents(List<Student> students, int threshold) {
        // TODO: Use stream().filter().map().collect()
        return null;
    }

    /**
     * TODO: Use streams to calculate average grade
     * Return 0.0 if list is empty
     */
    public static double getAverageGrade(List<Student> students) {
        // TODO: Use stream().mapToInt().average().orElse()
        return 0.0;
    }

    /**
     * TODO: Use streams to find the highest grade
     * Return OptionalInt.empty() if list is empty
     */
    public static OptionalInt getHighestGrade(List<Student> students) {
        // TODO: Use stream().mapToInt().max()
        return OptionalInt.empty();
    }

    /**
     * TODO: Use streams to sort students by grade (descending)
     * Return list of student names in order of highest grade first
     */
    public static List<String> getTopStudents(List<Student> students) {
        // TODO: Use stream().sorted().limit().map().collect()
        return null;
    }

    /**
     * TODO: Use streams to group students by pass/fail
     * Return map with "pass" and "fail" keys
     */
    public static Map<String, List<String>> groupByPassFail(List<Student> students, int threshold) {
        // TODO: Use stream().collect(Collectors.groupingBy(...))
        return null;
    }

    public static void main(String[] args) {
        List<Student> students = Arrays.asList(
            new Student("Alice", 85),
            new Student("Bob", 72),
            new Student("Charlie", 90),
            new Student("David", 65),
            new Student("Eve", 78),
            new Student("Frank", 95)
        );

        int passingGrade = 70;

        System.out.println("Passing Students: " + getPassingStudents(students, passingGrade));
        System.out.println("Average Grade: " + getAverageGrade(students));
        System.out.println("Highest Grade: " + getHighestGrade(students).getAsInt());
        System.out.println("Top 3 Students: " + getTopStudents(students));
        System.out.println("Pass/Fail Groups: " + groupByPassFail(students, passingGrade));
    }
}`;

      await ctx.db.insert("curriculumItems", {
        moduleId: streamBasicsModuleId,
        languageId,
        kind: "challenge",
        slug: "process-student-grades",
        title: "Process Student Grades",
        order: 2,
        prompt: `Implement stream operations to process student grades:

1. **getPassingStudents()**:
   - Filter students with grade >= threshold
   - Map to student names
   - Collect to list

2. **getAverageGrade()**:
   - Map students to grades (mapToInt)
   - Calculate average
   - Return 0.0 if empty

3. **getHighestGrade()**:
   - Map to grades (mapToInt)
   - Find max

4. **getTopStudents()**:
   - Sort by grade descending
   - Limit to 3
   - Map to names
   - Collect to list

5. **groupByPassFail()**:
   - Group by whether grade >= threshold
   - Use partitioningBy collector
   - Map to names in each group

Key methods:
- \`stream().filter(predicate)\`
- \`stream().map(function)\`
- \`stream().mapToInt(function)\`
- \`stream().sorted(comparator)\`
- \`stream().limit(n)\`
- \`Collectors.toList()\`
- \`Collectors.groupingBy()\`
- \`Collectors.partitioningBy()\`
- \`IntStream.average().orElse()\`
- \`IntStream.max()\``,
        starterCode: studentGradesStarterCode,
        testSuiteId: studentGradesTestSuiteId,
      });
    }

    // ============================================
    // MORE CURRICULUM - EXCEPTION HANDLING (TRACK 4)
    // ============================================

    // Lesson 16.1: Exception Handling Basics
    const existingExceptionHandlingLesson = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "exception-handling-basics")
      )
      .first();

    if (!existingExceptionHandlingLesson) {
      const exceptionHandlingContent = `# Exception Handling

## What are Exceptions?

An exception is an event that disrupts the normal flow of a program. Java's exception handling allows graceful error recovery.

\`\`\`java
try {
    int result = 10 / 0; // Throws ArithmeticException
} catch (ArithmeticException e) {
    System.out.println("Cannot divide by zero!");
}
\`\`\`

## try-catch-finally

\`\`\`java
try {
    // Code that might throw an exception
} catch (SpecificException e) {
    // Handle this exception
} catch (GeneralException e) {
    // Handle more general exceptions
} finally {
    // Always executed - cleanup code
}
\`\`\`

## Checked vs Unchecked Exceptions

| Type | Examples | Must Declare/Catch |
|------|----------|-------------------|
| **Checked** | IOException, SQLException | Yes |
| **Unchecked** | NullPointerException, ArithmeticException | No |

## Common Exceptions

- \`NullPointerException\`: Method called on null reference
- \`ArrayIndexOutOfBoundsException\`: Invalid array index
- \`ArithmeticException\`: Invalid arithmetic (divide by zero)
- \`NumberFormatException\`: Invalid number format

## Custom Exceptions

\`\`\`java
public class InsufficientFundsException extends Exception {
    public InsufficientFundsException(String message) {
        super(message);
    }
}
\`\`\`

## try-with-resources (Java 7+)

Automatically closes resources:

\`\`\`java
try (BufferedReader reader = new BufferedReader(new FileReader("data.txt"))) {
    // Use reader
} catch (IOException e) {
    // Handle exception
} // reader automatically closed
\`\`\`

## Best Practices

1. **Be specific** - catch specific exceptions, not \`Exception\`
2. **Never swallow exceptions** - always handle or log
3. **Clean up in finally** - release resources properly
4. **Use checked exceptions** for recoverable conditions
5. **Use unchecked exceptions** for programming errors
`;

      await ctx.db.insert("curriculumItems", {
        moduleId: exceptionModuleId,
        languageId,
        kind: "lesson",
        slug: "exception-handling-basics",
        title: "Exception Handling",
        order: 1,
        content: exceptionHandlingContent,
      });
    }

    // Challenge 16.1: Robust Input Validation
    const existingInputValidationTestSuite = await ctx.db
      .query("testSuites")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "input-validation")
      )
      .first();

    let inputValidationTestSuiteId;
    if (existingInputValidationTestSuite) {
      inputValidationTestSuiteId = existingInputValidationTestSuite._id;
    } else {
      const inputValidationTestSuiteDefinition = {
        type: "java",
        entrypoint: "InputValidator",
        tests: [
          {
            name: "InputValidator class compiles",
            check: "compilation",
          },
        ],
      };

      inputValidationTestSuiteId = await ctx.db.insert("testSuites", {
        languageId,
        slug: "input-validation",
        title: "Input Validation - Public Tests",
        definition: inputValidationTestSuiteDefinition,
      });
    }

    const existingInputValidationChallenge = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "input-validation")
      )
      .first();

    if (!existingInputValidationChallenge) {
      const inputValidationStarterCode = `import java.util.*;

class InvalidInputException extends Exception {
    public InvalidInputException(String message) {
        super(message);
    }
}

public class InputValidator {

    public static int parseInteger(String input) throws InvalidInputException {
        if (input == null || input.trim().isEmpty()) {
            throw new InvalidInputException("Input cannot be null or empty");
        }
        try {
            return Integer.parseInt(input.trim());
        } catch (NumberFormatException e) {
            throw new InvalidInputException("Invalid number format: " + input);
        }
    }

    public static void validateAge(int age) throws InvalidInputException {
        if (age < 0 || age > 150) {
            throw new InvalidInputException("Age must be between 0 and 150");
        }
    }

    public static void validateEmail(String email) throws InvalidInputException {
        if (email == null || email.trim().isEmpty()) {
            throw new InvalidInputException("Email cannot be empty");
        }
        if (!email.contains("@") || !email.contains(".")) {
            throw new InvalidInputException("Invalid email format");
        }
    }

    public static void main(String[] args) {
        try {
            int age = parseInteger("25");
            validateAge(age);
            validateEmail("user@example.com");
            System.out.println("All inputs valid!");
        } catch (InvalidInputException e) {
            System.out.println("Validation error: " + e.getMessage());
        }
    }
}`;

      await ctx.db.insert("curriculumItems", {
        moduleId: exceptionModuleId,
        languageId,
        kind: "challenge",
        slug: "input-validation",
        title: "Robust Input Validation",
        order: 2,
        prompt: `Implement comprehensive input validation with proper exception handling:

1. **parseInteger()**: Check for null/empty, trim, parse integer, throw InvalidInputException for invalid input

2. **validateAge()**: Check age is between 0-150, throw InvalidInputException if invalid

3. **validateEmail()**: Check for @ symbol and . in email, throw InvalidInputException if invalid

The main method demonstrates proper try-catch usage for validation.`,
        starterCode: inputValidationStarterCode,
        testSuiteId: inputValidationTestSuiteId,
      });
    }

    // ============================================
    // MORE CURRICULUM - SPRING BOOT (TRACK 7)
    // ============================================

    // Lesson 29.1: Spring Boot Basics
    const existingSpringBasicsLesson = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "spring-boot-basics")
      )
      .first();

    if (!existingSpringBasicsLesson) {
      const springBasicsContent = `# Spring Boot Basics

## What is Spring Boot?

Spring Boot makes it easy to create stand-alone, production-grade Spring applications with minimal configuration.

### Key Features
- **Auto-configuration**: Automatically configures based on dependencies
- **Embedded servers**: No need to deploy WAR files
- **Starter dependencies**: Simplified dependency management
- **Production-ready**: Metrics, health checks, externalized configuration

## Dependency Injection

Spring manages object creation and dependencies:

\`\`\`java
@Service
public class UserService {
    private final UserRepository repository;

    @Autowired
    public UserService(UserRepository repository) {
        this.repository = repository;
    }
}
\`\`\`

## REST Controllers

\`\`\`java
@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping
    public List<User> getAllUsers() {
        return userService.findAll();
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.findById(id);
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.save(user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteById(id);
    }
}
\`\`\`

## Request Mapping

| Annotation | Purpose |
|------------|---------|
| \`@GetMapping\` | Handle GET requests |
| \`@PostMapping\` | Handle POST requests |
| \`@PutMapping\` | Handle PUT requests |
| \`@DeleteMapping\` | Handle DELETE requests |

## Configuration

application.properties:
\`\`\`properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/mydb
spring.datasource.username=root
spring.datasource.password=password
\`\`\`
`;

      await ctx.db.insert("curriculumItems", {
        moduleId: springBasicsModuleId,
        languageId,
        kind: "lesson",
        slug: "spring-boot-basics",
        title: "Spring Boot Basics",
        order: 1,
        content: springBasicsContent,
      });
    }

    // ============================================
    // MORE CURRICULUM - JUNIT TESTING (TRACK 8)
    // ============================================

    // Lesson 32.1: Unit Testing with JUnit 5
    const existingJUnitLesson = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "unit-testing-junit")
      )
      .first();

    if (!existingJUnitLesson) {
      const jUnitContent = `# Unit Testing with JUnit 5

## What is Unit Testing?

Unit testing verifies that individual units of code (methods, classes) work correctly in isolation.

## Basic Test Structure

\`\`\`java
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

public class CalculatorTest {

    private Calculator calculator;

    @BeforeEach
    void setUp() {
        calculator = new Calculator();
    }

    @Test
    void testAddition() {
        int result = calculator.add(5, 3);
        assertEquals(8, result);
    }

    @Test
    void testDivisionByZero() {
        assertThrows(ArithmeticException.class, () -> {
            calculator.divide(10, 0);
        });
    }
}
\`\`\`

## Common Assertions

\`\`\`java
assertEquals(4, calculator.add(2, 2));
assertNotEquals(5, calculator.add(2, 2));
assertTrue(10 > 5);
assertFalse(10 < 5);
assertNull(nullValue);
assertNotNull("hello");
assertArrayEquals(new int[]{1, 2}, new int[]{1, 2});
\`\`\`

## Lifecycle Annotations

\`\`\`java
@BeforeAll  // Runs once before all tests
@BeforeEach // Runs before each test
@AfterEach  // Runs after each test
@AfterAll   // Runs once after all tests
\`\`\`

## Parameterized Tests

\`\`\`java
@ParameterizedTest
@CsvSource({"2, 3, 5", "5, 10, 15"})
void testAdd(int a, int b, int expected) {
    assertEquals(expected, calculator.add(a, b));
}
\`\`\`

## Best Practices

1. **Test behavior, not implementation**
2. **One assertion per test** (mostly)
3. **Use descriptive test names**
4. **Test edge cases**: null, empty, negative, boundary values
5. **Follow AAA pattern**: Arrange, Act, Assert
`;

      await ctx.db.insert("curriculumItems", {
        moduleId: junitModuleId,
        languageId,
        kind: "lesson",
        slug: "unit-testing-junit",
        title: "Unit Testing with JUnit 5",
        order: 1,
        content: jUnitContent,
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

    // ============================================
    // SAMPLE DEBUG EXERCISES FOR JAVA
    // ============================================

    // Create test suite for Hello World debug exercise
    const existingHelloWorldDebugTestSuite = await ctx.db
      .query("testSuites")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "hello-world-debug-tests")
      )
      .first();

    let helloWorldDebugTestSuiteId;
    if (!existingHelloWorldDebugTestSuite) {
      helloWorldDebugTestSuiteId = await ctx.db.insert("testSuites", {
        languageId,
        slug: "hello-world-debug-tests",
        title: "Hello World Debug Tests",
        definition: {
          type: "java",
          entrypoint: "Solution.java",
          method: "main",
          signature: "main(String[])",
          tests: [
            {
              input: [],
              output: "Hello, World!",
            },
          ],
        },
      });
    } else {
      helloWorldDebugTestSuiteId = existingHelloWorldDebugTestSuite._id;
    }

    // Create debug exercise: Hello World syntax error
    if (!existingProgrammingOverviewLesson) {
      const helloWorldDebugContent = `# Debug Exercise: Fix the Hello World Program

## The Problem
This program is supposed to print "Hello, World!" but it has syntax errors that prevent compilation.

## The Broken Code
\`\`\`java
public class Solution {
    public static void main(String[] args) {
        System.out.println("Hello, World!)
    }
}
\`\`\`

## What's Wrong
Look for common syntax errors like:
- Missing quotes
- Unmatched parentheses or brackets
- Missing semicolons

## Your Task
1. Read the broken code above
2. Identify and fix all syntax errors
3. Run the tests to verify your fix
4. Use the hints below if you get stuck

## Hints
${hintsPlaceholder}
`;
      await ctx.db.insert("curriculumItems", {
        moduleId: gettingStartedModuleId,
        languageId,
        kind: "debug",
        slug: "debug-hello-world",
        title: "Debug: Hello World Syntax Errors",
        order: 4,
        content: helloWorldDebugContent,
        brokenCode: `public class Solution {
    public static void main(String[] args) {
        System.out.println("Hello, World!)
    }
}`,
        errorType: "syntax",
        hints: [
          { level: 1, text: "Check the string literal in the print statement. Is it properly closed?" },
          { level: 2, text: "The System.out.println() line has a missing closing quote after 'World!'. Add a double quote before the closing parenthesis." },
          { level: 3, text: "Fix: System.out.println(\"Hello, World!\"); - The string literal needs both opening and closing double quotes." },
        ],
        testSuiteId: helloWorldDebugTestSuiteId,
        estimatedMinutes: 10,
        skillTags: ["syntax", "strings", "debugging"],
      });
    }

    // Create test suite for Type Mismatch debug exercise
    const existingTypeMismatchDebugTestSuite = await ctx.db
      .query("testSuites")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "type-mismatch-debug-tests")
      )
      .first();

    let typeMismatchDebugTestSuiteId;
    if (!existingTypeMismatchDebugTestSuite) {
      typeMismatchDebugTestSuiteId = await ctx.db.insert("testSuites", {
        languageId,
        slug: "type-mismatch-debug-tests",
        title: "Type Mismatch Debug Tests",
        definition: {
          type: "java",
          entrypoint: "Solution.java",
          method: "calculateSum",
          signature: "calculateSum(int, int)",
          tests: [
            {
              input: [5, 3],
              output: 8,
            },
            {
              input: [10, 20],
              output: 30,
            },
          ],
        },
      });
    } else {
      typeMismatchDebugTestSuiteId = existingTypeMismatchDebugTestSuite._id;
    }

    // Create debug exercise: Type Mismatch
    if (!existingProgrammingOverviewLesson) {
      const typeMismatchDebugContent = `# Debug Exercise: Fix Type Mismatch Errors

## The Problem
This method should calculate the sum of two integers, but there's a type error preventing it from working correctly.

## The Broken Code
\`\`\`java
public class Solution {
    public static int calculateSum(int a, int b) {
        String result = a + b;
        return result;
    }
}
\`\`\`

## What's Wrong
The method tries to store an integer result in a String variable, causing a compilation error.

## Your Task
1. Read the broken code above
2. Fix the type error
3. Run the tests to verify your fix
4. Use the hints below if you get stuck

## Hints
${hintsPlaceholder}
`;
      await ctx.db.insert("curriculumItems", {
        moduleId: variablesModuleId,
        languageId,
        kind: "debug",
        slug: "debug-type-mismatch",
        title: "Debug: Type Mismatch",
        order: 7,
        content: typeMismatchDebugContent,
        brokenCode: `public class Solution {
    public static int calculateSum(int a, int b) {
        String result = a + b;
        return result;
    }
}`,
        errorType: "logic",
        hints: [
          { level: 1, text: "Look at the variable type declarations. Do they match what you're storing in them?" },
          { level: 2, text: "The 'result' variable is declared as String, but you're trying to store an integer calculation in it. Change String to int." },
          { level: 3, text: "Fix: int result = a + b; - The result variable should be of type int since the method returns int and we're adding integers." },
        ],
        testSuiteId: typeMismatchDebugTestSuiteId,
        estimatedMinutes: 15,
        skillTags: ["types", "casting", "debugging"],
      });
    }

    // Create test suite for Logic Error debug exercise
    const existingLogicErrorDebugTestSuite = await ctx.db
      .query("testSuites")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", languageId).eq("slug", "logic-error-debug-tests")
      )
      .first();

    let logicErrorDebugTestSuiteId;
    if (!existingLogicErrorDebugTestSuite) {
      logicErrorDebugTestSuiteId = await ctx.db.insert("testSuites", {
        languageId,
        slug: "logic-error-debug-tests",
        title: "Logic Error Debug Tests",
        definition: {
          type: "java",
          entrypoint: "Solution.java",
          method: "findMax",
          signature: "findMax(int[])",
          tests: [
            {
              input: [[1, 5, 3]],
              output: 5,
            },
            {
              input: [[10, 2, 8]],
              output: 10,
            },
          ],
        },
      });
    } else {
      logicErrorDebugTestSuiteId = existingLogicErrorDebugTestSuite._id;
    }

    // Create debug exercise: Logic Error in finding maximum
    if (!existingProgrammingOverviewLesson) {
      const logicErrorDebugContent = `# Debug Exercise: Fix Logic Error

## The Problem
This method is supposed to return the maximum value in an array, but it always returns the first element.

## The Broken Code
\`\`\`java
public class Solution {
    public static int findMax(int[] arr) {
        int max = arr[0];
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] > max) {
                // Missing update here
            }
        }
        return max;
    }
}
\`\`\`

## What's Wrong
The method compares values but never updates the max variable when a larger value is found.

## Your Task
1. Read the broken code above
2. Fix the logic error
3. Run the tests to verify your fix
4. Use the hints below if you get stuck

## Hints
${hintsPlaceholder}
`;
      await ctx.db.insert("curriculumItems", {
        moduleId: variablesModuleId,
        languageId,
        kind: "debug",
        slug: "debug-logic-error",
        title: "Debug: Find Maximum Value",
        order: 8,
        content: logicErrorDebugContent,
        brokenCode: `public class Solution {
    public static int findMax(int[] arr) {
        int max = arr[0];
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] > max) {
                // Missing update here
            }
        }
        return max;
    }
}`,
        errorType: "logic",
        hints: [
          { level: 1, text: "Look inside the if statement. What should happen when arr[i] is greater than max?" },
          { level: 2, text: "When you find a value greater than max, you need to update the max variable with that new value." },
          { level: 3, text: "Fix: Add 'max = arr[i];' inside the if statement to update max when a larger value is found." },
        ],
        testSuiteId: logicErrorDebugTestSuiteId,
        estimatedMinutes: 15,
        skillTags: ["arrays", "loops", "logic", "debugging"],
      });
    }

    // ============================================
    // GO LANGUAGE SUPPORT
    // ============================================

    // Create or get Go language
    const existingGoLanguage = await ctx.db
      .query("languages")
      .withIndex("by_slug", (q) => q.eq("slug", "go"))
      .first();

    let goLanguageId;
    if (existingGoLanguage) {
      goLanguageId = existingGoLanguage._id;
    } else {
      goLanguageId = await ctx.db.insert("languages", {
        slug: "go",
        name: "Go",
        editorConfig: {
          monacoLanguageId: "go",
        },
      });
    }

    // Create or get Go track
    const existingGoTrack = await ctx.db
      .query("tracks")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", goLanguageId).eq("slug", "go-fundamentals")
      )
      .first();

    let goTrackId;
    if (existingGoTrack) {
      goTrackId = existingGoTrack._id;
    } else {
      goTrackId = await ctx.db.insert("tracks", {
        languageId: goLanguageId,
        slug: "go-fundamentals",
        title: "Go Fundamentals",
        description: "Learn Go programming language fundamentals",
        level: "beginner",
        order: 1,
      });
    }

    // Create or get Go module: Getting Started
    const existingGoGettingStartedModule = await ctx.db
      .query("modules")
      .withIndex("by_track_slug", (q) =>
        q.eq("trackId", goTrackId).eq("slug", "go-getting-started")
      )
      .first();

    let goGettingStartedModuleId;
    if (existingGoGettingStartedModule) {
      goGettingStartedModuleId = existingGoGettingStartedModule._id;
    } else {
      goGettingStartedModuleId = await ctx.db.insert("modules", {
        trackId: goTrackId,
        slug: "go-getting-started",
        title: "Getting Started with Go",
        description: "Introduction to Go language setup and basics",
        order: 1,
        estimatedHours: 3,
        skillTags: ["setup", "first-program", "output"],
      });
    }

    // Create or get Go module: Variables & Types
    const existingGoVariablesModule = await ctx.db
      .query("modules")
      .withIndex("by_track_slug", (q) =>
        q.eq("trackId", goTrackId).eq("slug", "go-variables-types")
      )
      .first();

    let goVariablesModuleId;
    if (existingGoVariablesModule) {
      goVariablesModuleId = existingGoVariablesModule._id;
    } else {
      goVariablesModuleId = await ctx.db.insert("modules", {
        trackId: goTrackId,
        slug: "go-variables-types",
        title: "Variables & Types",
        description: "Go variables, data types, and type inference",
        order: 2,
        estimatedHours: 3,
        skillTags: ["variables", "types", "type-inference"],
      });
    }

    // Create or get Go module: Control Flow
    const existingGoControlFlowModule = await ctx.db
      .query("modules")
      .withIndex("by_track_slug", (q) =>
        q.eq("trackId", goTrackId).eq("slug", "go-control-flow")
      )
      .first();

    let goControlFlowModuleId;
    if (existingGoControlFlowModule) {
      goControlFlowModuleId = existingGoControlFlowModule._id;
    } else {
      goControlFlowModuleId = await ctx.db.insert("modules", {
        trackId: goTrackId,
        slug: "go-control-flow",
        title: "Control Flow",
        description: "If statements, switch, and loops in Go",
        order: 3,
        estimatedHours: 2,
        skillTags: ["if-else", "switch", "loops"],
      });
    }

    // Create or get Go module: Functions
    const existingGoFunctionsModule = await ctx.db
      .query("modules")
      .withIndex("by_track_slug", (q) =>
        q.eq("trackId", goTrackId).eq("slug", "go-functions")
      )
      .first();

    let goFunctionsModuleId;
    if (existingGoFunctionsModule) {
      goFunctionsModuleId = existingGoFunctionsModule._id;
    } else {
      goFunctionsModuleId = await ctx.db.insert("modules", {
        trackId: goTrackId,
        slug: "go-functions",
        title: "Functions",
        description: "Go functions, multiple returns, and error handling",
        order: 4,
        estimatedHours: 3,
        skillTags: ["functions", "error-handling", "multiple-returns"],
      });
    }

    // ============================================
    // GO LESSONS (10 lessons per ROADMAP)
    // ============================================

    // Go Lesson 1: Introduction to Go
    const existingGoLesson1 = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", goLanguageId).eq("slug", "go-introduction")
      )
      .first();

    if (!existingGoLesson1) {
      const goLesson1Content = `# Introduction to Go

## What is Go?

Go (also called Golang) is a statically typed, compiled programming language designed at Google. It's known for its simplicity, efficiency, and excellent support for concurrent programming.

### Why Learn Go?

- **Simple syntax**: Easy to learn and read
- **Fast compilation**: Quick development cycle
- **Built-in concurrency**: Goroutines and channels make parallel programming easy
- **Strong standard library**: Rich tools and libraries included
- **Modern**: Used by companies like Google, Uber, Netflix, and many startups
- **Great for backend**: Perfect for web services, microservices, and cloud applications

## Key Features

### 1. Static Typing
Go requires you to declare types upfront, catching errors at compile time:

\`\`\`go
var name string = "OpenCamp"
var count int = 10
\`\`\`

### 2. Fast Compilation
Go compiles directly to machine code, making it fast to run:

\`\`\`bash
$ go run main.go
$ go build main.go
$ ./main
\`\`\`

### 3. Garbage Collection
Automatic memory management - no need to manually allocate/deallocate memory like in C.

### 4. Concurrency First
Go's goroutines make concurrent programming simple:

\`\`\`go
go func() {
    fmt.Println("Running in background")
}()
\`\`\`

## Where Go is Used

| Domain | Examples |
|--------|----------|
| **Web Services** | APIs, microservices, web servers |
| **Cloud & DevOps** | Docker, Kubernetes, Terraform |
| **Distributed Systems** | Microservices, event-driven architectures |
| **Networking** | Tools, proxies, network utilities |
| **Command-line Tools** | Utilities, system tools |

## Your First Go Program

Let's write a classic Hello World:

\`\`\`go
package main

import "fmt"

func main() {
    fmt.Println("Hello, Go!")
}
\`\`\`

### Breaking It Down

- \`package main\`: Every Go program starts with a package declaration. \`main\` is the entry point.
- \`import "fmt"\`: Imports the format package for input/output.
- \`func main() {\`: The \`main()\` function is where execution begins.
- \`fmt.Println(...)\`: Prints to the console.

## Try It Yourself

Click "Run" above to execute this program. Then modify the text to print your own message!
`;
      await ctx.db.insert("curriculumItems", {
        moduleId: goGettingStartedModuleId,
        languageId: goLanguageId,
        kind: "lesson",
        slug: "go-introduction",
        title: "Introduction to Go",
        order: 1,
        content: goLesson1Content,
        estimatedMinutes: 10,
        skillTags: ["introduction", "setup", "basics"],
      });
    }

    // Go Lesson 2: Variables & Constants
    const existingGoLesson2 = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", goLanguageId).eq("slug", "go-variables")
      )
      .first();

    if (!existingGoLesson2) {
      const goLesson2Content = `# Variables & Constants in Go

## Declaring Variables

Go provides several ways to declare variables:

### 1. Full Declaration
\`\`\`go
var name string = "OpenCamp"
var age int = 25
var isAwesome bool = true
\`\`\`

### 2. Type Inference
Go can infer the type from the value:

\`\`\`go
var name = "OpenCamp"      // string
var age = 25                // int
var isAwesome = true        // bool
\`\`\`

### 3. Short Declaration (Inside Functions)
Use \`:=\` for concise variable declaration:

\`\`\`go
func main() {
    name := "OpenCamp"
    age := 25
    isAwesome := true
}
\`\`\`

**Important:** Short declaration (\`:=\`) can only be used inside functions!

## Basic Data Types

| Type | Description | Example |
|------|-------------|---------|
| \`string\` | Text | \`"Hello"\` |
| \`int\` | Integer | \`42\` |
| \`float64\` | Decimal number | \`3.14\` |
| \`bool\` | Boolean | \`true\` / \`false\` |

### Zero Values
In Go, variables are automatically initialized to their "zero value":

\`\`\`go
var s string      // "" (empty string)
var i int         // 0
var f float64     // 0.0
var b bool        // false
\`\`\`

## Constants

Constants are immutable values declared with \`const\`:

\`\`\`go
const pi = 3.14159
const greeting = "Hello"
const maxUsers = 100
\`\`\`

Constants must be assigned a value at declaration time and cannot be changed.

## Multiple Variables

Declare multiple variables at once:

\`\`\`go
var (
    name  string = "OpenCamp"
    age   int    = 25
    email string
)
\`\`\`

## Example: User Profile

\`\`\`go
func main() {
    name := "Alex"
    age := 28
    city := "San Francisco"
    premium := true

    fmt.Printf("Name: %s\\n", name)
    fmt.Printf("Age: %d\\n", age)
    fmt.Printf("City: %s\\n", city)
    fmt.Printf("Premium: %t\\n", premium)
}
\`\`\`

## Try It Yourself

1. Declare variables for your name, age, and favorite language
2. Use short declaration (\`:=\`)
3. Print them using \`fmt.Printf\`
4. Declare a constant for PI (3.14159)
`;
      await ctx.db.insert("curriculumItems", {
        moduleId: goVariablesModuleId,
        languageId: goLanguageId,
        kind: "lesson",
        slug: "go-variables",
        title: "Variables & Constants",
        order: 1,
        content: goLesson2Content,
        estimatedMinutes: 15,
        skillTags: ["variables", "constants", "types"],
      });
    }

    // Go Lesson 3: Basic Operators
    const existingGoLesson3 = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", goLanguageId).eq("slug", "go-operators")
      )
      .first();

    if (!existingGoLesson3) {
      const goLesson3Content = `# Operators in Go

## Arithmetic Operators

| Operator | Description | Example |
|----------|-------------|---------|
| \`+\` | Addition | \`a + b\` |
| \`-\` | Subtraction | \`a - b\` |
| \`*\` | Multiplication | \`a * b\` |
| \`/\` | Division | \`a / b\` |
| \`%\` | Modulus (remainder) | \`a % b\` |

\`\`\`go
a := 10
b := 3

fmt.Println(a + b)  // 13
fmt.Println(a - b)  // 7
fmt.Println(a * b)  // 30
fmt.Println(a / b)  // 3
fmt.Println(a % b)  // 1
\`\`\`

## Comparison Operators

| Operator | Description | Example |
|----------|-------------|---------|
| \`==\` | Equal to | \`a == b\` |
| \`!=\` | Not equal to | \`a != b\` |
| \`<\` | Less than | \`a < b\` |
| \`>\` | Greater than | \`a > b\` |
| \`<=\` | Less than or equal | \`a <= b\` |
| \`>=\` | Greater than or equal | \`a >= b\` |

\`\`\`go
a := 10
b := 20

fmt.Println(a == b)  // false
fmt.Println(a != b)  // true
fmt.Println(a < b)   // true
\`\`\`

## Logical Operators

| Operator | Description | Example |
|----------|-------------|---------|
| \`&&\` | AND | \`true && false\` → \`false\` |
| \`\|\|\` | OR | \`true \|\| false\` → \`true\` |
| \`!\` | NOT | \`!true\` → \`false\` |

\`\`\`go
age := 25
hasLicense := true

canDrive := age >= 18 && hasLicense  // true
isSenior := age >= 65                // false
\`\`\`

## Assignment Operators

| Operator | Equivalent | Example |
|----------|-----------|---------|
| \`+=\` | \`a = a + b\` | \`a += 5\` |
| \`-= \` | \`a = a - b\` | \`a -= 5\` |
| \`*=\` | \`a = a * b\` | \`a *= 5\` |
| \`/=\` | \`a = a / b\` | \`a /= 5\` |

\`\`\`go
count := 10
count += 5    // count = 15
count *= 2    // count = 30
\`\`\`

## Example: Calculator

\`\`\`go
func main() {
    a := 15
    b := 4

    fmt.Printf("Addition: %d\\n", a + b)
    fmt.Printf("Subtraction: %d\\n", a - b)
    fmt.Printf("Multiplication: %d\\n", a * b)
    fmt.Printf("Division: %d\\n", a / b)
    fmt.Printf("Modulus: %d\\n", a % b)
}
\`\`\`

## Try It Yourself

1. Create variables for two numbers
2. Perform all arithmetic operations
3. Check if the first number is greater than the second
4. Use assignment operators to modify values
`;
      await ctx.db.insert("curriculumItems", {
        moduleId: goVariablesModuleId,
        languageId: goLanguageId,
        kind: "lesson",
        slug: "go-operators",
        title: "Operators",
        order: 2,
        content: goLesson3Content,
        estimatedMinutes: 12,
        skillTags: ["operators", "arithmetic", "comparison"],
      });
    }

    // Go Lesson 4: Strings
    const existingGoLesson4 = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", goLanguageId).eq("slug", "go-strings")
      )
      .first();

    if (!existingGoLesson4) {
      const _goLesson4Content = `# Strings in Go

## Creating Strings

Strings in Go are immutable sequences of bytes representing UTF-8 encoded text:

\`\`\`go
name := "OpenCamp"
message := \`Hello, World!\`
greeting := "Welcome to " + name
\`\`\`

## String Operations

### Concatenation

\`\`\`go
first := "Hello"
last := "World"
full := first + ", " + last  // "Hello, World"
\`\`\`

### Length (Number of Bytes)

\`\`\`go
s := "hello"
len(s)  // 5
\`\`\`

**Note:** \`len()\` returns bytes, not characters. Use \`utf8.RuneCountInString()\` for character count.

### Accessing Characters

\`\`\`go
s := "hello"
fmt.Println(s[0])  // 104 (ASCII for 'h')
fmt.Println(string(s[0]))  // "h"
\`\`\`

### Substrings

\`\`\`go
s := "hello world"
fmt.Println(s[0:5])   // "hello"
fmt.Println(s[6:])     // "world"
fmt.Println(s[:5])     // "hello"
\`\`\`

## String Functions

Go's \`strings\` package provides many useful functions:

\`\`\`go
import "strings"

s := "Hello, World!"

// Convert case
fmt.Println(strings.ToLower(s))   // "hello, world!"
fmt.Println(strings.ToUpper(s))   // "HELLO, WORLD!"

// Trim whitespace
fmt.Println(strings.TrimSpace("  hello  "))  // "hello"

// Check prefix/suffix
fmt.Println(strings.HasPrefix(s, "Hello"))  // true
fmt.Println(strings.HasSuffix(s, "!"))      // true

// Replace
fmt.Println(strings.Replace(s, "World", "Go", 1))  // "Hello, Go!"
\`\`\`

## Multiline Strings

Use backticks (\` \`) for multiline strings:

\`\`\`go
message := \`This is a
multiline
string\`
\`\`\`

## Raw Strings

Backticks also create raw strings (no escape sequences):

\`\`\`go
path := \`C:\\Users\\Name\\Documents\`  // Backslashes preserved
regex := \`\\d+\\.\\d+\`  // Regex without double escaping
\`\`\`

## Example: String Manipulation

\`\`\`go
import "strings"

func main() {
    name := "  john doe  "

    // Trim and capitalize
    name = strings.TrimSpace(name)
    name = strings.Title(name)

    // Create greeting
    greeting := "Hello, " + name + "!"
    
    fmt.Println(greeting)
    fmt.Printf("Length: %d\\n", len(greeting))
}
\`\`\`

## Try It Yourself

1. Create a string with your full name
2. Convert it to uppercase
3. Check if it contains your first name
4. Create a multiline string with a message
`;
      await ctx.db.insert("curriculumItems", {
        moduleId: goVariablesModuleId,
        languageId: goLanguageId,
        kind: "lesson",
        slug: "go-strings",
        title: "Strings",
        order: 3,
        estimatedMinutes: 15,
        skillTags: ["strings", "text", "manipulation"],
      });
    }

    // Go Lesson 5: If Statements
    const existingGoLesson5 = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", goLanguageId).eq("slug", "go-if-else")
      )
      .first();

    if (!existingGoLesson5) {
      const goLesson5Content = `# If Statements in Go

## Basic If Statement

\`\`\`go
age := 18

if age >= 18 {
    fmt.Println("You are an adult")
}
\`\`\`

## If-Else Statement

\`\`\`go
age := 15

if age >= 18 {
    fmt.Println("You can vote")
} else {
    fmt.Println("You cannot vote yet")
}
\`\`\`

## If-Else If-Else Chain

\`\`\`go
score := 85

if score >= 90 {
    fmt.Println("Grade: A")
} else if score >= 80 {
    fmt.Println("Grade: B")
} else if score >= 70 {
    fmt.Println("Grade: C")
} else {
    fmt.Println("Grade: F")
}
\`\`\`

## If with Initialization

You can initialize a variable in the if statement:

\`\`\`go
if age := 25; age >= 18 {
    fmt.Println("Adult")
}
\`\`\`

The variable \`age\` is scoped to the if block.

## Multiple Conditions

Use \`&&\` (AND) and \`||\` (OR):

\`\`\`go
age := 25
hasLicense := true

if age >= 18 && hasLicense {
    fmt.Println("Can drive")
}

if age < 18 || !hasLicense {
    fmt.Println("Cannot drive")
}
\`\`\`

## Comparison Operators Recap

| Operator | Meaning |
|----------|---------|
| \`==\` | Equal |
| \`!=\` | Not equal |
| \`<\` | Less than |
| \`>\` | Greater than |
| \`<=\` | Less than or equal |
| \`>=\` | Greater than or equal |

## Example: Login Validation

\`\`\`go
func main() {
    username := "admin"
    password := "secret123"
    isValid := true

    if username == "" || password == "" {
        fmt.Println("Username and password required")
        isValid = false
    }

    if isValid {
        if username == "admin" && password == "secret123" {
            fmt.Println("Login successful!")
        } else {
            fmt.Println("Invalid credentials")
        }
    }
}
\`\`\`

## Try It Yourself

1. Check if a number is positive, negative, or zero
2. Validate an email (contains "@" and ".")
3. Check if a person can vote (age >= 18)
4. Determine grade based on score (A: 90+, B: 80+, C: 70+)
`;
      await ctx.db.insert("curriculumItems", {
        moduleId: goControlFlowModuleId,
        languageId: goLanguageId,
        kind: "lesson",
        slug: "go-if-else",
        title: "If-Else Statements",
        order: 1,
        content: goLesson5Content,
        estimatedMinutes: 12,
        skillTags: ["if-else", "conditions", "logic"],
      });
    }

    // Go Lesson 6: Switch Statements
    const existingGoLesson6 = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", goLanguageId).eq("slug", "go-switch")
      )
      .first();

    if (!existingGoLesson6) {
      const goLesson6Content = `# Switch Statements in Go

## Basic Switch

Switch statements in Go are cleaner than in many languages - no \`break\` needed!

\`\`\`go
day := "Monday"

switch day {
case "Monday":
    fmt.Println("Start of the week")
case "Friday":
    fmt.Println("Almost weekend")
default:
    fmt.Println("Regular day")
}
\`\`\`

## Switch with Initialization

\`\`\`go
switch x := 42; x {
case 40:
    fmt.Println("Not quite")
case 42:
    fmt.Println("The answer!")
default:
    fmt.Println("Something else")
}
\`\`\`

## Multiple Cases

You can use comma-separated values:

\`\`\`go
day := 2

switch day {
case 1, 3, 5, 7:
    fmt.Println("Weekday")
case 2, 4, 6:
    fmt.Println("Weekday")
case 7:
    fmt.Println("Weekend")
}
\`\`\`

## Switch Without Expression (Switch-True)

Use for complex conditions:

\`\`\`go
hour := 14

switch {
case hour < 12:
    fmt.Println("Good morning")
case hour < 18:
    fmt.Println("Good afternoon")
default:
    fmt.Println("Good evening")
}
\`\`\`

## Type Switch

Switch on variable types:

\`\`\`go
var i interface{} = "hello"

switch v := i.(type) {
case string:
    fmt.Println("String:", v)
case int:
    fmt.Println("Integer:", v)
default:
    fmt.Println("Unknown type")
}
\`\`\`

## Fallthrough

Use \`fallthrough\` to execute the next case:

\`\`\`go
x := 10

switch x {
case 10:
    fmt.Println("Ten")
    fallthrough
case 20:
    fmt.Println("Twenty")  // This runs!
}
\`\`\`

## Example: Grading System

\`\`\`go
func main() {
    score := 85
    var grade string

    switch {
    case score >= 90:
        grade = "A"
    case score >= 80:
        grade = "B"
    case score >= 70:
        grade = "C"
    case score >= 60:
        grade = "D"
    default:
        grade = "F"
    }

    fmt.Printf("Score: %d, Grade: %s\\n", score, grade)
}
\`\`\`

## Try It Yourself

1. Create a menu system (1-4 for options)
2. Check day of week using switch
3. Categorize temperature (hot, warm, cold, freezing)
4. Use switch-true for complex conditions
`;
      await ctx.db.insert("curriculumItems", {
        moduleId: goControlFlowModuleId,
        languageId: goLanguageId,
        kind: "lesson",
        slug: "go-switch",
        title: "Switch Statements",
        order: 2,
        content: goLesson6Content,
        estimatedMinutes: 12,
        skillTags: ["switch", "conditions", "pattern-matching"],
      });
    }

    // Go Lesson 7: Loops
    const existingGoLesson7 = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", goLanguageId).eq("slug", "go-loops")
      )
      .first();

    if (!existingGoLesson7) {
      const goLesson7Content = `# Loops in Go

Go has only one loop keyword: \`for\`. It's versatile and can handle all looping scenarios.

## Basic For Loop

\`\`\`go
for i := 0; i < 5; i++ {
    fmt.Println(i)
}
\`\`\`

Output:
\`\`\`
0
1
2
3
4
\`\`\`

## While-Style Loop

\`\`\`go
i := 0
for i < 5 {
    fmt.Println(i)
    i++
}
\`\`\`

## Infinite Loop

\`\`\`go
for {
    fmt.Println("This will run forever")
    // Don't forget to break!
}
\`\`\`

## Range-Based Loops

Iterate over arrays, slices, maps, strings, and channels:

\`\`\`go
numbers := []int{1, 2, 3, 4, 5}

for i, num := range numbers {
    fmt.Printf("Index: %d, Value: %d\\n", i, num)
}
\`\`\`

### Ignoring Index or Value

\`\`\`go
// Ignore index, use value only
for _, num := range numbers {
    fmt.Println(num)
}

// Ignore value, use index only
for i := range numbers {
    fmt.Println(i)
}
\`\`\`

### Range Over String

\`\`\`go
for i, char := range "hello" {
    fmt.Printf("Index: %d, Char: %c\\n", i, char)
}
\`\`\`

## Break and Continue

\`\`\`go
// Break - exit loop entirely
for i := 0; i < 10; i++ {
    if i == 5 {
        break
    }
    fmt.Println(i)  // Prints 0-4
}

// Continue - skip to next iteration
for i := 0; i < 5; i++ {
    if i == 2 {
        continue
    }
    fmt.Println(i)  // Prints 0,1,3,4
}
\`\`\`

## Nested Loops

\`\`\`go
for i := 1; i <= 3; i++ {
    for j := 1; j <= 3; j++ {
        fmt.Printf("%d * %d = %d\\n", i, j, i*j)
    }
}
\`\`\`

## Example: Sum of Numbers

\`\`\`go
func main() {
    numbers := []int{1, 2, 3, 4, 5}
    sum := 0

    for _, num := range numbers {
        sum += num
    }

    fmt.Println("Sum:", sum)  // 15
}
\`\`\`

## Example: Finding Maximum

\`\`\`go
func main() {
    numbers := []int{3, 7, 2, 9, 4}
    max := numbers[0]

    for _, num := range numbers {
        if num > max {
            max = num
        }
    }

    fmt.Println("Maximum:", max)  // 9
}
\`\`\`

## Try It Yourself

1. Print numbers 1-10 using a for loop
2. Calculate factorial of a number
3. Find the minimum value in an array
4. Create a multiplication table
5. Use range to iterate over a string
`;
      await ctx.db.insert("curriculumItems", {
        moduleId: goControlFlowModuleId,
        languageId: goLanguageId,
        kind: "lesson",
        slug: "go-loops",
        title: "Loops",
        order: 3,
        content: goLesson7Content,
        estimatedMinutes: 15,
        skillTags: ["loops", "iteration", "for-range"],
      });
    }

    // Go Lesson 8: Functions
    const existingGoLesson8 = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", goLanguageId).eq("slug", "go-functions")
      )
      .first();

    if (!existingGoLesson8) {
      const goLesson8Content = `# Functions in Go

## Basic Function

\`\`\`go
func greet(name string) {
    fmt.Printf("Hello, %s!\\n", name)
}

func main() {
    greet("World")
}
\`\`\`

## Functions with Return Values

\`\`\`go
func add(a int, b int) int {
    return a + b
}

func main() {
    result := add(5, 3)
    fmt.Println(result)  // 8
}
\`\`\`

### Short Parameter Syntax

\`\`\`go
func add(a, b int) int {
    return a + b
}
\`\`\`

## Multiple Return Values

Go's unique feature - return multiple values!

\`\`\`go
func divide(a, b int) (int, error) {
    if b == 0 {
        return 0, fmt.Errorf("cannot divide by zero")
    }
    return a / b, nil
}

func main() {
    result, err := divide(10, 2)
    if err != nil {
        fmt.Println("Error:", err)
    } else {
        fmt.Println("Result:", result)
    }
}
\`\`\`

## Named Return Values

\`\`\`go
func calculate(a, b int) (sum int, product int) {
    sum = a + b
    product = a * b
    return  // Automatic return of sum and product
}

func main() {
    s, p := calculate(3, 4)
    fmt.Printf("Sum: %d, Product: %d\\n", s, p)
}
\`\`\`

## Variadic Functions

Functions that accept variable number of arguments:

\`\`\`go
func sum(numbers ...int) int {
    total := 0
    for _, num := range numbers {
        total += num
    }
    return total
}

func main() {
    fmt.Println(sum(1, 2, 3))        // 6
    fmt.Println(sum(1, 2, 3, 4, 5))  // 15
}
\`\`\`

## Anonymous Functions (Closures)

Functions without names, often used inline:

\`\`\`go
func main() {
    add := func(a, b int) int {
        return a + b
    }
    fmt.Println(add(5, 3))  // 8
}
\`\`\`

### Immediate Execution

\`\`\`go
func main() {
    result := func(a, b int) int {
        return a + b
    }(5, 3)
    fmt.Println(result)  // 8
}
\`\`\`

## Functions as Parameters

\`\`\`go
func apply(f func(int) int, x int) int {
    return f(x)
}

func double(n int) int {
    return n * 2
}

func main() {
    result := apply(double, 5)
    fmt.Println(result)  // 10
}
\`\`\`

## Recursive Functions

\`\`\`go
func factorial(n int) int {
    if n <= 1 {
        return 1
    }
    return n * factorial(n-1)
}

func main() {
    fmt.Println(factorial(5))  // 120
}
\`\`\`

## Example: Calculator

\`\`\`go
func calculate(operation string, a, b int) int {
    switch operation {
    case "add":
        return a + b
    case "subtract":
        return a - b
    case "multiply":
        return a * b
    case "divide":
        return a / b
    default:
        return 0
    }
}

func main() {
    fmt.Println(calculate("add", 5, 3))        // 8
    fmt.Println(calculate("multiply", 5, 3))  // 15
}
\`\`\`

## Try It Yourself

1. Create a function that calculates area of a rectangle
2. Write a function that returns both min and max of two numbers
3. Create a variadic function that returns the average
4. Implement a recursive function to calculate Fibonacci
5. Use an anonymous function to sort an array
`;
      await ctx.db.insert("curriculumItems", {
        moduleId: goFunctionsModuleId,
        languageId: goLanguageId,
        kind: "lesson",
        slug: "go-functions",
        title: "Functions",
        order: 1,
        content: goLesson8Content,
        estimatedMinutes: 18,
        skillTags: ["functions", "parameters", "return-values"],
      });
    }

    // Go Lesson 9: Error Handling
    const existingGoLesson9 = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", goLanguageId).eq("slug", "go-error-handling")
      )
      .first();

    if (!existingGoLesson9) {
      const goLesson9Content = `# Error Handling in Go

Go uses explicit error handling rather than exceptions. This makes errors more visible and forces you to handle them.

## The Error Type

\`error\` is a built-in interface:

\`\`\`go
type error interface {
    Error() string
}
\`\`\`

## Returning Errors

Functions that can fail typically return an error as the last value:

\`\`\`go
import "errors"

func divide(a, b int) (int, error) {
    if b == 0 {
        return 0, errors.New("cannot divide by zero")
    }
    return a / b, nil
}
\`\`\`

## Checking Errors

Always check errors!

\`\`\`go
result, err := divide(10, 0)
if err != nil {
    fmt.Println("Error:", err)
    return
}
fmt.Println("Result:", result)
\`\`\`

## Creating Custom Errors

\`\`\`go
import (
    "errors"
    "fmt"
)

// Using errors.New()
err1 := errors.New("something went wrong")

// Using fmt.Errorf() with formatting
err2 := fmt.Errorf("invalid value: %d", 42)

// Custom error type
type ValidationError struct {
    Field   string
    Message string
}

func (e ValidationError) Error() string {
    return fmt.Sprintf("validation error on field %s: %s", e.Field, e.Message)
}
\`\`\`

## Error Wrapping

Wrap errors with additional context:

\`\`\`go
import "fmt"

func readFile(filename string) ([]byte, error) {
    data, err := os.ReadFile(filename)
    if err != nil {
        return nil, fmt.Errorf("failed to read file %s: %w", filename, err)
    }
    return data, nil
}
\`\`\`

Use \`errors.Unwrap()\` to access the underlying error:

\`\`\`go
import "errors"

if err != nil {
    originalErr := errors.Unwrap(err)
    fmt.Println("Original error:", originalErr)
}
\`\`\`

## Panic and Recover

### Panic

Similar to exceptions in other languages:

\`\`\`go
func riskyOperation() {
    panic("something terrible happened!")
}

func main() {
    riskyOperation()
    fmt.Println("This won't run")
}
\`\`\`

### Recover

Catch panics:

\`\`\`go
func safeOperation() {
    defer func() {
        if r := recover(); r != nil {
            fmt.Println("Recovered from panic:", r)
        }
    }()
    
    panic("something went wrong!")
}

func main() {
    safeOperation()
    fmt.Println("Program continues")
}
\`\`\`

## Example: Safe Division

\`\`\`go
import (
    "errors"
    "fmt"
)

func divide(a, b int) (int, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}

func main() {
    divisions := []struct{ a, b int }{
        {10, 2},
        {10, 0},
        {20, 4},
    }

    for _, d := range divisions {
        result, err := divide(d.a, d.b)
        if err != nil {
            fmt.Printf("Error dividing %d by %d: %v\\n", d.a, d.b, err)
            continue
        }
        fmt.Printf("%d / %d = %d\\n", d.a, d.b, result)
    }
}
\`\`\`

## Best Practices

1. **Always check errors**: Never ignore them
2. **Handle errors close to source**: Don't just return them up the chain
3. **Wrap errors with context**: Add information about what you were doing
4. **Use descriptive error messages**: Help debuggers understand what went wrong
5. **Avoid panic**: Use it only for truly unrecoverable errors

## Try It Yourself

1. Create a function that validates email format
2. Write a function that reads a file and handles errors
3. Implement a function that calculates square root and handles negative numbers
4. Create a custom error type for validation errors
5. Use defer and recover to handle panics gracefully
`;
      await ctx.db.insert("curriculumItems", {
        moduleId: goFunctionsModuleId,
        languageId: goLanguageId,
        kind: "lesson",
        slug: "go-error-handling",
        title: "Error Handling",
        order: 2,
        content: goLesson9Content,
        estimatedMinutes: 18,
        skillTags: ["errors", "panic", "recover"],
      });
    }

    // Go Lesson 10: Structs & Methods
    const existingGoLesson10 = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", goLanguageId).eq("slug", "go-structs-methods")
      )
      .first();

    if (!existingGoLesson10) {
      const goLesson10Content = `# Structs & Methods in Go

## What are Structs?

Structs are collections of named fields, similar to classes in other languages but without inheritance:

\`\`\`go
type Person struct {
    Name string
    Age  int
    Email string
}

func main() {
    p := Person{
        Name:  "Alice",
        Age:   30,
        Email: "alice@example.com",
    }
    
    fmt.Printf("%s is %d years old\\n", p.Name, p.Age)
}
\`\`\`

## Creating Structs

### Method 1: Field Names

\`\`\`go
p := Person{
    Name:  "Bob",
    Age:   25,
    Email: "bob@example.com",
}
\`\`\`

### Method 2: Positional (Order Matters!)

\`\`\`go
p := Person{"Bob", 25, "bob@example.com"}
\`\`\`

### Method 3: Partial

\`\`\`go
p := Person{Age: 30}
// Other fields get zero values
\`\`\`

### Method 4: New Pointer

\`\`\`go
p := &Person{
    Name: "Charlie",
    Age:  35,
}
\`\`\`

## Accessing Fields

\`\`\`go
p := Person{Name: "Alice", Age: 30}

fmt.Println(p.Name)   // "Alice"
fmt.Println(p.Age)    // 30

// Modify fields
p.Age = 31
p.Email = "alice@newemail.com"
\`\`\`

## Pointers to Structs

\`\`\`go
p := Person{Name: "Alice", Age: 30}
ptr := &p

ptr.Age = 31  // Modifies original p
fmt.Println(p.Age)  // 31
\`\`\`

## Methods

Methods are functions with a receiver:

\`\`\`go
type Rectangle struct {
    Width  float64
    Height float64
}

// Value receiver
func (r Rectangle) Area() float64 {
    return r.Width * r.Height
}

// Pointer receiver (can modify struct)
func (r *Rectangle) Scale(factor float64) {
    r.Width *= factor
    r.Height *= factor
}

func main() {
    rect := Rectangle{Width: 3.0, Height: 4.0}
    
    fmt.Println("Area:", rect.Area())  // 12.0
    
    rect.Scale(2.0)
    fmt.Println("New width:", rect.Width)  // 6.0
}
\`\`\`

## Value vs Pointer Receivers

| Receiver | Use When... |
|----------|-------------|
| **Value** | Read-only, no modification needed |
| **Pointer** | Need to modify, or struct is large |

\`\`\`go
// Value receiver (read-only)
func (p Person) GetInfo() string {
    return fmt.Sprintf("%s, age %d", p.Name, p.Age)
}

// Pointer receiver (can modify)
func (p *Person) HaveBirthday() {
    p.Age++
}
\`\`\`

## Embedded Structs (Composition)

Go uses composition instead of inheritance:

\`\`\`go
type Address struct {
    Street  string
    City    string
    Country string
}

type Person struct {
    Name    string
    Age     int
    Address  // Embedded struct
}

func main() {
    p := Person{
        Name: "Alice",
        Age:  30,
        Address: Address{
            Street:  "123 Main St",
            City:    "San Francisco",
            Country: "USA",
        },
    }
    
    fmt.Println(p.Name)
    fmt.Println(p.Street)  // Direct access to embedded field
    fmt.Println(p.Address.City)  // Or through struct name
}
\`\`\`

## Example: Bank Account

\`\`\`go
import "fmt"

type BankAccount struct {
    Owner  string
    Balance float64
}

func (b *BankAccount) Deposit(amount float64) error {
    if amount <= 0 {
        return fmt.Errorf("invalid amount")
    }
    b.Balance += amount
    return nil
}

func (b *BankAccount) Withdraw(amount float64) error {
    if amount <= 0 {
        return fmt.Errorf("invalid amount")
    }
    if amount > b.Balance {
        return fmt.Errorf("insufficient funds")
    }
    b.Balance -= amount
    return nil
}

func (b BankAccount) GetBalance() float64 {
    return b.Balance
}

func main() {
    account := BankAccount{
        Owner:   "Alice",
        Balance: 1000.0,
    }
    
    fmt.Printf("Initial: $%.2f\\n", account.GetBalance())
    
    account.Deposit(500.0)
    fmt.Printf("After deposit: $%.2f\\n", account.GetBalance())
    
    account.Withdraw(300.0)
    fmt.Printf("After withdrawal: $%.2f\\n", account.GetBalance())
}
\`\`\`

## Example: Circle

\`\`\`go
import "math"

type Circle struct {
    Radius float64
}

func (c Circle) Area() float64 {
    return math.Pi * c.Radius * c.Radius
}

func (c Circle) Circumference() float64 {
    return 2 * math.Pi * c.Radius
}

func (c *Circle) Scale(factor float64) {
    c.Radius *= factor
}

func main() {
    circle := Circle{Radius: 5.0}
    
    fmt.Printf("Radius: %.2f\\n", circle.Radius)
    fmt.Printf("Area: %.2f\\n", circle.Area())
    fmt.Printf("Circumference: %.2f\\n", circle.Circumference())
    
    circle.Scale(2.0)
    fmt.Printf("New radius: %.2f\\n", circle.Radius)
}
\`\`\`

## Try It Yourself

1. Create a \`Student\` struct with name, age, grades array
2. Add methods to calculate average grade and letter grade
3. Create a \`Rectangle\` struct with width and height
4. Add methods for area, perimeter, and scaling
5. Use embedding to combine \`Person\` and \`Employee\` structs
`;
      await ctx.db.insert("curriculumItems", {
        moduleId: goFunctionsModuleId,
        languageId: goLanguageId,
        kind: "lesson",
        slug: "go-structs-methods",
        title: "Structs & Methods",
        order: 3,
        content: goLesson10Content,
        estimatedMinutes: 20,
        skillTags: ["structs", "methods", "composition"],
      });
    }

    // Go Challenge 1: FizzBuzz
    const existingGoChallenge1 = await ctx.db
      .query("curriculumItems")
      .withIndex("by_language_slug", (q) =>
        q.eq("languageId", goLanguageId).eq("slug", "go-fizzbuzz")
      )
      .first();

    let goFizzBuzzTestSuiteId;
    if (!existingGoChallenge1) {
      goFizzBuzzTestSuiteId = await ctx.db.insert("testSuites", {
        languageId: goLanguageId,
        slug: "go-fizzbuzz-tests",
        title: "Go FizzBuzz Tests",
        definition: {
          type: "go",
          entrypoint: "main.go",
          tests: [
            {
              name: "TestFizzBuzzFor3",
              input: "3",
              output: "Fizz\n",
            },
            {
              name: "TestFizzBuzzFor5",
              input: "5",
              output: "Buzz\n",
            },
            {
              name: "TestFizzBuzzFor15",
              input: "15",
              output: "FizzBuzz\n",
            },
            {
              name: "TestFizzBuzzFor7",
              input: "7",
              output: "7\n",
            },
          ],
        },
      });

      const fizzBuzzPrompt = `# Challenge: FizzBuzz

## Problem

Write a program that prints numbers from 1 to N, but:

- For multiples of 3, print "Fizz" instead of the number
- For multiples of 5, print "Buzz" instead of the number
- For multiples of both 3 and 5, print "FizzBuzz" instead of the number

## Example

If N = 15, the output should be:
\`\`\`
1
2
Fizz
4
Buzz
Fizz
7
8
Fizz
Buzz
11
Fizz
13
14
FizzBuzz
\`\`\`

## Requirements

1. Read a number N from input
2. Print FizzBuzz from 1 to N
3. Handle edge cases (N < 1)
4. Use loops and conditions

## Starter Code

\`\`\`go
package main

import "fmt"

func main() {
    // Your code here
}
\`\`\`

## Tips

- Use \`%\` (modulus operator) to check divisibility
- Check for FizzBuzz first (multiples of both)
- Use a for loop to iterate from 1 to N
- Print each result on its own line

Run the tests to verify your solution!`;

      await ctx.db.insert("curriculumItems", {
        moduleId: goControlFlowModuleId,
        languageId: goLanguageId,
        kind: "challenge",
        slug: "go-fizzbuzz",
        title: "Challenge: FizzBuzz",
        order: 4,
        content: fizzBuzzPrompt,
        starterCode: `package main

import "fmt"

func main() {
    // Read N from input
    var n int
    fmt.Scanln(&n)
    
    // Your code here - implement FizzBuzz from 1 to N
    // For multiples of 3, print "Fizz"
    // For multiples of 5, print "Buzz"
    // For multiples of both 3 and 5, print "FizzBuzz"
    // Otherwise, print the number itself
}`,
        difficulty: "easy",
        testSuiteId: goFizzBuzzTestSuiteId,
        estimatedMinutes: 15,
        skillTags: ["loops", "conditions", "modulus"],
      });
    }

    return {
      success: true,
      message: "Seed completed successfully",
    };
  },
});
