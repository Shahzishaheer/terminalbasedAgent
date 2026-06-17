import chalk from "chalk";
import { select, isCancel } from "@clack/prompts";

export default async function runCliMode() {
  while (true) {
    const mode = await select({
      message: "Select a CLI mode:",
      options: [
        { value: "Agent", label: "AGENT mode" },
        { value: "Plan", label: "PLAN mode" },
        { value: "Ask", label: "ASK mode" },
        { value: "back", label: `${chalk.white("←")} Back to CLI mode` },
      ],
    });
    if (isCancel(mode) || mode === "back") {
      break;
    }
    if (mode === "Agent") {
      console.log("Agent")
    } else if (mode === "Plan") {
      console.log("Plan")
    } else if (mode === "Ask") {
      console.log("Ask")
    }
    if (mode !== "Agent" && mode !== "Plan" && mode !== "Ask") {
      console.log(chalk.yellow("\nThat mode is not implemented yet.\n"));
    }
  }
}
