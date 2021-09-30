import fetch from 'node-fetch';

class TickerGenerator {
	constructor(url) {
		this.url = url;
	}

	async update() {
		const response = await fetch(this.url);
		const data = await response.json().quoteSummary?.result[0]?.price;
		return data;
	}

	parseMarketPrice(data) {
		const result = data?.quoteSummary?.result[0]?.price;
		return result;
	}

	get marketState() {
		return this.quote.marketState.includes('POST') ? 'post' : this._quote.marketState.toLowerCase();
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

		if (this.quote[`${this.quote.marketState}MarketChangePercent`]?.raw >= 0 && this.quote[`${this.quote.marketState}MarketChangePercent`]?.raw < 0.05) {
			formatting.decorator = '↗';
		} else if (this.quote[`${this.quote.marketState}MarketChangePercent`]?.raw > 0.05) {
			formatting.decorator = '🚀';
		} else {
			formatting.decorator = '↘';
		}

		formatting.color = this.quote[`${this.quote.marketState}MarketChangePercent`]?.raw > 0 ? 'green' : 'red';

		return formatting;
	}

}

export default TickerGenerator;
