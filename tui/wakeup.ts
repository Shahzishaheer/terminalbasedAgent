import { select, isCancel } from "@clack/prompts";
import chalk from "chalk";
import figlet from "figlet";
import runCliMode from "../modes/cli";

const BANNER_FONT = "ANSI Shadow";
const SHADOW = chalk.hex("#2709ec");
const FACE = chalk.hex("#e8dcf8").bold;

function printBannerWithShadow(ascii: string) {
  const bannerLines = ascii.trimEnd().split(/\r?\n/);
  if (bannerLines.length === 0) return;

  const rowWidth = Math.max(...bannerLines.map((line) => line.length)) + 2;
  const paddedLines = bannerLines.map((line) => line.padEnd(rowWidth));

  paddedLines.forEach((line) => console.log(SHADOW(` ${line}`)));
  process.stdout.write(`\x1b[${bannerLines.length}A`);
  paddedLines.forEach((line) => console.log(FACE(line)));
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
