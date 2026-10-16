(() => {
  // Explicit sample holdings for the static UI; no wallet ownership is inferred.
  const {cpuIds, numbers:holdings} = window.uluuluHoldings;
  const pageSize = 5;
  let selectedNumber = '', inventoryPage = 1, sellMode = 'fixed', createdAuction = null;
  const dialog = document.createElement('dialog');
  dialog.id = 'listing-dialog';
  dialog.setAttribute('aria-labelledby', 'listing-title');
  dialog.innerHTML = `<header class="listing-head"><div><span class="listing-eyebrow">uluulu / SELL</span><h2 id="listing-title">上架靓号</h2></div><button type="button" class="listing-close" aria-label="关闭上架窗口">×</button></header>
    <section id="holdings-picker" aria-labelledby="holdings-title">
      <div class="holdings-heading"><h3 id="holdings-title">选择持有靓号</h3><span class="holding-note"><span>示例持仓</span> · 1,248</span></div>
      <div class="holdings-filters"><div class="holdings-search"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5"/><path d="m13 13 4 4"/></svg><input id="holdings-query" type="search" placeholder="搜索完整号码或部分数字" aria-label="搜索持仓号码" autocomplete="off"></div><select id="holdings-cpu" aria-label="筛选持仓 CPU"><option value="all">全部 CPU</option>${cpuIds.map(cpu=>`<option value="${cpu}">CPU #${cpu}</option>`).join('')}</select></div>
      <div class="holdings-list-head"><span>靓号</span><span>所属 CPU</span></div>
      <div id="holdings-list" role="group" aria-label="持仓号码列表"></div>
      <div class="holdings-pagination"><span id="holdings-range" aria-live="polite"></span><div><button type="button" id="holdings-prev" aria-label="上一页持仓">‹</button><label><span class="sr-only">持仓页码</span><input id="holdings-page" type="number" min="1" value="1" aria-label="持仓页码"></label><span id="holdings-pages"></span><button type="button" id="holdings-next" aria-label="下一页持仓">›</button></div></div>
      <div class="holdings-picked"><span>已选靓号</span><strong id="holdings-picked-number">尚未选择</strong></div>
      <button type="button" id="holdings-continue" class="listing-submit" disabled>设置售价<span aria-hidden="true">→</span></button>
      <p class="listing-note">号码为示例持仓；当前仅演示上架流程，不会发布真实挂单。</p>
    </section>
    <form id="listing-form" novalidate hidden>
      <p class="listing-intro">选择靓号、设置价格，即可在 uluulu 出售。</p>
      <div class="listing-chosen"><div><span>所选靓号</span><strong id="listing-chosen-number"></strong></div><button type="button" id="change-owned-number">更换号码</button></div>
      <div class="listing-draft-state" id="listing-draft-state" hidden><span>已恢复此号码的草稿</span><button type="button" id="clear-listing-draft">清空草稿</button></div><div class="seller-sale-mode" role="group" aria-label="出售方式"><button type="button" data-sell-mode="fixed" aria-pressed="true">一口价</button><button type="button" data-sell-mode="auction" aria-pressed="false">拍卖</button></div><label class="listing-label" id="seller-price-label" for="listing-price">售价</label><div class="listing-price-field"><input id="listing-price" name="price" type="text" inputmode="decimal" autocomplete="off" placeholder="0.00" aria-label="输入 BNB 价格" aria-describedby="listing-price-error" maxlength="24" required><span>BNB</span></div>
      <p class="listing-error" id="listing-price-error" role="status" hidden>请填写大于 0 的价格，最多 8 位小数。</p>
      <fieldset class="duration-field" id="fixed-sale-duration"><legend>有效期</legend><div class="duration-options">${[1,7,30,90].map(days=>`<label><input type="radio" name="listing-duration" value="${days}" ${days===7?'checked':''}><span>${days} 天</span></label>`).join('')}</div></fieldset>
      <section id="seller-auction-settings" hidden><div class="seller-buyout-field"><label for="auction-buyout-price">拍卖一口价 <span>选填</span></label><div class="listing-price-field"><input id="auction-buyout-price" type="text" inputmode="decimal" maxlength="24" autocomplete="off" placeholder="不设置则仅支持竞价" aria-label="拍卖一口价 BNB" aria-describedby="buyout-help buyout-error"><span>BNB</span></div><p id="buyout-help">买家可按此价格直接购买，无需等待拍卖结束。</p><p id="buyout-error" role="status" hidden>一口价不能低于起拍价，最多 8 位小数。</p></div><div class="auction-start-note"><span>开始时间</span><strong>发布后立即开始</strong></div><fieldset class="duration-field"><legend>拍卖时长</legend><div class="duration-options auction-duration-options">${[1,3,7].map(days=>`<label><input type="radio" name="auction-duration" value="${days}" ${days===3?'checked':''}><span>${days} 天</span></label>`).join('')}</div></fieldset><p class="seller-rule-note">规则示例：最低加价 5%，最后 5 分钟有新出价时顺延。起拍价即最低接受价。</p></section><div class="listing-expiry"><span id="seller-expiry-label">到期时间</span><time id="listing-expiry"></time></div>
      <div class="listing-form-bottom"><div class="listing-live-summary" aria-live="polite"><span id="listing-selection">选择号码并填写售价</span><strong id="listing-amount"></strong></div><button type="submit" class="listing-submit" disabled>预览上架<span aria-hidden="true">↗</span></button><p class="listing-note">号码为示例持仓；当前仅演示上架流程，不会发布真实挂单。</p></div>
    </form><section id="listing-result" hidden aria-labelledby="listing-result-title"><span class="listing-result-mark" aria-hidden="true">✓</span><h3 id="listing-result-title">上架预览已完成</h3><p>尚未发布到市场，也未发起钱包签名。</p><strong id="listed-number"></strong><dl class="listed-facts" aria-label="上架信息"><div><dt id="listed-price-label">售价</dt><dd id="listed-price"></dd></div><div><dt id="listed-duration-label">有效期</dt><dd id="listed-duration"></dd></div><div id="listed-buyout-row" hidden><dt>拍卖一口价</dt><dd id="listed-buyout"></dd></div><div id="listed-start-row" hidden><dt>开始时间</dt><dd id="listed-start"></dd></div><div><dt>到期时间</dt><dd id="listed-expiry"></dd></div><div><dt>上架市场</dt><dd>uluulu</dd></div></dl><button type="button" id="preview-created-auction" hidden>查看买家拍卖页</button><div class="listing-result-actions"><button type="button" id="listing-edit">返回修改</button><button type="button" class="listing-submit" id="listing-finish">完成</button></div></section>`;
  document.body.append(dialog);
  const find = selector => dialog.querySelector(selector);
  const form = find('form');
  const price = find('#listing-price');
  const submit = find('[type=submit]');
  let trigger, expires, rowLaunch = false, pendingSale = null;
  const drafts = new Map();
  try {
    const stored = JSON.parse(window.uluuluDemoStorage.session.getItem('uluulu-listing-drafts') || '{}');
    for (const [key,value] of Object.entries(stored)) {
      if (value && typeof value.price === 'string' && typeof value.buyout === 'string') drafts.set(key,value);
    }
  } catch {}
  const draftKey = () => `${sellMode}:${selectedNumber}`;
  function persistDrafts(){try{window.uluuluDemoStorage.session.setItem('uluulu-listing-drafts',JSON.stringify(Object.fromEntries(drafts)));}catch{}}
  function saveDraft(){
    if(!selectedNumber || !find('#listing-result').hidden)return;
    if(!price.value && !buyoutInput.value){drafts.delete(draftKey());persistDrafts();return;}
    drafts.set(draftKey(),{price:price.value,buyout:buyoutInput.value,fixedDays:find('[name=listing-duration]:checked').value,auctionDays:find('[name=auction-duration]:checked').value});persistDrafts();
  }
  function loadDraft(){
    const draft=drafts.get(draftKey());
    price.value=draft?.price||'';buyoutInput.value=draft?.buyout||'';
    const fixed=[1,7,30,90].includes(Number(draft?.fixedDays))?draft.fixedDays:'7';
    const auction=[1,3,7].includes(Number(draft?.auctionDays))?draft.auctionDays:'3';
    find(`[name=listing-duration][value="${fixed}"]`).checked=true;
    find(`[name=auction-duration][value="${auction}"]`).checked=true;
    find('#listing-draft-state').hidden=!draft;
    find('#listing-price-error').hidden=true;find('#buyout-error').hidden=true;
    price.setAttribute('aria-invalid','false');buyoutInput.setAttribute('aria-invalid','false');
  }
  find('#clear-listing-draft').onclick=()=>{drafts.delete(draftKey());persistDrafts();loadDraft();updateExpiry();update();price.focus();};
  const chosen = () => selectedNumber;
  const days = () => Number(find(sellMode==='auction'?'[name=auction-duration]:checked':'[name=listing-duration]:checked').value);
  const validPrice = () => /^(?:0|[1-9]\d*)(?:\.\d{1,8})?$/.test(price.value.trim()) && Number(price.value) > 0;
  const buyoutInput = find('#auction-buyout-price');
  const validBuyout = () => sellMode!=='auction'||!buyoutInput.value.trim()||(/^(?:0|[1-9]\d*)(?:\.\d{1,8})?$/.test(buyoutInput.value.trim())&&Number(buyoutInput.value)>0&&Number(buyoutInput.value)>=Number(price.value));
  function matchingHoldings() {
    const query = find('#holdings-query').value.trim();
    const cpu = find('#holdings-cpu').value;
    return holdings.filter(id => !window.uluuluHoldings.getSale(id) && id.includes(query) && (cpu === 'all' || id.split('.')[1] === cpu));
  }
  function renderHoldings() {
    const rows = matchingHoldings();
    const pages = Math.max(1, Math.ceil(rows.length / pageSize));
    inventoryPage = Math.min(Math.max(1, inventoryPage), pages);
    const start = (inventoryPage - 1) * pageSize;
    find('#holdings-list').innerHTML = rows.length ? rows.slice(start, start + pageSize).map(id => `<label class="holding-row"><input type="radio" name="owned-number" value="${id}" ${id===selectedNumber?'checked':''}><span class="holding-row-body"><strong>${id.split('.')[0]}<span>.${id.split('.')[1]}</span></strong><small>CPU #${id.split('.')[1]}</small><i aria-hidden="true">${id===selectedNumber?'✓':''}</i></span></label>`).join('') : '<div class="holdings-empty"><strong>没有匹配的持仓</strong><p>试试其他数字，或清除筛选。</p><button type="button" id="holdings-reset">清除筛选</button></div>';
    find('#holdings-range').textContent = rows.length ? `${start + 1}–${Math.min(start + pageSize, rows.length)} / ${rows.length.toLocaleString('en-US')}` : '0 / 0';
    find('#holdings-page').value = inventoryPage;
    find('#holdings-page').max = pages;
    find('#holdings-pages').textContent = `/ ${pages}`;
    find('#holdings-prev').disabled = inventoryPage === 1;
    find('#holdings-next').disabled = inventoryPage === pages;
  }
  function updateSelection() {
    find('#holdings-picked-number').textContent = selectedNumber || '尚未选择';
    find('#listing-chosen-number').textContent = selectedNumber;
    find('#holdings-continue').disabled = !selectedNumber;
    update();
  }
  function showPicker() {
    form.hidden = true;
    find('#listing-result').hidden = true;
    find('#holdings-picker').hidden = false;
    renderHoldings();
    updateSelection();
  }
  find('#holdings-query').addEventListener('input', () => {inventoryPage = 1; renderHoldings();});
  find('#holdings-query').addEventListener('keydown', event => {
    if(event.key === 'Escape' && event.target.value) {
      event.preventDefault(); event.stopPropagation(); event.target.value = ''; inventoryPage = 1; renderHoldings();
    }
  });
  find('#holdings-cpu').addEventListener('change', () => {inventoryPage = 1; renderHoldings();});
  find('#holdings-prev').addEventListener('click', () => {inventoryPage--; renderHoldings();});
  find('#holdings-next').addEventListener('click', () => {inventoryPage++; renderHoldings();});
  function jumpToPage() {
    const value = Number(find('#holdings-page').value);
    inventoryPage = Number.isFinite(value) ? Math.trunc(value) : 1;
    renderHoldings();
  }
  find('#holdings-page').addEventListener('change', jumpToPage);
  find('#holdings-page').addEventListener('keydown', event => {if(event.key === 'Enter'){event.preventDefault();jumpToPage();}});
  find('#holdings-list').addEventListener('change', event => {
    if(event.target.name !== 'owned-number') return;
    saveDraft();
    selectedNumber = event.target.value;
    loadDraft();
    find('#holdings-list').querySelectorAll('.holding-row').forEach(row => {
      row.querySelector('i').textContent = row.querySelector('input').checked ? '✓' : '';
    });
    updateSelection();
  });
  find('#holdings-list').addEventListener('click', event => {
    if(!event.target.closest('#holdings-reset')) return;
    find('#holdings-query').value = ''; find('#holdings-cpu').value = 'all'; inventoryPage = 1; renderHoldings(); find('#holdings-query').focus();
  });
  find('#holdings-continue').addEventListener('click', () => {
    if(!selectedNumber) return;
    find('#holdings-picker').hidden = true; form.hidden = false; updateExpiry(); price.focus();
  });
  find('#change-owned-number').addEventListener('click', () => {showPicker(); find('#holdings-query').focus();});
  function updateExpiry() {
    const start = Date.now();
    expires = new Date(start + days() * 86400000);
    find('#listing-expiry').dateTime = expires.toISOString();
    find('#listing-expiry').textContent = new Intl.DateTimeFormat(document.documentElement.lang, {timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}).format(expires);
  }
  function update() {
    const valid = validPrice();
    submit.disabled = !chosen() || !valid || !validBuyout();
    find('#buyout-error').hidden = validBuyout();
    buyoutInput.setAttribute('aria-invalid',String(!validBuyout()));
    find('#listing-selection').textContent = chosen() || '选择号码并填写售价';
    find('#listing-amount').textContent = valid ? `${price.value.trim()} BNB` : '';
    if (!find('#listing-price-error').hidden) showError();
  }
  function showError() {
    const invalid = price.value.length > 0 && !validPrice();
    find('#listing-price-error').hidden = !invalid;
    price.setAttribute('aria-invalid', String(invalid));
  }
  function open(mode, number = null) {
    if (dialog.open || (number && (!holdings.includes(number) || window.uluuluHoldings.getSale(number)))) return;
    saveDraft();
    // Save the previous draft before changing the selected number.
    selectedNumber = '';
    setSellMode(mode === 'auction' ? 'auction' : 'fixed');
    rowLaunch = !!number;
    pendingSale = null;
    selectedNumber = number || '';
    loadDraft();
    trigger = document.activeElement;
    showPicker();
    find('#change-owned-number').hidden = rowLaunch;
    if (rowLaunch) { find('#holdings-picker').hidden = true; form.hidden = false; }
    find('#listing-result > p').textContent = rowLaunch ? '完成后更新本地演示状态，不会发布真实挂单。' : '尚未发布到市场，也未发起钱包签名。';
    updateExpiry(); update();
    dialog.showModal();
    (rowLaunch ? price : find('.listing-close')).focus({preventScroll:true});
  }
  document.querySelectorAll('[data-listing-mode]').forEach(button=>button.addEventListener('click', () => open(button.dataset.listingMode)));
  window.uluuluListing = {open};
  function setSellMode(mode){
    saveDraft();
    sellMode=mode;
    loadDraft();
    find('#listing-title').textContent=mode==='auction'?'发起拍卖':'一口价上架';
    find('#holdings-continue').textContent=mode==='auction'?'设置拍卖':'设置售价';
    dialog.querySelectorAll('[data-sell-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.sellMode===mode)));
    find('#seller-price-label').textContent=mode==='auction'?'起拍价':'售价';
    find('#fixed-sale-duration').hidden=mode==='auction';
    find('#seller-auction-settings').hidden=mode!=='auction';
    find('#seller-expiry-label').textContent=mode==='auction'?'结束时间 · JST':'到期时间';
    submit.textContent=mode==='auction'?'预览拍卖':'预览上架';
    updateExpiry();update();
  }
  dialog.querySelectorAll('[data-sell-mode]').forEach(b=>b.addEventListener('click',()=>setSellMode(b.dataset.sellMode)));
  find('#preview-created-auction').addEventListener('click',()=>{if(createdAuction)window.uluuluAuctions.open(createdAuction);});
  form.addEventListener('input', () => {update();saveDraft();});
  form.addEventListener('change', event => { if(['listing-duration','auction-duration'].includes(event.target.name)) updateExpiry(); update();saveDraft(); });
  price.addEventListener('blur', showError);
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!chosen() || !validPrice() || !validBuyout() || window.uluuluHoldings.getSale(chosen())) return;
    updateExpiry();
    const auction=sellMode==='auction';
    find('#listing-result-title').textContent=auction?'拍卖预览已生成':'上架预览已完成';
    find('#listed-price-label').textContent=auction?'起拍价':'售价';
    find('#listed-duration-label').textContent=auction?'拍卖时长':'有效期';
    find('#listed-start-row').hidden=!auction;
    find('#listed-buyout-row').hidden=!auction||!buyoutInput.value.trim();
    find('#listed-buyout').textContent=buyoutInput.value.trim()+' BNB';
    find('#preview-created-auction').hidden=!auction;
    if(auction){
      const start=Date.now();
      createdAuction={id:chosen(),reserve:Number(price.value),buyout:buyoutInput.value.trim()?Number(buyoutInput.value):null,current:0,start,end:start+days()*86400000,bids:[],seller:'0x71Ac…56F0',auction:true};
      find('#listed-start').textContent=new Intl.DateTimeFormat(document.documentElement.lang,{timeZone:'Asia/Tokyo',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}).format(start)+' JST';
    }
    pendingSale = auction ? {...createdAuction, mode:'auction'} : {mode:'fixed', price:Number(price.value), end:expires.getTime()};
    find('#listed-number').textContent = chosen();
    find('#listed-price').textContent = `${price.value.trim()} BNB`;
    find('#listed-duration').textContent = `${days()} 天`;
    find('#listed-expiry').textContent = find('#listing-expiry').textContent;
    form.hidden = true;
    find('#listing-result').hidden = false;
    find('#listing-finish').focus({preventScroll:true});
  });
  find('#listing-edit').addEventListener('click', () => {
    form.hidden = false; find('#listing-result').hidden = true; updateExpiry(); price.focus();
  });
  find('#listing-finish').addEventListener('click', () => {
    if (rowLaunch && pendingSale && !window.uluuluHoldings.getSale(chosen())) window.uluuluHoldings.setSale(chosen(), pendingSale);
    pendingSale = null;
    drafts.delete(draftKey());persistDrafts();dialog.close();
  });
  find('.listing-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { saveDraft();if(trigger?.isConnected) trigger.focus({preventScroll:true});else document.querySelector(`[data-owned-number="${selectedNumber}"] button`)?.focus({preventScroll:true}); });
  dialog.addEventListener('click', event => {
    if(event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if(event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  });
})();
