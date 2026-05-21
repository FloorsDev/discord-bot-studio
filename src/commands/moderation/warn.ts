import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { ModerationLog, User } from "@database";
import { CustomEmbed } from "@utils/embedBuilder";
import { messages } from "@config/messages";
import { isModerator } from "@utils/permissions";
import { logger } from "@utils/logger";

const slashCommand = new SlashCommandBuilder()
  .setName("warn")
  .setDescription("Avise um usuário")
  .addUserOption((option) =>
    option.setName("usuário").setDescription("O usuário a ser avisado").setRequired(true)
  )
  .addStringOption((option) =>
    option.setName("razão").setDescription("Razão do aviso").setRequired(false)
  );

export default {
  data: slashCommand,
  async execute(interaction: CommandInteraction) {
    const user = interaction.options.getUser("usuário", true);
    const reason = interaction.options.getString("razão") || "Sem razão especificada";
    const moderator = interaction.member as any;

    if (!isModerator(moderator)) {
      return interaction.reply({
        embeds: [CustomEmbed.error("Permissão Negada", messages.general.noPermission)],
        ephemeral: true,
      });
    }

    try {
      let userData = await User.findOne({
        userId: user.id,
        guildId: interaction.guildId,
      });

      if (!userData) {
        userData = await User.create({
          userId: user.id,
          guildId: interaction.guildId,
          warnings: 1,
        });
      } else {
        userData.warnings += 1;
        await userData.save();
      }

      await ModerationLog.create({
        guildId: interaction.guildId,
        userId: user.id,
        action: "warn",
        reason,
        moderatorId: interaction.user.id,
      });

      logger.moderation("warn", user.id, interaction.user.id, reason);

      const embed = CustomEmbed.warning(
        "Usuário Avisado",
        `**Usuário:** ${user.tag}\n**Razão:** ${reason}\n**Avisos Totais:** ${userData.warnings}`
      );

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      logger.error("Erro ao avisar usuário:", error);
      await interaction.reply({
        embeds: [CustomEmbed.error("Erro", messages.errors.commandError)],
        ephemeral: true,
      });
    }
  },
};

export const prefixCommand = {
  name: "warn",
  description: "Avise um usuário",
  aliases: ["aviso"],
  async execute(message: any, args: string[]) {
    const user = message.mentions.users.first();
    const reason = args.slice(1).join(" ") || "Sem razão especificada";
    const moderator = message.member;

    if (!isModerator(moderator)) {
      return message.reply(CustomEmbed.error("Permissão Negada", messages.general.noPermission));
    }

    try {
      let userData = await User.findOne({
        userId: user.id,
        guildId: message.guildId,
      });

      if (!userData) {
        userData = await User.create({
          userId: user.id,
          guildId: message.guildId,
          warnings: 1,
        });
      } else {
        userData.warnings += 1;
        await userData.save();
      }

      const embed = CustomEmbed.warning(
        "Usuário Avisado",
        `**Usuário:** ${user.tag}\n**Razão:** ${reason}\n**Avisos Totais:** ${userData.warnings}`
      );

      await message.reply({ embeds: [embed] });
    } catch (error) {
      logger.error("Erro ao avisar usuário:", error);
      await message.reply(CustomEmbed.error("Erro", messages.errors.commandError));
    }
  },
};
