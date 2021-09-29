import fetch from 'node-fetch';

class TickerGenerator {
	constructor(url) {
		this.url = url;
	}

	async update() {
		const response = await fetch(this.url);
		const quote await response.json().quoteSummary?.result[0]?.price;
		return quote;
	}

	get quote() {
		return this._quote;
	}

	set quote(data) {
		this._quote = data;
	}

	get marketState() {
		return this._quote.marketState.includes('POST') ? 'post' : this._quote.marketState.toLowerCase();
	}

	get price() {
		return this._quote[`${this.marketState}MarketPrice`];
	}

	get change() {
		return this._quote[`${this.marketState}MarketChange`];
	}

	get changePercent() {
		return this._quote[`${this.marketState}MarketChangePercent`];
	}

	parseFormatting(q) {
		let formatting = {};

		if (q[`${q.marketState}MarketChangePercent`]?.raw >= 0 && result[`${q.marketState}MarketChangePercent`]?.raw < 0.05) {
			formatting.decorator = '↗';
		} else if (q[`${q.marketState}MarketChangePercent`]?.raw > 0.05) {
			formatting.decorator = '🚀';
		} else {
			formatting.decorator = '↘';
		}

		formatting.color = q[`${this._quote.marketState}MarketChangePercent`]?.raw > 0 ? 'green' : 'red';

		return formatting;
	}

}

export default TickerGenerator;
