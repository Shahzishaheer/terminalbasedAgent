import { select, isCancel } from "@clack/prompts";
import chalk from "chalk";
import figlet from "figlet";
import runCliMode from "../modes/cli";

const BANNER_FONT = "ANSI Shadow";
const SHADOW = chalk.hex("#2709ec");
const FACE = chalk.hex("#e8dcf8").bold;

function printBannerWithShadow(ascii: string) {
  const bannerLines = ascii.replace(/\s+$/, "").split("\n");
  const maxLen = Math.max(...bannerLines.map((l) => l.length));
  const rowWidth = maxLen + 2;

  for (const line of bannerLines) {
    console.log(SHADOW(" " + line.padEnd(rowWidth)));
  }

  process.stdout.write(`\x1b[${bannerLines.length}A`);

  for (const line of bannerLines) {
    console.log(FACE(line.padEnd(rowWidth)));
  }

  console.log();
}

export async function runwakeup() {
  let ascii: string;
  try {
    ascii = figlet.textSync("ShahziOpenClaw", { font: BANNER_FONT });
  } catch (error) {
    ascii = figlet.textSync("ShahziOpenClaw", { font: "standard" });
  }

  printBannerWithShadow(ascii);

  while (true) {
    const mode = await select({
      message: "Select a mode:",
      options: [
        { value: "cli", label: "CLI" },
        { value: "whatsapp", label: "WHATSAPP" },
        { value: "exit", label: "Exit" },
      ],
    });
   
    if (mode === "cli") {
      //   console.log(chalk.dim("CLI mode selected"));
     await runCliMode();
    } else if (mode === "whatsapp") {
      console.log(chalk.dim("WHATSAPP mode selected"));
    } else if (isCancel(mode) || mode === "exit") {
      console.log(chalk.dim("GoodBye...."));
      return;

    }
  }
}
