(() => {
  const section = document.querySelector('#recent-sales');
  if (!section) return;
  const body = section.querySelector('tbody');
  const more = section.querySelector('#sales-load-more');
  const status = section.querySelector('#sales-load-status');
  const batchSize = 20;
  const epoch = Date.now();
  const sampleOwner = window.uluuluWallet?.address;
  const connected = () => Boolean(window.uluuluWallet?.connected);
  const currentAddress = () => connected() ? window.uluuluWallet.address.toLowerCase() : '';
  let scope = 'recent';
  // Deterministic sample identifiers, not real on-chain transactions.
  function demoHex(seed, length) {
    let value = seed;
    let output = '';
    while (output.length < length) {
      value = (Math.imul(value, 1664525) + 1013904223) >>> 0;
      output += value.toString(16).padStart(8, '0');
    }
    return '0x' + output.slice(0, length);
  }
  // Static preview records. Replace this source with a cursor-based sales API.
  const first = [
    { number: '7.0', price: 100, platform: 'official', mode: 'fixed', minutes: 5 },
    { number: '5.888', price: 1.99, platform: 'uluulu', mode: 'fixed', minutes: 18 },
    { number: '22.888', price: 4.99, platform: 'official', mode: 'fixed', minutes: 60 }
  ];
  const cpus = ['0', '888', '30', '1', '16', '231'];
  const circuits = ['88', '123', '666', '99', '520', '2026', '777', '1001', '8888', '333', '6868', '909'];
  const prices = [0.008, 0.12, 1.28, 0.056, 0.88, 2.35, 0.39, 0.071, 0.66, 3.2, 0.099, 0.18];
  const records = [...first, ...Array.from({ length: 72 }, (_, index) => ({
    number: `${circuits[index % circuits.length]}${index >= 36 ? '8' : ''}.${cpus[Math.floor(index / circuits.length) % cpus.length]}`,
    price: prices[index % prices.length],
    platform: index % 3 === 0 ? 'official' : 'uluulu',
    mode: index % 3 === 0 || index % 2 === 0 ? 'fixed' : 'auction',
    minutes: 85 + index * 37 + Math.floor(index / 4) * 53
  }))].map((record, index) => ({ ...record, key: index, timestamp: epoch - record.minutes * 60000,
    tx: demoHex(5656 + index * 17, 64),
    from: sampleOwner && index % 3 === 0 ? sampleOwner : demoHex(88 + index * 31, 40),
    to: sampleOwner && index % 3 === 1 ? sampleOwner : demoHex(888 + index * 43, 40)
  }))
    .sort((a, b) => b.timestamp - a.timestamp);
  let shown = 0;
  let loading = false;
  let lastScrollY = window.scrollY;
  let scrollIntentUntil = 0;
  let touchY = 0;
  let scrollFrame = 0;
  const english = () => document.documentElement.lang === 'en';
  const text = (zh, en) => english() ? en : zh;
  function scopedRecords() {
    if (scope === 'recent') return records;
    const address = currentAddress();
    return address ? records.filter(record => record.from.toLowerCase() === address || record.to.toLowerCase() === address) : [];
  }
  function updateTabs() {
    const mine = section.querySelector('#sales-tab-mine');
    mine.disabled = !connected();
    mine.title = connected() ? text('查看当前钱包的买入与卖出记录', 'View purchases and sales for this wallet') : text('连接钱包后查看我的成交', 'Connect a wallet to view your trades');
    section.querySelectorAll('[data-sales-scope]').forEach(tab => {
      const selected = tab.dataset.salesScope === scope;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    section.querySelector('#sales-panel').setAttribute('aria-labelledby', scope === 'mine' ? 'sales-tab-mine' : 'sales-tab-recent');
    section.querySelector('#sales-description').textContent = scope === 'mine'
      ? text('当前钱包的买入与卖出记录，按时间从近到远排列。', 'Purchases and sales for this wallet, newest first.')
      : text('全部市场的成交记录，按时间从近到远排列。', 'Sales across all markets, newest first.');
  }
  function resetScope(next) {
    scope = next === 'mine' && connected() ? 'mine' : 'recent';
    shown = 0;
    scrollIntentUntil = 0;
    cancelAnimationFrame(scrollFrame);
    body.replaceChildren();
    section.querySelector('.sales-table-scroll').scrollLeft = 0;
    updateTabs();
    loadMore();
    updateStatus();
  }
  const copyIcon = '<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="5" y="5" width="8" height="8" rx="1.5"/><path d="M3 10H2.5A1.5 1.5 0 0 1 1 8.5v-6A1.5 1.5 0 0 1 2.5 1h6A1.5 1.5 0 0 1 10 2.5V3"/></svg>';
  function identifier(value, label) {
    const short = value.slice(0, 6) + '…' + value.slice(-4);
    return `<button type="button" class="sale-copy" data-sale-copy="${value}" title="${value}" aria-label="${text('复制', 'Copy ')}${label}: ${value}"><span>${short}</span>${copyIcon}</button>`;
  }

  function row(record) {
    const [circuit, cpu] = record.number.split('.');
    const locale = english() ? 'en-US' : 'zh-CN';
    const minutes = Math.max(1, Math.floor((Date.now() - record.timestamp) / 60000));
    const unit = minutes >= 1440 ? 'day' : minutes >= 60 ? 'hour' : 'minute';
    const value = unit === 'day' ? Math.floor(minutes / 1440) : unit === 'hour' ? Math.floor(minutes / 60) : minutes;
    const relative = new Intl.RelativeTimeFormat(locale, { numeric: 'always', style: 'short' }).format(-value, unit);
    const date = new Date(record.timestamp);
    const exact = new Intl.DateTimeFormat(locale, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }).format(date);
    return `<tr data-sale-record="${record.key}">
      <td class="sale-number"><strong title="tape://${record.number}">${circuit}<span>.${cpu}</span></strong></td>
      <td class="sale-price">${record.price.toLocaleString('en-US', { maximumFractionDigits: 8 })} <small>BNB</small></td>
      <td class="sale-platform"><span class="sale-platform-icon" aria-hidden="true">${record.platform === 'official' ? 'T' : 'u'}</span>${record.platform === 'official' ? text('TapeOut 官网', 'TapeOut official') : 'uluulu'}</td>
      <td class="sale-method"><span>${record.mode === 'fixed' ? text('一口价', 'Buy now') : text('拍卖', 'Auction')}</span></td>
      <td>${identifier(record.tx, text('交易 ID', 'transaction ID'))}</td>
      <td>${identifier(record.from, 'From')}</td>
      <td>${identifier(record.to, 'To')}</td>
      <td class="sale-time"><time datetime="${date.toISOString()}" title="${exact}">${relative}</time></td>
    </tr>`;
  }

  function updateStatus() {
    status.textContent = text(`已显示 ${shown} 条成交`, `${shown} sales shown`);
    const rows = scopedRecords();
    const done = shown >= rows.length;
    more.hidden = done;
    more.textContent = text(`继续加载 ${batchSize} 条 ↓`, `Load ${batchSize} more ↓`);
    section.querySelector('#sales-end').hidden = !done || !rows.length;
    if (!rows.length) body.innerHTML = `<tr><td colspan="8" class="sales-empty">${text('这个钱包暂无成交记录', 'No trades for this wallet yet')}</td></tr>`;
  }

  function loadMore() {
    const rows = scopedRecords();
    if (loading || section.hidden || shown >= rows.length) return;
    loading = true;
    scrollIntentUntil = 0;
    section.setAttribute('aria-busy', 'true');
    const next = rows.slice(shown, shown + batchSize);
    body.insertAdjacentHTML('beforeend', next.map(row).join(''));
    shown += next.length;
    updateStatus();
    section.setAttribute('aria-busy', 'false');
    loading = false;
  }

  // Keep a keyboard-accessible fallback as well as automatic scroll loading.
  section.addEventListener('click', async event => {
    const button = event.target.closest('[data-sale-copy]');
    if (!button) return;
    const copyStatus = section.querySelector('#sales-copy-status');
    try {
      await navigator.clipboard.writeText(button.dataset.saleCopy);
      button.classList.add('is-copied');
      const icon = button.querySelector('svg');
      icon.innerHTML = '<path d="m3 8 3 3 7-7"/>';
      copyStatus.textContent = text('已复制完整内容', 'Full value copied');
      clearTimeout(button.copyTimer);
      button.copyTimer = setTimeout(() => {
        button.classList.remove('is-copied');
        if (button.isConnected) icon.outerHTML = copyIcon;
      }, 1800);
    } catch {
      copyStatus.textContent = text('复制失败，请长按或手动复制完整内容：', 'Copy failed. Copy the full value manually: ') + button.dataset.saleCopy;
    }
  });
  more.addEventListener('click', loadMore);
  section.querySelectorAll('[data-sales-scope]').forEach(tab => tab.addEventListener('click', () => resetScope(tab.dataset.salesScope)));
  section.querySelector('.sales-tabs').addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    event.stopPropagation();
    const tabs = [...section.querySelectorAll('[data-sales-scope]:not(:disabled)')];
    const index = tabs.indexOf(document.activeElement);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    tabs[next].click();
    tabs[next].focus({ preventScroll: true });
  });
  window.addEventListener('uluulu-wallet-change', () => resetScope(scope));
  resetScope('recent');
  // Only load on a downward page scroll once the bottom actually enters view.
  // Initial rendering, hash navigation and a larger viewport must not prefetch.
  function onScroll() {
    const currentY = window.scrollY;
    const downward = currentY > lastScrollY;
    lastScrollY = currentY;
    cancelAnimationFrame(scrollFrame);
    if (Date.now() > scrollIntentUntil || !downward || section.hidden || more.hidden) return;
    scrollFrame = requestAnimationFrame(() => {
      const bounds = more.getBoundingClientRect();
      if (bounds.top < window.innerHeight && bounds.bottom > 0) loadMore();
    });
  }
  const armScroll = () => { scrollIntentUntil = Date.now() + 1200; };
  window.addEventListener('wheel', event => {
    if (event.deltaY > 0) armScroll();
  }, { passive: true });
  window.addEventListener('keydown', event => {
    if (event.target.closest('input,textarea,select,[contenteditable]')) return;
    if (['ArrowDown', 'PageDown', 'End'].includes(event.key) || (event.key === ' ' && !event.shiftKey)) armScroll();
  });
  window.addEventListener('touchstart', event => { touchY = event.touches[0]?.clientY || 0; }, { passive: true });
  window.addEventListener('touchmove', event => {
    const y = event.touches[0]?.clientY || 0;
    if (y < touchY) armScroll();
    touchY = y;
  }, { passive: true });
  window.addEventListener('pointerdown', event => {
    if (event.target === document.documentElement) armScroll();
  }, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  new MutationObserver(() => {
    updateTabs();
    body.innerHTML = scopedRecords().slice(0, shown).map(row).join('');
    updateStatus();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  new MutationObserver(() => {
    if (!section.hidden && shown === 0) loadMore();
  }).observe(section, { attributes: true, attributeFilter: ['hidden'] });
})();
