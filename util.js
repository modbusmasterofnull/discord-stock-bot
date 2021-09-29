import fetch from 'node-fetch';

class TickerGenerator {
	constructor(url) {
		this.url = url;
		this._quote = this.update();
		console.log(this._quote);
	}

	async update() {
		const response = await fetch(this.url);
		return response.json().quoteSummary?.result[0]?.price;
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

	get decorator() {
		let q = this._quote;

		if (q[`${q.marketState}MarketChangePercent`]?.raw >= 0 && result[`${q.marketState}MarketChangePercent`]?.raw < 0.05) {
			return '↗';
		} else if (q[`${q.marketState}MarketChangePercent`]?.raw > 0.05) {
			return '🚀';
		} else {
			return '↘';
		}
	}

	get color() {
		return this._quote[`${this._quote.marketState}MarketChangePercent`]?.raw > 0 ? 'green' : 'red';
	}

}

export default TickerGenerator;
