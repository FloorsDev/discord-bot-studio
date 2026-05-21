import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { User } from "@database";
import { CustomEmbed } from "@utils/embedBuilder";
import { messages } from "@config/messages";
import { logger } from "@utils/logger";
import { formatNumber } from "@utils/validators";

const slashCommand = new SlashCommandBuilder()
  .setName("balance")
  .setDescription("Veja seu saldo")
  .addUserOption((option) =>
    option.setName("usuário").setDescription("Usuário para verificar saldo").setRequired(false)
  );

export default {
  data: slashCommand,
  async execute(interaction: CommandInteraction) {
    const user = interaction.options.getUser("usuário") || interaction.user;

    try {
      let userData = await User.findOne({
        userId: user.id,
        guildId: interaction.guildId,
      });

      if (!userData) {
        userData = await User.create({
          userId: user.id,
          guildId: interaction.guildId,
        });
      }

      const total = userData.money + userData.bank;

      const embed = CustomEmbed.gaming(
        `💰 ${messages.economy.balanceTitle.replace("{user}", user.username)}`,
        `**${messages.economy.wallet}:** ${formatNumber(userData.money)} 💵\n**${messages.economy.bank}:** ${formatNumber(userData.bank)} 🏦\n**${messages.economy.total}:** ${formatNumber(total)} 💰`
      ).setThumbnail(user.displayAvatarURL());

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      logger.error("Erro ao verificar saldo:", error);
      await interaction.reply({
        embeds: [CustomEmbed.error("Erro", messages.errors.commandError)],
        ephemeral: true,
      });
    }
  },
};

export const prefixCommand = {
  name: "balance",
  description: "Veja seu saldo",
  aliases: ["saldo", "bal"],
  async execute(message: any, args: string[]) {
    const user = message.mentions.users.first() || message.author;

    try {
      let userData = await User.findOne({
        userId: user.id,
        guildId: message.guildId,
      });

      if (!userData) {
        userData = await User.create({
          userId: user.id,
          guildId: message.guildId,
        });
      }

      const total = userData.money + userData.bank;

      const embed = CustomEmbed.gaming(
        `💰 ${messages.economy.balanceTitle.replace("{user}", user.username)}`,
        `**${messages.economy.wallet}:** ${formatNumber(userData.money)} 💵\n**${messages.economy.bank}:** ${formatNumber(userData.bank)} 🏦\n**${messages.economy.total}:** ${formatNumber(total)} 💰`
      ).setThumbnail(user.displayAvatarURL());

      await message.reply({ embeds: [embed] });
    } catch (error) {
      logger.error("Erro ao verificar saldo:", error);
      await message.reply(CustomEmbed.error("Erro", messages.errors.commandError));
    }
  },
};
