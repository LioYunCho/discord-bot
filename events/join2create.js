const client = require("..");

client.on("voiceStateUpdate", async (oldState, newState) => {
  const user = await client.users.fetch(newState.id);
  const member = newState.guild.member(user);
  let data = client.db.get(`jtc-${oldState.guild.id}`);
  const j2channel = newState.guild.channels.cache.get(data)?.id;
  if (!j2channel) return;
  if (!oldState.channel && newState.channel.id === j2channel) {
    const channel = await newState.guild.channels.create(user.username, {
      type: "voice",
      parent: newState.channel.parent,
    });

    member.voice.setChannel(channel);
    client.voiceCollection.set(user.id, channel.id);
  } else if (!newState.channel) {
    if (oldState.channelID === client.voiceCollection.get(newState.id))
      return oldState.channel.delete();
  }
});
