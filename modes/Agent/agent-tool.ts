import { tool } from "ai";
import { z } from "zod";
import type { ToolExecutor } from "./tool-excutor";

const createAgentTools = (executor: ToolExecutor) => {
  return {
    read_file: tool({
      description:
        "Read a text file from the workspace. Use a path relative to the project root.",
      inputSchema: z.object({
        path: z.string().describe("The path to the file to read"),
      }),
      execute: async ({ path: p }) => executor.readFile(p),
    }),

    create_file: tool({
      description:
        "Create a new text file in the workspace. Use a path relative to the project root.",
      inputSchema: z.object({
        path: z.string().describe("The path where the file should be created"),
        content: z.string().describe("The content to write to the file"),
      }),
      execute: async ({ path: p, content: c }) => executor.createFile(p, c),
    }),

    modify_file: tool({
      description:
        "Modify an existing text file in the workspace. Use a path relative to the project root.",
      inputSchema: z.object({
        path: z.string().describe("The path to the file to modify"),
        content: z.string().describe("The new content for the file"),
      }),
      execute: async ({ path: p, content: c }) => executor.modifyFile(p, c),
    }),

    delete_file: tool({
      description:
        "Delete a file from the workspace. Use a path relative to the project root.",
      inputSchema: z.object({
        path: z.string().describe("The path to the file to delete"),
      }),
      execute: async ({ path: p }) => executor.deleteFile(p),
    }),

    create_folder: tool({
      description:
        "Stage a new folder in the workspace. Use a path relative to the project root.",
      inputSchema: z.object({
        path: z.string().describe("The folder path to create"),
      }),
      execute: async ({ path: p }) => executor.createFolder(p),
    }),

    list_files: tool({
      description:
        "List files in a folder or file path. Use a path relative to the project root.",
      inputSchema: z.object({
        path: z.string().describe("The path to list files from"),
        recursive: z.boolean().optional().default(false),
      }),
      execute: async ({ path: p, recursive }) =>
        executor.listFiles(p, recursive ?? false),
    }),

    search_files: tool({
      description:
        "Search files by glob pattern and optional content query inside the workspace.",
      inputSchema: z.object({
        root: z.string().describe("The root path to search from"),
        globPattern: z
          .string()
          .describe("The glob pattern to match file paths"),
        contentQuery: z
          .string()
          .optional()
          .describe("Optional string to search inside matching files"),
      }),
      execute: async ({ root, globPattern, contentQuery }) =>
        executor.searchFiles(root, globPattern, contentQuery),
    }),

    analyze_codebase: tool({
      description:
        "Analyze the target codebase path and return a simple file/directory summary.",
      inputSchema: z.object({
        path: z.string().describe("The root path to analyze"),
      }),
      execute: async ({ path: p }) => executor.analyzeCodebase(p),
    }),

    execute_shell: tool({
      description: "Queue a shell command to run in the workspace root.",
      inputSchema: z.object({
        command: z.string().describe("The command to execute"),
      }),
      execute: async ({ command }) => executor.queueShell(command),
    }),

    list_skills: tool({
      description:
        "List available skill directories discovered from configured skill roots.",
      inputSchema: z.object({}),
      execute: async () => executor.listSkills(),
    }),

    read_skill: tool({
      description:
        "Read a skill file from an allowed skill root. Provide the full skill path or relative path.",
      inputSchema: z.object({
        path: z.string().describe("The skill file path to read"),
      }),
      execute: async ({ path: p }) => executor.readSkill(p),
    }),

    apply_approved_changes: tool({
      description:
        "Apply approved file and shell actions that are staged in the tracker.",
      inputSchema: z.object({}),
      execute: async () => {
        const result = executor.applyApprovedFromTracker();
        return result.errors.length
          ? `Applied with errors:\n${result.errors.join("\n")}`
          : "Applied approved changes successfully.";
      },
    }),
  };
};

export default createAgentTools;
