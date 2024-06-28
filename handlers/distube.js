const { Client, Message, MessageEmbed } = require("discord.js");
const { prefix, config } = require("..");
const ee = require("../config/embed.json");

module.exports = async (client) => {
  const status = (queue) =>
    `Volume: ${queue.volume}% | Filter: ${queue.filter || " ❌ Off"} | Loop: ${
      queue.repeatMode
        ? queue.repeatMode == 2
          ? "All Queue"
          : " ✅ This Song"
        : "Off"
    } | Autoplay: ${queue.autoplay ? " ✅ On" : " ❌ Off"}`;

  // play song
  client.distube.on("playSong", (message, queue, song) => {
    message.channel
      .send(
        new MessageEmbed()
          .setColor(ee.color)
          .setTitle(`<a:skip:934482677791334430> Started Playing <a:skip:934482677791334430>`)
          .setDescription(`Song: [\`${song.name}\`](${song.url})`)
          .addField("Requested by:", ` ${song.user}`, true)
          .addField(
            "Duration:",
            `\`${queue.formattedCurrentTime} / ${song.formattedDuration}\``,
            true
          )
          .setThumbnail(song.thumbnail)
          .setFooter(status(queue))
      )
      .then(async (msg) => {
        await msg.react("⏭"); 
        await msg.react("⏯"); 
        await msg.react("🔉"); 
        await msg.react("🔊");
        await msg.react("🔁"); 
        await msg.react("⏹"); 

        const filter = (reaction, user) =>
          ["⏭", "⏯", "🔉", "🔊", "🔁", "⏹"].includes(
            reaction.emoji.id || reaction.emoji.name
          ) && user.id !== message.client.user.id;
        var collector = await msg.createReactionCollector(filter, {
          time: song.duration > 0 ? song.duration * 1000 : 600000,
        });

        collector.on("collect", async (reaction, user) => {
          //return if no queue available
          if (!queue) return;

          //create member out of the user
          const member = reaction.message.guild.member(user);

          //remoe the reaction
          reaction.users.remove(user);

          if (
            !member.voice.channel ||
            member.voice.channel.id !== member.guild.me.voice.channel.id
          )
            return message.channel.send(
              new MessageEmbed()
                .setColor(ee.color)
                .setDescription("<:peringatan:1026504194116567150> You must join a Voice Channel")
            );

          switch (reaction.emoji.id || reaction.emoji.name) {
            // skip reaction
            case "⏭":
              queue.playing = true;
              reaction.users.remove(user).catch(console.error);
              queue.connection.dispatcher.end();
              message.channel
                .send(
                  new MessageEmbed()
                    .setColor(ee.color)
                    .setDescription(
                      `\`<:peringatan:1026504194116567150> Song Skipped\` By ${message.author.username}`
                    )
                )
                .then((msg) => {
                  msg.delete({
                    timeout: 5000,
                  });
                });
              collector.stop();
              break;

            // pause and resume reaction

            case "⏯":
              reaction.users.remove(user).catch(console.error);
              if (queue.playing) {
                queue.playing = !queue.playing;
                client.distube.pause(message);
                message.channel
                  .send(
                    new MessageEmbed()
                      .setColor(ee.color)
                      .setDescription(
                        `⏸ Song is Pause by <@${message.author.id}>`
                      )
                  )
                  .then((msg) => {
                    msg.delete({
                      timeout: 5000,
                    });
                  });
              } else {
                queue.playing = !queue.playing;
                client.distube.resume(message);
                message.channel
                  .send(
                    new MessageEmbed()
                      .setColor(ee.color)
                      .setDescription(
                        `▶ Resumed Song By <@${message.author.id}>`
                      )
                  )
                  .then((msg) => {
                    msg.delete({
                      timeout: 5000,
                    });
                  });
              }
              break;

            // decrease Volume
            case "🔉":
              reaction.users.remove(user).catch(console.error);
              if (queue.volume - 10 <= 0) queue.volume = 0;
              else queue.volume = queue.volume - 10;
              queue.connection.dispatcher.setVolumeLogarithmic(
                queue.volume / 100
              );
              queue.textChannel;
              message.channel
                .send(
                  new MessageEmbed()
                    .setColor(ee.color)
                    .setDescription(
                      `🔉 Decreased The Volume, The Volume is Now ${queue.volume}%`
                    )
                )
                .then((msg) => {
                  msg.delete({
                    timeout: 5000,
                  });
                });
              break;

            // increase Volume
            case "🔊":
              reaction.users.remove(user).catch(console.error);
              if (queue.volume + 10 >= 1000) queue.volume = 100;
              else queue.volume = queue.volume + 10;
              queue.connection.dispatcher.setVolumeLogarithmic(
                queue.volume / 100
              );
              message.channel
                .send(
                  new MessageEmbed()
                    .setColor(ee.color)
                    .setDescription(
                      `🔊 Increased The Volume, The Volume Is Now ${queue.volume}%`
                    )
                )
                .then((msg) => {
                  msg.delete({
                    timeout: 5000,
                  });
                });
              break;

            // Loop reaction
            case "🔁":
              reaction.users.remove(user).catch(console.error);
              queue.loop = !queue.loop;
              message.channel
                .send(
                  new MessageEmbed()
                    .setColor(ee.color)
                    .setDescription(
                      `Loop is now ${queue.loop ? "**✅ on**" : "**❌ off**"}`
                    )
                )
                .then((msg) => {
                  msg.delete({
                    timeout: 5000,
                  });
                });
              break;

            // Stop reaction
            case "⏹":
              reaction.users.remove(user).catch(console.error);
              queue.songs = [];
              message.channel
                .send(
                  new MessageEmbed()
                    .setColor(ee.color)
                    .setDescription(
                      `⏹ Music is Stopped by <@${message.author.id}>`
                    )
                )
                .then((msg) => {
                  msg.delete({
                    timeout: 5000,
                  });
                });
              try {
                queue.connection.dispatcher.end();
              } catch (error) {
                console.error(error);
                queue.connection.disconnect();
              }
              collector.stop();
              break;

            default:
              reaction.users.remove(user).catch(console.error);
              break;
          }
        });
        collector.on("end", () => {
          msg.reactions.removeAll();
          msg.delete({
            timeout: 10000,
          });
        });
      });
  });

  // add song
  client.distube.on("addSong", (message, queue, song) => {
    message.channel
      .send(
        new MessageEmbed()
          .setColor(ee.color)
          .setTitle("🎶 Added Song!")
          .setDescription(
            `Song:  [\`${song.name}\`](${song.url}) \n Duration 🎱  \`${song.formattedDuration}\` \n Tracks  ${queue.songs.length}`
          )
          .setFooter(`Requested by: <@${message.author.id}>\n${status(queue)}}`)
      )
      .then((msg) => {
        msg.delete({ timeout: 5000 });
      });
  });

  // add list
  client.distube.on("addList", (message, queue, playlist) => {
    message.channel
      .send(
        new MessageEmbed()
          .setColor(ee.color)
          .setTitle("🎶 Added List!")
          .setDescription(
            `List:  [\`${playlist.name}\`](${playlist.url}) \n Duration 🎱  \`${
              playlist.formattedDuration
            }\` \n Tracks  ${playlist.songs.length} \n To Queue${status(queue)}`
          )
          .setFooter(`Requested by: ${message.author.tag}\n${status(queue)}}`)
      )
      .then((msg) => {
        msg.delete({ timeout: 5000 });
      });
  });

  // add playlist
  client.distube.on("playList", (message, queue, playlist) => {
    message.channel
      .send(
        new MessageEmbed()
          .setColor(ee.color)
          .setTitle("🎶 Added PlayList!")
          .setDescription(
            `PlayList:  [\`${playlist.name}\`](${playlist.url}) \n Duration 🎱  \`${playlist.formattedDuration}\` \n Tracks  ${playlist.songs.length} \n Added By ${playlist.user}`
          )
          .setFooter(`Requested by: ${message.author.tag}\n${status(queue)}}`)
      )
      .then((msg) => {
        msg.delete({ timeout: 5000 });
      });
  });

  // search result
  client.distube.on("searchResult", (message, result) => {
    let i = 0;
    message.channel.send(
      new MessageEmbed()
        .setColor(ee.color)
        .setTitle(`Your Search Result  ${result.length}`)
        .addField(
          `**Choose an option from below**\n${result
            .map(
              (song) =>
                `**${++i}**. ${song.name} - \`${song.formattedDuration}\``
            )
            .join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`,
          true
        )
        .setFooter(
          `Requested by: ${
            message.author.tag
          } , ${message.author.displayAvatarURL({ dynamic: true })}}}`
        )
    );
  });

  // search cancel
  client.distube.on("searchCancel", (message) => {
    message.channel
      .send(
        new MessageEmbed()
          .setColor(ee.color)
          .setDescription(`Your Search Canceled`)
      )
      .then((msg) => {
        msg.delete({ timeout: 5000 });
      });
  });
  client.distube.on("error", (message, e) => {
    message.channel
      .send(
        new MessageEmbed()
          .setColor(ee.color)
          .setTitle(`This is Error`)
          .setDescription(e)
      )
      .then((msg) => {
        msg.delete({ timeout: 5000 });
      });
  });
  client.distube.on("initQueue", (queue) => {
    queue.autoplay = false;
    queue.volume = 75;
    queue.filter = "lowbass";
    queue.repeatMode = false;
  });

  client.distube.on("finish", (message) => {
    message.channel
      .send(
        new MessageEmbed()
          .setColor(`#30D109`)
          .setDescription(
            `<a:pikaixin:941673652619993119> **Music Queue ended**, save on bandwidth I've automatically left the voice channel, if you like please vote me! \n
            <:piala:1026678365765242990> **Top.GG**: https://top.gg/bot/946985307826450433/vote`
          )
          .setImage("https://cdn.discordapp.com/attachments/907202627329220618/969156740316823582/EC4EBED8-3F09-41C4-A82C-7BEC1FCB6C6D.png")
      )
      .then((msg) => {
        msg.delete({ timeout: 30000 });
      });
  });

  client.distube.on("empty", (message) => {
    message.channel
      .send(
        new MessageEmbed()
          .setColor(ee.color)
          .setDescription(`Nothing Playing \n i am in VC \nThanks to My Owner`)
      )
      .then((msg) => {
        msg.delete({ timeout: 5000 });
      });
  });
};
