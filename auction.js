(() => {
  const items = window.uluuluAuctionItems;
  const amount = n => Number(n).toLocaleString('en-US',{maximumFractionDigits:8});
  const status = x => Date.now()<x.start?'scheduled':Date.now()>=x.end?'ended':'live';
  const statusText = x => ({scheduled:'即将开始',ended:x.current?'已结束 · 待结算':'已结束 · 无人出价',live:'正在拍卖'})[status(x)];
  const priceLabel = x => status(x)==='ended'?(x.current?'最终出价':'起拍价'):(x.current?'当前最高价':'起拍价');
  const minBid = x => {
    if(!x.current)return x.reserve;
    const units=BigInt(Math.round(x.current*1e8));
    return Number((units*105n+99n)/100n)/1e8;
  };
  const date = timestamp => new Intl.DateTimeFormat(document.documentElement.lang,{timeZone:'Asia/Tokyo',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).format(timestamp);
  function clock(end) {
    const seconds=Math.max(0,Math.ceil((end-Date.now())/1000));
    const days=Math.floor(seconds/86400),h=Math.floor(seconds%86400/3600),m=Math.floor(seconds%3600/60),s=seconds%60;
    return `${days?days+'d ':''}${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }
  const timeHTML = x => `<span class="auction-clock" data-auction-clock data-start="${x.start}" data-end="${x.end}">${status(x)==='ended'?'已结束':clock(status(x)==='scheduled'?x.start:x.end)}</span>`;
  const cardStatus = x => `<span class="auction-card-state" data-auction-status data-start="${x.start}" data-end="${x.end}" data-has-bids="${!!x.current}">${statusText(x)}</span>${status(x)==='ended'?'':' · '+timeHTML(x)}`;
  const cardFooter = x => `<div class="auction-card-bottom"><div class="auction-card-status">${cardStatus(x)}</div><div class="auction-card-price"><div><span>${priceLabel(x)}</span><strong>${amount(x.current||x.reserve)} <small>BNB</small></strong></div><span class="auction-bid-count"><b>${x.bids.length}</b> <span>次出价</span></span></div>${x.buyout&&status(x)!=='ended'?`<div class="auction-card-buyout"><span>拍卖一口价</span><b>${amount(x.buyout)} <small>BNB</small></b></div>`:''}<span class="auction-card-source">uluulu</span></div>`;
  const dialog=document.createElement('dialog');
  dialog.id='auction-dialog';
  dialog.setAttribute('aria-labelledby','auction-number');
  dialog.innerHTML='<div id="auction-content"></div>';
  document.body.append(dialog);
  const find=s=>dialog.querySelector(s);
  let active, trigger, bidDraft='';
  const canBuyout = () => !!active?.buyout && status(active)==='live';
  const reachesBuyout = () => canBuyout() && Number(bidDraft)>=active.buyout;
  function isValid(){return /^(?:0|[1-9]\d*)(?:\.\d{1,8})?$/.test(bidDraft)&&(Number(bidDraft)>=minBid(active)||reachesBuyout())&&status(active)==='live';}
  const head=()=>`<div class="auction-dialog-head"><span class="listing-eyebrow">uluulu / AUCTION</span><button type="button" class="listing-close" data-auction-close aria-label="关闭拍卖详情">×</button></div><div class="auction-identity"><span class="auction-state">${statusText(active)}</span><h2 id="auction-number">${active.id.split('.')[0]}<span>.${active.id.split('.')[1]}</span></h2><p>tape://${active.id}<span>BNB Chain</span></p><div class="auction-detail-tools"><button type="button" data-copy-address="${active.id}" aria-label="复制地址">⧉</button>${window.uluuluMarket?.hasListing(active.id)?`<button type="button" data-favorite="${active.id}" aria-label="${window.uluuluMarket.isSaved(active.id)?'取消收藏':'收藏'} ${active.id}" aria-pressed="${window.uluuluMarket.isSaved(active.id)}">${window.uluuluMarket.isSaved(active.id)?'★':'☆'}</button>`:''}</div></div>`;
  function renderDetail(){
    const s=status(active);
    dialog.classList.toggle('has-buyout',canBuyout());
    find('#auction-content').innerHTML=`${head()}<div class="auction-key-facts"><div><span>${priceLabel(active)}</span><strong>${amount(active.current||active.reserve)} <small>BNB</small></strong></div><div><span>${s==='scheduled'?'距离开始':s==='ended'?'结束时间':'距离结束'}</span><strong>${s==='ended'?date(active.end):timeHTML(active)}</strong></div></div>
    ${canBuyout()?`<section class="auction-buyout-offer"><div><span>拍卖一口价</span><strong>${amount(active.buyout)} <small>BNB</small></strong><p>无需等待拍卖结束</p></div><button type="button" id="buyout-now">立即购买<span aria-hidden="true">↗</span></button></section>`:''}
    ${s==='live'?`<form id="bid-form"><label for="auction-bid">你的出价</label><div class="auction-bid-input"><input id="auction-bid" type="text" inputmode="decimal" autocomplete="off" maxlength="24" placeholder="${amount(minBid(active))}" aria-describedby="bid-minimum bid-error" value="${bidDraft}"><span>BNB</span></div><div class="bid-minimum-row"><span id="bid-minimum"><span>最低出价</span> <b>${amount(minBid(active))} BNB</b></span><button type="button" id="use-minimum">使用最低价</button></div><p id="bid-error" role="status" hidden>请输入不低于最低出价的金额，最多 8 位小数。</p><p id="bid-buyout-hint" hidden>已达到拍卖一口价，将按一口价购买。</p><button type="submit" class="auction-primary" id="review-bid" ${isValid()?'':'disabled'}>预览出价<span aria-hidden="true">→</span></button></form>`:`<div class="auction-closed-note">${s==='scheduled'?'拍卖尚未开始，开始后即可出价。':active.current?'竞价已结束，等待买卖双方完成结算。':'本次拍卖无人出价，号码未售出。'}</div>`}
    <details class="auction-history" ${canBuyout()?'':'open'}><summary class="auction-section-heading"><span>出价记录</span><span>${active.bids.length} <span>次出价</span>⌄</span></summary>${active.bids.length?`<ol>${active.bids.map(([wallet,price,age])=>`<li><div><strong>${wallet}</strong><span>${age}</span></div><b>${amount(price)} <small>BNB</small></b></li>`).join('')}</ol>`:'<p class="auction-no-bids">暂无出价，成为第一位竞拍者。</p>'}</details>
    <details class="auction-rules"><summary>拍卖规则与详情</summary><dl><div><dt>卖家</dt><dd>${active.seller}</dd></div><div><dt>开始时间</dt><dd>${date(active.start)} JST</dd></div><div><dt>结束时间</dt><dd>${date(active.end)} JST</dd></div><div><dt>起拍价</dt><dd>${amount(active.reserve)} BNB</dd></div><div><dt>最低加价</dt><dd>5%</dd></div>${active.buyout?`<div><dt>拍卖一口价</dt><dd>${amount(active.buyout)} BNB</dd></div>`:''}</dl><p>规则示例：最后 5 分钟有新出价，结束时间顺延至该次出价后的 5 分钟。正式规则以合约为准。</p></details><p class="auction-prototype-note">拍卖、钱包地址和出价记录均为演示数据，不会发起真实交易。</p>`;
  }
  function open(item){
    active=item;trigger=document.activeElement;bidDraft='';dialog.dataset.phase=status(active);renderDetail();
    if(!dialog.open)dialog.showModal();find('[data-auction-close]').focus({preventScroll:true});
  }
  function renderReview(){
    if(!isValid())return;
    if(reachesBuyout()){renderBuyoutReview();return;}
    find('#auction-content').innerHTML=`${head()}<section class="bid-review"><h3>确认你的出价</h3><div class="bid-review-amount">${amount(bidDraft)} <small>BNB</small></div><dl><div><dt>最低出价</dt><dd>${amount(minBid(active))} BNB</dd></div><div><dt>网络费用</dt><dd>以钱包确认为准</dd></div><div><dt>平台费</dt><dd>待公布</dd></div></dl><p>当前仅预览出价。连接钱包并确认后，才会提交链上竞价。</p><button type="button" class="auction-primary" id="wallet-bid">连接钱包出价</button><button type="button" class="auction-back" id="edit-bid">返回修改</button></section><p class="auction-prototype-note">拍卖、钱包地址和出价记录均为演示数据，不会发起真实交易。</p>`;
    find('#wallet-bid').focus({preventScroll:true});
  }
  function renderBuyoutReview(){
    if(!canBuyout())return;
    find('#auction-content').innerHTML=`${head()}<section class="bid-review buyout-review"><h3>确认一口价购买</h3><div class="bid-review-amount">${amount(active.buyout)} <small>BNB</small></div><p class="buyout-delivery">无需等待拍卖结束。交易确认后，拍卖立即结束，靓号转入你的钱包。</p><dl><div><dt>购买方式</dt><dd>拍卖一口价</dd></div><div><dt>网络费用</dt><dd>以钱包确认为准</dd></div><div><dt>平台费</dt><dd>待公布</dd></div></dl><button type="button" class="auction-primary" id="wallet-buyout">连接钱包购买</button><button type="button" class="auction-back" id="edit-bid">返回拍卖详情</button></section><p class="auction-prototype-note">当前仅为购买预览，不会扣款、结束拍卖或转移靓号。</p>`;
    find('#wallet-buyout').focus({preventScroll:true});
  }
  function syncBidInput(){
    find('#review-bid').disabled=!isValid();
    find('#review-bid').textContent=reachesBuyout()?'按一口价购买':'预览出价';
    find('#bid-error').hidden=!bidDraft||isValid();
    find('#bid-buyout-hint').hidden=!reachesBuyout();
    find('#auction-bid').setAttribute('aria-invalid',String(!!bidDraft&&!isValid()));
  }
  dialog.addEventListener('input',event=>{
    if(event.target.id!=='auction-bid')return;
    bidDraft=event.target.value.trim();
    syncBidInput();
  });
  dialog.addEventListener('submit',event=>{event.preventDefault();renderReview();});
  dialog.addEventListener('click',event=>{
    if(event.target.closest('[data-auction-close]'))dialog.close();
    if(event.target.closest('#use-minimum')){bidDraft=String(minBid(active));find('#auction-bid').value=bidDraft;syncBidInput();find('#auction-bid').focus();}
    if(event.target.closest('#edit-bid')){renderDetail();if(find('#auction-bid'))syncBidInput();find('#auction-bid')?.focus();}
    if(event.target.closest('#buyout-now'))renderBuyoutReview();
    if(event.target.closest('#wallet-buyout')&&canBuyout())window.uluuluWallet.open({number:active.id,price:amount(active.buyout)+' BNB',action:'buyout'});
    if(event.target.closest('#wallet-bid')&&isValid())window.uluuluWallet.open({number:active.id,price:amount(bidDraft)+' BNB',action:'bid'});
    if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}
  });
  dialog.addEventListener('close',()=>{document.querySelectorAll('.grid-card.selected,.list-table tr.selected').forEach(e=>e.classList.remove('selected'));if(trigger?.isConnected)trigger.focus({preventScroll:true});});
  function tick(){
    document.querySelectorAll('[data-auction-clock]').forEach(el=>{
      const start=Number(el.dataset.start),end=Number(el.dataset.end);
      const value=Date.now()>=end?'已结束':clock(Date.now()<start?start:end);
      if(el.dataset.clockValue!==value){el.dataset.clockValue=value;el.textContent=value;}
    });
    document.querySelectorAll('[data-auction-status]').forEach(el=>{
      const text=statusText({start:Number(el.dataset.start),end:Number(el.dataset.end),current:el.dataset.hasBids==='true'?1:0});
      // Update only on a phase transition, keeping localization stable.
      const phase=status({start:Number(el.dataset.start),end:Number(el.dataset.end)});
      if(el.dataset.phase!==phase){el.dataset.phase=phase;el.textContent=text;}
    });
    if(dialog.open&&active){
      if(find('#review-bid'))find('#review-bid').disabled=!isValid();
      if(find('#wallet-bid'))find('#wallet-bid').disabled=!isValid();
      if(find('#wallet-buyout'))find('#wallet-buyout').disabled=!canBuyout();
      if(find('#buyout-now'))find('#buyout-now').disabled=!canBuyout();
      if(dialog.dataset.phase&&dialog.dataset.phase!==status(active))renderDetail();
      dialog.dataset.phase=status(active);
    }
  }
  setInterval(tick,1000);
  window.uluuluAuctions={items,open,cardStatus,cardFooter,priceLabel};
  document.addEventListener('click', async event => {
    const button=event.target.closest('[data-copy-address]');if(!button)return;
    try {
      await navigator.clipboard.writeText('tape://'+button.dataset.copyAddress);
      button.textContent='✓';button.setAttribute('aria-label','地址已复制');button.title='地址已复制';
    } catch {
      button.setAttribute('aria-label','复制失败，请手动复制地址');button.title='复制失败，请手动复制地址';
    }
    setTimeout(()=>{if(button.isConnected){button.textContent='⧉';button.setAttribute('aria-label','复制地址');button.removeAttribute('title');}},2000);
  });
})();
