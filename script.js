/**
 * Campus Life Survival Guide - Complete Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  // 数据总线
  const appData = {
    guides: [],
    steps: [],
    dormInfo: null,
    currentDormPage: 1
  };

  // 视图节点
  const homeView = document.getElementById('homeView');
  const guideDetailView = document.getElementById('guideDetailView');
  const dormDossierView = document.getElementById('dormDossierView');

  // 组件节点
  const detailMainTitle = document.getElementById('detailMainTitle');
  const stepsFlowContainer = document.getElementById('stepsFlowContainer');
  const trackLineFill = document.getElementById('trackLineFill');
  const btnBackHome = document.getElementById('btnBackHome');

  const dormFileTrigger = document.getElementById('dormFileTrigger');
  const openDormDossierLink = document.getElementById('openDormDossierLink');
  const dossierCloseBtn = document.getElementById('dossierCloseBtn');
  const dossierPrevBtn = document.getElementById('dossierPrevBtn');
  const dossierNextBtn = document.getElementById('dossierNextBtn');
  const dossierPageLabel = document.getElementById('dossierPageLabel');
  const dossierBodyViewport = document.getElementById('dossierBodyViewport');
  const toastPopup = document.getElementById('toastPopup');

  // 1. 初始化并拉取数据
  async function init() {
    try {
      const [guidesRes, stepsRes, dormRes] = await Promise.all([
        fetch('data/guides.json').then(r => r.json()),
        fetch('data/steps.json').then(r => r.json()),
        fetch('data/dorm-info.json').then(r => r.json())
      ]);

      appData.guides = guidesRes;
      appData.steps = stepsRes;
      appData.dormInfo = dormRes;

      bindEventListeners();
    } catch (e) {
      console.error('Data loading error:', e);
    }
  }

  // 2. 绑定事件
  function bindEventListeners() {
    // 点击主页任一指南卡片 -> 切到详情页
    document.querySelectorAll('.guide-card').forEach(card => {
      card.addEventListener('click', () => {
        const guideId = card.dataset.guideId;
        openGuideDetailPage(guideId);
      });
    });

    // 详情页返回主页
    btnBackHome.addEventListener('click', () => {
      switchView('home');
      window.scrollTo(0, 0);
    });

    // 打开 Building 12 档案
    dormFileTrigger.addEventListener('click', () => openDormDossier());
    openDormDossierLink.addEventListener('click', () => openDormDossier());

    // 关闭档案
    dossierCloseBtn.addEventListener('click', () => {
      switchView('home');
    });

    // 档案翻页
    dossierPrevBtn.addEventListener('click', () => {
      if (appData.currentDormPage > 1) {
        appData.currentDormPage--;
        renderDormPage(appData.currentDormPage);
      }
    });

    dossierNextBtn.addEventListener('click', () => {
      if (appData.currentDormPage < 3) {
        appData.currentDormPage++;
        renderDormPage(appData.currentDormPage);
      }
    });

    // 监听窗口滚动 -> 驱动竖直蓝色灌浆进度条
    window.addEventListener('scroll', handleScrollProgressBar);
  }

  // 视图切换控制器
  function switchView(viewName) {
    homeView.classList.remove('active');
    guideDetailView.classList.remove('active');
    dormDossierView.classList.remove('active');

    if (viewName === 'home') homeView.classList.add('active');
    if (viewName === 'guide') guideDetailView.classList.add('active');
    if (viewName === 'dossier') dormDossierView.classList.add('active');
  }

  // 3. 打开指南步骤新页面（图 4 效果）
  function openGuideDetailPage(guideId) {
    const guide = appData.guides.find(g => g.guide_id === guideId) || {
      guide_title: 'HOW TO GET MY PACKAGES?'
    };

    detailMainTitle.innerHTML = guide.guide_title.replace('?', '?<br>');
    stepsFlowContainer.innerHTML = '';

    // 过滤此 guide 的所有步骤
    let steps = appData.steps.filter(s => s.guide_id === guideId);
    if (steps.length === 0) {
      // 若是菜鸟默认步骤，聚合呈现
      steps = appData.steps.filter(s => ['GUIDE-005', 'GUIDE-006', 'GUIDE-008'].includes(s.guide_id));
    }

    let currentSection = '';
    steps.forEach(step => {
      // 分段小标题（例如 [iOS] Download the Cainiao App）
      if (step.step_title && step.step_title.startsWith('[')) {
        const secHeader = document.createElement('h3');
        secHeader.className = 'step-section-header';
        secHeader.textContent = step.step_title;
        stepsFlowContainer.appendChild(secHeader);
      }

      const isPhoto = step.display_frame === 'photo';
      const imgSrc = step.image_id ? `images/cainiao-code-01.png` : 'images/cainiao-code-01.png'; // 优先展示对应截图

      const stepCard = document.createElement('div');
      stepCard.className = 'step-item-card';

      const mediaHtml = isPhoto ? `
        <div class="mockup-photo-body">
          <img src="${imgSrc}" alt="${step.step_title}">
        </div>
      ` : `
        <div class="mockup-phone-body">
          <div class="mockup-screen">
            <img src="${imgSrc}" alt="${step.step_title}">
          </div>
        </div>
      `;

      stepCard.innerHTML = `
        ${mediaHtml}
        <div class="step-info-col">
          <div class="step-circle-badge">${step.step_number || 1}</div>
          <h4 class="step-instruction-heading">${step.step_title || ''}</h4>
          <p class="step-detail-text">${step.instruction || ''}</p>
        </div>
      `;

      stepsFlowContainer.appendChild(stepCard);
    });

    switchView('guide');
    window.scrollTo(0, 0);
    setTimeout(handleScrollProgressBar, 100);
  }

  // 4. 竖直蓝色进度条随页面滑动灌浆填充
  function handleScrollProgressBar() {
    if (!guideDetailView.classList.contains('active')) return;

    const scrollLayout = document.querySelector('.detail-scroll-layout');
    if (!scrollLayout) return;

    const rect = scrollLayout.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const totalHeight = rect.height - windowHeight;

    if (totalHeight <= 0) {
      trackLineFill.style.height = '100%';
      return;
    }

    const currentPassed = Math.max(0, -rect.top + 100);
    const percent = Math.min(100, Math.max(0, (currentPassed / totalHeight) * 100));
    trackLineFill.style.height = `${percent}%`;
  }

  // 5. 打开 Building 12 沉浸式档案页（底图 page.png）
  function openDormDossier() {
    appData.currentDormPage = 1;
    renderDormPage(appData.currentDormPage);
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

    // 绑定复制真实触发事件
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
