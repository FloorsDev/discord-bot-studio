import { Client } from "discord.js";
import fs from "fs";
import path from "path";
import { logger } from "@utils/logger";

export async function loadEvents(client: Client): Promise<void> {
  const eventsPath = path.join(process.cwd(), "src", "events");
  const eventFolders = fs.readdirSync(eventsPath);

  for (const folder of eventFolders) {
    const folderPath = path.join(eventsPath, folder);
    if (!fs.statSync(folderPath).isDirectory()) continue;

    const eventFiles = fs
      .readdirSync(folderPath)
      .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

    for (const file of eventFiles) {
      try {
        const filePath = path.join(folderPath, file);
        const event = await import(filePath);

        if (event.default) {
          if (event.default.once) {
            client.once(event.default.name, (...args) => event.default.execute(...args));
          } else {
            client.on(event.default.name, (...args) => event.default.execute(...args));
          }
          logger.success(`Evento carregado: ${event.default.name}`);
        }
      } catch (error) {
        logger.error(`Erro ao carregar evento: ${file}`, error);
      }
    }
  }
}
