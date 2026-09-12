/**
 * Campus Life Survival Guide - Complete Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const state = {
    guides: [],
    steps: [],
    screenshots: [],
    dormInfo: null,
    currentDormPage: 1,
    currentLang: localStorage.getItem('site_lang') || 'en',
    currentTheme: localStorage.getItem('site_theme') || 'light',
    currentGuideId: null
  };

  // 双语字典（已加入 TRANSIT 与 FAQ）
  const i18n = {
    en: {
      logoTitle: "CAMPUS LIFE",
      navPackages: "PACKAGES",
      navTransit: "TRANSIT",
      navFinance: "FINANCE",
      navDorm: "DORM LIFE",
      navApps: "APP DIRECTORY",
      navDormInfo: "DORM INFO",
      catPackages: "PACKAGES & FOOD",
      catTransit: "TRANSIT & COMMUTE",
      catFinance: "MONEY & PAYMENTS",
      catDorm: "SETTLING INTO YOUR DORM LIFE",
      g008Title: "HOW TO<br>GET MY<br>PACKAGES?",
      g008Desc: "finding pickup stations",
      g010Title: "HOW TO<br>GET MY<br>DELIVERY?",
      g010Desc: "where to grab your meal",
      g014Title: "HOW TO GET<br>A RIDE WITH<br>AMAP",
      g014Desc: "Call taxis & online car-hailing easily",
      g004Title: "HOW TO<br>TAKE THE<br>METRO",
      g004Desc: "Scan contactless QR codes at gates",
      g015Title: "HOW TO RIDE<br>A SHARED<br>BIKE",
      g015Desc: "Unlock street bikes with a quick scan",
      g001Title: "BANK<br>ACCOUNT<br>SETUP",
      g001Desc: "Required paperwork & activation",
      g002Title: "LINKING CARD<br>TO ALIPAY",
      g002Desc: "Link your card and start paying",
      g011Title: "DOING YOUR<br>LAUNDRY",
      g011Desc: "Quick guide to washing machines",
      g009Title: "KEEPING THE<br>POWER ON",
      g009Desc: "Easy recharges so you're never stuck",
      g012Title: "GETTING<br>THINGS FIXED",
      g012Desc: "How to submit repair requests",
      learnMore: "LEARN MORE",
      scatteredIntro: "• Click any category below or browse the full ecosystem •",
      scatteredHeading: "RECOMMEND<br>APPS",
      appCat1: "Food & Delivery",
      appCat2: "Transit & Maps",
      appCat3: "Finance & Payments",
      appCat4: "Shopping",
      appCat5: "VPN & Network",
      dossierBtn: "Building 12 Dormitory Information",
      survivalTag: "CAMPUS SURVIVAL GUIDE",
      closeDossier: "CLOSE",
      searchPlaceholder: "Search guides (e.g. Cainiao, Laundry, Alipay, Delivery)...",
      noResults: "No matching guides found.",
      copiedToast: "Address copied to clipboard!",
      faqMainTitle: "Questions People<br>Often Ask",
      faqQ1: "What time is the dormitory curfew? What should I do if I return late?",
      faqA1: "The dormitory doors are locked at 11:00 PM. If you return late, check the dorm staff's phone number displayed at the front desk through the glass door and call her to open the door. After entering, you will need to register your late return.",
      faqQ2: "Can I bring visitors into the dormitory?",
      faqA2: "Yes. All visitors must register at the front desk when entering the dormitory and must leave before 10:00 PM.",
      faqQ3: "What should I do if I have a conflict with another resident?",
      faqA3: "Please contact the Dorm Leader as soon as possible for help with communication and mediation. Please avoid arguing or escalating the situation.",
      faqQ4: "What numbers should I call in an emergency?",
      faqA4: "In an emergency, call the appropriate number:<br><br>🚓 <strong>Police:</strong> 110<br>🚑 <strong>Ambulance:</strong> 120<br>🚒 <strong>Fire:</strong> 119"
    },
    zh: {
      logoTitle: "校园生活指引",
      navPackages: "快递外卖",
      navTransit: "交通出行",
      navFinance: "金融支付",
      navDorm: "宿舍生活",
      navApps: "常用软件",
      navDormInfo: "宿舍信息",
      catPackages: "快递与外卖",
      catTransit: "交通与出行指南",
      catFinance: "金融与支付",
      catDorm: "融入宿舍新生活",
      g008Title: "如何取<br>我的快递？",
      g008Desc: "菜鸟驿站与取件码指南",
      g010Title: "如何取<br>我的外卖？",
      g010Desc: "美团外卖点餐与外卖架取餐",
      g014Title: "如何使用<br>高德地图打车",
      g014Desc: "网约车呼叫与出租车出行",
      g004Title: "如何扫码<br>乘坐上海地铁",
      g004Desc: "支付宝与乘车码进出站",
      g015Title: "如何使用<br>共享单车骑行",
      g015Desc: "美团与哈啰单车扫码开锁指南",
      g001Title: "银行账户<br>开设指南",
      g001Desc: "所需证件、网点办理与激活",
      g002Title: "支付宝<br>绑定银行卡",
      g002Desc: "轻松绑定借记卡开启扫码支付",
      g011Title: "宿舍洗衣机<br>使用指南",
      g011Desc: "一楼洗衣房、烘干机与微信支付",
      g009Title: "校园卡与<br>宿舍电费充值",
      g009Desc: "微信小程序快捷缴费指南",
      g012Title: "宿舍报修<br>全流程",
      g012Desc: "企业微信报修系统使用方法",
      learnMore: "查看指南",
      scatteredIntro: "• 点击下方分类查看常用应用生态 •",
      scatteredHeading: "推荐应用<br>RECOMMEND",
      appCat1: "外卖订餐",
      appCat2: "交通出行",
      appCat3: "移动支付",
      appCat4: "网络购物",
      appCat5: "校园网络",
      dossierBtn: "12号楼 宿舍规章与档案",
      survivalTag: "留学生校园生存手册",
      closeDossier: "关闭档案",
      searchPlaceholder: "搜索指南 (例如：菜鸟, 洗衣, 外卖, 支付宝)...",
      noResults: "未找到相关指南。",
      copiedToast: "地址已成功复制到剪贴板！",
      faqMainTitle: "常见宿舍疑问解答<br>FAQ",
      faqQ1: "宿舍几点门禁？晚归怎么办？",
      faqA1: "宿舍将在 23:00 锁门。如果晚归，请透过玻璃门查看前台宿管阿姨的手机号码，并拨打电话请她帮忙开门。进入宿舍后，需要进行晚归登记。",
      faqQ2: "可以带访客进入宿舍吗？",
      faqA2: "可以，但所有访客进入宿舍时都必须在前台登记，并且必须在 22:00 前离开宿舍。",
      faqQ3: "如果和其他住户发生矛盾或冲突怎么办？",
      faqA3: "请第一时间联系楼长协助沟通和调解。请尽量避免自行争执或让冲突升级。",
      faqQ4: "遇到紧急情况应该拨打什么电话？",
      faqA4: "在紧急情况下，请根据情况拨打：<br><br>🚓 <strong>报警 Police:</strong> 110<br>🚑 <strong>急救 Ambulance:</strong> 120<br>🚒 <strong>火警 Fire:</strong> 119"
    }
  };

  const appGalleries = {
    '01': {
      title: '01 FOOD & DELIVERY',
      breadcrumb: '01 food & delivery',
      apps: [
        { name: '美团', sub: 'MeiTuan', icon: 'images/meituanicon.png' },
        { name: '淘宝', sub: 'TaoBao', icon: 'images/taobaoicon.png' },
        { name: '京东', sub: 'JingDong', icon: 'images/jdicon.png' }
      ]
    },
    '02': {
      title: '02 TRANSIT & MAPS',
      breadcrumb: '02 transit & maps',
      apps: [
        { name: '高德地图', sub: 'Amap', icon: 'images/amapicon.png' },
        { name: '哈喽', sub: 'HaLou', icon: 'images/haloicon.png' }
      ]
    },
    '03': {
      title: '03 FINANCE & PAYMENTS',
      breadcrumb: '03 finance & payments',
      apps: [
        { name: '支付宝', sub: 'Alipay', icon: 'images/alipayicon.png' },
        { name: '工商银行', sub: 'ICBC', icon: 'images/icbcicon.png' },
        { name: '微信', sub: 'WeChat Pay', icon: 'images/wechatpayicon.png' }
      ]
    },
    '04': {
      title: '04 SHOPPING',
      breadcrumb: '04 shopping',
      apps: [
        { name: '淘宝', sub: 'TaoBao', icon: 'images/taobaoicon.png' },
        { name: '京东', sub: 'JingDong', icon: 'images/jdicon.png' },
        { name: '菜鸟', sub: 'CaiNiao', icon: 'images/cainiaoicon.png' }
      ]
    },
    '05': {
      title: '05 VPN',
      breadcrumb: '05 vpn & network',
      apps: [
        { name: 'Skuracat', sub: '', icon: 'images/sakuracaticon.png' },
        { name: 'Ikuuu', sub: '', icon: 'images/ikuuuicon.png' }
      ]
    }
  };

  // DOM 节点引用
  const homeView = document.getElementById('homeView');
  const guideDetailView = document.getElementById('guideDetailView');
  const appGalleryView = document.getElementById('appGalleryView');
  const dormDossierView = document.getElementById('dormDossierView');

  const detailMainTitle = document.getElementById('detailMainTitle');
  const stepsFlowContainer = document.getElementById('stepsFlowContainer');
  const trackLineFill = document.getElementById('trackLineFill');

  const crumbGuideCat = document.getElementById('crumbGuideCat');
  const crumbGuideCurrent = document.getElementById('crumbGuideCurrent');
  const crumbGalleryCurrent = document.getElementById('crumbGalleryCurrent');

  const galleryCatTitle = document.getElementById('galleryCatTitle');
  const galleryCardsGrid = document.getElementById('galleryCardsGrid');

  const dormFileTrigger = document.getElementById('dormFileTrigger');
  const dossierCloseBtn = document.getElementById('dossierCloseBtn');
  const dossierPrevBtn = document.getElementById('dossierPrevBtn');
  const dossierNextBtn = document.getElementById('dossierNextBtn');
  const dossierPageLabel = document.getElementById('dossierPageLabel');
  const dossierBodyViewport = document.getElementById('dossierBodyViewport');
  const toastPopup = document.getElementById('toastPopup');

  const searchInput = document.getElementById('searchInput');
  const searchClearBtn = document.getElementById('searchClearBtn');
  const searchResultsDropdown = document.getElementById('searchResultsDropdown');

  const langToggleBtn = document.getElementById('langToggleBtn');
  const langLabel = document.getElementById('langLabel');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const themeLabel = document.getElementById('themeLabel');

  async function fetchSafeJson(url) {
    try {
      const res = await fetch(url);
      if (!res.ok) return [];
      let text = (await res.text()).trim();
      if (!text) return [];

      if (text.startsWith('"') && text.includes('":[')) text = '{' + text;
      if (text.startsWith('{') && !text.endsWith('}')) text = text + '}';

      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) return parsed;
      if (typeof parsed === 'object' && parsed !== null) {
        for (let k of Object.keys(parsed)) {
          if (Array.isArray(parsed[k])) return parsed[k];
        }
      }
      return [];
    } catch (e) {
      console.warn('JSON read fallback for ' + url, e);
      return [];
    }
  }

  async function init() {
    applyTheme(state.currentTheme);
    applyLanguage(state.currentLang);

    state.guides = await fetchSafeJson('data/guides.json');
    state.steps = await fetchSafeJson('data/steps.json');
    state.screenshots = await fetchSafeJson('data/screenshots.json');

    try {
      const dRes = await fetch('data/dorm-info.json');
      if (dRes.ok) state.dormInfo = await dRes.json();
    } catch (e) {}

    bindEvents();
  }

  function bindEvents() {
    // 卡片点击
    
    document.querySelectorAll('.guide-card').forEach(card => {
      card.addEventListener('click', () => {
        const gid = card.dataset.guideId;
        const cat = card.dataset.category || 'PACKAGES & FOOD';
        openGuideDetail(gid, cat);
      });
    });

    // 拍立得点击
    document.querySelectorAll('.pin-card').forEach(card => {
      card.addEventListener('click', () => {
        const catKey = card.dataset.appCat;
        openAppGallery(catKey);
      });
    });

    // 面包屑返回首页
    document.querySelectorAll('[data-action="go-home"]').forEach(el => {
      el.addEventListener('click', () => {
        switchView('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    // 面包屑定位 App 区域
    document.querySelectorAll('[data-action="go-apps"]').forEach(el => {
      el.addEventListener('click', () => {
        switchView('home');
        const appsSec = document.getElementById('apps');
        if (appsSec) appsSec.scrollIntoView({ behavior: 'smooth' });
      });
    });

    // 档案袋打开
    if (dormFileTrigger) dormFileTrigger.addEventListener('click', openDossier);
    document.querySelectorAll('#openDormLink').forEach(el => {
      el.addEventListener('click', openDossier);
    });
    if (dossierCloseBtn) dossierCloseBtn.addEventListener('click', () => switchView('home'));

    if (dossierPrevBtn) {
      dossierPrevBtn.addEventListener('click', () => {
        if (state.currentDormPage > 1) {
          state.currentDormPage--;
          renderDormPage(state.currentDormPage);
        }
      });
    }

    if (dossierNextBtn) {
      dossierNextBtn.addEventListener('click', () => {
        const total = (state.dormInfo && state.dormInfo.pages) ? state.dormInfo.pages.length : 3;
        if (state.currentDormPage < total) {
          state.currentDormPage++;
          renderDormPage(state.currentDormPage);
        }
      });
    }

    window.addEventListener('scroll', updateScrollProgress);

    // 搜索实时下拉
    if (searchInput) {
      searchInput.addEventListener('input', handleSearchDropdown);
      searchInput.addEventListener('focus', handleSearchDropdown);
    }
    if (searchClearBtn) {
      searchClearBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchClearBtn.style.display = 'none';
        searchResultsDropdown.classList.remove('open');
      });
    }

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-bar-wrap')) {
        searchResultsDropdown.classList.remove('open');
      }
    });

    // 语言与模式切换
    if (langToggleBtn) {
      langToggleBtn.addEventListener('click', () => {
        const next = state.currentLang === 'en' ? 'zh' : 'en';
        applyLanguage(next);
      });
    }

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const next = state.currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(next);
      });
    }

    // FAQ 手风琴展开与收起
    document.querySelectorAll('.faq-item').forEach(item => {
      const btn = item.querySelector('.faq-question-btn');
      const panel = item.querySelector('.faq-answer-panel');

      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        if (isOpen) {
          item.classList.remove('active');
          panel.style.maxHeight = null;
        } else {
          item.classList.add('active');
          panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      });
    });
  }

  function applyLanguage(lang) {
    state.currentLang = lang;
    localStorage.setItem('site_lang', lang);
    document.documentElement.setAttribute('data-lang', lang);

    if (langLabel) langLabel.textContent = lang === 'en' ? '中文' : 'EN';
    const dict = i18n[lang];

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (dict[key]) el.innerHTML = dict[key];
    });

    if (searchInput) searchInput.placeholder = dict.searchPlaceholder;
  }

  function applyTheme(theme) {
    state.currentTheme = theme;
    localStorage.setItem('site_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);

    if (themeIcon && themeLabel) {
      if (theme === 'dark') {
        themeIcon.textContent = '☀️';
        themeLabel.textContent = 'LIGHT';
      } else {
        themeIcon.textContent = '🌙';
        themeLabel.textContent = 'DARK';
      }
    }
  }

  function handleSearchDropdown() {
    const query = searchInput.value.trim().toLowerCase();
    if (searchClearBtn) searchClearBtn.style.display = query ? 'block' : 'none';

    if (!query) {
      searchResultsDropdown.classList.remove('open');
      return;
    }

    const cards = Array.from(document.querySelectorAll('.guide-card'));
    const matched = [];

    cards.forEach(card => {
      const gid = card.dataset.guideId;
      const cat = card.dataset.category || '';
      const title = card.querySelector('.card-headline')?.innerText.replace(/\n/g, ' ') || '';
      const app = card.querySelector('.card-app-name')?.innerText || '';
      const desc = card.querySelector('.card-sub-desc')?.innerText || '';
      const tags = (card.dataset.tags || '').toLowerCase();

      const fullString = `${title} ${app} ${desc} ${tags}`.toLowerCase();
      if (fullString.includes(query)) {
        matched.push({ gid, cat, title, app, desc });
      }
    });

    if (matched.length === 0) {
      searchResultsDropdown.innerHTML = `
        <div style="padding: 1.2rem; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
          ${i18n[state.currentLang].noResults}
        </div>
      `;
      searchResultsDropdown.classList.add('open');
      return;
    }

    searchResultsDropdown.innerHTML = matched.map(m => `
      <div class="search-item-row" data-guide-id="${m.gid}" data-category="${m.cat}">
        <div class="search-item-main">
          <span class="search-item-title">${m.title}</span>
          <span class="search-item-sub">${m.desc}</span>
        </div>
        <span class="search-item-tag">${m.app}</span>
      </div>
    `).join('');

    searchResultsDropdown.classList.add('open');

    searchResultsDropdown.querySelectorAll('.search-item-row').forEach(row => {
      row.addEventListener('click', () => {
        const gid = row.dataset.guideId;
        const cat = row.dataset.category;
        searchResultsDropdown.classList.remove('open');
        openGuideDetail(gid, cat);
      });
    });
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
function formatInstructionWithLinks(text) {
    if (!text) return '';
    const urlRegex = /(https?:\/\/[^\s\]]+)/g;
    return text.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="step-inline-link">${url}</a>`;
    });
  }
  // 步骤详情渲染（先文字指令，后配图；起点对齐）
  function openGuideDetail(guideId, categoryName = 'PACKAGES & FOOD') {
    state.currentGuideId = guideId;
    const targetId = (guideId || '').trim();
    const guide = state.guides.find(g => (g.guide_id || '').trim() === targetId) || {
      guide_title: 'CAMPUS SURVIVAL'
    };

    if (crumbGuideCat) {
      crumbGuideCat.textContent = categoryName.toLowerCase();
      crumbGuideCat.onclick = () => {
        switchView('home');
        const targetSec = categoryName.includes('PACKAGES') ? 'packages' :
                          categoryName.includes('TRANSIT') ? 'transit' :
                          categoryName.includes('MONEY') ? 'finance' : 'dorm';
        const secEl = document.getElementById(targetSec);
        if (secEl) secEl.scrollIntoView({ behavior: 'smooth' });
      };
    }

    if (crumbGuideCurrent) crumbGuideCurrent.textContent = (guide.guide_title || '').toLowerCase();

    detailMainTitle.innerHTML = (guide.guide_title || '').replace('?', '?<br>');
    stepsFlowContainer.innerHTML = '';

    const currentSteps = state.steps
      .filter(s => (s.guide_id || '').trim() === targetId)
      .sort((a, b) => (Number(a.step_number) || 0) - (Number(b.step_number) || 0));

    if (currentSteps.length === 0) {
      stepsFlowContainer.innerHTML = `<p style="font-size:1.1rem; color:var(--text-muted); padding: 2rem 0;">Step details are being updated...</p>`;
    } else {
      currentSteps.forEach(step => {
        const imgId = String(step.image_id || '').trim();
        const stepId = String(step.step_id || '').trim();

        const ss = state.screenshots.find(s => {
          const sImgId = String(s.image_id || '').trim();
          const sStepId = String(s.step_id || '').trim();
          return (imgId && sImgId === imgId) || (stepId && sStepId === stepId);
        });

        const fileName = step.filename || (ss ? ss.filename : '');
        const hasRealImage = fileName && String(fileName).trim() !== '' && fileName !== 'null';
        const ssStatus = String(step.status || (ss ? ss.status : '') || '').toLowerCase().trim();
        const isExcelNone = ssStatus === 'none';

        const stepCard = document.createElement('div');
        stepCard.className = isExcelNone ? 'step-item-card step-card-text-only' : 'step-item-card';

        // 1. 顶部标题指令区：序号与文字基线水平对齐
        const headerHtml = `
          <div class="step-top-header">
            <div class="step-circle-badge">${step.step_number || 1}</div>
            <div class="step-text-wrap">
              <h4 class="step-instruction-heading">${step.step_title || ''}</h4>
             ${step.instruction ? `<p class="step-detail-text">${formatInstructionWithLinks(step.instruction)}</p>` : ''}
              ${step.tip ? `<div class="step-tip-callout">* ${step.tip}</div>` : ''}
            </div>
          </div>
        `;

        // 2. 紧接下方配图区（组内间距仅 14px）
        if (isExcelNone) {
          stepCard.innerHTML = headerHtml;
        } else {
          const mediaContainer = document.createElement('div');
          mediaContainer.className = 'step-media-box';

          const frameBody = document.createElement('div');
          frameBody.className = 'mockup-phone-body';

          if (hasRealImage) {
            const screen = document.createElement('div');
            screen.className = 'mockup-screen';
            const img = document.createElement('img');
            img.src = `images/${fileName}`;
            img.alt = step.step_title || '';

            // 图像自适应嗅探：偏扁则卸下手机壳，换相框
            img.onload = () => {
              const ratio = img.naturalHeight / img.naturalWidth;
              if (ratio < 1.45) {
                frameBody.className = 'mockup-photo-body';
                screen.className = '';
              }
            };

            screen.appendChild(img);
            frameBody.appendChild(screen);
          } else {
            frameBody.innerHTML = `<div class="mockup-photo-placeholder">[ Step Preview Pending ]</div>`;
          }

          mediaContainer.appendChild(frameBody);
          stepCard.innerHTML = headerHtml;
          stepCard.appendChild(mediaContainer);
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
    if (crumbGalleryCurrent) crumbGalleryCurrent.textContent = config.breadcrumb;
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
    state.currentDormPage = 1;
    renderDormPage(state.currentDormPage);
    switchView('dossier');
    window.scrollTo(0, 0);
  }

  function renderDormPage(pageNum) {
    const total = (state.dormInfo && state.dormInfo.pages) ? state.dormInfo.pages.length : 3;
    dossierPageLabel.textContent = `Page ${pageNum} / ${total}`;
    dossierBodyViewport.innerHTML = '';

    if (state.dormInfo && state.dormInfo.pages) {
      const pageData = state.dormInfo.pages.find(p => p.page_number === pageNum);
      if (pageData && pageData.sections) {
        pageData.sections.forEach(sec => {
          const secDiv = document.createElement('div');
          secDiv.className = sec.photo ? 'dorm-section-block dossier-split-photo' : 'dorm-section-block';

          let itemsHtml = '';
          (sec.items || []).forEach(item => {
            if (item.type === 'copyable') {
              itemsHtml += `
                <div class="dossier-copyable-box">
                  <div class="dorm-typewriter-text" style="white-space: pre-line;">★ ${item.text}</div>
                  <button class="copy-trigger-btn" data-copy="${encodeURIComponent(item.text)}" title="Copy Address">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#222" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  </button>
                </div>
              `;
            } else {
              itemsHtml += `<div class="dorm-typewriter-text" style="margin-bottom: 0.5rem; white-space: pre-line;">${item.type === 'bullet' ? '• ' : '★ '}${item.text}</div>`;
            }
          });

          if (sec.photo) {
            secDiv.innerHTML = `
              <div>
                <h3 class="dorm-sec-heading">${sec.title}</h3>
                ${itemsHtml}
              </div>
              <div class="polaroid-holder" style="transform: rotate(${sec.photo.rotation || 0}deg);">
                ${sec.photo.has_clip ? '<div class="metal-clip"></div>' : ''}
                <img src="${sec.photo.image}" alt="${sec.title}">
              </div>
            `;
          } else {
            secDiv.innerHTML = `
              <h3 class="dorm-sec-heading">${sec.title}</h3>
              ${itemsHtml}
            `;
          }

          dossierBodyViewport.appendChild(secDiv);
        });
      }
    } else {
      renderDefaultDormHtml(pageNum);
    }

    dossierBodyViewport.querySelectorAll('.copy-trigger-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const text = decodeURIComponent(btn.dataset.copy);
        navigator.clipboard.writeText(text).then(() => {
          showToast(i18n[state.currentLang].copiedToast);
        }).catch(() => {
          const ta = document.createElement('textarea');
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          showToast(i18n[state.currentLang].copiedToast);
        });
      });
    });
  }

  function renderDefaultDormHtml(pageNum) {
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
            <img src="images/kitchen.png" alt="Kitchen">
          </div>
        </div>
        <div class="dorm-section-block dossier-split-photo" style="margin-top: 2.5rem;">
          <div class="polaroid-holder" style="transform: rotate(-4deg);">
            <img src="images/garbage.png" alt="Garbage">
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
            <img src="images/water.png" alt="Water Dispenser">
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
            <img src="images/hairdryer.png" alt="Hair Dryer">
          </div>
        </div>
      `;
    }
  }

  function showToast(msg) {
    toastPopup.textContent = msg;
    toastPopup.classList.add('show');
    setTimeout(() => toastPopup.classList.remove('show'), 2000);
  }

  init();
});
