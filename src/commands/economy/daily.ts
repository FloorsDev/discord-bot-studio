import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { User } from "@database";
import { CustomEmbed } from "@utils/embedBuilder";
import { messages } from "@config/messages";
import { logger } from "@utils/logger";
import { formatNumber } from "@utils/validators";
import { cooldownManager } from "@utils/cooldown";

const DAILY_REWARD = 100;
const DAILY_COOLDOWN = 24 * 60 * 60 * 1000; // 24 horas

const slashCommand = new SlashCommandBuilder()
  .setName("daily")
  .setDescription("Receba sua recompensa diária");

export default {
  data: slashCommand,
  async execute(interaction: CommandInteraction) {
    const cooldownKey = `daily_${interaction.user.id}_${interaction.guildId}`;
    const cooldownTime = cooldownManager.getRemainingTime(cooldownKey);

    if (cooldownManager.isOnCooldown(cooldownKey)) {
      const hours = Math.ceil(cooldownTime / (60 * 60 * 1000));
      return interaction.reply({
        embeds: [
          CustomEmbed.warning(
            "Cooldown",
            `Você já reclamou seu prêmio diário! Tente novamente em ${hours}h`
          ),
        ],
        ephemeral: true,
      });
    }

    try {
      let userData = await User.findOne({
        userId: interaction.user.id,
        guildId: interaction.guildId,
      });

      if (!userData) {
        userData = await User.create({
          userId: interaction.user.id,
          guildId: interaction.guildId,
          money: DAILY_REWARD,
          lastDaily: new Date(),
        });
      } else {
        userData.money += DAILY_REWARD;
        userData.lastDaily = new Date();
        await userData.save();
      }

      cooldownManager.apply(cooldownKey, DAILY_COOLDOWN);

      const embed = CustomEmbed.success(
        "💸 Prêmio Diário",
        `Você recebeu **${formatNumber(DAILY_REWARD)}** moedas!\nSeu novo saldo: **${formatNumber(userData.money)}** 💰`
      );

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      logger.error("Erro ao reclamar prêmio diário:", error);
      await interaction.reply({
        embeds: [CustomEmbed.error("Erro", messages.errors.commandError)],
        ephemeral: true,
      });
    }
  },
};

export const prefixCommand = {
  name: "daily",
  description: "Receba sua recompensa diária",
  aliases: ["diário"],
  async execute(message: any) {
    const cooldownKey = `daily_${message.author.id}_${message.guildId}`;
    const cooldownTime = cooldownManager.getRemainingTime(cooldownKey);

    if (cooldownManager.isOnCooldown(cooldownKey)) {
      const hours = Math.ceil(cooldownTime / (60 * 60 * 1000));
      return message.reply({
        embeds: [
          CustomEmbed.warning(
            "Cooldown",
            `Você já reclamou seu prêmio diário! Tente novamente em ${hours}h`
          ),
        ],
      });
    }

    try {
      let userData = await User.findOne({
        userId: message.author.id,
        guildId: message.guildId,
      });

      if (!userData) {
        userData = await User.create({
          userId: message.author.id,
          guildId: message.guildId,
          money: DAILY_REWARD,
          lastDaily: new Date(),
        });
      } else {
        userData.money += DAILY_REWARD;
        userData.lastDaily = new Date();
        await userData.save();
      }

      cooldownManager.apply(cooldownKey, DAILY_COOLDOWN);

      const embed = CustomEmbed.success(
        "💸 Prêmio Diário",
        `Você recebeu **${formatNumber(DAILY_REWARD)}** moedas!\nSeu novo saldo: **${formatNumber(userData.money)}** 💰`
      );

      await message.reply({ embeds: [embed] });
    } catch (error) {
      logger.error("Erro ao reclamar prêmio diário:", error);
      await message.reply(CustomEmbed.error("Erro", messages.errors.commandError));
    }
  },
};
