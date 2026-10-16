(() => {
  const root = document.documentElement;
  const read = (key, fallback) => { try { return window.uluuluDemoStorage.local.getItem(key) || fallback; } catch { return fallback; } };
  let language = read('5656-language', 'zh') === 'en' ? 'en' : 'zh';
  let theme = read('5656-theme', 'dark') === 'light' ? 'light' : 'dark';
  root.lang = language === 'en' ? 'en' : 'zh-CN';
  root.dataset.theme = theme;
  const translations = {
    '我的成交':'My trades', '成交记录范围':'Sales scope', '成交记录':'Trade history',
    '当前钱包的买入与卖出记录，按时间从近到远排列。':'Purchases and sales for this wallet, newest first.',
    '查看当前钱包的买入与卖出记录':'View purchases and sales for this wallet',
    '连接钱包后查看我的成交':'Connect a wallet to view your trades',

    '交易 ID':'Transaction ID', '左右滑动查看交易 ID 和地址 →':'Swipe to view transaction IDs and addresses →',
    '最近成交明细，可横向滚动':'Recent sale details, scroll horizontally',

    '全部市场的成交记录，按时间从近到远排列。':'Sales across all markets, newest first.',
    '最近成交记录，按成交时间降序排列':'Recent sales, ordered by time descending',
    '成交平台':'Marketplace', '成交方式':'Sale type', '成交时间 ↓':'Time ↓',
    '已显示全部成交记录':'All sales loaded', '演示数据':'Demo data',

    '当前搜索':'Search', '修改搜索条件':'Edit search', '清除搜索':'Clear search', '搜索':'Search',
    '当前筛选下没有收藏':'No favorites match these filters', '你已有收藏，清除筛选即可查看。':'You have saved numbers. Clear the filters to see them.', '浏览市场':'Browse market',
    '更多行情':'More market data', '收起行情':'Less market data', '拍卖状态':'Auction status', '进行中':'Live', '全部拍卖':'All auctions',
    '价格排序按当前出价或起拍价':'Prices are sorted by highest or starting bid',
    '预览上架':'Preview listing', '已恢复此号码的草稿':'Draft restored for this number', '清空草稿':'Clear draft',
    '本次出价':'Your bid', '拍卖一口价购买':'Auction buyout', '显示金额为交易金额，不含网络费用。':'Amount shown excludes network fees.',
    '复制地址':'Copy address', '地址已复制':'Address copied', '复制失败，请手动复制地址':'Copy failed. Please copy the address manually.', '2天前':'2 days ago',

    '竞价进行中，下一次出价由你决定。':'Bidding is live. Make the next move.',
    '距离落槌':'Auction ends in', '即将结束':'Ending soon', '竞价中':'Bidding live', '立即竞拍':'Bid now',

    '全部靓号':'All numbers',
    '在 uluulu 参与竞价；设有一口价的拍卖也可直接购买。':'Bid on uluulu, or buy instantly when an auction offers a buyout price.',
    '按标价购买 uluulu 靓号，连接钱包后即可继续。':'Buy uluulu numbers at the listed price. Connect your wallet to continue.',
    '按标价购买。官方号码前往 TapeOut，uluulu 号码连接钱包购买。':'Buy at the listed price. Purchase official numbers on TapeOut, or connect your wallet for uluulu listings.',
    '浏览 uluulu 的一口价与拍卖靓号，连接钱包后购买或出价。':'Browse fixed-price listings and auctions on uluulu. Connect your wallet to buy or bid.',
    '浏览一口价与拍卖靓号。官方号码在 TapeOut 购买，uluulu 号码在本站交易。':'Browse fixed-price listings and auctions. Purchase official numbers on TapeOut and trade uluulu listings here.',

    '火热拍卖':'Live auctions', '查看全部拍卖':'View all auctions',
    '拍卖与出价均为演示数据。':'Auctions and bids are demo data.',
    '暂无进行中的拍卖':'No live auctions right now',
    '查看拍卖':'View auction', '剩余时间':'Time left',

    '出售方式':'Sale type', 'uluulu 拍卖':'uluulu auctions', '参与竞价，或按拍卖一口价直接购买。':'Place a bid, or purchase at the auction buyout price.',

    '市场来源':'Marketplace source',

    "官方市场仅支持一口价": "Official market supports buy now only",
    "官方市场仅支持一口价，购买前往 TapeOut 电路市场。": "The official market supports buy now only. Purchase on TapeOut.",
    "拍卖仅在 uluulu 市场提供": "Auctions are available on uluulu only",
    "拍卖一口价": "Auction buyout price",
    "选填": "Optional",
    "不设置则仅支持竞价": "Leave blank for bidding only",
    "拍卖一口价 BNB": "Auction buyout price in BNB",
    "买家可按此价格直接购买，无需等待拍卖结束。": "Buyers can purchase at this price without waiting for the auction to end.",
    "一口价不能低于起拍价，最多 8 位小数。": "The buyout must be at least the starting bid, with up to 8 decimal places.",
    "无需等待拍卖结束": "No waiting for the auction to end",
    "立即购买": "Buy now",
    "已达到拍卖一口价，将按一口价购买。": "Your amount meets the buyout price. You will purchase at the buyout price.",
    "按一口价购买": "Buy at buyout price",
    "确认一口价购买": "Review instant purchase",
    "无需等待拍卖结束。交易确认后，拍卖立即结束，靓号转入你的钱包。": "No waiting for the auction to end. Once the transaction confirms, the auction ends and the number transfers to your wallet.",
    "购买方式": "Purchase type",
    "返回拍卖详情": "Back to auction",
    "当前仅为购买预览，不会扣款、结束拍卖或转移靓号。": "Purchase preview only. No payment, auction settlement or number transfer occurs.",
    "一口价上架": "List at fixed price",
    "发起拍卖": "Create auction",
    "设置拍卖": "Set up auction",

    "全部方式": "All types",
    "一口价": "Buy now",
    "拍卖": "Auction",
    "拍卖即将结束": "Auctions ending soon",
    "挂单与拍卖均为演示数据": "Demo listings and auctions",
    "价格 / 出价": "Price / Bid",
    "次出价": "bids",
    "即将开始": "Upcoming",
    "已结束 · 待结算": "Ended · Unsettled",
    "已结束 · 无人出价": "Ended · No bids",
    "正在拍卖": "Live auction",
    "已结束": "Ended",
    "最终出价": "Final bid",
    "起拍价": "Starting bid",
    "当前最高价": "Highest bid",
    "关闭拍卖详情": "Close auction details",
    "距离开始": "Starts in",
    "距离结束": "Ends in",
    "结束时间": "Ends at",
    "你的出价": "Your bid",
    "最低出价": "Minimum bid",
    "使用最低价": "Use minimum",
    "请输入不低于最低出价的金额，最多 8 位小数。": "Enter at least the minimum bid, with up to 8 decimal places.",
    "预览出价": "Review bid",
    "拍卖尚未开始，开始后即可出价。": "Bidding opens when the auction starts.",
    "竞价已结束，等待买卖双方完成结算。": "Bidding has ended. Settlement is pending.",
    "本次拍卖无人出价，号码未售出。": "No bids were placed. The number remains unsold.",
    "出价记录": "Bid history",
    "暂无出价，成为第一位竞拍者。": "No bids yet. Be the first bidder.",
    "拍卖规则与详情": "Auction rules and details",
    "卖家": "Seller",
    "开始时间": "Starts at",
    "最低加价": "Minimum increment",
    "规则示例：最后 5 分钟有新出价，结束时间顺延至该次出价后的 5 分钟。正式规则以合约为准。": "Example rule: bids in the final 5 minutes extend the end to 5 minutes after the bid. Final rules depend on the contract.",
    "拍卖、钱包地址和出价记录均为演示数据，不会发起真实交易。": "Auctions, wallet addresses and bids are examples. No real transaction is initiated.",
    "确认你的出价": "Review your bid",
    "平台费": "Platform fee",
    "待公布": "To be announced",
    "当前仅预览出价。连接钱包并确认后，才会提交链上竞价。": "This is a bid preview. An onchain bid requires a wallet connection and confirmation.",
    "连接钱包出价": "Connect wallet to bid",
    "发布后立即开始": "Start upon listing",
    "预约开始": "Schedule start",
    "拍卖开始日期与时间": "Auction start date and time",
    "请选择至少 1 分钟后的开始时间。": "Choose a start time at least 1 minute in the future.",
    "拍卖时长": "Auction duration",
    "3 天": "3 days",
    "规则示例：最低加价 5%，最后 5 分钟有新出价时顺延。起拍价即最低接受价。": "Example rules: 5% minimum increment; late bids extend the auction by 5 minutes. The starting bid is the minimum accepted price.",
    "查看买家拍卖页": "Preview buyer view",
    "请选择开始时间": "Choose a start time",
    "预览拍卖": "Preview auction",
    "拍卖预览已生成": "Auction preview ready",

    "搜索完整号码或部分数字": "Search a number or digits",
    "搜索持仓号码": "Search holdings",
    "筛选持仓 CPU": "Filter holdings by CPU",
    "靓号": "Number",
    "持仓号码列表": "Owned numbers",
    "上一页持仓": "Previous holdings page",
    "下一页持仓": "Next holdings page",
    "持仓页码": "Holdings page",
    "已选靓号": "Selected number",
    "尚未选择": "None selected",
    "设置售价": "Set price",
    "更换号码": "Change number",
    "没有匹配的持仓": "No matching holdings",
    "试试其他数字，或清除筛选。": "Try different digits or clear the filters.",
    "清除筛选": "Clear filters",

    "上架靓号": "List a number",
    "选择靓号、设置价格，即可在 uluulu 出售。": "Choose your number and set your listing terms.",
    "关闭上架窗口": "Close listing",
    "选择持有靓号": "Choose a number",
    "示例持仓": "Demo holdings",
    "售价": "Sale price",
    "输入 BNB 价格": "Enter a price in BNB",
    "有效期": "Duration",
    "1 天": "1 day",
    "7 天": "7 days",
    "30 天": "30 days",
    "90 天": "90 days",
    "到期时间": "Expires at",
    "请填写大于 0 的价格，最多 8 位小数。": "Enter a price greater than 0, with up to 8 decimal places.",
    "选择号码并填写售价": "Choose a number and enter a price",
    "确认上架": "Confirm listing",
    "所选靓号": "Selected number",
    "上架预览已完成": "Listing preview complete",
    "尚未发布到市场，也未发起钱包签名。": "Nothing has been published or signed.",
    "号码为示例持仓；当前仅演示上架流程，不会发布真实挂单。": "Holdings are examples. This preview does not publish a real listing.",
    "上架市场": "Marketplace",
    "返回修改": "Edit listing",
    "完成": "Done",
    "上架信息": "Listing details",

    '全部': 'All', '官方号码前往 TapeOut，uluulu 号码连接钱包购买。': 'Buy official numbers on TapeOut; connect a wallet for uluulu listings.',
    '最近成交行情': 'Recent sales feed', '成交记录，按时间从近到远': 'Sales, newest first', '成交示例': 'Demo sales',
    '查看和管理你的靓号。': 'View and manage your numbers.',
    '连接钱包，查看我的靓号': 'Connect a wallet to view your numbers',
    '演示模式下，将显示示例地址与持仓。': 'Demo mode displays a sample address and holdings.',
    '状态 / 操作': 'Status / Actions', '已一口价上架': 'Listed at fixed price', '下架': 'Unlist', '拍卖中': 'Auction live', '拍卖已结束': 'Auction ended',
    '完成后更新本地演示状态，不会发布真实挂单。': 'Completing updates the local demo status without publishing a real listing.',
    '我的靓号': 'My numbers', '退出连接': 'Disconnect', '关闭我的靓号': 'Close my numbers', '示例钱包': 'Demo wallet',
    '演示模式：连接后显示示例地址，不会连接真实钱包或发起交易。': 'Demo mode: shows a sample address without connecting a real wallet or making a transaction.',
    '以上为演示靓号，不代表真实钱包资产。': 'These numbers are examples, not real wallet assets.',
    '钱包选择预览': 'Wallet selection preview',
    '选择钱包，在 uluulu 继续。': 'Choose a wallet to continue on uluulu.',
    '关闭钱包选择': 'Close wallet selection', '本次购买': 'Your purchase',
    '钱包选择仅为界面预览，暂不发起连接或交易。': 'Wallet selection is a UI preview. No connection or transaction will be initiated.',
    'TapeOut 官网': 'TapeOut official', '5分钟前': '5 min ago', '18分钟前': '18 min ago', '1小时前': '1 hr ago',
    '最近成交': 'Recent sales', '成交价': 'Sold for',
    '成交号码、价格、平台与时间均为静态展示样例。': 'Numbers, prices, platforms and times shown are demo examples.',
    'TapeOut 链上地址': 'TapeOut onchain address',
    '返回靓号详情': 'Back to number details', '收藏号码': 'Save number', '已收藏': 'Saved',
    '在 Tapeout 完成购买，价格与可售状态以官方市场为准。': 'Purchase on Tapeout. Confirm the price and availability there.',
    '在 uluulu 完成购买，连接 BNB Chain 钱包继续。': 'Purchase on uluulu. Connect your BNB Chain wallet to continue.', 
    '交易市场': 'Marketplaces', '在 Tapeout 完成购买': 'Buy on Tapeout',
    '选择号码后，前往官方电路市场。': 'Choose a number to visit the official circuit market.',
    '在 uluulu 完成购买': 'Buy on uluulu', '选择号码，连接钱包后购买。': 'Choose a number and connect your wallet to buy.',
    '仅看收藏': 'Saved only', '前往官方市场': 'Visit the official market', '通过钱包购买': 'Buy with your wallet',
    '站外交易': 'External market',
    '此号码在 Tapeout 电路市场出售，购买将在官方市场完成。': 'This number is listed on Tapeout. Complete your purchase in its circuit market.',
    '连接钱包后，在 uluulu 确认号码与价格并完成购买。': 'Connect your wallet, review the number and price, and purchase on uluulu.',
    '前往 Tapeout 电路市场': 'Visit Tapeout circuit market', '连接钱包购买': 'Connect wallet to buy',
    '价格与可售状态以官方市场为准': 'Confirm the price and availability on Tapeout',
    'BNB Chain · 使用 BNB 支付': 'BNB Chain · Pay with BNB', '静态 UI 预览，尚未接入交易': 'UI preview · Trading is not connected',
    '你选择的号码来自官方市场，购买将在 Tapeout 完成。': 'Your selected number is from the official market. Complete the purchase on Tapeout.',
    '交易目的地': 'Purchase destination', '电路市场': 'Circuit market',
    '跳转界面预览，暂不打开外部网站。': 'Navigation preview. No external website will open.',
    '在 uluulu 购买靓号，使用 BNB Chain 钱包继续。': 'Use a BNB Chain wallet to purchase your number on uluulu.',
    '钱包选择预览': 'Wallet selection preview',
    '钱包选择为界面预览，尚未接入连接与支付。': 'Wallet UI preview. Connection and payments are not enabled.',
    'uluulu — 好号码，一眼记住。': 'uluulu — A number to remember.',
    '市场一览 — uluulu': 'Marketplace — uluulu',
    '好号码，': 'A good number. ', '一眼记住。': 'Unforgettable.',
    '发现简短、顺口、有记忆点的 TapeOut 靓号。': 'Discover short, memorable TapeOut numbers.',
    '你的下一个数字身份，就从这里开始。': 'Your next digital identity starts here.',
    '试试 22.888，或你喜欢的 CPU': 'Try 22.888 or your favorite CPU',
    '搜索靓号或 CPU': 'Search numbers or CPUs', '搜索靓号': 'Search numbers',
    '先读懂一个号码': 'How numbers work', '进入市场一览': 'Explore the market',
    '浏览全部靓号': 'Browse all numbers', '从一个喜欢的号码开始。': 'Start with a number you love.',
    '简短，直接。': 'Short. Simple.', '熟悉的数字，顺口的节奏。': 'Familiar digits. A natural rhythm.',
    '成双，也成串。': 'A pair worth remembering.', '精选号码与价格为静态展示样例。': 'Featured numbers and prices are demo examples.',
    '一个点，连接两个编号。': 'One dot. Two identifiers.',
    'tape://56.56：左侧 56 是电路ID，右侧 56 是 CPU ID': 'tape://56.56: circuit ID 56 on the left, CPU ID 56 on the right',
    '56.56：左侧 56 是电路号，右侧 56 是 CPU 号': '56.56: circuit 56 on the left, CPU 56 on the right',
    '56 号 CPU 中的第 56 号电路': 'Circuit 56 within CPU 56',
    '电路号在前，CPU 号在后，以点分隔。': 'Circuit first, CPU second. Separated by a dot.',
    '数字位数不计小数点': 'The dot is not counted', '电路ID': 'Circuit ID', '电路号': 'Circuit', 'CPU 号': 'CPU',
    '有偏好？': 'Have a favorite? ', '从这里找。': 'Find it here.',
    '选一个 CPU，定一个位数。': 'Choose a CPU and a digit count.', '剩下的，交给你的眼缘。': 'Then find the one that feels right.',
    '电路号与 CPU 号一起计算，范围 2–8 位。': 'Count both circuit and CPU digits, from 2 to 8.',
    '完整数字位数': 'Total digits', '所属 CPU': 'CPU', '全部 CPU': 'All CPUs', '不限位数': 'Any length',
    '查看匹配靓号': 'Find matching numbers', '去发现你的号码': 'Find your number',
    '静态设计预览 · 挂单与行情为演示数据': 'Static preview · Demo listings and market data',
    '回到顶部': 'Back to top', 'CPU 分类查询': 'Filter by CPU',
    '主导航': 'Main navigation', '首页': 'Home', '市场一览': 'Marketplace', '号码指南': 'Number guide',
    '进入市场': 'Explore market', '我的收藏': 'Favorites', '静态预览': 'Preview', '连接钱包': 'Connect wallet',
    '#0 · 创世 Genesis': '#0 · Genesis', '#1 · 巨兽 Behemoth': '#1 · Behemoth',
    '创世': 'Genesis', '巨兽': 'Behemoth', '行情为演示数据': 'Demo market data',
    '找到属于你的': 'Find your ', '好号码。': 'perfect number.',
    '按 CPU 和 2–8 位数字筛选，': 'Filter by CPU and 2–8 digits. ',
    '轻松比较每一个心仪号码。': 'Compare the numbers you love.', '聚合 3 个交易市场': 'From 3 marketplaces',
    '市场概览': 'Market overview', '在售靓号': 'Listed numbers', '全部市场': 'All markets', '全市场': 'All markets',
    '24h 新增': 'New in 24h', '24h 成交额': '24h volume', '地板价': 'Floor price',
    '最低在售挂单': 'Lowest active listing', '24h 成交': '24h sales', '较昨日': 'vs. yesterday',
    '成交额趋势': 'Volume trend', 'BNB · 演示': 'BNB · Demo', '图表周期': 'Chart period',
    '市场视图': 'Market tabs', '全部靓号': 'All numbers', '最新上架': 'Latest listings', '自选': 'Favorites',
    '演示挂单 · 非实时报价': 'Demo listings · Not live prices', '刷新演示列表': 'Refresh demo listings',
    '市场筛选与视图': 'Market filters and views', '全部筛选': 'All filters', '筛选靓号': 'Filter numbers',
    '重置': 'Reset', '数字位数': 'Digit count', '电路号与 CPU 号一起计算，不含点。': 'Count circuit and CPU digits, excluding the dot.',
    '清除': 'Clear', '排序：综合推荐': 'Sort: Recommended', '价格从低到高': 'Price: Low to high', '价格从高到低': 'Price: High to low',
    '排序': 'Sort', '网格视图': 'Grid view', '列表视图': 'List view', '视图': 'View',
    '关闭靓号详情': 'Close number details', '靓号详情': 'Number details', '静态设计原型': 'Static prototype',
    '电路号.CPU号 · 找到一眼记住的号码。': 'Circuit.CPU · Find a number to remember.', '关于靓号': 'About numbers',
    '知道了': 'Got it', '关闭': 'Close', '官方市场': 'Official market', '取消收藏': 'Unsave', '收藏': 'Save',
    '这里还没有收藏': 'No favorites yet', '没有找到匹配的靓号': 'No matching numbers',
    '点击号码旁的星标，把心仪的靓号收在这里。': 'Use the star beside a number to save it here.',
    '试试其他号码，或调整 CPU 与数字位数。': 'Try another number, CPU or digit count.',
    '查看全部靓号': 'Browse all numbers', '靓号 / CPU': 'Number / CPU', '来源': 'Source', '挂单价': 'Listed price',
    '挖矿': 'Mining', '可以挖矿': 'Mineable', '含引用，不可挖矿': 'Contains references; not mineable', '不可挖矿': 'Not mineable', '可挖矿': 'Mineable', '收藏 · 链上网址': 'Collectible · On-chain address',
    '暂无结果': 'No results', '等待你的选择': 'Choose a number', '调整筛选条件，再查看感兴趣的号码。': 'Adjust the filters to explore more numbers.',
    '不含小数点': 'Excluding the dot', 'CPU 编号': 'CPU ID', '电路编号': 'Circuit ID',
    '交易来源': 'Marketplace', '挖矿能力': 'Mining', '当前挂单价': 'Current listing', '演示汇率': 'Demo exchange rate',
    '买方市场服务费': 'Buyer service fee', '网络费用': 'Network fee', '以钱包确认为准': 'Confirmed in your wallet',
    '购买预览': 'Preview purchase', '静态演示，不发起链上交易': 'Demo only. No on-chain transaction.',
    '认准号码，也认准 CPU': 'Check the number and the CPU',
    '点左边是电路编号，右边是 CPU 编号。': 'The circuit is before the dot; the CPU follows it.',
    '同名 CPU 可能对应不同合约。': 'CPUs with the same name may use different contracts.',
    '了解靓号的构成': 'How numbers work', '确认你的靓号': 'Review your number', '网络': 'Network',
    '市场服务费': 'Market service fee', '合计（不含 Gas）': 'Total (excluding gas)',
    '这是静态购买预览。正式交易时需连接钱包，并重新核对合约、卖家和挂单状态。': 'This is a purchase preview. A real transaction requires a wallet and a fresh check of the contract, seller and listing.',
    '连接你的钱包': 'Connect your wallet',
    '当前是市场 UI 预览，尚未接入钱包。你可以先筛选号码、添加收藏，或查看购买费用明细。': 'This market preview is not connected to a wallet. Explore numbers, save favorites and review purchase fees.',
    '计划支持 MetaMask 和 OKX Wallet。': 'Planned support: MetaMask and OKX Wallet.',
    '官方': 'Official', '社区': 'Community', '已认证': 'Verified', '枚': 'items', '笔': 'trades',
    '上一页': 'Previous page', '下一页': 'Next page'
  };
  const phrases = Object.keys(translations).sort((a, b) => b.length - a.length);
  function translate(value) {
    if (language === 'zh') return value;
    const trimmed = value.trim();
    if (translations[trimmed]) return value.replace(trimmed, translations[trimmed]);
    let result = value
      .replace(/(\d+)日演示成交额走势图/g, '$1-day demo volume chart')
      .replace(/演示列表已更新，共 (\d+) 条样例挂单/g, 'Demo refreshed: $1 sample listings')
      .replace(/查看靓号 ([\d.]+)/g, 'View number $1')
      .replace(/打开 ([\d.]+) 详情/g, 'Open details for $1')
      .replace(/(\d+(?:–\d+)?) 位数字/g, '$1 digits')
      .replace(/(\d+) 位数/g, '$1 digits')
      .replace(/(\d+) 位/g, '$1 digits')
      .replace(/(\d+) 分钟前/g, '$1 min ago')
      .replace(/(\d+) 小时前/g, '$1 hr ago')
      .replace(/最多 (\d+) 位/g, 'up to $1 digits')
      .replace(/展示 /g, 'Showing ')
      .replace(/个靓号/g, 'numbers').replace(/个结果/g, 'results').replace(/查看 /g, 'View ')
      .replace(/，最多 /g, ', up to ');
    phrases.forEach(phrase => { result = result.split(phrase).join(translations[phrase]); });
    return result;
  }
  const textCache = new WeakMap();
  const attrCache = new WeakMap();
  const skip = el => el.closest('script,style,[data-preferences]');
  function translateNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (!node.parentElement || skip(node.parentElement)) return;
      let entry = textCache.get(node);
      if (!entry || node.nodeValue !== entry.output) entry = {original: node.nodeValue};
      entry.output = translate(entry.original);
      if (node.nodeValue !== entry.output) node.nodeValue = entry.output;
      textCache.set(node, entry);
    } else if (node.nodeType === Node.ELEMENT_NODE && !skip(node)) {
      for (const attr of ['aria-label', 'placeholder', 'title']) {
        if (!node.hasAttribute(attr)) continue;
        let entries = attrCache.get(node) || {};
        let entry = entries[attr];
        const current = node.getAttribute(attr);
        if (!entry || current !== entry.output) entry = {original: current};
        entry.output = translate(entry.original);
        if (current !== entry.output) node.setAttribute(attr, entry.output);
        entries[attr] = entry;
        attrCache.set(node, entries);
      }
      node.childNodes.forEach(translateNode);
    }
  }
  const save = (key, value) => { try { window.uluuluDemoStorage.local.setItem(key, value); } catch {} };
  document.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver(records => {
      observer.disconnect();
      records.forEach(record => {
        if (record.type === 'childList') record.addedNodes.forEach(translateNode);
        else translateNode(record.target);
      });
      observe();
    });
    function observe() { observer.observe(document.body, {subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','placeholder','title']}); }
    function updateControls() {
      const langButton = document.querySelector('#language-toggle');
      langButton.textContent = language === 'zh' ? 'EN' : '中文';
      langButton.setAttribute('aria-label', language === 'zh' ? 'Switch to English' : '切换为中文');
      langButton.setAttribute('title', language === 'zh' ? 'Switch to English' : '切换为中文');
      const themeButton = document.querySelector('#theme-toggle');
      themeButton.querySelector('.theme-label').textContent = theme === 'dark' ? 'Dark' : 'Light';
      themeButton.setAttribute('aria-label', language === 'zh' ? (theme === 'dark' ? '切换浅色模式' : '切换深色模式') : (theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'));
      themeButton.setAttribute('title', themeButton.getAttribute('aria-label'));
      themeButton.setAttribute('aria-pressed', String(theme === 'dark'));
      document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#1c2026' : '#f5f3ef';
    }
    function applyLanguage() {
      observer.disconnect();
      root.lang = language === 'en' ? 'en' : 'zh-CN';
      translateNode(document.body);
      translateNode(document.querySelector('title'));
      updateControls();
      observe();
    }
    document.querySelector('#language-toggle').addEventListener('click', () => {
      language = language === 'zh' ? 'en' : 'zh';
      save('5656-language', language);
      applyLanguage();
    });
    document.querySelector('#theme-toggle').addEventListener('click', () => {
      theme = theme === 'light' ? 'dark' : 'light';
      root.dataset.theme = theme;
      save('5656-theme', theme);
      updateControls();
    });
    window.addEventListener('storage', event => {
      if (event.key === '5656-language') { language = event.newValue === 'en' ? 'en' : 'zh'; applyLanguage(); }
      if (event.key === '5656-theme') { theme = event.newValue === 'light' ? 'light' : 'dark'; root.dataset.theme = theme; updateControls(); }
    });
    applyLanguage();
  });
})();
