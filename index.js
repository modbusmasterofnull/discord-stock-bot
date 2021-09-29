import { Client, Intents } from 'discord.js';
import TickerGenerator from "./util.js";

const TOKEN = process.env.TOKEN;
const UPDATE_FREQUENCY_MS = process.env.FREQUENCY || 10000;
const API_URL = "https://query1.finance.yahoo.com/v10/finance/quoteSummary/tsla?modules=price";
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
	var oldTicker;
	var ticker;

	//interval to check price/do discord stuff
	setInterval(async () => {

		ticker = new TickerGenerator(API_URL);
		const guildIds = client.guilds.cache.map(guild => guild.id);

		guildIds.forEach(async guildId => {
			const guild = await client.guilds.fetch(guildId);

			if (ticker.decorator != oldTicker?.decorator || ticker.color != oldTicker?.color) {
				const newNickname = `TSLA ${ticker.decorator}`;
				const currentRole = guild.me.roles.cache.find(role => role.name.includes('tickers')) || 0;
				const newRole = `tickers-${ticker.color}`;

				//change nickname
				guild.me.setNickname(newNickname);
				console.log(`Setting nickname to ${newNickname}`);

				//change roles
				if (currentRole) {
					guild.me.roles.remove(currentRole);
				}
				guild.me.roles.add(newRole);
			}

			//update price into activity if market is open at all
			if (ticker.marketState != 'POSTPOST') {
				client.user.setActivity(`${ticker.price} (${ticker.changePercent}) `, { type: 'WATCHING' });
			}

		});
		oldTicker = Object.assign({}, ticker);
	}, UPDATE_FREQUENCY_MS);

	console.log('Bot is ready...');
});

client.login(TOKEN);
