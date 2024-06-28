const { MessageEmbed } = require("discord.js");
const client = require("../index");

client.on("message", (message) => {
  try {
    const messagedelete = () => {
      message.delete();
      message
        .reply(
          ` <:ngakak:1018031048795377684> This server is protected by **Anti-Link**, if you don't like it please **exit** from this server. || Contact **Owner** this server`
        )
        .then((msg) => {
          msg.delete({ timeout: 18000 });
        });
    };
    let data = client.db.get(`antilink-${message.guild.id}`);
    if (data === true) {
      if (
        message.content.match("https://") ||
        message.content.match("discord.gg") ||
        message.content.match("www.")
      ) {
        messagedelete();
      }
    }
  } catch (e) {
    message.channel.send(String(e));
  }
});
