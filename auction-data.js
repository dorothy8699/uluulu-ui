(() => {
  // Keep the static demo countdown consistent when navigating between pages.
  let epoch = Date.now();
  try {
    const saved = Number(window.uluuluDemoStorage.session.getItem('uluulu-auction-demo-epoch'));
    if (saved > 0 && saved <= epoch && epoch - saved < 86400000) epoch = saved;
    else window.uluuluDemoStorage.session.setItem('uluulu-auction-demo-epoch', String(epoch));
  } catch {}
  const items = [
    {id:'66.888',reserve:1,buyout:3.8,current:1.65,start:epoch-86400000,end:epoch+7384000,bids:[['0x8A4f…91C2',1.65,'5分钟前'],['0xF29a…B708',1.5,'18分钟前'],['0x3c62…74Ab',1.25,'2天前']]},
    {id:'99.0',reserve:2,buyout:5,current:2.8,start:epoch-86400000,end:epoch+23640000,bids:[['0x9C71…03fA',2.8,'18分钟前'],['0x62aB…23dC',2.5,'1小时前']]},
    {id:'808.30',reserve:.3,current:0,start:epoch-3600000,end:epoch+95200000,bids:[]},
    {id:'77.1',reserve:.8,buyout:2,current:0,start:epoch-3600000,end:epoch+255600000,bids:[]},
    {id:'121.16',reserve:.1,buyout:.4,current:.25,start:epoch-345600000,end:epoch-86400000,bids:[['0x57Bb…80A1',.25,'2天前']]},
    {id:'18.231',reserve:.05,current:0,start:epoch-172800000,end:epoch-3600000,bids:[]}
  ].map(item=>({...item,seller:'0x71Ac…56F0',auction:true}));
  window.uluuluAuctionItems = items;
})();
