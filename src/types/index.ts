import { Client, CommandInteraction, Message } from "discord.js";

export interface SlashCommand {
  data: any;
  execute: (interaction: CommandInteraction) => Promise<void>;
  cooldown?: number;
  permissions?: string[];
}

export interface PrefixCommand {
  name: string;
  description: string;
  aliases?: string[];
  execute: (message: Message, args: string[]) => Promise<void>;
  cooldown?: number;
  permissions?: string[];
}

export interface BotClient extends Client {
  commands: Map<string, SlashCommand>;
  prefixCommands: Map<string, PrefixCommand>;
  cooldowns: Map<string, Map<string, number>>;
  config: any;
}
