import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from "discord.js";
import { ModerationLog } from "@database";
import { CustomEmbed } from "@utils/embedBuilder";
import { messages } from "@config/messages";
import { isModerator, canModerate } from "@utils/permissions";
import { logger } from "@utils/logger";

const slashCommand = new SlashCommandBuilder()
  .setName("ban")
  .setDescription("Bane um usuário do servidor")
  .addUserOption((option) =>
    option.setName("usuário").setDescription("O usuário a ser banido").setRequired(true)
  )
  .addStringOption((option) =>
    option.setName("razão").setDescription("Razão do banimento").setRequired(false)
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
        embeds: [CustomEmbed.error("Erro", "Você não pode banir este usuário!")],
        ephemeral: true,
      });
    }

    try {
      await interaction.guild?.bans.create(user.id, { reason });

      await ModerationLog.create({
        guildId: interaction.guildId,
        userId: user.id,
        action: "ban",
        reason,
        moderatorId: interaction.user.id,
      });

      logger.moderation("ban", user.id, interaction.user.id, reason);

      const embed = CustomEmbed.success(
        "Usuário Banido",
        `**Usuário:** ${user.tag}\n**Razão:** ${reason}\n**Moderador:** ${interaction.user.tag}`
      );

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      logger.error("Erro ao banir usuário:", error);
      await interaction.reply({
        embeds: [CustomEmbed.error("Erro", messages.errors.commandError)],
        ephemeral: true,
      });
    }
  },
};

export const prefixCommand = {
  name: "ban",
  description: "Bane um usuário do servidor",
  aliases: ["banir"],
  async execute(message: any, args: string[]) {
    const user = message.mentions.users.first();
    const reason = args.slice(1).join(" ") || "Sem razão especificada";
    const member = message.guild?.members.cache.get(user?.id);
    const moderator = message.member;

    if (!isModerator(moderator)) {
      return message.reply(CustomEmbed.error("Permissão Negada", messages.general.noPermission));
    }

    if (!member || !canModerate(moderator, member)) {
      return message.reply(CustomEmbed.error("Erro", "Você não pode banir este usuário!"));
    }

    try {
      await message.guild?.bans.create(user.id, { reason });

      await ModerationLog.create({
        guildId: message.guildId,
        userId: user.id,
        action: "ban",
        reason,
        moderatorId: message.author.id,
      });

      const embed = CustomEmbed.success(
        "Usuário Banido",
        `**Usuário:** ${user.tag}\n**Razão:** ${reason}`
      );

      await message.reply({ embeds: [embed] });
    } catch (error) {
      logger.error("Erro ao banir usuário:", error);
      await message.reply(CustomEmbed.error("Erro", messages.errors.commandError));
    }
  },
};
