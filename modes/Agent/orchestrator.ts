import { select, text, isCancel } from "@clack/prompts";
import chalk from "chalk";
import { defaultAgentConfig } from "./types";
import { ActionTracker } from "./action-tracker";
import { ToolExecutor } from "./tool-excutor";
import createAgentTools from "./agent-tool";
import { stepCountIs, ToolLoopAgent } from "ai";
import { getAgentModel } from "../../ai";
import renderterminalMarkdown from "../../tui/terminal-md";

const runAgentMode = async () => {
  console.log(chalk.bold("\n🤖 Agent mode\n"));

  const goal = await text({
    message: "What is the goal of the agent?",
    placeholder: "e.g., Assist with coding tasks",
  });

  if (isCancel(goal)) {
    console.log(chalk.yellow("Operation cancelled."));
    return;
  }

  const config = defaultAgentConfig();
  const tracker = new ActionTracker();
  const executor = new ToolExecutor(tracker, config);
  const tools = createAgentTools(executor);
  const agent = new ToolLoopAgent({
    model: getAgentModel(),
    stopWhen: stepCountIs(40),
    instructions: [
      `Workspace root: ${config.codebasePath}`,
      "All mutations are staged until approval.",
    ].join("\n"),
    tools,
  });

  const clearLine = () => {
    if (process.stdout.isTTY) {
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
    }
  };

  const startLoadingDots = () => {
    let count = 0;
    const render = () => {
      const dots = ".".repeat((count % 3) + 1);
      clearLine();
      process.stdout.write(chalk.yellow(`Thinking${dots.padEnd(3, " ")}`));
    };

    render();
    const interval = setInterval(() => {
      count += 1;
      render();
    }, 300);
    return interval;
  };

  const stopLoadingDots = (interval: ReturnType<typeof setInterval> | null) => {
    if (!interval) return;
    clearInterval(interval);
    clearLine();
  };

  let loadingInterval: ReturnType<typeof setInterval> | null = null;
  const pauseLoadingDots = () => {
    stopLoadingDots(loadingInterval);
    loadingInterval = null;
  };
  const resumeLoadingDots = () => {
    if (loadingInterval) return;
    loadingInterval = startLoadingDots();
  };

  // const askText = async (message: string, placeholder?: string) => {
  //   const value = await text({ message, placeholder });
  //   return isCancel(value) ? undefined : value;
  // };

  // while (true) {
  //   const action = await select({
  //     message: `Agent goal: ${goal}\nChoose a tool to execute:`,
  //     options: [
  //       { value: "read_file", label: "Read file" },
  //       { value: "create_file", label: "Create file" },
  //       { value: "modify_file", label: "Modify file" },
  //       { value: "delete_file", label: "Delete file" },
  //       { value: "create_folder", label: "Create folder" },
  //       { value: "list_files", label: "List files" },
  //       { value: "search_files", label: "Search files" },
  //       { value: "analyze_codebase", label: "Analyze codebase" },
  //       { value: "execute_shell", label: "Execute shell command" },
  //       { value: "list_skills", label: "List skills" },
  //       { value: "read_skill", label: "Read skill file" },
  //       { value: "apply_approved_changes", label: "Apply approved changes" },
  //       { value: "exit", label: "Exit agent mode" },
  //     ],
  //   });

  //   if (isCancel(action) || action === "exit") {
  //     console.log(chalk.dim("Exiting agent mode."));
  //     break;
  //   }

  //   let result: string = "No result.";

  //   try {
  //     switch (action) {
  //       case "read_file": {
  //         const path = await askText("Enter the file path to read:");
  //         if (!path) break;
  //         result = await tools.read_file.execute({ path });
  //         break;
  //       }
  //       case "create_file": {
  //         const path = await askText("Enter the new file path:");
  //         if (!path) break;
  //         const content = await askText("Enter the file content:");
  //         if (content === undefined) break;
  //         result = await tools.create_file.execute({ path, content });
  //         break;
  //       }
  //       case "modify_file": {
  //         const path = await askText("Enter the file path to modify:");
  //         if (!path) break;
  //         const content = await askText("Enter the new file content:");
  //         if (content === undefined) break;
  //         result = await tools.modify_file.execute({ path, content });
  //         break;
  //       }
  //       case "delete_file": {
  //         const path = await askText("Enter the file path to delete:");
  //         if (!path) break;
  //         result = await tools.delete_file.execute({ path });
  //         break;
  //       }
  //       case "create_folder": {
  //         const path = await askText("Enter the folder path to create:");
  //         if (!path) break;
  //         result = await tools.create_folder.execute({ path });
  //         break;
  //       }
  //       case "list_files": {
  //         const path = await askText("Enter the folder or file path to list:");
  //         if (!path) break;
  //         const recursive = await select({
  //           message: "List files recursively?",
  //           options: [
  //             { value: true, label: "Yes" },
  //             { value: false, label: "No" },
  //           ],
  //         });
  //         if (isCancel(recursive)) break;
  //         result = await tools.list_files.execute({ path, recursive });
  //         break;
  //       }
  //       case "search_files": {
  //         const root = await askText("Enter the root path to search in:");
  //         if (!root) break;
  //         const globPattern = await askText("Enter the glob pattern:", "**/*.{ts,js}");
  //         if (!globPattern) break;
  //         const contentQuery = await askText("Enter an optional content query (leave blank to skip):");
  //         result = await tools.search_files.execute({
  //           root,
  //           globPattern,
  //           contentQuery: contentQuery || undefined,
  //         });
  //         break;
  //       }
  //       case "analyze_codebase": {
  //         const path = await askText("Enter the root path to analyze:");
  //         if (!path) break;
  //         result = await tools.analyze_codebase.execute({ path });
  //         break;
  //       }
  //       case "execute_shell": {
  //         const command = await askText("Enter the shell command to queue:");
  //         if (!command) break;
  //         result = await tools.execute_shell.execute({ command });
  //         break;
  //       }
  //       case "list_skills": {
  //         result = await tools.list_skills.execute({});
  //         break;
  //       }
  //       case "read_skill": {
  //         const path = await askText("Enter the skill file path to read:");
  //         if (!path) break;
  //         result = await tools.read_skill.execute({ path });
  //         break;
  //       }
  //       case "apply_approved_changes": {
  //         result = await tools.apply_approved_changes.execute({});
  //         break;
  //       }
  //       default:
  //         result = "Tool not implemented.";
  //     }
  //   } catch (error) {
  //     result = `Error: ${error instanceof Error ? error.message : String(error)}`;
  //   }

  //   console.log(chalk.green(`\n${result}\n`));
  // }

  // console.log(chalk.bold("\nAgent session ended.\n"));
  loadingInterval = startLoadingDots();
  const result = await agent.generate({
    prompt: goal.trim(),
    onStepFinish: ({ toolCalls }) => {
      pauseLoadingDots();
      for (const toolCall of toolCalls) {
        const preview = JSON.stringify(toolCall.input).slice(0, 160);
        console.log(
          chalk.green(" ✔"),
          chalk.bold(String(toolCall.toolName)),
          chalk.dim(preview.length > 160 ? preview + "..." : preview),
        );
      }
      resumeLoadingDots();
    },
  });
  stopLoadingDots(loadingInterval);

  if (result.text?.trim()) {
    console.log(renderterminalMarkdown(result.text));
  }
   const ok = await runApprovalflow(tracker);
if(!ok) { 
  return executor.clearStaging();
}
const {errors} = executor.applyApprovedFromTracker();
if(errors.length)
{
  console.log(chalk.red("\nsome operations reported errors:\n"));
  for(const e of errors) console.log((chalk.red(`. ${e}`)))
}
else
{
  console.log(chalk.green("\n✔ Applied.\n"))
}
executor.clearStaging()
};

export default runAgentMode;
