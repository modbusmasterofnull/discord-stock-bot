function TickerGenerator(quote) {
	var result = {};
	result.quote = quote;
	result.marketState = () => {
		return result.quote.marketState == 'POSTPOST' ? 'post' : result.quote.marketState.toLowerCase();
	}

	result.price = () => {
		return result.quote[`${result.marketState}MarketPrice`]?.fmt;
	}

	result.change = () => {
		return result.quote[`${result.marketState}MarketChange`]?.fmt;
	}

	result.changePercent = () => {
		return result.quote[`${result.marketState}MarketChangePercent`]?.fmt;
	}

	result.update = (quote) => {
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
	return result;
}

export default TickerGenerator;
