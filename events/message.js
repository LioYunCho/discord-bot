const config = require("../config/config.json");
const ee = require("../config/embed.json");
const { MessageEmbed, Permissions } = require("discord.js");
const client = require("..");

client.on("message", async (message) => {
  try {
    if (!message.guild || !message.channel || message.author.bot) return;
    let prefix = config.prefix;
    const prefixRegex = new RegExp(
      `^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`
    );
    if (!prefixRegex.test(message.content)) return;
    const [, matchedPrefix] = message.content.match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();
    if (cmd.length === 0) {
      if (matchedPrefix.includes(client.user.id))
        return message.reply(
          new MessageEmbed()
          .setDescription(
            `<@${message.author.id}>To see all Commands type: \`${config.prefix}help\`\n\nthank you for choosing us to be a bot on your server, I really hope you don't kick **Musical** from your server, to improve the performance of **Musical** I will always keep you up to date.\n\n<:5579primogem:974505939833090109> support 24/7 in voice channel\n<:5579primogem:974505939833090109> support Soundcloud | basic music system\n<:5579primogem:974505939833090109> support more filters\n\nplease bring me into your server. I hope it can be useful for master members who want to have me!`
          )
          .setImage("https://media.discordapp.net/attachments/907202627329220618/969156740316823582/EC4EBED8-3F09-41C4-A82C-7BEC1FCB6C6D.png?width=852&height=499")
        );
    }
    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));
    if (command) {
      if (
        !message.member.permissions.has(
          Permissions.FLAGS[command.memberpermissions] || []
        )
      ) {
        return message.reply(
          `You Don't Have \`${command.memberpermissions}\` Permission to Use \`${command.name}\` Command!!`
        );
      } else if (
        !message.guild.me.permissions.has(
          Permissions.FLAGS[command.memberpermissions] || []
        )
      ) {
        return message.reply(
          `I Don't Have \`${command.memberpermissions}\` Permission to Use \`${command.name}\` Command!!`
        );
      } else {
        command.run(client, message, args, prefix);
      }
    }
  } catch (e) {
    console.log(String(e.stack).red);
  }
});

function escapeRegex(str) {
  try {
    return str.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
  } catch (e) {
    console.log(String(e.stack).bgRed);
  }
}
