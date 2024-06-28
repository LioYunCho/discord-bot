const { Client, Message, MessageEmbed } = require("discord.js");
const ee = require("../../config/embed.json");
//button
const ButtonPages = require('discord-button-pages');
const MessageButton = require("discord-buttons");
const disbut = require("discord-buttons");
const disbutpages = require("discord-embeds-pages-buttons")
const { default: discordButtons } = require("discord-buttons");



module.exports = {
    name: "update",
    category: "🔰 Info",
    aliases: ["apt", "upd"],
    description: "Update Information whats next features coming in Musical",
    usage: "",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
     run: async (client, message, args) => {
        let helpEmbed = new MessageEmbed()
        .setColor(ee.color)
                .setColor("BLUE")

                .setTitle("<:peringatan:1026678363357720606> __**Musical Information**__")
                .setDescription("Thank you for choosing us to be a bot on your server, I really hope you don't kick Musical from your server, to improve the performance of Musical I will always keep you up to date.\n\nsupport us to be an amazing bot with a very easy to understand interface for users.\nSupport: **Youtube + Soundcloud etc 700+ websites.**")
                //.addField(
                   // "<:piala:1026678365765242990> **Invite bot**",
                 //   `[Click here to invite me](https://top.gg/bot/946985307826450433/invite)`
            //)
                //.addField(
                 //   "<:piala:1026678365765242990> **Vote bot**",
                 //   `[Click here to vote me](https://top.gg/bot/946985307826450433/vote)`
                //)
                .setFooter(
                    `Requested by ${message.author.tag} | Make cool your server with Musical`,
                    client.user.displayAvatarURL()
                )
                .setImage("https://cdn.discordapp.com/attachments/907202627329220618/1027618560362696835/sweet.gif")
        
        //Button pages
            let button1 = new disbut.MessageButton()
              .setStyle('url')
              .setLabel('📝Vote Musical')
              .setURL(`https://top.gg/bot/946985307826450433`);

              let button2 = new disbut.MessageButton()
              .setStyle('url')
              .setLabel('📝Invite Musical')
              .setURL(`https://top.gg/bot/946985307826450433/invite`);

              //let button2 = new disbut.MessageButton()
              //.setStyle('green')
              //.setLabel('📝Vote Musical')
              //.setID(`info`)
    
              return message.channel.send(helpEmbed,{
                button: [button1, button2],
              });
    },
};
