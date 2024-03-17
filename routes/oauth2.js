const express = require('express');
const router = express.Router();
const { handleOAuth2Callback } = require('../utils/auth');

router.get('/', async (req, res) => {
  const { code } = req.query;
  if (code) {
    try {
      const userId = await handleOAuth2Callback(code);
      console.log(userId);
      res.send(`
        <html>
          <head>
            <title>Verification Result</title>
          </head>
          <body>
            <h1>Verification Successful!</h1>
            <p>Your account has been successfully verified. You can now close this window and return to the Discord server.</p>
            <script>
              setTimeout(() => {
                window.close();
              }, 3000);
            </script>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('Error during OAuth2 callback:', error);
      res.status(500).send(`
        <html>
          <head>
            <title>Verification Result</title>
          </head>
          <body>
            <h1>Verification Failed!</h1>
            <p>An error occurred during the verification process. Please try again later.</p>
          </body>
        </html>
      `);
    }
  } else {
    res.status(400).send(`
      <html>
        <head>
          <title>Verification Result</title>
        </head>
        <body>
          <h1>Verification Failed!</h1>
          <p>Authorization code missing. Please try again.</p>
        </body>
      </html>
    `);
  }
});

module.exports = router;
