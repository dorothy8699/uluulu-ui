(() => {
  const {cpuIds, numbers, hasReferences, canMine, getSale, setSale} = window.uluuluHoldings;
  const find = selector => document.querySelector(selector);
  const query = find('#owned-query'), cpu = find('#owned-cpu');
  let page = 1;
  const pageSize = 10;
  cpuIds.forEach(id => { const option = document.createElement('option'); option.value = id; option.textContent = `CPU #${id}`; cpu.append(option); });
  function rowActions(number) {
    const sale = getSale(number);
    if (sale?.mode === 'fixed') return `<div class="owned-row-actions"><div class="owned-sale-info"><span class="owned-sale-status">已一口价上架</span><small>${Number(sale.price).toLocaleString('en-US')} BNB</small></div><button type="button" data-owned-action="unlist">下架</button></div>`;
    if (sale?.mode === 'auction') return `<div class="owned-row-actions"><div class="owned-sale-info"><span class="owned-sale-status is-auction">${sale.end > Date.now() ? '拍卖中' : '拍卖已结束'}</span><small>${Number(sale.current || sale.reserve).toLocaleString('en-US')} BNB</small></div><button type="button" data-owned-action="view-auction">查看拍卖</button></div>`;
    return '<div class="owned-row-actions"><button type="button" class="owned-list-fixed" data-owned-action="fixed">一口价上架</button><button type="button" data-owned-action="auction">发起拍卖</button></div>';
  }
  function render() {
    const rows = numbers.filter(number => number.includes(query.value.trim()) && (cpu.value === 'all' || number.split('.')[1] === cpu.value));
    const pages = Math.max(1, Math.ceil(rows.length / pageSize));
    page = Math.max(1, Math.min(page, pages));
    const start = (page - 1) * pageSize;
    find('#owned-list').innerHTML = rows.slice(start, start + pageSize).map(number => `<div class="owned-row" data-owned-number="${number}"><strong>${number.split('.')[0]}<span>.${number.split('.')[1]}</span></strong><span>CPU #${number.split('.')[1]}</span><span title="${hasReferences[number] ? '含引用，不可挖矿' : ''}" class="owned-mining ${canMine(number) ? 'is-mineable' : ''}">${canMine(number) ? '可以挖矿' : '不可挖矿'}</span><span>${number.replace('.', '').length} 位数字</span>${rowActions(number)}</div>`).join('');
    find('#owned-count').hidden = !query.value.trim() && cpu.value === 'all';
    find('#owned-count').textContent = `${rows.length.toLocaleString('en-US')} 个靓号`;
    find('#owned-range').textContent = rows.length ? `${start + 1}–${Math.min(start + pageSize, rows.length)} / ${rows.length.toLocaleString('en-US')}` : '0 / 0';
    find('#owned-page').textContent = `${page} / ${pages}`;
    find('#owned-prev').disabled = page === 1;
    find('#owned-next').disabled = page === pages;
    find('#owned-empty').hidden = rows.length > 0;
    find('.owned-table').hidden = rows.length === 0;
  }
  find('#owned-list').addEventListener('click', event => {
    const button = event.target.closest('[data-owned-action]');
    if (!button || !window.uluuluWallet.connected) return;
    const number = button.closest('[data-owned-number]').dataset.ownedNumber;
    const sale = getSale(number);
    if (button.dataset.ownedAction === 'unlist' && sale?.mode === 'fixed') {
      setSale(number, null);
      find(`[data-owned-number="${number}"] button`)?.focus({preventScroll:true});
    } else if (button.dataset.ownedAction === 'view-auction' && sale?.mode === 'auction') {
      window.uluuluAuctions.open({...sale, id:number});
    } else if (!sale && ['fixed','auction'].includes(button.dataset.ownedAction)) {
      window.uluuluListing.open(button.dataset.ownedAction, number);
    }
  });
  window.addEventListener('uluulu-holdings-change', render);
  function resetPage() { page = 1; render(); }
  query.addEventListener('input', resetPage);
  cpu.addEventListener('change', resetPage);
  find('#owned-prev').addEventListener('click', () => { page--; render(); });
  find('#owned-next').addEventListener('click', () => { page++; render(); });
  find('#owned-reset').addEventListener('click', () => { query.value = ''; cpu.value = 'all'; resetPage(); query.focus(); });
  function syncWallet() {
    const connected = window.uluuluWallet.connected;
    find('#owned-content').hidden = !connected;
    find('#owned-disconnected').hidden = connected;
    find('.owned-total').hidden = !connected;
    find('#owned-total').textContent = numbers.length.toLocaleString('en-US');
    if (!connected) { query.value = ''; cpu.value = 'all'; resetPage(); }
  }
  function syncFavorites() {
    try {
      const favorites = JSON.parse(window.uluuluDemoStorage.local.getItem('eight-favorites') || '[]');
      find('#home-favorites-count').textContent = Array.isArray(favorites) ? new Set(favorites.filter(id => typeof id === 'string' && /^\d+\.\d+$/.test(id))).size : 0;
    } catch { find('#home-favorites-count').textContent = '0'; }
  }
  window.addEventListener('uluulu-wallet-change', syncWallet);
  window.addEventListener('storage', syncFavorites);
  syncWallet(); syncFavorites(); render();
})();
