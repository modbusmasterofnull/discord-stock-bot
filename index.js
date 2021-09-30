import { Client, Intents } from 'discord.js';
import TickerGenerator from "./util.js";

const TOKEN = process.env.TOKEN;
const UPDATE_FREQUENCY_MS = process.env.FREQUENCY || 10000;
const API_URL = "https://query1.finance.yahoo.com/v10/finance/quoteSummary/tsla?modules=price";
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
	var oldFormatting;
	var firstRun = true;

	//interval to check price/do discord stuff
	setInterval(async () => {

		const ticker = new TickerGenerator(API_URL);
		const quote = await ticker.get();
		ticker.updateTicker(quote);
		const guildIds = client.guilds.cache.map(guild => guild.id);

		console.log('new formatting: '+JSON.stringify(ticker.formatting));
		console.log('old formatting: '+JSON.stringify(oldFormatting);
		console.log(ticker.toString());
		console.log('market state: '+ticker.quote.marketState);

		guildIds.forEach(async guildId => {
			const guild = await client.guilds.fetch(guildId);

			if (ticker.formatting.decorator !== oldFormatting?.decorator || ticker.formatting.color !== oldFormatting?.color || firstRun) {
				console.log('formatting changed');
				const newNickname = `TSLA ${ticker.formatting.decorator}`;
				const currentRole = guild.me.roles.cache.find(role => role.name.includes('tickers'));
				console.log('current role: ' + currentRole);
				const newRole = guild.roles.cache.find(role => role.name == `tickers-${ticker.formatting.color}`);

				//change nickname
				await guild.me.setNickname(newNickname);
				console.log(`Setting nickname to ${newNickname}`);

				//change roles
				if (currentRole) {
					await guild.me.roles.remove(currentRole);
				}
				await guild.me.roles.add(newRole);

				//after first run, is false
				if (firstRun) {
					firstRun = false;
				}
			}

			//update price into activity if market is open at all
			if (ticker.quote.marketState != 'POSTPOST') {
				console.log(ticker.price.fmt);
				console.log(ticker.changePercent.fmt);
				client.user.setActivity(`${ticker.price.fmt} (${ticker.changePercent.fmt}) `, { type: 'WATCHING' });
			}

		});
		oldFormatting = Object.assign({}, ticker.formatting);
	}, UPDATE_FREQUENCY_MS);

	console.log('Bot is ready...');
});

client.login(TOKEN);
