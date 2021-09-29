import fetch from 'node-fetch';
import { Client, Intents } from 'discord.js';
import TickerGenerator from "./util.js";

async function getQuote(url) {
	const response = await fetch(url);
	return response.json().data?.quoteSummary?.result[0]?.price;
}

const TOKEN = process.env.TOKEN;
const UPDATE_FREQUENCY_MS = process.env.FREQUENCY || 10000;
const API_URL = "https://query1.finance.yahoo.com/v10/finance/quoteSummary/tsla?modules=price";
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
	var oldTicker;
	var ticker;

	//interval to check price/do discord stuff
	setInterval(async () => {
		if (oldTicker) {
			oldTicker = Object.assign({}, ticker);
		}

		ticker = TickerGenerator(getQuote(API_URL));
		const guildIds = client.guilds.cache.map(guild => guild.id);

		guildIds.forEach(async guildId => {
			const guild = await client.guilds.fetch(guildId);

			if (ticker.decorator != oldTicker?.decorator || ticker.tickerColor != oldTicker?.tickerColor) {
				const newNickname = `TSLA ${ticker.decorator}`;
				const currentRole = guild.me.roles.cache.find(role => role.name.includes('tickers'));
				const newRole = `tickers-${ticker.tickerColor}`;

				//change nickname
				guild.me.setNickname(newNickname);
				console.log(`Setting nickname to ${newNickname}`);

				//change roles
				guild.me.roles.remove(currentRole);
				guild.me.roles.add(newRole);
			}

			//update price into activity if market is open at all
			if (ticker.marketState != 'POSTPOST') {
				client.user.setActivity(`${ticker.price} (${ticker.changePercent}) `, { type: 'WATCHING' });
			}

		});
	}, UPDATE_FREQUENCY_MS);

	console.log('Bot is ready...');
});

client.login(TOKEN);
