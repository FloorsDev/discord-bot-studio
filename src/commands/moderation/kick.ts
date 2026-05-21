import { SlashCommandBuilder, CommandInteraction } from "discord.js";
import { ModerationLog } from "@database";
import { CustomEmbed } from "@utils/embedBuilder";
import { messages } from "@config/messages";
import { isModerator, canModerate } from "@utils/permissions";
import { logger } from "@utils/logger";

const slashCommand = new SlashCommandBuilder()
  .setName("kick")
  .setDescription("Expulse um usuário do servidor")
  .addUserOption((option) =>
    option.setName("usuário").setDescription("O usuário a ser expulso").setRequired(true)
  )
  .addStringOption((option) =>
    option.setName("razão").setDescription("Razão da expulsão").setRequired(false)
  );

export default {
  data: slashCommand,
  async execute(interaction: CommandInteraction) {
    const user = interaction.options.getUser("usuário", true);
    const reason = interaction.options.getString("razão") || "Sem razão especificada";
    const member = interaction.guild?.members.cache.get(user.id);
    const moderator = interaction.member as any;

    if (!isModerator(moderator)) {
      return interaction.reply({
        embeds: [CustomEmbed.error("Permissão Negada", messages.general.noPermission)],
        ephemeral: true,
      });
    }

    if (!member || !canModerate(moderator, member)) {
      return interaction.reply({
        embeds: [CustomEmbed.error("Erro", "Você não pode expulsar este usuário!")],
        ephemeral: true,
      });
    }

    try {
      await member.kick(reason);

      await ModerationLog.create({
        guildId: interaction.guildId,
        userId: user.id,
        action: "kick",
        reason,
        moderatorId: interaction.user.id,
      });

      logger.moderation("kick", user.id, interaction.user.id, reason);

      const embed = CustomEmbed.success(
        "Usuário Expulso",
        `**Usuário:** ${user.tag}\n**Razão:** ${reason}`
      );

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      logger.error("Erro ao expulsar usuário:", error);
      await interaction.reply({
        embeds: [CustomEmbed.error("Erro", messages.errors.commandError)],
        ephemeral: true,
      });
    }
  },
};

export const prefixCommand = {
  name: "kick",
  description: "Expulse um usuário do servidor",
  aliases: ["expulsar"],
  async execute(message: any, args: string[]) {
    const user = message.mentions.users.first();
    const reason = args.slice(1).join(" ") || "Sem razão especificada";
    const member = message.guild?.members.cache.get(user?.id);
    const moderator = message.member;

    if (!isModerator(moderator)) {
      return message.reply(CustomEmbed.error("Permissão Negada", messages.general.noPermission));
    }

    if (!member || !canModerate(moderator, member)) {
      return message.reply(CustomEmbed.error("Erro", "Você não pode expulsar este usuário!"));
    }

    try {
      await member.kick(reason);

      await ModerationLog.create({
        guildId: message.guildId,
        userId: user.id,
        action: "kick",
        reason,
        moderatorId: message.author.id,
      });

      const embed = CustomEmbed.success(
        "Usuário Expulso",
        `**Usuário:** ${user.tag}\n**Razão:** ${reason}`
      );

      await message.reply({ embeds: [embed] });
    } catch (error) {
      logger.error("Erro ao expulsar usuário:", error);
      await message.reply(CustomEmbed.error("Erro", messages.errors.commandError));
    }
  },
};
