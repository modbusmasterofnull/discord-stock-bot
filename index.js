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
		var marketState = quote.marketState.toLowerCase() == 'postpost' ? 'post' : quote.marketState.toLowerCase();
		const price = quote[`${marketState}MarketPrice`] || 0;
		const previousClose = quote.regularMarketPreviousClose || 0;
		const changeAmount = quote[`${marketState}MarketChange`]?.fmt || '--';
		const changePercent = quote[`${marketState}MarketChangePercent`]?.fmt || '--';
		const isGreen = price >= previousClose ? true : false;

		const newNickname = `TSLA: \$${price.fmt}`;

		const guildIds = client.guilds.cache.map(guild => guild.id);

		guildIds.forEach(async guildId => {
			const guild = await client.guilds.fetch(guildId);

			guild.me.setNickname(newNickname);

			client.user.setActivity(`${marketState}market \$${changeAmount} (${changePercent}) `, { type: 'WATCHING' });

			console.log(`Setting nickname to ${newNickname}`);

			const greenRole = guild.roles.cache.find(role => role.name == 'tickers-green');
			const redRole = guild.roles.cache.find(role => role.name == 'tickers-red');

			if (isGreen) {
				guild.me.roles.remove(redRole);
				guild.me.roles.add(greenRole);
				console.log('Ticker is green')
			} else {
				guild.me.roles.remove(greenRole);
				guild.me.roles.add(redRole);
				console.log('Ticker is red');
			}
		});
	}, UPDATE_FREQUENCY_MS);

console.log('Bot is ready...');
});

client.login(TOKEN);
