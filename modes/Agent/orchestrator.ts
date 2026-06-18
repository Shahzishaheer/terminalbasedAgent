import { text, isCancel } from "@clack/prompts";
import chalk from "chalk";
import { defaultAgentConfig } from "./types";
import { ActionTracker } from "./action-tracker";
import { ToolExecutor } from "./tool-excutor";
const runAgentMode = async () => {
  console.log(chalk.bold("\n🤖Agent mode\n"));

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
};

export default runAgentMode;
