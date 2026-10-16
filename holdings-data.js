// Static sample holdings shared by the account page and listing preview.
(() => {
  const cpuIds = ['56', '888', '0', '30', '1', '16'];
  const numbers = ['56.56', '88.888', '168.0', ...Array.from({length:1245}, (_, i) => `${1000 + i}.${cpuIds[i % cpuIds.length]}`)];
  // Explicit reference examples for the UI demo, not onchain data.
  const referenceExamples = new Set(['1009.30', '1010.1']);
  const hasReferences = Object.fromEntries(numbers.map(number => [number, referenceExamples.has(number)]));
  const saleKey = 'uluulu-demo-holding-sales';
  const now = Date.now();
  let sales = {
    '88.888': {mode:'fixed', price:1.8, end:now + 7*86400000},
    '168.0': {mode:'auction', reserve:0.3, current:0, buyout:1.2, start:now - 3600000, end:now + 3*86400000, bids:[], seller:'0x5656…5656', auction:true}
  };
  try {
    const saved = JSON.parse(window.uluuluDemoStorage.session.getItem(saleKey) || 'null');
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) sales = saved;
  } catch {}
  function persistSales(){try{window.uluuluDemoStorage.session.setItem(saleKey, JSON.stringify(sales));}catch{}}
  persistSales();
  function getSale(number) {
    const sale = sales[number];
    if (!sale || !['fixed','auction'].includes(sale.mode) || !Number.isFinite(sale.end)) return null;
    if (sale.mode === 'fixed' && sale.end <= Date.now()) return null;
    return sale;
  }
  function setSale(number, sale) {
    if (!numbers.includes(number)) return;
    if (sale) sales[number] = sale; else delete sales[number];
    persistSales();
    window.dispatchEvent(new CustomEvent('uluulu-holdings-change', {detail:{number}}));
  }
  window.uluuluHoldings = {getSale, setSale,
    cpuIds, numbers, hasReferences,
    canMine(number) {
      return ['1', '30'].includes(number.split('.')[1]) && hasReferences[number] === false;
    }
  };
})();
