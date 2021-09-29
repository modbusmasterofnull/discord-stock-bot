function TickerGenerator(quote) {
	var result = {};
	result.quote = quote;
	result.marketState = () => {
		return result.quote.marketState == 'POSTPOST' ? 'post' : result.quote.marketState.toLowerCase();
	}


	get decorator() {
		return result.quote.decorator;
	}

	get tickerColor() {
		return result.quote.tickerColor;
	}

	get price() {
		return result.quote[`${result.marketState}MarketPrice`]?.fmt;
	}

	get change() {
		return result.quote[`${result.marketState}MarketChange`]?.fmt;
	}

	get changePercent() {
		return result.quote[`${result.marketState}MarketChangePercent`]?.fmt;
	}

	update(quote) {
		result.oldQuote = result.quote;
		result.quote = quote;
		result.quote.tickerColor = result.quote[`${result.marketState}MarketChangePercent`]?.raw > 0 ? 'green' : 'red';
		result.quote.decorator = () => {
			if (result.quote[`${result.marketState}MarketChangePercent`]?.raw >= 0 && result.quote[`${result.marketState}MarketChangePercent`]?.raw < 0.05) {
				return '↗';
			} else if (result.quote[`${result.marketState}MarketChangePercent`]?.raw > 0.05) {
				return '🚀';
			} else {
				return '↘';
			}
		}

		if (result.quote.tickerColor != result.oldQuote.tickerColor || result.quote.decorator != result.oldQuote.decorator) {
			result.updateNickname = true;
		} else result.updateNickname = false;

	    return result.quote;
	}
}

export default TickerGenerator;
