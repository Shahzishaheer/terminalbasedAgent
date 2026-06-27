import chalk from "chalk";
import { select, isCancel } from "@clack/prompts";
import runAgentMode from "./Agent/orchestrator";
import { runAskMode } from "./ask/orchestrator";

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
      await runAgentMode();
    } else if (mode === "Plan") {
      console.log("Plan mode is not implemented yet.");
    } else if (mode === "Ask") {
      await runAskMode();
    } else {
      console.log(chalk.yellow("\nThat mode is not implemented yet.\n"));
    }
  }
}
