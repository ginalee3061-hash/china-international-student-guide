/**
 * Campus Life Survival Guide - Interactive Engine
 * 包含：动态 JSON 加载、中英双语切换、亮暗模式、模糊下拉搜索、长宽比相框自动嗅探
 */
document.addEventListener('DOMContentLoaded', () => {
  // 全局数据状态
  const state = {
    guides: [],
    steps: [],
    screenshots: [],
    dormInfo: null,
    currentDormPage: 1,
    currentLang: localStorage.getItem('site_lang') || 'en',
    currentTheme: localStorage.getItem('site_theme') || 'light'
  };

  // 双语字典字典表 (新功能 1)
  const i18n = {
    en: {
      logoTitle: "CAMPUS LIFE",
      navPackages: "PACKAGES",
      navFinance: "FINANCE",
      navDorm: "DORM LIFE",
      navApps: "APP DIRECTORY",
      navDormInfo: "DORM INFO",
      catPackages: "PACKAGES & FOOD",
      catFinance: "MONEY & PAYMENTS",
      catDorm: "SETTLING INTO YOUR DORM LIFE",
      g008Title: "HOW TO<br>GET MY<br>PACKAGES?",
      g008Desc: "finding pickup stations",
      g010Title: "HOW TO<br>GET MY<br>DELIVERY?",
      g010Desc: "where to grab your meal",
      g001Title: "BANK<br>ACCOUNT<br>SETUP",
      g001Desc: "Required paperwork & activation",
      g002Title: "LINKING CARD<br>TO ALIPAY",
      g002Desc: "Link your card and start paying",
      g004Title: "HOW TO TAKE<br>METRO WITH<br>ALIPAY?",
      g004Desc: "Scan using a QR code",
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
      backToGuides: "BACK TO GUIDES",
      survivalTag: "CAMPUS SURVIVAL GUIDE",
      backToHome: "BACK TO HOME",
      closeDossier: "CLOSE",
      searchPlaceholder: "Search guides (e.g. Cainiao, Laundry, Alipay, Delivery)...",
      noResults: "No matching guides found.",
      copiedToast: "Address copied to clipboard!"
    },
    zh: {
      logoTitle: "校园生活指引",
      navPackages: "快递外卖",
      navFinance: "金融支付",
      navDorm: "宿舍生活",
      navApps: "常用软件",
      navDormInfo: "宿舍信息",
      catPackages: "快递与外卖",
      catFinance: "金融与支付",
      catDorm: "融入宿舍新生活",
      g008Title: "如何取<br>我的快递？",
      g008Desc: "菜鸟驿站与取件码指南",
      g010Title: "如何取<br>我的外卖？",
      g010Desc: "美团外卖点餐与外卖架取餐",
      g001Title: "银行账户<br>开设指南",
      g001Desc: "所需证件、网点办理与激活",
      g002Title: "支付宝<br>绑定银行卡",
      g002Desc: "轻松绑定借记卡开启扫码支付",
      g004Title: "如何用支付宝<br>乘坐上海地铁？",
      g004Desc: "扫码乘车与交通出行",
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
      backToGuides: "返回指南列表",
      survivalTag: "留学生校园生存手册",
      backToHome: "返回主页",
      closeDossier: "关闭档案",
      searchPlaceholder: "搜索指南 (例如：菜鸟, 洗衣, 外卖, 支付宝)...",
      noResults: "未找到相关指南。",
      copiedToast: "地址已成功复制到剪贴板！"
    }
  };

  // RECOMMEND APPS (01) ~ (05) 展台数据
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

  // DOM 元素引用
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
  const searchClearBtn = document.getElementById('searchClearBtn');
  const searchResultsDropdown = document.getElementById('searchResultsDropdown');

  const langToggleBtn = document.getElementById('langToggleBtn');
  const langLabel = document.getElementById('langLabel');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const themeLabel = document.getElementById('themeLabel');

  // 通用 JSON 容错解包提取器
  async function fetchSafeJson(url) {
    try {
      const res = await fetch(url);
      if (!res.ok) return [];
      let text = (await res.text()).trim();
      if (!text) return [];

      if (text.startsWith('"') && text.includes('":[')) {
        text = '{' + text;
      }
      if (text.startsWith('{') && !text.endsWith('}')) {
        text = text + '}';
      }

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

  // 初始化入口
  async function init() {
    // 渲染系统偏好主题与语言
    applyTheme(state.currentTheme);
    applyLanguage(state.currentLang);

    // 动态拉取 JSON
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
        openGuideDetail(gid);
      });
    });

    // 散落拍立得点击
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

    // 档案袋
    dormFileTrigger.addEventListener('click', openDossier);
    if (openDormLink) openDormLink.addEventListener('click', openDossier);
    dossierCloseBtn.addEventListener('click', () => switchView('home'));

    dossierPrevBtn.addEventListener('click', () => {
      if (state.currentDormPage > 1) {
        state.currentDormPage--;
        renderDormPage(state.currentDormPage);
      }
    });

    dossierNextBtn.addEventListener('click', () => {
      const total = (state.dormInfo && state.dormInfo.pages) ? state.dormInfo.pages.length : 3;
      if (state.currentDormPage < total) {
        state.currentDormPage++;
        renderDormPage(state.currentDormPage);
      }
    });

    window.addEventListener('scroll', updateScrollProgress);

    // 搜索实时下拉列表交互 (问题 5)
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

    // 点击空白处关闭搜索下拉
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-bar-wrap')) {
        searchResultsDropdown.classList.remove('open');
      }
    });

    // 语言与主题切换事件 (新功能 1 & 2)
    langToggleBtn.addEventListener('click', () => {
      const nextLang = state.currentLang === 'en' ? 'zh' : 'en';
      applyLanguage(nextLang);
    });

    themeToggleBtn.addEventListener('click', () => {
      const nextTheme = state.currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(nextTheme);
    });
  }

  // 语言应用函数
  function applyLanguage(lang) {
    state.currentLang = lang;
    localStorage.setItem('site_lang', lang);
    document.documentElement.setAttribute('data-lang', lang);

    langLabel.textContent = lang === 'en' ? '中文' : 'EN';
    const dict = i18n[lang];

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (dict[key]) el.innerHTML = dict[key];
    });

    searchInput.placeholder = dict.searchPlaceholder;
  }

  // 主题应用函数
  function applyTheme(theme) {
    state.currentTheme = theme;
    localStorage.setItem('site_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);

    if (theme === 'dark') {
      themeIcon.textContent = '☀️';
      themeLabel.textContent = 'LIGHT';
    } else {
      themeIcon.textContent = '🌙';
      themeLabel.textContent = 'DARK';
    }
  }

  // 即时下拉搜索列表 (问题 5)
  function handleSearchDropdown() {
    const query = searchInput.value.trim().toLowerCase();
    searchClearBtn.style.display = query ? 'block' : 'none';

    if (!query) {
      searchResultsDropdown.classList.remove('open');
      return;
    }

    const cards = Array.from(document.querySelectorAll('.guide-card'));
    const matched = [];

    cards.forEach(card => {
      const gid = card.dataset.guideId;
      const title = card.querySelector('.card-headline')?.innerText.replace(/\n/g, ' ') || '';
      const app = card.querySelector('.card-app-name')?.innerText || '';
      const desc = card.querySelector('.card-sub-desc')?.innerText || '';
      const tags = (card.dataset.tags || '').toLowerCase();

      const fullString = `${title} ${app} ${desc} ${tags}`.toLowerCase();
      if (fullString.includes(query)) {
        matched.push({ gid, title, app, desc });
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
      <div class="search-item-row" data-guide-id="${m.gid}">
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
        searchResultsDropdown.classList.remove('open');
        openGuideDetail(gid);
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

  // 步骤详情渲染 (问题 3：自动嗅探图片长宽比，扁图自动切为相框)
  function openGuideDetail(guideId) {
    const targetId = (guideId || '').trim();
    const guide = state.guides.find(g => (g.guide_id || '').trim() === targetId) || {
      guide_title: 'CAMPUS SURVIVAL'
    };

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

        if (isExcelNone) {
          stepCard.className = 'step-item-card step-card-text-only';
          stepCard.innerHTML = `
            <div class="step-info-col">
              <div class="step-circle-badge">${step.step_number || 1}</div>
              <h4 class="step-instruction-heading">${step.step_title || ''}</h4>
              <p class="step-detail-text">${step.instruction || ''}</p>
              ${step.tip ? `<p class="step-detail-text" style="margin-top:0.5rem; color:#888;">* ${step.tip}</p>` : ''}
            </div>
          `;
        } else {
          stepCard.className = 'step-item-card';

          // 核心修复 (问题 3)：长宽比自适应容器
          // 初始默认给一个容器，图片加载后如果发现 aspect-ratio < 1.4，自动切换样式为相框
          const mediaContainer = document.createElement('div');
          mediaContainer.className = 'mockup-phone-body'; // 默认外壳

          if (hasRealImage) {
            const screen = document.createElement('div');
            screen.className = 'mockup-screen';
            const img = document.createElement('img');
            img.src = `images/${fileName}`;
            img.alt = step.step_title || '';

            // 图像自适应嗅探
            img.onload = () => {
              const ratio = img.naturalHeight / img.naturalWidth;
              // 如果图片是扁平的 (宽高比偏小) 或者非典型竖屏手机比例，立刻换成相框
              if (ratio < 1.45) {
                mediaContainer.className = 'mockup-photo-body';
                screen.className = '';
              }
            };

            screen.appendChild(img);
            mediaContainer.appendChild(screen);
          } else {
            mediaContainer.innerHTML = `<div class="mockup-photo-placeholder">[ Step Preview Pending ]</div>`;
          }

          const infoCol = document.createElement('div');
          infoCol.className = 'step-info-col';
          infoCol.innerHTML = `
            <div class="step-circle-badge">${step.step_number || 1}</div>
            <h4 class="step-instruction-heading">${step.step_title || ''}</h4>
            <p class="step-detail-text">${step.instruction || ''}</p>
            ${step.tip ? `<p class="step-detail-text" style="margin-top:0.5rem; color:#888;">* ${step.tip}</p>` : ''}
          `;

          stepCard.appendChild(mediaContainer);
          stepCard.appendChild(infoCol);
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
    state.currentDormPage = 1;
    renderDormPage(state.currentDormPage);
    switchView('dossier');
    window.scrollTo(0, 0);
  }

  // 档案渲染
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
  }

  function showToast(msg) {
    toastPopup.textContent = msg;
    toastPopup.classList.add('show');
    setTimeout(() => toastPopup.classList.remove('show'), 2000);
  }

  init();
});
