function TickerGenerator(quote) {
	var result = Object.assign({}, quote);
	result.marketState = () => {
		return result.marketState == 'POSTPOST' ? 'post' : result.marketState.toLowerCase();
	}

	result.price = () => {
		return result[`${result.marketState}MarketPrice`]?.fmt;
	}

	result.change = () => {
		return result[`${result.marketState}MarketChange`]?.fmt;
	}

	result.changePercent = () => {
		return result[`${result.marketState}MarketChangePercent`]?.fmt;
	}

	result.tickerColor = result[`${result.marketState}MarketChangePercent`]?.raw > 0 ? 'green' : 'red';
	result.decorator = () => {
		if (result[`${result.marketState}MarketChangePercent`]?.raw >= 0 && result[`${result.marketState}MarketChangePercent`]?.raw < 0.05) {
			return '↗';
		} else if (result[`${result.marketState}MarketChangePercent`]?.raw > 0.05) {
			return '🚀';
		} else {
			return '↘';
		}
	}

	return result;
}

export default TickerGenerator;
