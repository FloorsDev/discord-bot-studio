import { EmbedBuilder, ColorResolvable } from "discord.js";

const colors = {
  primary: "#5865F2",
  success: "#57F287",
  warning: "#FEE75C",
  error: "#ED4245",
  info: "#00B0F4",
  gaming: "#9D4EDD",
};

export class CustomEmbed extends EmbedBuilder {
  constructor() {
    super();
    this.setTimestamp();
  }

  static success(title: string, description?: string): CustomEmbed {
    const embed = new CustomEmbed()
      .setColor(colors.success as ColorResolvable)
      .setTitle(`✅ ${title}`);
    if (description) embed.setDescription(description);
    return embed;
  }

  static error(title: string, description?: string): CustomEmbed {
    const embed = new CustomEmbed()
      .setColor(colors.error as ColorResolvable)
      .setTitle(`❌ ${title}`);
    if (description) embed.setDescription(description);
    return embed;
  }

  static warning(title: string, description?: string): CustomEmbed {
    const embed = new CustomEmbed()
      .setColor(colors.warning as ColorResolvable)
      .setTitle(`⚠️ ${title}`);
    if (description) embed.setDescription(description);
    return embed;
  }

  static info(title: string, description?: string): CustomEmbed {
    const embed = new CustomEmbed()
      .setColor(colors.info as ColorResolvable)
      .setTitle(`ℹ️ ${title}`);
    if (description) embed.setDescription(description);
    return embed;
  }

  static gaming(title: string, description?: string): CustomEmbed {
    const embed = new CustomEmbed()
      .setColor(colors.gaming as ColorResolvable)
      .setTitle(`🎮 ${title}`);
    if (description) embed.setDescription(description);
    return embed;
  }
}
