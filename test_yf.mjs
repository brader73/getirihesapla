import { YahooFinance } from 'yahoo-finance2';
const yf = new YahooFinance();
async function test() {
  try {
    const res = await yf.quote(['DX-Y.NYB']);
    console.log(res);
  } catch (e) {
    console.error(e);
  }
}
test();
