const { MessageEmbed } = require("discord.js");
const client = require("../index");

const badwords = [
  "fuck",
  "lund",
  "bc",
  "motherfucker",
  "chutiya",
  "porn",
  "sex",
  "memek",
  "mmk",
  "bngsat",
  "bangsat",
  "kontol",
  "kntl",
  "kntol",
  "idiot",
  "bego",
  "bodoh",
  "dongo"
];

client.on("message", (message) => {
  try {
    const messagedelete = () => {
      message.delete();
      message
        .reply(
          new MessageEmbed().setDescription(
            `\`\` Noob Don't Send Any Type Of Bad Word Here Because I am security in here 😁😁 \`\``
          )
        )
        .then((msg) => {
          msg.delete({ timeout: 5000 });
        });
    };
    let data = client.db.get(`antiword-${message.guild.id}`);
    if (data === true) {
      if (message.content.match(badwords)) {
        messagedelete();
      }
    }
  } catch (e) {
    message.channel.send(String(e));
  }
});
