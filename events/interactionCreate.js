// events/interactionCreate.js
const { Events } = require('discord.js');
const { oauth } = require('../utils/auth');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(`Error executing ${interaction.commandName}`);
        console.error(error);
      }
    } else if (interaction.isButton()) {
      if (interaction.customId === 'verify') {
        const authUrl = oauth.generateAuthUrl({
          scope: ['identify'],
          state: interaction.user.id,
        });

        await interaction.reply({ content: `Please click this link to verify: ${authUrl}`, ephemeral: true });
      }
    }
  },
};
