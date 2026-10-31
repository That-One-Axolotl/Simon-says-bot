// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require('discord.js');
const token = process.env.TOKEN;
const channel_id = process.env.CHANNEL;
const { fetch_replies, parseTweets, findNewTweets, writeTweetsToJson, fetch_posts, mergeTweets } = require("./tweetHandling.js");
const fs = require("node:fs/promises");

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once).
// The distinction between `client: Client<boolean>` and `readyClient: Client<true>` is important for TypeScript developers.
// It makes some properties non-nullable.
client.once(Events.ClientReady, async(readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    const channel = await client.channels.cache.get(channel_id);

    let replies = await parseTweets(await fetch_replies());
    let posts = await parseTweets(await fetch_posts());
    let tweets = mergeTweets(replies, posts);
    let oldTweets = await JSON.parse(await fs.readFile("prevTweets.json", "utf8"));
    let newTweets = await findNewTweets(tweets, oldTweets);

    if(newTweets.length > 0){
        await channel.send("**Simon** posted " + newTweets.length + " new tweets!")
        for(let tweet of newTweets) {
            let link = "https://vxtwitter.com" + tweet[1];
            await channel.send(link);
        }
        
        writeTweetsToJson(tweets);
    }
    
    
});

// Log in to Discord with your client's token
client.login(token);

