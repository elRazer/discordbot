// commands/setup.js
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { setGuildConfig } = require('../database/db');
const config = require('../config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Sets up the verification system.')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('The channel to send the verification message in.')
        .setRequired(true))
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('The role to assign to verified users.')
        .setRequired(true)),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const role = interaction.options.getRole('role');

    // Speichere die Kanal-ID und Rollen-ID in der Datenbank für den jeweiligen Server
    await setGuildConfig(interaction.guildId, channel.id, role.id);

    const verifyEmbed = new EmbedBuilder()
      .setTitle('Verification')
      .setDescription('Click the button below to verify your account.');

    const verifyButton = new ButtonBuilder()
      .setLabel('Verify')
      .setStyle(ButtonStyle.Link)
      .setURL(`https://discord.com/api/oauth2/authorize?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(config.redirectUri)}&response_type=code&scope=identify%20guilds%20guilds.join`);

    const row = new ActionRowBuilder()
      .addComponents(verifyButton);

    await channel.send({ embeds: [verifyEmbed], components: [row] });

    await interaction.reply({ content: 'Verification message sent!', ephemeral: true });
  },
};
