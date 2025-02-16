const { Client, Message, MessageEmbed } = require('discord.js');
var ee = require('../../config/embed.json');
var config = require('../../config/config.json');
const moment = require("moment")

const flags = {
    DISCORD_EMPLOYEE: 'Discord Employee',
    DISCORD_PARTNER: 'Discord Partner',
    BUGHUNTER_LEVEL_1: 'Bug Hunter (Level 1)',
    BUGHUNTER_LEVEL_2: 'Bug Hunter (Level 2)',
    HYPESQUAD_EVENTS: 'HypeSquad Events',
    HOUSE_BRAVERY: 'House of Bravery',
    HOUSE_BRILLIANCE: 'House of Brilliance',
    HOUSE_BALANCE: 'House of Balance',
    EARLY_SUPPORTER: 'Early Supporter',
    TEAM_USER: 'Team User',
    SYSTEM: 'System',
    VERIFIED_BOT: 'Verified Bot',
    VERIFIED_DEVELOPER: 'Verified Bot Developer'
};
function trimArray(arr, maxLen = 25) {
    if (arr.array().length > maxLen) {
        const len = arr.array().length - maxLen;
        arr = arr.array().sort((a, b) => b.rawPosition - a.rawPosition).slice(0, maxLen);
        arr.map(role => `<@&${role.id}>`)
        arr.push(`${len} more...`);
    }
    return arr.join(", ");
}
const statuses = {
    "online": "🟢",
    "idle": "🟠",
    "dnd": "🔴",
    "offline": "⚫️",
}


module.exports = {
    name: 'userinfo',
    aliases: ['uinfo'],
    category: '🔰 Info',
    memberpermissions: [],
    cooldown: 5,
    description: 'Show Information Of User',
    usage: 'userinfo [@USER] [global]',
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async (client, message, args, prefix) => {
        try {
            var user = message.mentions.users.first() || message.author;
            if (!user || user == null || user.id == null || !user.id) return message.reply("User Not Found");

            const member = message.guild.members.cache.get(user.id);
            const roles = member.roles;
            const userFlags = member.user.flags.toArray();
            const activity = member.user.presence.activities[0];
            //create the EMBED
            const embeduserinfo =  new MessageEmbed()
 .setColor(ee.color)
            embeduserinfo.setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
            embeduserinfo.setAuthor("Information about:   " + member.user.username + "#" + member.user.discriminator, member.user.displayAvatarURL({ dynamic: true }), "https://discord.gg/kFNAKt6dhD")
            embeduserinfo.addField('**❱ Username:**', `<@${member.user.id}>\n\`${member.user.tag}\``, true)
            embeduserinfo.addField('**❱ ID:**', `\`${member.id}\``, true)
            embeduserinfo.addField('**❱ Avatar:**', `[\`Link to avatar\`](${member.user.displayAvatarURL({ format: "png" })})`, true)
            embeduserinfo.addField('**❱ Date Join DC:**', "\`" + moment(member.user.createdTimestamp).format("DD/MM/YYYY") + "\`\n" + "`" + moment(member.user.createdTimestamp).format("hh:mm:ss") + "\`", true)
            embeduserinfo.addField('**❱ Date Join Guild:**', "\`" + moment(member.joinedTimestamp).format("DD/MM/YYYY") + "\`\n" + "`" + moment(member.joinedTimestamp).format("hh:mm:ss") + "\`", true)
            embeduserinfo.addField('**❱ Flags:**', `\`${userFlags.length ? userFlags.map(flag => flags[flag]).join(', ') : 'None'}\``, true)
            embeduserinfo.addField('**❱ Status:**', `\`${statuses[member.user.presence.status]} ${member.user.presence.status}\``, true)
            embeduserinfo.addField('**❱ Highest Role:**', `${member.roles.highest.id === message.guild.id ? 'None' : member.roles.highest}`, true)
            embeduserinfo.addField('**❱ Is a Bot:**', `\`${member.user.bot ? "✔️" : "❌"}\``, true)
            var userstatus = "Not having an activity";
            if (activity) {
                if (activity.type === "CUSTOM_STATUS") {
                    let emoji = `${activity.emoji ? activity.emoji.id ? `<${activity.emoji.animated ? "a" : ""}:${activity.emoji.name}:${activity.emoji.id}>` : activity.emoji.name : ""}`
                    userstatus = `${emoji} \`${activity.state || 'Not having an acitivty.'}\``
                }
                else {
                    userstatus = `\`${activity.type.toLowerCase().charAt(0).toUpperCase() + activity.type.toLowerCase().slice(1)} ${activity.name}\``
                }
            }
            embeduserinfo.addField('**❱ Activity:**', `${userstatus}`)
            embeduserinfo.addField('**❱ Permissions:**', `${message.member.permissions.toArray().map(p => `\`${p}\``).join(", ")}`)
            embeduserinfo.addField(`❱ [${roles.cache.size}] Roles: `, roles.cache.size < 25 ? roles.cache.array().sort((a, b) => b.rawPosition - a.rawPosition).map(role => `<@&${role.id}>`).join(', ') : roles.cache.size > 25 ? trimArray(roles.cache) : 'None')
            embeduserinfo.setFooter(ee.footertext, ee.footericon)
            //send the EMBED
            message.channel.send(embeduserinfo)
        } catch (e) {
            message.channel.send(
                 new MessageEmbed()
                .setColor(ee.color)
                    .setDescription(e)
            )
        }
    }
}