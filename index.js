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

		guildIds.forEach(async guildId => {
			const guild = await client.guilds.fetch(guildId);
			const me = await client.user.id;
			const newNickname = `TSLA ${ticker.formatting.decorator} \$${ticker.price.fmt}`;

			if (ticker.formatting.decorator !== oldFormatting?.decorator || ticker.formatting.color !== oldFormatting?.color || firstRun) {
				//console.log('formatting changed');
				const currentRole = guild.me.roles.cache.find(role => role.name.includes('tickers'));
				//console.log('current role: ' + currentRole);
				const newRole = guild.roles.cache.find(role => role.name == `tickers-${ticker.formatting.color}`);

				//change roles
				if (currentRole) {
					await guild.me.roles.remove(currentRole).then(result => console.log('removed role: '+result));
				}
				await guild.me.roles.add(newRole).then(result => console.log('added role: '+result));

				//after first run, is false
				if (firstRun) {
					firstRun = false;
				}
			}

			//update activity if market is open at all
			if (ticker.quote.marketState != 'POSTPOST') {
				await client.user.setActivity(`\$${ticker.change.fmt} (${ticker.changePercent.fmt})`)
				//update nick
				await guild.members.edit(me,{nick:newNickname}).then(result => console.log('Changed nick: '+result));
			}

		});
		oldFormatting = Object.assign({}, ticker.formatting);
	}, UPDATE_FREQUENCY_MS);

	console.log('Bot is ready...');

	client.on('messageCreate', msg => {
		console.log(msg);
	});
});


client.login(TOKEN);
