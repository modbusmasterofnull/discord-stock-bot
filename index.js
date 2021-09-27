import { Client, Intents } from 'discord.js';
import Response from "./Response.js";

const TOKEN = process.env.TOKEN;
const UPDATE_FREQUENCY_MS = process.env.FREQUENCY || 10000;
const API_URL = "https://query1.finance.yahoo.com/v10/finance/quoteSummary/tsla?modules=price";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
  const responseClient = new Response(API_URL);

  setInterval(async () => {
    const res = await responseClient.get();
    const quote = responseClient.parseMarketPrice(res);
    const marketState = quote.marketState.toLowerCase();
    var price = quote[`${marketState}MarketPrice`]?.fmt;
    /*if (quote.MarketState == 'PRE') {
      price = quote.preMarketPrice.fmt;
    } else if (quote.marketState == 'POST') {
      price = quote.postMarketPrice.fmt;
    } else {
      price = quote.regularMarketPrice.fmt;
    }*/
    
    //quote.regularMarketPrice?.raw

    const newNickname = `TSLA: \$${price}`;

    const guildIds = client.guilds.cache.map(guild => guild.id);

    guildIds.forEach(async guildId => {
      const guild = await client.guilds.fetch(guildId);

      guild.me.setNickname(newNickname);

      console.log(`Setting nickname to ${newNickname}`);
    });
  }, UPDATE_FREQUENCY_MS);

  console.log('Bot is ready...');
});

client.login(TOKEN);
