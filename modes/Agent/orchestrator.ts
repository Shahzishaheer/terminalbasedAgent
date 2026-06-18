import { text, isCancel } from "@clack/prompts";
import chalk from "chalk";
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
};

export default runAgentMode;
