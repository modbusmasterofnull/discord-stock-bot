import fetch from 'node-fetch';

class TickerGenerator {
	constructor(url) {
		this.url = url;
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
	    const response = await fetch(this.url);
		this.oldQuote = this.quote;
		this.quote = response.json().data?.quoteSummary?.result[0]?.price;
		this.marketState = this.quote.marketState == 'POSTPOST' ? 'post' : this.quote.marketState.toLowerCase();
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
