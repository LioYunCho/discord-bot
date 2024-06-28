const { Client, Message, MessageEmbed } = require("discord.js");
const config = require("../../config/config.json");
//button
const ButtonPages = require('discord-button-pages');
const MessageButton = require("discord-buttons");
const disbut = require("discord-buttons");
const disbutpages = require("discord-embeds-pages-buttons")
const { default: discordButtons } = require("discord-buttons");

module.exports = {
  name: "ping",
  category: "🔰 Info",
  aliases: ["api"],
  cooldown: 5,
  description: "Get Bot Ping..",
  usage: "ping",
  memberpermissions: [" "],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
   run: async (client, message, args) => {
    let helpEmbed = new MessageEmbed()
    .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
    .setDescription(
      `╭‧˚₊‧୨🔋 **Musical Ping**: ${Date.now() - message.createdTimestamp}ms\n┇\n┇ __Here Vote now__ : https://top.gg/bot/946985307826450433\n┇\n╰‧˚₊‧୨🥥 Dont forget to votting **Musical**`
    )
    let button1 = new disbut.MessageButton()
          .setStyle('url')
          .setLabel('📝Vote Musical')
          .setURL(`https://top.gg/bot/946985307826450433`)

          return message.channel.send(helpEmbed,{
            button: [button1],
          });
  },
};
