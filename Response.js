import fetch from 'node-fetch';

class Response {
  constructor(url){
    this.url = url;
  }

  async get() {
    const response = await fetch(this.url);
    return response.json();  
  }

  parseMarketPrice(data) {
    return data?.quoteSummary?.result[0]?.price?.regularMarketPrice?.raw;
  }
}

export default Response;
