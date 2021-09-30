import fetch from 'node-fetch';

class TickerGenerator {
	constructor(url) {
		this.url = url;
	}

	async get() {
		const response = await fetch(this.url);
		return response.json();
	}

	updateTicker(data) {
		this.quote =  data?.quoteSummary?.result[0]?.price;
		return true;
	}

	get marketState() {
		return this.quote.marketState.includes('POST') ? 'post' : this.quote.marketState.toLowerCase();
	}

	get price() {
		return this.quote[`${this.marketState}MarketPrice`];
	}

	get change() {
		return this.quote[`${this.marketState}MarketChange`];
	}

	get changePercent() {
		return this.quote[`${this.marketState}MarketChangePercent`];
	}

	get formatting() {
		let formatting = {};

		if (this.quote[`${this.marketState}MarketChangePercent`]?.raw >= 0 && this.quote[`${this.marketState}MarketChangePercent`]?.raw < 0.05) {
			formatting.decorator = '↗';
		} else if (this.quote[`${this.marketState}MarketChangePercent`]?.raw > 0.05) {
			formatting.decorator = '🚀';
		} else {
			formatting.decorator = '↘';
		}

		formatting.color = this.quote[`${this.marketState}MarketChangePercent`]?.raw > 0 ? 'green' : 'red';

		return formatting;
	}

	toString() {
		return `TSLA ${this.formatting.decorator} (${this.changePercent.fmt}))`;
	}

}

export default TickerGenerator;
