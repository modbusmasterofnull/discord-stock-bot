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

		function parseMarketState(m){
			if (m == 'POSTPOST') {
				return 'post';
			} else return m.toLowerCase();
		}
		const marketState = parseMarketState(quote.marketState);
		const price = quote[`${marketState}MarketPrice`];
		const previousClose = quote.regularMarketPreviousClose;
		const changeAmount = quote[`${marketState}MarketChange`] || '--';
		const changePercent = quote[`${marketState}MarketChangePercent`] || '--';

		function decorator(q,m) {
			if (q[`${m}MarketChangePercent`]?.raw >= 0 && q[`${m}MarketChangePercent`]?.raw < 0.05) {
				return {
					arrow: '↗',
					color: 'green',
				};
			} else if (q[`${m}MarketChangePercent`]?.raw > 0.05) {
				return {
					arrow: '🚀',
					color: 'green',
				};
			} else {
				return {
					arrow: '↘',
					color: 'red',
				};
			}
		}

		const dec = decorator(quote,marketState);

		const newNickname = `TSLA ${dec.arrow}`;

		const guildIds = client.guilds.cache.map(guild => guild.id);

		guildIds.forEach(async guildId => {
			const guild = await client.guilds.fetch(guildId);

			guild.me.setNickname(newNickname);

			client.user.setActivity(`${price.fmt} (${changePercent.fmt}) `, { type: 'WATCHING' });

			console.log(`Setting nickname to ${newNickname}`);

			const greenRole = guild.roles.cache.find(role => role.name == 'tickers-green');
			const redRole = guild.roles.cache.find(role => role.name == 'tickers-red');

			if (dec.color == 'green') {
				console.log(`Ticker is Green`)
				guild.me.roles.remove(redRole);
				guild.me.roles.add(greenRole);
			} else {
				console.log(`Ticker is Red`)
				guild.me.roles.remove(greenRole);
				guild.me.roles.add(redRole);
			}
		});
	}, UPDATE_FREQUENCY_MS);

console.log('Bot is ready...');
});

client.login(TOKEN);
