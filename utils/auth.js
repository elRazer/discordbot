const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const config = require('../config');

const rest = new REST({ version: '10' }).setToken(config.token);

async function exchangeCodeForToken(code) {
  const tokenResponse = await rest.post(Routes.oauth2TokenExchange(), {
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: config.redirectUri,
      scope: 'identify guilds guilds.join',
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return tokenResponse.json();
}

async function getUserInfo(accessToken) {
  const userResponse = await rest.get(Routes.userInfo(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return userResponse.json();
}

async function handleOAuth2Callback(code) {
  try {
    const tokenData = await exchangeCodeForToken(code);
    const accessToken = tokenData.access_token;
    const user = await getUserInfo(accessToken);
    // Hier kannst du weitere Aktionen durchführen, z.B. die Benutzerrolle zuweisen
    return user.id;
  } catch (error) {
    console.error('Error during OAuth2 callback:', error);
    throw error;
  }
}

module.exports = { handleOAuth2Callback };
