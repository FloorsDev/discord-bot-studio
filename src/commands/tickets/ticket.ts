import { SlashCommandBuilder, CommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Ticket } from "@database";
import { CustomEmbed } from "@utils/embedBuilder";
import { messages } from "@config/messages";
import { logger } from "@utils/logger";
import { generateId } from "@utils/helpers";

const slashCommand = new SlashCommandBuilder()
  .setName("ticket")
  .setDescription("Crie um novo ticket");

export default {
  data: slashCommand,
  async execute(interaction: CommandInteraction) {
    try {
      const existingTicket = await Ticket.findOne({
        guildId: interaction.guildId,
        userId: interaction.user.id,
        status: { $in: ["open", "claimed"] },
      });

      if (existingTicket) {
        return interaction.reply({
          embeds: [
            CustomEmbed.warning(
              "Ticket Existente",
              `Você já possui um ticket aberto: <#${existingTicket.channelId}>`
            ),
          ],
          ephemeral: true,
        });
      }

      const ticketId = generateId(6);
      const category = interaction.guild?.channels.cache.find(
        (c) => c.name === "tickets" && c.isCategory()
      );

      if (!category) {
        return interaction.reply({
          embeds: [
            CustomEmbed.error(
              "Erro",
              "Categoria de tickets não encontrada! Contate um administrador."
            ),
          ],
          ephemeral: true,
        });
      }

      const ticketChannel = await interaction.guild?.channels.create({
        name: `ticket-${ticketId}`,
        parent: category.id,
        permissionOverwrites: [
          {
            id: interaction.guildId,
            deny: ["ViewChannel"],
          },
          {
            id: interaction.user.id,
            allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"],
          },
        ],
      });

      if (!ticketChannel) {
        return interaction.reply({
          embeds: [CustomEmbed.error("Erro", "Falha ao criar canal de ticket!")],
          ephemeral: true,
        });
      }

      const ticketData = await Ticket.create({
        ticketId,
        guildId: interaction.guildId,
        channelId: ticketChannel.id,
        userId: interaction.user.id,
        status: "open",
      });

      const closeButton = new ButtonBuilder()
        .setCustomId(`close_ticket_${ticketId}`)
        .setLabel("Fechar Ticket")
        .setStyle(ButtonStyle.Danger);

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(closeButton);

      const embed = CustomEmbed.gaming(
        "🎫 Novo Ticket",
        `Bem-vindo ao seu ticket!\n\nID do Ticket: **${ticketId}**\nSua solicitação será atendida em breve.`
      );

      await ticketChannel.send({
        content: `<@${interaction.user.id}>`,
        embeds: [embed],
        components: [row],
      });

      logger.info(`Ticket criado: ${ticketId} por ${interaction.user.id}`);

      await interaction.reply({
        embeds: [
          CustomEmbed.success(
            "Ticket Criado",
            `Seu ticket foi criado com sucesso! <#${ticketChannel.id}>`
          ),
        ],
        ephemeral: true,
      });
    } catch (error) {
      logger.error("Erro ao criar ticket:", error);
      await interaction.reply({
        embeds: [CustomEmbed.error("Erro", messages.errors.commandError)],
        ephemeral: true,
      });
    }
  },
};

export const prefixCommand = {
  name: "ticket",
  description: "Crie um novo ticket",
  aliases: ["suporte"],
  async execute(message: any) {
    try {
      const existingTicket = await Ticket.findOne({
        guildId: message.guildId,
        userId: message.author.id,
        status: { $in: ["open", "claimed"] },
      });

      if (existingTicket) {
        return message.reply({
          embeds: [
            CustomEmbed.warning(
              "Ticket Existente",
              `Você já possui um ticket aberto: <#${existingTicket.channelId}>`
            ),
          ],
        });
      }

      const ticketId = generateId(6);
      const category = message.guild?.channels.cache.find(
        (c) => c.name === "tickets" && c.isCategory()
      );

      if (!category) {
        return message.reply({
          embeds: [
            CustomEmbed.error(
              "Erro",
              "Categoria de tickets não encontrada! Contate um administrador."
            ),
          ],
        });
      }

      const ticketChannel = await message.guild?.channels.create({
        name: `ticket-${ticketId}`,
        parent: category.id,
        permissionOverwrites: [
          {
            id: message.guildId,
            deny: ["ViewChannel"],
          },
          {
            id: message.author.id,
            allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"],
          },
        ],
      });

      if (!ticketChannel) {
        return message.reply({
          embeds: [CustomEmbed.error("Erro", "Falha ao criar canal de ticket!")],
        });
      }

      await Ticket.create({
        ticketId,
        guildId: message.guildId,
        channelId: ticketChannel.id,
        userId: message.author.id,
        status: "open",
      });

      const closeButton = new ButtonBuilder()
        .setCustomId(`close_ticket_${ticketId}`)
        .setLabel("Fechar Ticket")
        .setStyle(ButtonStyle.Danger);

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(closeButton);

      const embed = CustomEmbed.gaming(
        "🎫 Novo Ticket",
        `Bem-vindo ao seu ticket!\n\nID do Ticket: **${ticketId}**\nSua solicitação será atendida em breve.`
      );

      await ticketChannel.send({
        content: `<@${message.author.id}>`,
        embeds: [embed],
        components: [row],
      });

      await message.reply({
        embeds: [
          CustomEmbed.success(
            "Ticket Criado",
            `Seu ticket foi criado com sucesso! <#${ticketChannel.id}>`
          ),
        ],
      });
    } catch (error) {
      logger.error("Erro ao criar ticket:", error);
      await message.reply(CustomEmbed.error("Erro", messages.errors.commandError));
    }
  },
};
