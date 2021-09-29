import fetch from 'node-fetch';

class TickerGenerator {
	constructor(url) {
		this.url = url;
		this.quote = () => {
			const result = await this.getQuote(url);
			return result;
		};
		console.log('Created Ticker');
		console.log(this.quote);
	}

	async getQuote(url) {
		const response = await fetch(url);
		console.log('Got Quote')
		return response.json().data?.quoteSummary?.result[0]?.price;
	}

	get decorator() {
		return this.quote.decorator;
	}

	get tickerColor() {
		return this.quote.tickerColor;
	}

	get price() {
		return this.quote[`${this.marketState}MarketPrice`]?.fmt;
	}

	get change() {
		return this.quote[`${this.marketState}MarketChange`]?.fmt;
	}

	get changePercent() {
		return this.quote[`${this.marketState}MarketChangePercent`]?.fmt;
	}

	async refresh() {
		this.oldQuote = this.quote;
		this.quote = await this.getQuote(this.url);
		//this.marketState = this.quote.marketState == 'POSTPOST' ? 'post' : this.quote.marketState.toLowerCase();
		if (this.quote.marketState == 'POSTPOST') {
			this.marketState = 'post';
		} else {
			this.marketState = this.quote.marketState.toLowerCase();
		}
		this.quote.tickerColor = this.quote[`${this.marketState}MarketChangePercent`]?.raw > 0 ? 'green' : 'red';
		this.quote.decorator = () => {
			if (this.quote[`${this.marketState}MarketChangePercent`]?.raw >= 0 && this.quote[`${this.marketState}MarketChangePercent`]?.raw < 0.05) {
				return '↗';
			} else if (this.quote[`${this.marketState}MarketChangePercent`]?.raw > 0.05) {
				return '🚀';
			} else {
				return '↘';
			}
		}

		if (this.quote.tickerColor != this.oldQuote.tickerColor || this.quote.decorator != this.oldQuote.decorator) {
			this.updateNickname = true;
		} else this.updateNickname = false;

	    return this.quote;
	}
}

export default TickerGenerator;
