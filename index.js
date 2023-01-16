const { Client, GuildMember, Intents } = require("discord.js");
const { Player, QueryType } = require("discord-player");
const config = require("./config.json");

const client = new Client({
    intents: [Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS]
});
client.login(config.token);

client.once('ready', () => {
    console.log('Ready!');
   });
   
   client.on("error", console.error);
   client.on("warn", console.warn);

const player = new Player(client);

player.on("error", (queue, error) => {
    console.log(`[${queue.guild.name}] Error stemmed from the queue: ${error.message}`);
});
player.on("connectionError", (queue, error) => {
    console.log(`[${queue.guild.name}] Error stemmed from the connection: ${error.message}`);
});

player.on("trackStart", (queue, track) => {
    queue.metadata.send(`🎶 | Now playing: **${track.title}** in **${queue.connection.channel.name}**!`);
});

player.on("trackAdd", (queue, track) => {
    queue.metadata.send(`🎶 | Track **${track.title}** has been queued!`);
});

player.on("botDisconnect", (queue) => {
    queue.metadata.send("❌ | Hasta la vista, baby! Clearing queue!");
});

player.on("channelEmpty", (queue) => {
    queue.metadata.send("❌ | Can't party on my own, leaving...");
});

player.on("queueEnd", (queue) => {
    queue.metadata.send("✅ | Queue has finished!");
});