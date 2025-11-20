import { Command } from "commander";
import { registerVersionCommands } from "./commands/version.js";

export default function register(program: Command): void {
  registerVersionCommands(program);
}
