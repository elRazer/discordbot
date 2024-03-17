// events/ready.js
const { Events } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    // Weitere Initialisierungslogik hier hinzuf�gen
  },
};
