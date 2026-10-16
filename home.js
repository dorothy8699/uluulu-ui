(() => {
  const address = document.querySelector('.anatomy-number');
  if (!address) return;
  const characters = [...address.querySelectorAll('[data-type-char]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let timer;
  let position = 0;

  function stop() {
    clearTimeout(timer);
    characters.forEach(character => character.classList.remove('is-cursor'));
  }

  function showComplete() {
    stop();
    characters.forEach(character => character.classList.add('is-typed'));
    address.classList.add('typewriter-complete');
  }

  function typeNext() {
    if (document.hidden || reducedMotion.matches) return;
    characters.forEach(character => character.classList.remove('is-cursor'));
    const character = characters[position++];
    character.classList.add('is-typed', 'is-cursor');
    if (position === characters.length) {
      character.classList.remove('is-cursor');
      address.classList.add('typewriter-complete');
      timer = setTimeout(start, 5000);
    } else {
      const delay = character.textContent === ':' || character.textContent === '.' ? 190 : 120;
      timer = setTimeout(typeNext, delay);
    }
  }

  function start() {
    stop();
    if (reducedMotion.matches || document.hidden) {
      showComplete();
      return;
    }
    position = 0;
    address.classList.add('typewriter-running');
    address.classList.remove('typewriter-complete');
    characters.forEach(character => character.classList.remove('is-typed'));
    // Show the first digit immediately; the URL prefix stays visible throughout.
    typeNext();
  }

  reducedMotion.addEventListener('change', start);
  document.addEventListener('visibilitychange', start);
  start();
})();

(() => {
  const grid = document.querySelector('#home-auctions');
  if (!grid) return;
  const items = window.uluuluAuctionItems
    .filter(item => item.start <= Date.now() && item.end > Date.now())
    .sort((a, b) => b.bids.length - a.bids.length || a.end - b.end).slice(0, 3);
  const amount = value => Number(value).toLocaleString('en-US', { maximumFractionDigits: 8 });
  grid.innerHTML = items.length ? items.map(item => {
    const [circuit, cpu] = item.id.split('.');
    return `<a class="number-tile live-auction-tile" href="market.html?type=auction&number=${encodeURIComponent(item.id)}">
      <div class="tile-art">
        <div class="tile-top"><span class="home-auction-badge" data-home-auction-state="${item.end}">竞价中</span><span>CPU #${cpu} · uluulu</span></div>
        <div class="tile-number">${circuit}<span>.${cpu}</span></div>
        <div class="home-auction-timing"><span>距离落槌</span><b data-home-auction-end="${item.end}"></b></div>
      </div>
      <div class="home-auction-facts"><div><span>${item.current ? '当前最高价' : '起拍价'}</span><strong>${amount(item.current || item.reserve)} <small>BNB</small></strong></div><div class="home-auction-action"><span class="home-bid-count"><b>${item.bids.length}</b> <span>次出价</span></span><span class="home-auction-link"><span>立即竞拍</span><span aria-hidden="true">↗</span></span></div></div>
    </a>`;
  }).join('') : '<p class="home-auctions-empty">暂无进行中的拍卖</p>';
  function tick() {
    grid.querySelectorAll('[data-home-auction-end]').forEach(element => {
      const seconds = Math.max(0, Math.ceil((Number(element.dataset.homeAuctionEnd) - Date.now()) / 1000));
      const phase = seconds === 0 ? 'ended' : seconds <= 10800 ? 'ending' : 'live';
      const card = element.closest('.live-auction-tile');
      if (card.dataset.phase !== phase) {
        card.dataset.phase = phase;
        card.querySelector('[data-home-auction-state]').textContent = phase === 'ended' ? '已结束' : phase === 'ending' ? '即将结束' : '竞价中';
        card.querySelector('.home-auction-link span').textContent = phase === 'ended' ? '查看拍卖' : '立即竞拍';
      }
      const days = Math.floor(seconds / 86400);
      const time = [Math.floor(seconds % 86400 / 3600), Math.floor(seconds % 3600 / 60), seconds % 60].map(n => String(n).padStart(2, '0')).join(':');
      const value = seconds ? `${days ? days + 'd ' : ''}${time}` : '已结束';
      if (element.dataset.value !== value) { element.dataset.value = value; element.textContent = value; }
    });
  }
  tick();
  setInterval(tick, 1000);
})();

// Refresh the navigation count on return from the market or another open tab.
(() => {
  const count = document.querySelector('#home-favorites-count');
  if (!count) return;
  function syncFavorites() {
    let favorites = [];
    try {
      const stored = JSON.parse(window.uluuluDemoStorage.local.getItem('eight-favorites') || '[]');
      if (Array.isArray(stored)) favorites = stored.filter(id => typeof id === 'string' && /^\d+\.\d+$/.test(id));
    } catch {}
    count.textContent = String(new Set(favorites).size);
  }
  syncFavorites();
  window.addEventListener('pageshow', syncFavorites);
  window.addEventListener('storage', event => {
    if (event.key === 'eight-favorites' || event.key === null) syncFavorites();
  });
})();
