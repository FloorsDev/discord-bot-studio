import { Client, Collection } from "discord.js";
import fs from "fs";
import path from "path";
import { logger } from "@utils/logger";

export async function loadSlashCommands(client: Client): Promise<void> {
  const commandsPath = path.join(process.cwd(), "src", "commands");
  const commandFolders = fs.readdirSync(commandsPath);

  client.commands = new Collection();

  for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder);
    if (!fs.statSync(folderPath).isDirectory()) continue;

    const commandFiles = fs
      .readdirSync(folderPath)
      .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

    for (const file of commandFiles) {
      try {
        const filePath = path.join(folderPath, file);
        const command = await import(filePath);
        if (command.default && command.default.data) {
          client.commands.set(command.default.data.name, command.default);
          logger.success(`Comando slash carregado: ${command.default.data.name}`);
        }
      } catch (error) {
        logger.error(`Erro ao carregar comando: ${file}`, error);
      }
    }
  }
}

export async function loadPrefixCommands(client: any): Promise<void> {
  const commandsPath = path.join(process.cwd(), "src", "commands");
  const commandFolders = fs.readdirSync(commandsPath);

  client.prefixCommands = new Collection();

  for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder);
    if (!fs.statSync(folderPath).isDirectory()) continue;

    const commandFiles = fs
      .readdirSync(folderPath)
      .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

    for (const file of commandFiles) {
      try {
        const filePath = path.join(folderPath, file);
        const command = await import(filePath);
        if (command.prefixCommand) {
          client.prefixCommands.set(command.prefixCommand.name, command.prefixCommand);
          if (command.prefixCommand.aliases) {
            command.prefixCommand.aliases.forEach((alias: string) => {
              client.prefixCommands.set(alias, command.prefixCommand);
            });
          }
          logger.success(`Comando prefix carregado: ${command.prefixCommand.name}`);
        }
      } catch (error) {
        logger.error(`Erro ao carregar comando prefix: ${file}`, error);
      }
    }
  }
}
