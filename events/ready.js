const client = require("../index");
const config = require("../config/config.json");

client.on("ready", () => {
  console.log(`${client.user.username} Is Online `);
  client.user.setActivity(`mhelp`);
});