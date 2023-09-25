import { Client as DiscordClient, GatewayIntentBits } from 'discord.js';

import { PSM, createWorker } from 'tesseract.js';
import 'dotenv/config'
import { banking } from './util';
import { expenseHandler } from './functions';

const discord = new DiscordClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

discord.on('ready', () => {
    console.log(discord.user?.tag)
    console.log(process.env)
})

discord.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    // Message from guild (server)
    if (message.channel.type === 0) {
        switch (message.channel.name) {
            case "expense":
                expenseHandler(message)
                break;
            default:
                break;
        }
    }
})

discord.login(process.env.DISCORD_TOKEN)