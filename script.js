/**
 * Campus Life Survival Guide - Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  const state = {
    guides: [],
    steps: [],
    screenshots: [],
    currentDormPage: 1
  };

  // RECOMMEND APPS 图 6~10 的配置元数据
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

  // 视图节点
  const homeView = document.getElementById('homeView');
  const guideDetailView = document.getElementById('guideDetailView');
  const appGalleryView = document.getElementById('appGalleryView');
  const dormDossierView = document.getElementById('dormDossierView');

  // 组件节点
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

  async function init() {
    try {
      const [guides, steps, screenshots] = await Promise.all([
        fetch('data/guides.json').then(r => r.json()),
        fetch('data/steps.json').then(r => r.json()),
        fetch('data/screenshots.json').then(r => r.json())
      ]);

      state.guides = guides;
      state.steps = steps;
      state.screenshots = screenshots;

      bindEvents();
    } catch (err) {
      console.error('Data initialization error:', err);
    }
  }

  function bindEvents() {
    // 点击主页卡片 -> 打开对应指南
    document.querySelectorAll('.guide-card').forEach(card => {
      card.addEventListener('click', () => {
        const gid = card.dataset.guideId;
        openGuideDetail(gid);
      });
    });

    // 点击散落拍立得 (01) ~ (05) -> 打开图 6~10 App 展台
    document.querySelectorAll('.pin-card').forEach(card => {
      card.addEventListener('click', () => {
        const catKey = card.dataset.appCat;
        openAppGallery(catKey);
      });
    });

    // 返回主页
    btnBackHome.addEventListener('click', () => {
      switchView('home');
      window.scrollTo(0, 0);
    });

    btnBackFromGallery.addEventListener('click', () => {
      switchView('home');
      window.scrollTo(0, 0);
    });

    // Building 12 档案
    dormFileTrigger.addEventListener('click', openDossier);
    openDormLink.addEventListener('click', openDossier);

    dossierCloseBtn.addEventListener('click', () => switchView('home'));

    dossierPrevBtn.addEventListener('click', () => {
      if (state.currentDormPage > 1) {
        state.currentDormPage--;
        renderDormPage(state.currentDormPage);
      }
    });

    dossierNextBtn.addEventListener('click', () => {
      if (state.currentDormPage < 3) {
        state.currentDormPage++;
        renderDormPage(state.currentDormPage);
      }
    });

    window.addEventListener('scroll', updateScrollProgress);
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

  // 1. 严格对应 Excel 的步骤与图片判断引擎
  function openGuideDetail(guideId) {
    const guide = state.guides.find(g => g.guide_id === guideId) || {
      guide_title: 'CAMPUS LIFE GUIDE'
    };

    detailMainTitle.innerHTML = guide.guide_title.replace('?', '?<br>');
    stepsFlowContainer.innerHTML = '';

    const currentSteps = state.steps.filter(s => s.guide_id === guideId);

    if (currentSteps.length === 0) {
      stepsFlowContainer.innerHTML = `<p style="font-size:1.1rem; color:#666;">Step details for this guide are being updated...</p>`;
    } else {
      currentSteps.forEach(step => {
        const ss = state.screenshots.find(s => s.image_id === step.image_id);
        const hasRealImage = ss && ss.filename && ss.filename.trim() !== '';
        const isExcelNone = ss && ss.status === 'none';
        const isPhoto = (step.display_frame === 'photo') || (ss && ss.display_frame === 'photo');

        const stepCard = document.createElement('div');

        // 情况 C：Excel 中 status === 'none' -> 纯文字卡片，不加图片也不留预留框架
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
          // 情况 A & B：有真实图片渲染图片，无真实图片渲染预留占位容器
          stepCard.className = 'step-item-card';

          let mediaBox = '';
          if (isPhoto) {
            mediaBox = hasRealImage ? `
              <div class="mockup-photo-body">
                <img src="images/${ss.filename}" alt="${step.step_title}">
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
                  <img src="images/${ss.filename}" alt="${step.step_title}">
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

  // 2. 打开图 6~10 RECOMMEND APPS 展台
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

  // 3. 蓝色进度条灌浆
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

  // 4. Building 12 档案渲染
  function openDossier() {
    state.currentDormPage = 1;
    renderDormPage(state.currentDormPage);
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#222" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </button>
          </div>

          <div class="dossier-copyable-box">
            <div class="dorm-typewriter-text">
              ★ 上海市闵行区虹梅南路5800号华东师范大学闵行校区<br>
              研究生公寓12号楼
            </div>
            <button class="copy-trigger-btn" data-copy="上海市闵行区虹梅南路5800号华东师范大学闵行校区研究生公寓12号楼" title="复制中文地址">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#222" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
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

        <div class="dorm-section-block dossier-split-photo" style="margin-top: 2rem;">
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

        <div class="dorm-section-block dossier-split-photo" style="margin-top: 2rem;">
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

  init();
});
