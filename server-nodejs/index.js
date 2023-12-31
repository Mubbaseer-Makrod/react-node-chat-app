const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { CHAT_ENGINE_PRIVATE_KEY, NODE_PORT, CHAT_ENGINE_PROJECT_ID } = require("./config/config");

const app = express();
app.use(express.json());
app.use(cors({ origin: true }));

// const CHAT_ENGINE_PROJECT_ID = `${CHAT_ENGINE_PROJECT_ID}`;
// const CHAT_ENGINE_PRIVATE_KEY = `${CHAT_ENGINE_PRIVATE_KEY}`;


// Define a route for the '/' endpoint
app.get('/', (req, res) => {
  res.status(200).send('Hello, this is the root API endpoint!');
});


app.post("/signup", async (req, res) => {
  const { username, secret, email, first_name, last_name } = req.body;

  // Store a user-copy on Chat Engine!
  // Docs at rest.chatengine.io
  try {
    const r = await axios.post(
      "https://api.chatengine.io/users/",
      { username, secret, email, first_name, last_name },
      { headers: { "Private-Key": CHAT_ENGINE_PRIVATE_KEY } }
    );
    return res.status(r.status).json(r.data);
  } catch (e) {
    return res.status(e.response.status).json(e.response.data);
  }
});

app.post("/login", async (req, res) => {
  console.log(`successfully getting env: ${NODE_PORT}`)
  const { username, secret } = req.body;

  // Fetch this user from Chat Engine in this project!
  // Docs at rest.chatengine.io
  try {
    const r = await axios.get("https://api.chatengine.io/users/me/", {
      headers: {
        "Project-ID": CHAT_ENGINE_PROJECT_ID,
        "User-Name": username,
        "User-Secret": secret,
      },
    });
    return res.status(r.status).json(r.data);
  } catch (e) {
    return res.status(e.response.status).json(e.response.data);
  }
});

// vvv On port 3001!
app.listen(NODE_PORT);
