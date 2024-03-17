// database/db.js
const mongoose = require('mongoose');
const config = require('../config');

mongoose.connect(config.mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

const guildConfigSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
    unique: true,
  },
  channelId: {
    type: String,
    required: true,
  },
  roleId: {
    type: String,
    required: true,
  },
});

const GuildConfig = mongoose.model('GuildConfig', guildConfigSchema);

async function getGuildConfig(guildId) {
  try {
    const guildConfig = await GuildConfig.findOne({ guildId });
    return guildConfig;
  } catch (error) {
    console.error('Error retrieving guild config:', error);
    return null;
  }
}

async function setGuildConfig(guildId, channelId, roleId) {
  try {
    const guildConfig = await GuildConfig.findOneAndUpdate(
      { guildId },
      { channelId, roleId },
      { upsert: true, new: true }
    );
    return guildConfig;
  } catch (error) {
    console.error('Error setting guild config:', error);
    return null;
  }
}

module.exports = { getGuildConfig, setGuildConfig };
