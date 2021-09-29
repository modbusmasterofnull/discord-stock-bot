import { Client, Intents } from 'discord.js';
import TickerGenerator from "./util.js";

const TOKEN = process.env.TOKEN;
const UPDATE_FREQUENCY_MS = process.env.FREQUENCY || 10000;
const API_URL = "https://query1.finance.yahoo.com/v10/finance/quoteSummary/tsla?modules=price";
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
	var oldFormatting;

	//interval to check price/do discord stuff
	setInterval(async () => {

		const ticker = new TickerGenerator(API_URL);
		const quote = await ticker.update();
		ticker.quote = quote;
		const formatting = ticker.parseFormatting(quote);
		const guildIds = client.guilds.cache.map(guild => guild.id);

		guildIds.forEach(async guildId => {
			const guild = await client.guilds.fetch(guildId);

			if (formatting.decorator != oldFormatting?.decorator || formatting.color != oldFormatting?.color) {
				const newNickname = `TSLA ${formatting.decorator}`;
				const currentRole = guild.me.roles.cache.find(role => role.name.includes('tickers')) || 0;
				const newRole = `tickers-${formatting.color}`;

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
			if (ticker.quote.marketState != 'POSTPOST') {
				client.user.setActivity(`${ticker.price} (${ticker.changePercent}) `, { type: 'WATCHING' });
			}

		});
		oldFormatting = Object.assign({}, formatting);
	}, UPDATE_FREQUENCY_MS);

	console.log('Bot is ready...');
});

client.login(TOKEN);
