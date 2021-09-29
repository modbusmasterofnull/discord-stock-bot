import fetch from 'node-fetch';

async function getQuote(url) {
	const response = await fetch(url);
	console.log(response.json());
	return response.json().data?.quoteSummary?.result[0]?.price;
}

class TickerGenerator {
	constructor(quote) {
		this.quote = quote;
		this.marketState = () => {
			return this.quote.marketState == 'POSTPOST' ? 'post' : this.quote.marketState.toLowerCase();
		}
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

	update(quote) {
		this.oldQuote = this.quote;
		this.quote = quote;
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

module.exports= {
	TickerGenerator: TickerGenerator,
	getQuote: getQuote
}
