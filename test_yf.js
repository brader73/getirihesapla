const yf = require('yahoo-finance2').default;

async function test() {
  try {
    const res = await yf.quote(['DX-Y.NYB', '^VIX', '^TNX', 'GC=F', 'CL=F']);
    console.log("SUCCESS:", res.length);
  } catch (e) {
    console.error("ERROR:", e.message);
  }
}
test();
