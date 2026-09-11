/**
 * Campus Life Survival Guide - Engine (All 61 Steps + Real-time Search)
 */
document.addEventListener('DOMContentLoaded', () => {
  // 1. 全部完整指南元数据 (9 篇发布指南)
  const GUIDES = [
    { "guide_id": "GUIDE-001", "guide_title": "How to register Alipay", "platform": "iOS, Android" },
    { "guide_id": "GUIDE-002", "guide_title": "How to add a bank card", "platform": "iOS, Android" },
    { "guide_id": "GUIDE-003", "guide_title": "How to pay with Alipay", "platform": "iOS, Android" },
    { "guide_id": "GUIDE-004", "guide_title": "How to take metro with Alipay?", "platform": "iOS, Android" },
    { "guide_id": "GUIDE-008", "guide_title": "How to get my packages？", "platform": "iOS, Android" },
    { "guide_id": "GUIDE-009", "guide_title": "Top up your campus card & dorm electricity", "platform": "iOS, Android" },
    { "guide_id": "GUIDE-010", "guide_title": "How to get my delivery?", "platform": "iOS, Android" },
    { "guide_id": "GUIDE-011", "guide_title": "Doing your laundry", "platform": "all" },
    { "guide_id": "GUIDE-012", "guide_title": "Getting things fixed", "platform": "all" }
  ];

  // 2. 全部 61 个完整步骤与截图配置 (直接内嵌，避免 fetch 旧 json 污染)
  const ALL_STEPS = [
    // GUIDE-001 (Alipay 注册)
    {"guide_id":"GUIDE-001","step_number":1,"step_title":"Open Alipay","instruction":"","tip":"","filename":"alipay-register-ios-01.png","status":"ready","display_frame":"phone"},
    {"guide_id":"GUIDE-001","step_number":2,"step_title":"Start registration","instruction":"","tip":"","filename":"alipay-register-ios-02.png","status":"ready","display_frame":"phone"},
    {"guide_id":"GUIDE-001","step_number":3,"step_title":"Enter your phone number","instruction":"Use the number you can receive SMS on","tip":"","filename":"","status":"none","display_frame":"phone"},
    {"guide_id":"GUIDE-001","step_number":4,"step_title":"Verify your number","instruction":"","tip":"","filename":"alipay-register-ios-04.png","status":"ready","display_frame":"phone"},
    {"guide_id":"GUIDE-001","step_number":5,"step_title":"Enter your identity card number","instruction":"","tip":"","filename":"alipay-register-ios-05.png","status":"ready","display_frame":"phone"},
    {"guide_id":"GUIDE-001","step_number":6,"step_title":"Enter your passport number","instruction":"","tip":"","filename":"alipay-register-ios-06.png","status":"ready","display_frame":"phone"},
    {"guide_id":"GUIDE-001","step_number":7,"step_title":"Go to settings","instruction":"","tip":"","filename":"alipay-register-ios-07.png","status":"ready","display_frame":"phone"},
    {"guide_id":"GUIDE-001","step_number":8,"step_title":"Go to Account and Security","instruction":"","tip":"","filename":"alipay-register-ios-08.png","status":"ready","display_frame":"phone"},
    {"guide_id":"GUIDE-001","step_number":9,"step_title":"Set your email and identity information","instruction":"","tip":"","filename":"alipay-register-ios-09.png","status":"ready","display_frame":"phone"},

    // GUIDE-002 (绑定银行卡)
    {"guide_id":"GUIDE-002","step_number":1,"step_title":"Click Account","instruction":"","tip":"","filename":"alipay-bank-ios-01.png","status":"ready","display_frame":"phone"},
    {"guide_id":"GUIDE-002","step_number":2,"step_title":"Go to Bank Cards","instruction":"","tip":"","filename":"alipay-bank-ios-02.png","status":"ready","display_frame":"phone"},
    {"guide_id":"GUIDE-002","step_number":3,"step_title":"Add Bank card","instruction":"","tip":"","filename":"alipay-bank-ios-03.png","status":"ready","display_frame":"phone"},
    {"guide_id":"GUIDE-002","step_number":4,"step_title":"Enter your bank card number","instruction":"","tip":"","filename":"alipay-bank-ios-04.png","status":"ready","display_frame":"phone"},

    // GUIDE-003 (支付宝付款)
    {"guide_id":"GUIDE-003","step_number":1,"step_title":"Go to Pay/Receive","instruction":"","tip":"","filename":"alipay-pay-ios-01.png","status":"ready","display_frame":"phone"},
    {"guide_id":"GUIDE-003","step_number":2,"step_title":"Use the QR code to pay","instruction":"","tip":"","filename":"alipay-pay-ios-02.png","status":"ready","display_frame":"phone"},
    {"guide_id":"GUIDE-003","step_number":3,"step_title":"Go to receive","instruction":"","tip":"","filename":"alipay-pay-ios-03.png","status":"ready","display_frame":"phone"},
    {"guide_id":"GUIDE-003","step_number":4,"step_title":"Use the QR code to receive","instruction":"","tip":"","filename":"alipay-pay-ios-04.png","status":"ready","display_frame":"phone"},

    // GUIDE-004 (地铁乘车码)
    {"guide_id":"GUIDE-004","step_number":1,"step_title":"Go to Transport","instruction":"","tip":"","filename":"alipay-metro-ios-01.png","status":"ready","display_frame":"phone"},
    {"guide_id":"GUIDE-004","step_number":2,"step_title":"Use the QR code to Scan","instruction":"","tip":"","filename":"alipay-metro-ios-02.png","status":"ready","display_frame":"phone"},

    // GUIDE-008 (取快递)
    {"guide_id":"GUIDE-008","step_number":1,"step_title":"Open TaoBao and tap 菜鸟驿站","instruction":"","tip":"","filename":"cainiao-code-01.png","status":"ready","display_frame":"phone"},
    {"guide_id":"GUIDE-008","step_number":2,"step_title":"Use the 取件码 (pickup code) to find your package","instruction":"","tip":"","filename":"cainiao-code-02.png","status":"ready","display_frame":"phone"},
    {"guide_id":"GUIDE-008","step_number":3,"step_title":"Scan the barcode on your package","instruction":"","tip":"","filename":"cainiao-code-03.png","status":"ready","display_frame":"photo"},
    {"guide_id":"GUIDE-008","step_number":4,"step_title":"Just scan your identity code at the machine and you're good to go","instruction":"","tip":"","filename":"cainiao-code-04.png","status":"ready","display_frame":"photo"},

    // GUIDE-009 (校园卡及电费充值)
    {"guide_id":"GUIDE-009","step_number":1,"step_title":"Open WeChat","instruction":"","tip":"","filename":"Ecard-01.png","status":"ready","display_frame":"phone"},
    {"guide_id":"GUIDE-009","step_number":2,"step_title":"Search for 华东师大Ecard at the top","instruction":"","tip":"","filename":"Ecard-02.png","status":"ready","display_frame":"phone"},
    {"guide_id":"GUIDE-009","step_number":3,"step_title":"Open the ECNU Ecard Mini Program","instruction":"","tip":"","filename":"Ecard-03.png","status":"ready","display_frame":"phone"},
    {"guide_id":"GUIDE-009","step_number":4,"step_title":"Tap Login and enter your Campus Card ID and password","instruction":"","tip":"","filename":"Ecard-04.png","status":"ready","display_frame":"phone"},
    {"guide_id":"GUIDE-009","step_number":5,"step_title":"To recharge your campus card","instruction":"Tap Recharge","tip":"","filename":"Ecard-05.png","status":"ready","display_frame":"phone"},
    {"guide_id":"GUIDE-009","step_number":6,"step_title":"Enter the amount you want to recharge","instruction":"","tip":"","filename":"Ecard-06.png","status":"ready","display_frame":"phone"},
    {"guide_id":"GUIDE-009","step_number":7,"step_title":"To recharge your dormitory electricity","instruction":"Tap Water & Electricity Top-Up","tip":"","filename":"Ecard-07.png","status":"ready","display_frame":"phone"},
    {"guide_id":"GUIDE-009","step_number":8,"step_title":"Enter your dormitory room information, then tap Next","instruction":"","tip":"","filename":"Ecard-08.png","status":"ready","display_frame":"phone"},
    {"guide_id":"GUIDE-009","step_number":9,"step_title":"Enter the amount you want to top up and complete the payment","instruction":"","tip":"","filename":"Ecard-09.png","status":"ready","display_frame":"phone"},
    {"guide_id":"GUIDE-009","step_number":10,"step_title":"To open the Mini Program more quickly next time","instruction":"Tap the ··· icon in the top-right corner","tip":"","filename":"Ecard-10.png","status":"ready","display_frame":"phone"},
    {"guide_id":"GUIDE-009","step_number":11,"step_title":"Select Add to My Mini Programs or Add to Home Screen","instruction":"","tip":"","filename":"Ecard-11.png","status":"ready","display_frame":"phone"},

    // GUIDE-010 (点外卖 - 取外卖)
    {"guide_id":"GUIDE-010","step_number":1,"step_title":"Tap “外卖” on the home page","instruction":"","tip":"","filename":"meituan-order-01.png","status":"ready","display_frame":"phone"},
    {"guide_id":"GUIDE-010","step_number":2,"step_title":"Remember to update the delivery address to our dorm","instruction":"","tip":"","filename":"meituan-order-02.png","status":"ready","display_frame":"phone"},
    {"guide_id":"GUIDE-010","step_number":3,"step_title":"Scroll down or search for what you want to eat, then tap the yellow button to add it to your cart","instruction":"","tip":"","filename":"meituan-order-03.png","status":"ready","display_frame":"phone"},
    {"guide_id":"GUIDE-010","step_number":4,"step_title":"Once you're done selecting, tap “去结算” in the bottom right corner","instruction":"","tip":"","filename":"meituan-order-04.png","status":"ready","display_frame":"phone"},
    {"guide_id":"GUIDE-010","step_number":5,"step_title":"Make sure to select your delivery address and tap 支付","instruction":"(Optional) Scroll down to find the “备注” section, where you can write down preferences or ingredients to avoid.","tip":"","filename":"meituan-order-05.png","status":"ready","display_frame":"phone"},
    {"guide_id":"GUIDE-010","step_number":6,"step_title":"You will get a call from the delivery driver telling you where on the shelf they placed it","instruction":"If you didn't catch it clearly, you can check the driver's info in the app where they uploaded a photo.","tip":"","filename":"meituan-order-06.png","status":"ready","display_frame":"phone"},

    // GUIDE-011 (洗衣房指南)
    {"guide_id":"GUIDE-011","step_number":1,"step_title":"The washing machines and dryers are located around the corner of the stairs on the 1st floor.","instruction":"Turn left after entering the door and go all the way to the end.","tip":"","filename":"","status":"ready","display_frame":"photo"},
    {"guide_id":"GUIDE-011","step_number":2,"step_title":"Put your clothes into the washing machine and add laundry detergent","instruction":"","tip":"","filename":"","status":"ready","display_frame":"photo"},
    {"guide_id":"GUIDE-011","step_number":3,"step_title":"Use WeChat on your phone to scan the QR code on the machine","instruction":"","tip":"","filename":"","status":"ready","display_frame":"photo"},
    {"guide_id":"GUIDE-011","step_number":4,"step_title":"Once successful, press the button on the machine and set a timer","instruction":"People in the dorm chat group remind each other. Notify group if someone else can help take clothes out.","tip":"","filename":"","status":"ready","display_frame":"photo"},
    {"guide_id":"GUIDE-011","step_number":5,"step_title":"The dryer looks like this, and you operate it following the exact same steps","instruction":"","tip":"","filename":"","status":"ready","display_frame":"photo"},

    // GUIDE-012 (报修系统)
    {"guide_id":"GUIDE-012","step_number":1,"step_title":"Join the ECNU WeChat Enterprise account","instruction":"Follow the steps on the official website: [https://eoffice.ecnu.edu.cn/sjdpzwqywxw/list.htm]","tip":"","filename":"maintenance-01.png","status":"ready","display_frame":"photo"},
    {"guide_id":"GUIDE-012","step_number":2,"step_title":"Go to “Contacts” at the bottom of WeChat, find and click on “华东师范大学”","instruction":"","tip":"","filename":"maintenance-02.png","status":"ready","display_frame":"photo"},
    {"guide_id":"GUIDE-012","step_number":3,"step_title":"Click on the “报修系统”","instruction":"","tip":"","filename":"maintenance-03.png","status":"ready","display_frame":"photo"},
    {"guide_id":"GUIDE-012","step_number":4,"step_title":"Click on the “报修系统” at the bottom","instruction":"","tip":"","filename":"maintenance-04.png","status":"ready","display_frame":"photo"},
    {"guide_id":"GUIDE-012","step_number":5,"step_title":"Click “统一认证登录”","instruction":"","tip":"","filename":"maintenance-05.png","status":"ready","display_frame":"photo"},
    {"guide_id":"GUIDE-012","step_number":6,"step_title":"Click “我要报修”","instruction":"","tip":"","filename":"maintenance-06.png","status":"ready","display_frame":"photo"},
    {"guide_id":"GUIDE-012","step_number":7,"step_title":"Fill in details such as your dorm room number and issue description, then submit","instruction":"","tip":"","filename":"maintenance-07.png","status":"ready","display_frame":"photo"}
  ];

  const appGalleries = {
    '01': {
      title: '01 FOOD & DELIVERY',
      apps: [
        { name: '美团', sub: 'MeiTuan', icon: 'images/meituanicon.png' },
        { name: '淘宝', sub: 'TaoBao', icon: 'images/taobaoicon.png' },
        { name: '京东', sub: 'JingDong', icon: 'images/JDIcon.png' }
      ]
    },
    '02': {
      title: '02 TRANSIT & MAPS',
      apps: [
        { name: '高德地图', sub: 'Amap', icon: 'images/amapicon.png' },
        { name: '哈喽', sub: 'HaLou', icon: 'images/haloicon.png' }
      ]
    },
    '03': {
      title: '03 FINANCE & PAYMENTS',
      apps: [
        { name: '支付宝', sub: 'Alipay', icon: 'images/alipayicon.png' },
        { name: '工商银行', sub: 'ICBC', icon: 'images/icbcicon.png' },
        { name: '微信', sub: 'WeChat Pay', icon: 'images/wechatpayicon.png' }
      ]
    },
    '04': {
      title: '04 SHOPPING',
      apps: [
        { name: '淘宝', sub: 'TaoBao', icon: 'images/taobaoicon.png' },
        { name: '京东', sub: 'JingDong', icon: 'images/JDIcon.png' },
        { name: '菜鸟', sub: 'CaiNiao', icon: 'images/cainiaoicon.png' }
      ]
    },
    '05': {
      title: '05 VPN',
      apps: [
        { name: 'Skuracat', sub: '', icon: 'images/sakuracaticon.png' },
        { name: 'Ikuuu', sub: '', icon: 'images/ikuuicon.png' }
      ]
    }
  };

  // DOM 节点
  const homeView = document.getElementById('homeView');
  const guideDetailView = document.getElementById('guideDetailView');
  const appGalleryView = document.getElementById('appGalleryView');
  const dormDossierView = document.getElementById('dormDossierView');

  const detailMainTitle = document.getElementById('detailMainTitle');
  const stepsFlowContainer = document.getElementById('stepsFlowContainer');
  const trackLineFill = document.getElementById('trackLineFill');
  const btnBackHome = document.getElementById('btnBackHome');
  const btnBackFromGallery = document.getElementById('btnBackFromGallery');

  const galleryCatTitle = document.getElementById('galleryCatTitle');
  const galleryCardsGrid = document.getElementById('galleryCardsGrid');

  const dormFileTrigger = document.getElementById('dormFileTrigger');
  const openDormLink = document.getElementById('openDormLink');
  const dossierCloseBtn = document.getElementById('dossierCloseBtn');
  const dossierPrevBtn = document.getElementById('dossierPrevBtn');
  const dossierNextBtn = document.getElementById('dossierNextBtn');
  const dossierPageLabel = document.getElementById('dossierPageLabel');
  const dossierBodyViewport = document.getElementById('dossierBodyViewport');
  const toastPopup = document.getElementById('toastPopup');
  const searchInput = document.getElementById('searchInput');
  const searchNoResults = document.getElementById('searchNoResults');

  let currentDormPage = 1;

  function bindEvents() {
    // 监听卡片点击
    document.querySelectorAll('.guide-card').forEach(card => {
      card.addEventListener('click', () => {
        const gid = card.dataset.guideId;
        openGuideDetail(gid);
      });
    });

    // 监听 (01) ~ (05) 拍立得点击
    document.querySelectorAll('.pin-card').forEach(card => {
      card.addEventListener('click', () => {
        const catKey = card.dataset.appCat;
        openAppGallery(catKey);
      });
    });

    btnBackHome.addEventListener('click', () => {
      switchView('home');
      window.scrollTo(0, 0);
    });

    btnBackFromGallery.addEventListener('click', () => {
      switchView('home');
      window.scrollTo(0, 0);
    });

    dormFileTrigger.addEventListener('click', openDossier);
    openDormLink.addEventListener('click', openDossier);
    dossierCloseBtn.addEventListener('click', () => switchView('home'));

    dossierPrevBtn.addEventListener('click', () => {
      if (currentDormPage > 1) {
        currentDormPage--;
        renderDormPage(currentDormPage);
      }
    });

    dossierNextBtn.addEventListener('click', () => {
      if (currentDormPage < 3) {
        currentDormPage++;
        renderDormPage(currentDormPage);
      }
    });

    window.addEventListener('scroll', updateScrollProgress);

    // 核心：实时模糊搜索功能绑定
    if (searchInput) {
      searchInput.addEventListener('input', handleSearch);
    }
  }

  // 搜索处理引擎
  function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    const allCards = document.querySelectorAll('.guide-card');
    let visibleCount = 0;

    allCards.forEach(card => {
      const cardTitle = card.querySelector('.card-headline').innerText.toLowerCase();
      const appName = card.querySelector('.card-app-name').innerText.toLowerCase();
      const tags = (card.dataset.tags || '').toLowerCase();

      if (!query || cardTitle.includes(query) || appName.includes(query) || tags.includes(query)) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // 控制大模块的显隐
    document.querySelectorAll('.category-block-wrapper').forEach(block => {
      const visibleInside = block.querySelectorAll('.guide-card[style*="display: flex"], .guide-card:not([style*="display: none"])');
      if (!query) {
        block.style.display = 'block';
      } else if (visibleInside.length === 0) {
        block.style.display = 'none';
      } else {
        block.style.display = 'block';
      }
    });

    // 搜索无匹配项提示
    if (searchNoResults) {
      searchNoResults.style.display = (visibleCount === 0 && query) ? 'block' : 'none';
    }
  }

  function switchView(viewName) {
    homeView.classList.remove('active');
    guideDetailView.classList.remove('active');
    appGalleryView.classList.remove('active');
    dormDossierView.classList.remove('active');

    if (viewName === 'home') homeView.classList.add('active');
    if (viewName === 'guide') guideDetailView.classList.add('active');
    if (viewName === 'gallery') appGalleryView.classList.add('active');
    if (viewName === 'dossier') dormDossierView.classList.add('active');
  }

  // 渲染步骤详情（直接从固化 ALL_STEPS 读取）
  function openGuideDetail(guideId) {
    const guide = GUIDES.find(g => g.guide_id === guideId) || {
      guide_title: 'CAMPUS LIFE GUIDE'
    };

    detailMainTitle.innerHTML = guide.guide_title.replace('?', '?<br>');
    stepsFlowContainer.innerHTML = '';

    const currentSteps = ALL_STEPS
      .filter(s => s.guide_id === guideId)
      .sort((a, b) => a.step_number - b.step_number);

    if (currentSteps.length === 0) {
      stepsFlowContainer.innerHTML = `<p style="font-size:1.1rem; color:#666; padding: 2rem 0;">Step details are being updated...</p>`;
    } else {
      currentSteps.forEach(step => {
        const hasRealImage = step.filename && step.filename.trim() !== '';
        const isExcelNone = (step.status === 'none');
        const isPhoto = (step.display_frame === 'photo');

        const stepCard = document.createElement('div');

        if (isExcelNone) {
          stepCard.className = 'step-item-card step-card-text-only';
          stepCard.innerHTML = `
            <div class="step-info-col">
              <div class="step-circle-badge">${step.step_number || 1}</div>
              <h4 class="step-instruction-heading">${step.step_title}</h4>
              <p class="step-detail-text">${step.instruction || ''}</p>
              ${step.tip ? `<p class="step-detail-text" style="margin-top:0.5rem; color:#888;">* ${step.tip}</p>` : ''}
            </div>
          `;
        } else {
          stepCard.className = 'step-item-card';
          let mediaBox = '';

          if (isPhoto) {
            mediaBox = hasRealImage ? `
              <div class="mockup-photo-body">
                <img src="images/${step.filename}" alt="${step.step_title}" onerror="this.src='images/packagesandfood-01.png'">
              </div>
            ` : `
              <div class="mockup-photo-body">
                <div class="mockup-photo-placeholder">[ Photo Preview Pending ]</div>
              </div>
            `;
          } else {
            mediaBox = hasRealImage ? `
              <div class="mockup-phone-body">
                <div class="mockup-screen">
                  <img src="images/${step.filename}" alt="${step.step_title}" onerror="this.src='images/packagesandfood-01.png'">
                </div>
              </div>
            ` : `
              <div class="mockup-phone-body">
                <div class="mockup-screen-placeholder">[ Mobile Screen Preview Pending ]</div>
              </div>
            `;
          }

          stepCard.innerHTML = `
            ${mediaBox}
            <div class="step-info-col">
              <div class="step-circle-badge">${step.step_number || 1}</div>
              <h4 class="step-instruction-heading">${step.step_title}</h4>
              <p class="step-detail-text">${step.instruction || ''}</p>
              ${step.tip ? `<p class="step-detail-text" style="margin-top:0.5rem; color:#888;">* ${step.tip}</p>` : ''}
            </div>
          `;
        }

        stepsFlowContainer.appendChild(stepCard);
      });
    }

    switchView('guide');
    window.scrollTo(0, 0);
    setTimeout(updateScrollProgress, 100);
  }

  function openAppGallery(catKey) {
    const config = appGalleries[catKey] || appGalleries['01'];
    galleryCatTitle.textContent = config.title;
    galleryCardsGrid.innerHTML = '';

    config.apps.forEach(app => {
      const card = document.createElement('div');
      card.className = 'app-exhibit-card';
      card.innerHTML = `
        <div class="app-exhibit-icon-box">
          <img src="${app.icon}" alt="${app.name}" onerror="this.style.background='#EEE'">
        </div>
        <div class="app-exhibit-footer">
          <span class="app-exhibit-name">${app.name} ${app.sub}</span>
          <span class="app-exhibit-arrow">▶</span>
        </div>
      `;
      galleryCardsGrid.appendChild(card);
    });

    switchView('gallery');
    window.scrollTo(0, 0);
  }

  function updateScrollProgress() {
    if (!guideDetailView.classList.contains('active')) return;
    const layout = document.querySelector('.detail-scroll-layout');
    if (!layout) return;

    const rect = layout.getBoundingClientRect();
    const winH = window.innerHeight;
    const totalH = rect.height - winH;

    if (totalH <= 0) {
      trackLineFill.style.height = '100%';
      return;
    }

    const scrolled = Math.max(0, -rect.top + 80);
    const percent = Math.min(100, Math.max(0, (scrolled / totalH) * 100));
    trackLineFill.style.height = `${percent}%`;
  }

  function openDossier() {
    currentDormPage = 1;
    renderDormPage(currentDormPage);
    switchView('dossier');
    window.scrollTo(0, 0);
  }

  function renderDormPage(pageNum) {
    dossierPageLabel.textContent = `Page ${pageNum} / 3`;
    dossierBodyViewport.innerHTML = '';

    if (pageNum === 1) {
      dossierBodyViewport.innerHTML = `
        <div class="dorm-section-block">
          <h3 class="dorm-sec-heading">DORMITORY ADDRESS</h3>
          
          <div class="dossier-copyable-box">
            <div class="dorm-typewriter-text">
              ★ Building 12, Graduate Student Apartments<br>
              East China Normal University (Minhang Campus)<br>
              No. 5800 Hongmei South Road, Minhang District, Shanghai
            </div>
            <button class="copy-trigger-btn" data-copy="Building 12, Graduate Student Apartments, East China Normal University (Minhang Campus), No. 5800 Hongmei South Road, Minhang District, Shanghai" title="Copy English Address">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#222" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </button>
          </div>

          <div class="dossier-copyable-box">
            <div class="dorm-typewriter-text">
              ★ 上海市闵行区虹梅南路5800号华东师范大学闵行校区<br>
              研究生公寓12号楼
            </div>
            <button class="copy-trigger-btn" data-copy="上海市闵行区虹梅南路5800号华东师范大学闵行校区研究生公寓12号楼" title="复制中文地址">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#222" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </button>
          </div>
        </div>

        <div class="dorm-section-block">
          <h3 class="dorm-sec-heading">ACCESS HOURS</h3>
          <div class="dorm-typewriter-text">★ The dormitory entrance closes at 23:00.</div>
        </div>

        <div class="dorm-section-block">
          <h3 class="dorm-sec-heading">QUIET HOURS</h3>
          <div class="dorm-typewriter-text">★ Please keep noise to a minimum after 23:00.<br>Do not use washing machines or hair dryers after 23:00.</div>
        </div>
      `;
    } else if (pageNum === 2) {
      dossierBodyViewport.innerHTML = `
        <div class="dorm-section-block dossier-split-photo">
          <div>
            <h3 class="dorm-sec-heading">SHARED KITCHEN</h3>
            <div class="dorm-typewriter-text">
              • Please clean the kitchen after use.<br>
              • Do not leave personal items, pots, dishes, or cooking utensils on the countertops.<br>
              • Please return them to the cabinets or take them back to your room.
            </div>
          </div>
          <div class="polaroid-holder" style="transform: rotate(5deg);">
            <div class="metal-clip"></div>
            <img src="images/packagesandfood-01.png" alt="Kitchen">
          </div>
        </div>

        <div class="dorm-section-block dossier-split-photo" style="margin-top: 2.5rem;">
          <div class="polaroid-holder" style="transform: rotate(-4deg);">
            <img src="images/packagesandfood-02.png" alt="Garbage">
          </div>
          <div>
            <h3 class="dorm-sec-heading">GARBAGE DISPOSAL</h3>
            <div class="dorm-typewriter-text">
              • The kitchen trash bins are for food waste only.<br>
              • Trash from your room must be taken to the public garbage station located between Building 14 and the cafeteria.
            </div>
          </div>
        </div>
      `;
    } else if (pageNum === 3) {
      dossierBodyViewport.innerHTML = `
        <div class="dorm-section-block dossier-split-photo">
          <div>
            <h3 class="dorm-sec-heading">DRINKING WATER DISPENSERS</h3>
            <div class="dorm-typewriter-text">
              Water dispensers are located near the small staircases on the 2nd and 5th floors.
            </div>
          </div>
          <div class="polaroid-holder" style="transform: rotate(-3deg);">
            <img src="images/dormlife-01.png" alt="Water Dispenser">
          </div>
        </div>

        <div class="dorm-section-block dossier-split-photo" style="margin-top: 2.5rem;">
          <div>
            <h3 class="dorm-sec-heading">HAIR DRYER ROOMS</h3>
            <div class="dorm-typewriter-text">
              Hair dryer rooms are located near the small staircases on the 2nd, 4th, and 6th floors.
            </div>
          </div>
          <div class="polaroid-holder" style="transform: rotate(6deg);">
            <div class="metal-clip"></div>
            <img src="images/dormlife-02.png" alt="Hair Dryer">
          </div>
        </div>
      `;
    }

    dossierBodyViewport.querySelectorAll('.copy-trigger-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const text = btn.dataset.copy;
        navigator.clipboard.writeText(text).then(() => {
          showToast('Address copied to clipboard!');
        }).catch(() => {
          const ta = document.createElement('textarea');
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          showToast('Address copied to clipboard!');
        });
      });
    });
  }

  function showToast(msg) {
    toastPopup.textContent = msg;
    toastPopup.classList.add('show');
    setTimeout(() => toastPopup.classList.remove('show'), 2000);
  }

  bindEvents();
});
