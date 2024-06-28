const { Client, Message, MessageEmbed } = require("discord.js");
const ee = require("../../config/embed.json");
module.exports = {
  name: "invite",
  category: "🔰 Info",
  aliases: ["inv"],
  description: "",
  usage: "",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    message.channel.send(
      new MessageEmbed()
        .setColor(ee.color)
        .setColor("BLUE")

        .setTitle("<:mmusical:947838743212097537> Invite Musical Bot <:mmusical:947838743212097537>")
        .addField(
          "**Invite Musical bot Multipurpose**",
          `[Click here to invite me](https://top.gg/bot/946985307826450433/invite)`
        )
        .setFooter(
          `Requested by ${message.author.tag}`,
          client.user.displayAvatarURL()
        )
        .setImage("https://cdn.discordapp.com/attachments/907202627329220618/1026676708809646152/bgmusical.png")
    );
  },
};
