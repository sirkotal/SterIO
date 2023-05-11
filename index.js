const { Client, Intents } = require('discord.js');
const { GuildMember } = require("discord.js");
const { Player, QueryType } = require("discord-player");
const config = require("./config.json");

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });


client.on('ready', () => {
    console.log('Ready!');
    client.user.setActivity({
        name: "Hammer Time",
        type: "LISTENING"
    });
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

client.on("messageCreate", async (message) => {
    if (message.author.bot || !message.guild) return;
    if (!client.application?.owner) await client.application?.fetch();

    if (message.content === "!deploy" && message.author.id === client.application?.owner?.id) {
        await message.guild.commands.set([
            {
                name: "play",
                description: "Plays a song from youtube",
                options: [
                    {
                        name: "query",
                        type: "STRING",
                        description: "The song you want to play",
                        required: true
                    }
                ]
            }
        ]);

        await message.reply("Deployed!");
    }
});

client.login(config.token);