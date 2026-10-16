(() => {
  // UI demo only: never access an injected provider or request a wallet signature.
  const storageKey = 'uluulu-demo-wallet';
  const demoAddress = '0x5656888800000000000000000000000000005656';
  const providers = ['MetaMask', 'OKX Wallet'];
  const readSession = () => { try { return window.uluuluDemoStorage.local.getItem(storageKey); } catch { return null; } };
  let connected = providers.includes(readSession());
  const button = document.querySelector('.header [data-wallet-open]');
  const account = document.createElement('div');
  account.className = 'wallet-account';
  button.before(account);
  account.append(button);
  const chevron = document.createElement('span');
  chevron.className = 'wallet-chevron';
  chevron.setAttribute('aria-hidden', 'true');
  chevron.textContent = '⌄';
  button.append(chevron);
  const menu = document.createElement('div');
  menu.id = 'wallet-menu';
  menu.className = 'wallet-menu';
  menu.setAttribute('role', 'menu');
  menu.setAttribute('aria-labelledby', button.id);
  menu.hidden = true;
  menu.innerHTML = `<a href="my-numbers.html" role="menuitem" data-wallet-holdings><svg viewBox="0 0 20 20" aria-hidden="true"><rect x="3" y="3" width="5" height="5" rx="1"/><rect x="12" y="3" width="5" height="5" rx="1"/><rect x="3" y="12" width="5" height="5" rx="1"/><rect x="12" y="12" width="5" height="5" rx="1"/></svg><span>我的靓号</span></a><button type="button" role="menuitem" data-wallet-disconnect><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M8 3H4v14h4M8 10h9m-4-4 4 4-4 4"/></svg><span>退出连接</span></button>`;
  account.append(menu);
  const items = [...menu.querySelectorAll('[role=menuitem]')];
  const dialog = document.createElement('dialog');
  dialog.id = 'wallet-dialog';
  dialog.setAttribute('aria-labelledby', 'wallet-dialog-title');
  dialog.setAttribute('aria-describedby', 'wallet-preview-note');
  dialog.innerHTML = `<div class="wallet-dialog-head"><h2 id="wallet-dialog-title">连接钱包</h2><button type="button" class="wallet-close" aria-label="关闭钱包选择">×</button></div>
    <p class="wallet-intro">选择钱包，在 uluulu 继续。</p>
    <div class="wallet-chain"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m8 1 7 7-7 7-7-7Z"/><path d="m8 5 3 3-3 3-3-3Z"/></svg>BNB Chain</div>
    <div class="wallet-purchase" hidden><span class="wallet-action-label">本次购买</span><div><strong class="wallet-purchase-number"></strong><span class="wallet-purchase-price"></span></div></div>
    <p class="wallet-context-note" hidden>显示金额为交易金额，不含网络费用。</p><div class="wallet-provider-list" aria-label="钱包选择预览">
      ${providers.map((name, i) => `<button class="wallet-provider" type="button" data-provider="${name}"><span class="wallet-provider-mark ${['', 'okx', 'wc'][i]}" aria-hidden="true">${['M', 'OKX', 'WC'][i]}</span><strong>${name}</strong><span class="wallet-provider-arrow" aria-hidden="true">→</span></button>`).join('')}
    </div><p class="wallet-preview-note" id="wallet-preview-note">演示模式：连接后显示示例地址，不会连接真实钱包或发起交易。</p>`;
  document.body.append(dialog);
  let trigger;
  function closeMenu(restoreFocus = false) {
    menu.hidden = true;
    if (connected) button.setAttribute('aria-expanded', 'false');
    if (restoreFocus) button.focus({preventScroll:true});
  }
  function openMenu(focusIndex) {
    if (!connected) return;
    menu.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    if (focusIndex !== undefined) items[focusIndex].focus();
  }
  function render() {
    closeMenu();
    button.querySelector('span').textContent = connected ? `${demoAddress.slice(0, 6)}…${demoAddress.slice(-4)}` : '连接钱包';
    button.classList.toggle('is-connected', connected);
    button.setAttribute('aria-haspopup', connected ? 'menu' : 'dialog');
    button.setAttribute('aria-controls', connected ? menu.id : dialog.id);
    if (connected) { button.setAttribute('aria-expanded', 'false'); button.title = demoAddress; }
    else { button.removeAttribute('aria-expanded'); button.removeAttribute('title'); }
    chevron.hidden = !connected;
    window.dispatchEvent(new CustomEvent('uluulu-wallet-change', {detail:{connected}}));
  }
  function open(purchase = null) {
    if (dialog.open) return;
    closeMenu();
    trigger = document.activeElement;
    dialog.querySelector('.wallet-purchase').hidden = !purchase;
    dialog.querySelector('.wallet-action-label').textContent = purchase?.action === 'bid' ? '本次出价' : purchase?.action === 'buyout' ? '拍卖一口价购买' : '本次购买';
    dialog.querySelector('.wallet-context-note').hidden=!purchase;
    dialog.querySelector('.wallet-purchase-number').textContent = purchase?.number || '';
    dialog.querySelector('.wallet-purchase-price').textContent = purchase?.price || '';
    dialog.showModal();
    dialog.querySelector('.wallet-close').focus({preventScroll:true});
  }
  dialog.querySelectorAll('[data-provider]').forEach(provider => provider.addEventListener('click', () => {
    connected = true;
    try { window.uluuluDemoStorage.local.setItem(storageKey, provider.dataset.provider); } catch {}
    render();
    dialog.close();
  }));
  [dialog].forEach(panel => {
    panel.querySelector('.wallet-close').addEventListener('click', () => panel.close());
    panel.addEventListener('close', () => {
      const target = trigger;
      if (target?.isConnected) target.focus({preventScroll:true});
    });
    panel.addEventListener('click', event => {
      if (event.target !== panel) return;
      const r = panel.getBoundingClientRect();
      if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) panel.close();
    });
  });
  document.addEventListener('click', event => {
    if (event.target.closest('[data-wallet-open]')) {
      if (connected && account.contains(event.target)) menu.hidden ? openMenu() : closeMenu();
      else open();
    } else if (!account.contains(event.target)) closeMenu();
  });
  document.addEventListener('focusin', event => { if (!account.contains(event.target)) closeMenu(); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) { event.preventDefault(); closeMenu(true); }
  });
  button.addEventListener('keydown', event => {
    if (connected && ['ArrowDown', 'ArrowUp'].includes(event.key)) {
      event.preventDefault(); openMenu(event.key === 'ArrowDown' ? 0 : items.length - 1);
    }
  });
  menu.addEventListener('keydown', event => {
    const index = items.indexOf(document.activeElement);
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
    items[next].focus();
  });
  menu.querySelector('[data-wallet-disconnect]').addEventListener('click', () => {
    connected = false;
    try { window.uluuluDemoStorage.local.removeItem(storageKey); } catch {}
    render(); button.focus({preventScroll:true});
  });
  window.addEventListener('storage', event => {
    if (event.key !== storageKey && event.key !== null) return;
    connected = providers.includes(readSession());
    render();
  });
  render();
  window.uluuluWallet = {open, get connected() { return connected; }, address:demoAddress};
})();
