#!/usr/bin/env bun

import { Command } from "commander";
import { runwakeup } from "./tui/wakeup";

const program = new Command();

program
  .name("shahziopenclaw")
  .description("A simple CLI tool")
  .version("1.0.0");

program
  .command("wakeup")
  .description("Wake up the system")
  .action(async() => {
 await runwakeup();
  });

await program.parseAsync(process.argv);
