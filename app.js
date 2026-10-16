const $ = s => document.querySelector(s);
const cpus = {'0':{name:'Genesis',type:'官方'},'1':{name:'Behemoth',type:'官方'},'30':{name:'TapeOut',type:'官方'},'888':{name:'lucky888',type:'社区'},'16':{name:'4444',type:'社区'},'231':{name:'PAYCORE',type:'已认证'}};
const listings = [
 ['5.888',1.99,'官方',false,8],
 ['888.30',3.888,'官方',true,23],
 ['7.0',100,'官方',false,36],
 ['22.888',4.99,'官方',false,42],
 ['9999.0',1.9,'uluulu',false,54],
 ['678.0',1.99,'官方',false,68],
 ['9.1',6.99,'官方',true,82],
 ['1331.30',1,'uluulu',true,97],
 ['6.888',4.99,'官方',false,108],
 ['88.0',88,'官方',false,126],
 ['4444.0',2,'uluulu',false,143],
 ['966.30',.8,'官方',true,163],
 ['282.0',.3,'官方',false,185],
 ['6.30',6.66,'官方',true,216],
 ['7.16',.1,'官方',false,242],
 ['404.0',.88,'uluulu',false,273],
 ['1234.30',.36,'uluulu',true,316],
 ['2026.0',.52,'uluulu',false,352],
 ['12345.30',.18,'官方',true,375],
 ['123456.30',.16,'uluulu',true,395],
 ['55.231',.01,'官方',false,535],
].map(([id,price,source,mining,age])=>({id,price,source,mining,age,circuit:id.split('.')[0],cpu:id.split('.')[1],digits:id.replace(/\D/g,'').length}));
window.uluuluAuctions.items.forEach(x=>listings.push({...x,price:x.current||x.reserve,source:'uluulu',mining:false,age:0,circuit:x.id.split('.')[0],cpu:x.id.split('.')[1],digits:x.id.replace(/\D/g,'').length,auction:true}));
let saved;try{saved=new Set(JSON.parse(window.uluuluDemoStorage.local.getItem('eight-favorites')||'[]'));}catch{saved=new Set()}
saved=new Set([...saved].filter(id=>listings.some(x=>x.id===id)));
let state={saleMode:'all',digits:'all',tab:'all',favorites:false,selected:'5.888',view:'grid',page:1,detailOpen:false,query:''};
const pageSize=12;
function normalizeQuery(value){
 return value.normalize('NFKC').trim().replace(/^tape:\/\//i,'').replace(/[/?#]+$/,'').replace(/\s*\.\s*/g,'.').slice(0,100);
}
function readRoute(){
 const params=new URLSearchParams(location.search);
 state.favorites=params.get('view')==='favorites';
 state.saleMode=['fixed','auction'].includes(params.get('type'))?params.get('type'):'all';
 state.tab=['official','studio'].includes(params.get('source'))?params.get('source'):'all';
 state.digits=/^[2-8]$/.test(params.get('digits'))?params.get('digits'):'all';
 state.query=normalizeQuery(params.get('q')||'');
 state.view=params.get('layout')==='table'?'table':'grid';
 state.auctionStatus=['ended','all'].includes(params.get('status'))?params.get('status'):'live';
 state.page=Math.max(1,parseInt(params.get('page'),10)||1);
 $('#cpu').value=Object.hasOwn(cpus,params.get('cpu'))?params.get('cpu'):'all';
 $('#sort').value=['low','high','new','ending'].includes(params.get('sort'))?params.get('sort'):'recommended';
 const number=params.get('number');
 state.detailOpen=!!number&&listings.some(x=>x.id===number);
 if(state.detailOpen){state.selected=number;state.query=number;const item=listings.find(x=>x.id===number);if(item.auction&&item.end<=Date.now())state.auctionStatus='ended';}
}
function syncRoute(){
 const params=new URLSearchParams();
 if(state.favorites)params.set('view','favorites');
 if(state.saleMode!=='all')params.set('type',state.saleMode);
 if(state.tab!=='all')params.set('source',state.tab);
 if(state.digits!=='all')params.set('digits',state.digits);
 if($('#cpu').value!=='all')params.set('cpu',$('#cpu').value);
 if(state.query)params.set('q',state.query);
 if(state.view!=='grid')params.set('layout',state.view);
 if($('#sort').value!=='recommended')params.set('sort',$('#sort').value);
 if(state.auctionStatus!=='live')params.set('status',state.auctionStatus);
 if(state.page>1)params.set('page',state.page);
 const url=new URL(location.href);
 url.search=params.toString();
 if(location.href!==url.href){try{history.replaceState(null,'',url.href)}catch{/* Local file URL restrictions must not interrupt the demo. */}}
}
readRoute();

const marketRows=()=>state.tab==='all'?listings:listings.filter(x=>x.source===(state.tab==='official'?'官方':'uluulu'));
const money = n => n.toLocaleString('en-US',{maximumFractionDigits:8});
const dollars = n => '$'+(n*608.42).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const numberHTML = x => `<span class="number-value ${x.digits>6?'long-number':''}">${x.circuit}<span class="suffix">.${x.cpu}</span></span>`;
const sourceHTML = x => `<span class="row-source"><i class="source-icon ${x.source==='官方'?'official':'studio'}" aria-hidden="true">${x.source==='官方'?'T':'u'}</i>${x.source==='官方'?'官方市场':'uluulu'}</span>`;
const favoriteHTML = x => `<button class="fav ${saved.has(x.id)?'saved':''}" data-favorite="${x.id}" aria-label="${saved.has(x.id)?'取消收藏':'收藏'} ${x.id}" aria-pressed="${saved.has(x.id)}">${saved.has(x.id)?'★':'☆'}</button>`;
function syncFilters(){
 $('#digits').value=state.digits;
 $('#market-source').value=state.tab;
 $('#market-source').classList.toggle('has-value',state.tab!=='all');
 $('#panel-cpu').value=$('#cpu').value;
 $('#panel-source').value=state.tab;
 $('#market-query-form').hidden=!state.query;
 $('#market-query').value=state.query;
 $('#auction-state-filter').hidden=state.saleMode!=='auction';
 $('#auction-state').value=state.auctionStatus;
 document.querySelectorAll('.view-switch button').forEach(b=>{b.classList.toggle('active',b.id===state.view+'-view');b.setAttribute('aria-pressed',String(b.id===state.view+'-view'));});
 $('#panel-digits').value=state.digits;
 const count=Number($('#cpu').value!=='all')+Number(state.digits!=='all')+Number(state.tab!=='all');
 $('#filter-count').textContent=count;
 $('#filter-count').hidden=!count;
 $('#reset').hidden=!count&&!state.query;
 $('#cpu').classList.toggle('has-value',$('#cpu').value!=='all');
 $('#digits').classList.toggle('has-value',state.digits!=='all');
}
function filtered(){const q=state.query.toLowerCase().trim();const cpuQuery=q.match(/^(?:cpu\s*#?\s*|#)(\d+)$/i);let rows=marketRows().filter(x=>(state.saleMode==='all'||(state.saleMode==='auction'?x.auction:!x.auction))&&(state.saleMode!=='auction'||state.auctionStatus==='all'||(state.auctionStatus==='ended'?x.end<=Date.now():x.end>Date.now()))&&x.digits>=2&&x.digits<=8&&(state.digits==='all'||x.digits===Number(state.digits))&&($('#cpu').value==='all'||x.cpu===$('#cpu').value)&&(!state.favorites||saved.has(x.id))&&(!q||(cpuQuery?x.cpu===cpuQuery[1]:`${x.id} ${x.cpu} ${cpus[x.cpu].name} ${x.cpu==='0'?'创世':x.cpu==='1'?'巨兽':''}`.toLowerCase().includes(q))));const sort=$('#sort').value;if(sort==='low')rows.sort((a,b)=>a.price-b.price);else if(sort==='high')rows.sort((a,b)=>b.price-a.price);else if(sort==='new')rows.sort((a,b)=>a.age-b.age);else if(sort==='ending')rows.sort((a,b)=>(a.auction&&a.end>Date.now()?a.end:Infinity)-(b.auction&&b.end>Date.now()?b.end:Infinity));return rows;}
function renderMarketGuidance(){
 const title=state.saleMode==='auction'?'拍卖':state.saleMode==='fixed'?'一口价':'全部靓号';
 let description;
 if(state.tab==='official') description='官方市场仅支持一口价，购买前往 TapeOut 电路市场。';
 else if(state.saleMode==='auction') description='在 uluulu 参与竞价；设有一口价的拍卖也可直接购买。';
 else if(state.saleMode==='fixed') description=state.tab==='studio'
   ?'按标价购买 uluulu 靓号，连接钱包后即可继续。'
   :'按标价购买。官方号码前往 TapeOut，uluulu 号码连接钱包购买。';
 else description=state.tab==='studio'
   ?'浏览 uluulu 的一口价与拍卖靓号，连接钱包后购买或出价。'
   :'浏览一口价与拍卖靓号。官方号码在 TapeOut 购买，uluulu 号码在本站交易。';
 $('#market-guidance').innerHTML=`<span class="route-symbol" aria-hidden="true">↗</span><strong>${title}</strong><span>${description}</span>`;
}
function render(){document.querySelector('#recent-sales').hidden=state.favorites;if(state.tab==='official'&&state.saleMode==='auction')state.saleMode='fixed';$('#open-auction-listing').disabled=state.tab==='official';$('#open-auction-listing').title=state.tab==='official'?'拍卖仅在 uluulu 市场提供':'';syncFilters();document.querySelectorAll('[data-sale-mode]').forEach(b=>{b.classList.toggle('active',b.dataset.saleMode===state.saleMode);b.setAttribute('aria-selected',String(b.dataset.saleMode===state.saleMode));b.tabIndex=b.dataset.saleMode===state.saleMode?0:-1;b.disabled=state.tab==='official'&&b.dataset.saleMode==='auction';b.title=state.tab==='official'&&b.dataset.saleMode==='auction'?'官方市场仅支持一口价':'';});const rows=filtered();const pages=Math.max(1,Math.ceil(rows.length/pageSize));state.page=Math.min(state.page,pages);const visible=rows.slice((state.page-1)*pageSize,state.page*pageSize);if(visible.length&&!visible.some(x=>x.id===state.selected))state.selected=visible[0].id;$('#result-count').textContent=rows.length;$('#panel-result-count').textContent=rows.length;const scopeRows=marketRows().filter(x=>!state.favorites||saved.has(x.id));$('#total-count').textContent=scopeRows.filter(x=>state.saleMode==='all'||(state.saleMode==='auction'?x.auction:!x.auction)).length;$('#all-market-count').textContent=scopeRows.length;$('#fixed-market-count').textContent=scopeRows.filter(x=>!x.auction).length;$('#auction-market-count').textContent=scopeRows.filter(x=>x.auction).length;$('#favorites-scope').hidden=!state.favorites;renderMarketGuidance();$('#nav-count').textContent=saved.size;document.querySelectorAll('[data-tab]').forEach(b=>{b.classList.toggle('active',b.dataset.tab===state.tab);b.setAttribute('aria-selected',b.dataset.tab===state.tab)});document.querySelectorAll('[data-nav]').forEach(b=>{const active=b.dataset.nav===(state.favorites?'favorites':'market');b.classList.toggle('active',active);if(active)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});if(!visible.length){
 const noFavorites=state.favorites&&!saved.size;
 const title=noFavorites?'这里还没有收藏':state.favorites?'当前筛选下没有收藏':'没有找到匹配的靓号';
 const copy=noFavorites?'点击号码旁的星标，把心仪的靓号收在这里。':state.favorites?'你已有收藏，清除筛选即可查看。':'试试其他号码，或调整 CPU 与数字位数。';
 $('#listing-container').innerHTML=`<div class="empty"><strong>${title}</strong><p>${copy}</p><button ${noFavorites?'data-browse-market':'data-reset'}>${noFavorites?'浏览市场':'清除筛选'}</button></div>`;
}else if(state.view==='table'){$('#listing-container').innerHTML=`<table class="list-table"><thead><tr><th><span aria-hidden="true">☆</span></th><th>靓号 / CPU</th><th>数字位数</th><th>来源</th><th>价格 / 出价</th><th></th></tr></thead><tbody>${visible.map(x=>`<tr class="${state.detailOpen&&state.selected===x.id?'selected':''}" data-select="${x.id}"><td>${favoriteHTML(x)}</td><td><button class="number-button" data-select="${x.id}" aria-label="查看靓号 ${x.id}">${numberHTML(x)}</button><div class="number-meta">${cpus[x.cpu].name} · #${x.cpu}</div><span class="row-sale-type">${x.auction?'拍卖':'一口价'}</span></td><td><span class="digit-value">${x.digits} 位数</span><span class="row-sub">${x.mining?'↗ 可挖矿':'收藏 · 链上网址'}</span></td><td class="row-market-status">${sourceHTML(x)}<span class="row-sub">${x.auction?window.uluuluAuctions.cardStatus(x):x.age<60?x.age+' 分钟前':Math.floor(x.age/60)+' 小时前'}</span></td><td class="row-price"><span class="row-sub">${x.auction?window.uluuluAuctions.priceLabel(x):'一口价'}</span>${money(x.price)} <small>BNB</small><span class="row-sub price-estimate">≈ ${dollars(x.price)}</span>${x.auction&&x.buyout&&x.end>Date.now()?`<span class="row-sub row-buyout"><span>拍卖一口价</span> ${money(x.buyout)} BNB</span>`:''}</td><td><button class="row-arrow" data-select="${x.id}" aria-label="打开 ${x.id} 详情">↗</button></td></tr>`).join('')}</tbody></table>`}else{$('#listing-container').innerHTML=`<div class="grid-list">${visible.map(x=>`<article class="grid-card ${state.detailOpen&&state.selected===x.id?'selected':''}" data-select="${x.id}"><div class="card-art"><span class="card-sale-type ${x.auction?'is-auction':'is-fixed'}">${x.auction?'拍卖':'一口价'}</span><div class="card-kicker"><span>CPU #${x.cpu}</span><span>${x.digits} 位数字</span></div>${favoriteHTML(x)}<button class="number-button" data-select="${x.id}" aria-label="查看靓号 ${x.id}">${numberHTML(x)}</button><div class="number-meta">${cpus[x.cpu].name}</div></div>${x.auction?window.uluuluAuctions.cardFooter(x):`<div class="card-bottom">${sourceHTML(x)}<span class="row-price"><span class="price-caption">一口价</span>${money(x.price)} <small>BNB</small></span></div>`}</article>`).join('')}</div>`}$('#range-label').textContent=rows.length?`展示 ${(state.page-1)*pageSize+1}–${Math.min(state.page*pageSize,rows.length)} / ${rows.length}`:'暂无结果';$('#page-label').textContent=`${state.page} / ${pages}`;$('#prev').disabled=state.page===1;$('#next').disabled=state.page===pages;syncRoute();if(state.detailOpen&&rows.length)renderDetail();}

function renderDetail(){
 const x=listings.find(x=>x.id===state.selected);
 if(x.auction){state.detailOpen=false;window.uluuluAuctions.open(x);return;}
 const official=x.source==='官方';
 const dialog=$('#modal');
 dialog.classList.add('number-dialog');
 dialog.removeAttribute('aria-label');
 dialog.setAttribute('aria-labelledby','detail-label detail-number');
 dialog.setAttribute('aria-describedby','detail-destination');
 dialog.querySelector('.eyebrow').innerHTML=sourceHTML(x);
 $('#modal-done').hidden=true;
 $('#modal-content').innerHTML=`<span class="sr-only" id="detail-label">靓号详情</span>
 <div class="quick-number"><h2 id="detail-number">${numberHTML(x)}</h2><div class="detail-address"><span>tape://${x.id}</span><button type="button" data-copy-address="${x.id}" aria-label="复制地址">⧉</button></div><div class="quick-tags"><span>${x.digits} 位数字</span><span aria-hidden="true">·</span><span>BNB Chain</span></div></div>
 <div class="quick-purchase"><div class="quick-price"><div><span class="quick-label">当前挂单价</span><strong>${money(x.price)} <small>BNB</small></strong></div><span class="quick-route">${official?'站外交易':'uluulu'}</span></div>
 <button class="primary" id="purchase">${official?'前往 Tapeout 电路市场':'连接钱包购买'}<span aria-hidden="true">${official?'↗':'→'}</span></button>
 <p id="detail-destination">${official?'在 Tapeout 完成购买，价格与可售状态以官方市场为准。':'在 uluulu 完成购买，连接 BNB Chain 钱包继续。'}</p></div>
 <dl class="quick-facts"><div><dt>所属 CPU</dt><dd>${cpus[x.cpu].name}<span>#${x.cpu}</span></dd></div><div><dt>电路编号</dt><dd>#${x.circuit}</dd></div><div><dt>挖矿能力</dt><dd>${x.mining?'可挖矿':'不可挖矿'}</dd></div></dl>
 <div class="quick-footer"><span>静态 UI 预览，尚未接入交易</span><button class="quick-save" data-favorite="${x.id}" aria-pressed="${saved.has(x.id)}" aria-label="${saved.has(x.id)?'取消收藏':'收藏'} ${x.id}"><span aria-hidden="true">${saved.has(x.id)?'★':'☆'}</span>${saved.has(x.id)?'已收藏':'收藏号码'}</button></div>`;
 if(!dialog.open)dialog.showModal();
 $('#close-modal').focus({preventScroll:true});
}
let toastTimer;function toast(text){$('#toast').textContent=text;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),2600)}
function clearConditions(){state.saleMode='all';state.tab='all';state.digits='all';state.page=1;state.query='';state.auctionStatus='live';state.detailOpen=false;$('#cpu').value='all';$('#sort').value='recommended';}
function reset(){clearConditions();render()}
function showModal(html){
 const dialog=$('#modal');
 dialog.classList.remove('number-dialog');
 dialog.removeAttribute('aria-labelledby');
 dialog.removeAttribute('aria-describedby');
 dialog.setAttribute('aria-label',document.documentElement.lang==='en'?'Purchase preview':'购买预览');
 dialog.querySelector('.eyebrow').textContent='uluulu MARKET';
 $('#modal-content').innerHTML=html;
 $('#modal-done').hidden=false;
 $('#modal-done').textContent=state.detailOpen?'返回靓号详情':'知道了';
 if(!dialog.open)dialog.showModal();
 $('#close-modal').focus({preventScroll:true});
}
function showWalletPreview(x){window.uluuluWallet.open(x?{number:x.id,price:money(x.price)+' BNB'}:null)}
$('#favorites-scope').onclick=()=>{state.favorites=false;state.page=1;render()};
document.addEventListener('click',e=>{const fav=e.target.closest('[data-favorite]');if(fav){const inDetail=fav.closest('#modal');const inAuction=fav.closest('#auction-dialog');const id=fav.dataset.favorite;saved.has(id)?saved.delete(id):saved.add(id);try{window.uluuluDemoStorage.local.setItem('eight-favorites',JSON.stringify([...saved]))}catch{}render();if(inDetail)$('#modal [data-favorite]')?.focus({preventScroll:true});if(inAuction){fav.setAttribute('aria-pressed',String(saved.has(id)));fav.setAttribute('aria-label',(saved.has(id)?'取消收藏':'收藏')+' '+id);fav.textContent=saved.has(id)?'★':'☆';}return}const select=e.target.closest('[data-select]');if(select){state.selected=select.dataset.select;state.detailOpen=true;document.querySelectorAll('.grid-card,.list-table tr').forEach(el=>el.classList.toggle('selected',el.dataset.select===state.selected));renderDetail();return}const digit=e.target.closest('[data-digits]');if(digit){state.digits=digit.dataset.digits;state.page=1;render();return}const tab=e.target.closest('[data-tab]');if(tab){state.tab=tab.dataset.tab;if(state.tab==='official')state.saleMode='fixed';state.page=1;state.detailOpen=false;render();return}const nav=e.target.closest('[data-nav]');if(nav){state.favorites=nav.dataset.nav==='favorites';clearConditions();render();return}if(e.target.closest('[data-browse-market]')){state.favorites=false;reset();return}if(e.target.closest('[data-reset]'))reset();if(e.target.closest('#purchase')){const x=listings.find(x=>x.id===state.selected);if(x.source==='官方'){showModal(`<div class="route-modal-icon" aria-hidden="true">↗</div><h2>前往 Tapeout 电路市场</h2><p>你选择的号码来自官方市场，购买将在 Tapeout 完成。</p><div class="purchase-summary"><strong>${x.id}</strong><span>${money(x.price)} BNB</span></div><div class="destination-preview"><span>交易目的地</span><strong>Tapeout <span>电路市场 ↗</span></strong></div><p class="prototype-note">跳转界面预览，暂不打开外部网站。</p>`)}else{showWalletPreview(x)}} });
['#cpu','#sort'].forEach(s=>$(s).addEventListener('change',()=>{state.page=1;render()}));$('#reset').onclick=reset;$('#prev').onclick=()=>{state.page--;render()};$('#next').onclick=()=>{state.page++;render()};$('#refresh').onclick=()=>{render();toast(`演示列表已更新，共 ${listings.length} 条样例挂单`)};$('#close-modal').onclick=()=>$('#modal').close();$('#modal-done').onclick=()=>{if(state.detailOpen)renderDetail();else $('#modal').close()};$('#modal').addEventListener('close',()=>{const wasDetail=state.detailOpen;state.detailOpen=false;document.querySelectorAll('.grid-card.selected,.list-table tr.selected').forEach(el=>el.classList.remove('selected'));if(wasDetail)document.querySelector(`.number-button[data-select="${state.selected}"]`)?.focus({preventScroll:true})});$('#modal').addEventListener('click',e=>{if(e.target===$('#modal')){const r=$('#modal').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('#modal').close()}});['table','grid'].forEach(v=>$('#'+v+'-view').onclick=()=>{state.view=v;document.querySelectorAll('.view-switch button').forEach(b=>{b.classList.toggle('active',b.id===v+'-view');b.setAttribute('aria-pressed',b.id===v+'-view')});render()});
function drawChart(period){const values=period==='7'?[17,19,16,23,22,21,25,21,22,20,24,29,25,28,27,29,23,24,30,26,31,28,34,35,29,32,34,39]:[8,12,10,15,11,18,21,15,20,17,23,25,20,18,26,21,28,24,26,30,27,34,29,32,28,35,33,39];const points=values.map((v,i)=>`${i*12.2},${77-v*1.55}`).join(' ');$('#trend-chart').innerHTML=`<path d="M0 24H350M0 50H350M0 77H350" stroke="var(--border)" stroke-width=".6" stroke-dasharray="2 4"/><path d="M0 77 L${points.replaceAll(' ',' L')} L329.4 77Z" fill="var(--accent)" opacity=".055"/>${values.map((v,i)=>`<rect x="${i*12.2}" y="${80-v*.65}" width="4" height="${v*.65}" fill="var(--accent)" opacity=".13"/>`).join('')}<polyline points="${points}" fill="none" stroke="var(--accent-ink)" stroke-width="1.6" stroke-linejoin="round"/><circle cx="329.4" cy="16.55" r="2.7" fill="var(--accent-ink)"/>`;$('#trend-chart').setAttribute('aria-label',period+'日演示成交额走势图');$('#chart-start').textContent=period==='7'?'10/05':'09/12';document.querySelectorAll('[data-period]').forEach(b=>b.classList.toggle('active',b.dataset.period===period))}
document.querySelectorAll('[data-period]').forEach(b=>b.onclick=()=>drawChart(b.dataset.period));drawChart('7');render();

$('#digits').addEventListener('change',()=>{state.digits=$('#digits').value;state.page=1;render()});
$('#panel-cpu').addEventListener('change',()=>{$('#cpu').value=$('#panel-cpu').value;state.page=1;render()});
$('#panel-digits').addEventListener('change',()=>{state.digits=$('#panel-digits').value;state.page=1;render()});
$('#filters-done').onclick=()=>{$('#all-filters').open=false;$('#all-filters summary').focus()};
document.addEventListener('click',e=>{if(!e.target.closest('#all-filters'))$('#all-filters').open=false});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#all-filters').open){$('#all-filters').open=false;$('#all-filters summary').focus()}});

document.querySelectorAll('[data-sale-mode]').forEach(button=>button.addEventListener('click',()=>{state.saleMode=button.dataset.saleMode;state.page=1;state.detailOpen=false;document.querySelectorAll('[data-sale-mode]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-selected',String(b===button));});render();}));

$('#market-source').addEventListener('change',()=>{state.tab=$('#market-source').value;state.page=1;state.detailOpen=false;render();});

$('#market-query-form').addEventListener('submit',event=>{event.preventDefault();state.query=normalizeQuery($('#market-query').value);state.page=1;render();});
$('#clear-query').onclick=()=>{state.query='';state.page=1;render();};
$('#panel-source').onchange=()=>{state.tab=$('#panel-source').value;state.page=1;render();};
$('#auction-state').onchange=()=>{state.auctionStatus=$('#auction-state').value;state.page=1;render();};
$('#toggle-metrics').onclick=()=>{const expanded=$('.overview').classList.toggle('is-expanded');$('#toggle-metrics').setAttribute('aria-expanded',String(expanded));$('#toggle-metrics').textContent=expanded?'收起行情':'更多行情';};
$('.market-tabs').addEventListener('keydown',event=>{
 if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
 const tabs=[...document.querySelectorAll('[data-sale-mode]:not(:disabled)')];
 const index=tabs.indexOf(document.activeElement);if(index<0)return;
 event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
 tabs[next].click();tabs[next].focus();
});
window.addEventListener('popstate',()=>{document.querySelectorAll('dialog[open]').forEach(d=>d.close());readRoute();render();});
window.uluuluMarket={isSaved:id=>saved.has(id),hasListing:id=>listings.some(x=>x.id===id)};

