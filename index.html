/**
 * Campus Life Survival Guide - Dynamic Loader & Interactive Engine
 */
document.addEventListener('DOMContentLoaded', () => {
  // 全局数据状态缓存
  const state = {
    categories: [],
    guides: [],
    steps: [],
    screenshots: [],
    dormInfo: null,
    currentDormPage: 1
  };

  // DOM 元素引用
  const feedSection = document.getElementById('feedSection');
  const categoryNav = document.getElementById('categoryNav');
  const guideModal = document.getElementById('guideModal');
  const closeGuideModal = document.getElementById('closeGuideModal');
  const modalGuideTitle = document.getElementById('modalGuideTitle');
  const modalGuideDesc = document.getElementById('modalGuideDesc');
  const modalStepsScroll = document.getElementById('modalStepsScroll');

  const folderTrigger = document.getElementById('folderTrigger');
  const dossierModal = document.getElementById('dossierModal');
  const closeDossierBtn = document.getElementById('closeDossierBtn');
  const prevPageBtn = document.getElementById('prevPageBtn');
  const nextPageBtn = document.getElementById('nextPageBtn');
  const pageIndicator = document.getElementById('pageIndicator');
  const paperPageContent = document.getElementById('paperPageContent');
  const toastNotice = document.getElementById('toastNotice');

  // 初始化加载所有本地 JSON 数据
  async function initApp() {
    try {
      const [cats, guides, steps, screenshots, dorm] = await Promise.all([
        fetch('data/categories.json').then(r => r.json()),
        fetch('data/guides.json').then(r => r.json()),
        fetch('data/steps.json').then(r => r.json()),
        fetch('data/screenshots.json').then(r => r.json()),
        fetch('data/dorm-info.json').then(r => r.json())
      ]);

      state.categories = cats;
      state.guides = guides;
      state.steps = steps;
      state.screenshots = screenshots;
      state.dormInfo = dorm;

      renderCategoryNav();
      renderFeed();
    } catch (err) {
      console.error('Failed to load JSON files:', err);
    }
  }

  // 渲染顶部药丸导航
  function renderCategoryNav() {
    categoryNav.innerHTML = `<button class="cat-pill active" data-cat="all">ALL</button>`;
    state.categories.forEach(c => {
      const btn = document.createElement('button');
      btn.className = 'cat-pill';
      btn.textContent = c.display_name;
      btn.dataset.cat = c.category_id;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderFeed(c.category_id);
      });
      categoryNav.appendChild(btn);
    });

    categoryNav.querySelector('[data-cat="all"]').addEventListener('click', (e) => {
      document.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      renderFeed('all');
    });
  }

  // 渲染卡片信息流
  function renderFeed(filterCatId = 'all') {
    feedSection.innerHTML = '';

    const targetCats = filterCatId === 'all' 
      ? state.categories 
      : state.categories.filter(c => c.category_id === filterCatId);

    targetCats.forEach(cat => {
      const catGuides = state.guides.filter(g => g.category_id === cat.category_id && g.status === 'published');
      if (catGuides.length === 0) return;

      const groupContainer = document.createElement('div');
      groupContainer.className = 'category-group';

      groupContainer.innerHTML = `
        <div class="category-group-header">
          <span class="category-badge">${cat.display_name}</span>
        </div>
        <div class="cards-grid"></div>
      `;

      const grid = groupContainer.querySelector('.cards-grid');

      catGuides.forEach(guide => {
        const card = document.createElement('div');
        card.className = 'guide-card';
        card.innerHTML = `
          <div>
            <h3 class="card-title">${guide.guide_title}</h3>
            <p class="card-desc">${guide.short_description || ''}</p>
          </div>
          <div class="card-footer">
            <span class="card-platform-tag">${guide.platform}</span>
            <span class="card-action-arrow">→</span>
          </div>
        `;
        card.addEventListener('click', () => openGuideDetails(guide));
        grid.appendChild(card);
      });

      feedSection.appendChild(groupContainer);
    });
  }

  // 打开步骤指引弹窗（自动匹配 手机外壳 / 实拍相框）
  function openGuideDetails(guide) {
    modalGuideTitle.textContent = guide.guide_title;
    modalGuideDesc.textContent = guide.short_description || '';
    modalStepsScroll.innerHTML = '';

    const steps = state.steps
      .filter(s => s.guide_id === guide.guide_id)
      .sort((a, b) => a.step_number - b.step_number);

    steps.forEach(step => {
      const screenshot = state.screenshots.find(ss => ss.image_id === step.image_id);
      const isPhoto = (step.display_frame === 'photo') || (screenshot && screenshot.display_frame === 'photo');
      const imgSrc = screenshot ? `images/${screenshot.filename}` : 'images/placeholder.png';

      const stepRow = document.createElement('div');
      stepRow.className = 'step-card-wrapper';

      // 视觉容器渲染：手机外壳 vs 相框
      const mediaHtml = isPhoto ? `
        <div class="photo-frame-wrapper">
          <div class="photo-frame-inner">
            <img src="${imgSrc}" alt="${step.step_title}" onerror="this.style.background='#CCC'">
          </div>
        </div>
      ` : `
        <div class="mockup-phone-frame">
          <div class="phone-screen">
            <img src="${imgSrc}" alt="${step.step_title}" onerror="this.style.background='#E0E0E0'">
          </div>
        </div>
      `;

      stepRow.innerHTML = `
        ${mediaHtml}
        <div class="step-details-side">
          <span class="step-number-tag">STEP ${String(step.step_number).padStart(2, '0')}</span>
          <h4 class="step-title-text">${step.step_title}</h4>
          <p class="step-instruction-text">${step.instruction || ''}</p>
          ${step.tip ? `<div class="step-tip-callout">Tip: ${step.tip}</div>` : ''}
        </div>
      `;

      modalStepsScroll.appendChild(stepRow);
    });

    guideModal.classList.add('open');
  }

  closeGuideModal.addEventListener('click', () => {
    guideModal.classList.remove('open');
  });

  // ==========================================================================
  // Building 12 拟物档案渲染与真实剪贴板复制引擎
  // ==========================================================================
  folderTrigger.addEventListener('click', () => {
    state.currentDormPage = 1;
    renderDormPage(state.currentDormPage);
    dossierModal.classList.add('open');
  });

  closeDossierBtn.addEventListener('click', () => {
    dossierModal.classList.remove('open');
  });

  prevPageBtn.addEventListener('click', () => {
    if (state.currentDormPage > 1) {
      state.currentDormPage--;
      renderDormPage(state.currentDormPage);
    }
  });

  nextPageBtn.addEventListener('click', () => {
    if (state.currentDormPage < state.dormInfo.pages.length) {
      state.currentDormPage++;
      renderDormPage(state.currentDormPage);
    }
  });

  // 渲染具体某一页档案纸张内容
  function renderDormPage(pageNum) {
    pageIndicator.textContent = `Page ${pageNum} / ${state.dormInfo.pages.length}`;
    paperPageContent.innerHTML = '';

    const pageData = state.dormInfo.pages.find(p => p.page_number === pageNum);
    if (!pageData) return;

    pageData.sections.forEach(sec => {
      const secDiv = document.createElement('div');
      secDiv.className = sec.photo ? 'paper-section paper-section-with-photo' : 'paper-section';

      let itemsHtml = '';

      sec.items.forEach(item => {
        if (item.type === 'copyable') {
          itemsHtml += `
            <div class="copyable-row">
              <div class="typewriter-body" style="white-space: pre-line;">★  ${item.text}</div>
              <button class="copy-icon-btn" data-clipboard="${encodeURIComponent(item.text)}" title="Copy address">
                <svg class="copy-icon-svg" viewBox="0 0 24 24">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
            </div>
          `;
        } else if (item.type === 'bullet') {
          itemsHtml += `<div class="typewriter-body" style="margin-bottom: 0.5rem; white-space: pre-line;">★  ${item.text}</div>`;
        } else {
          itemsHtml += `<div class="typewriter-body" style="white-space: pre-line;">${item.text}</div>`;
        }
      });

      if (sec.photo) {
        secDiv.innerHTML = `
          <div>
            <h3 class="paper-sec-title">${sec.title}</h3>
            ${itemsHtml}
          </div>
          <div class="polaroid-frame" style="transform: rotate(${sec.photo.rotation}deg)">
            ${sec.photo.has_clip ? '<div class="paper-clip"></div>' : ''}
            <div class="polaroid-img-box">
              <img src="${sec.photo.image}" alt="${sec.title}" onerror="this.style.background='#CCC'">
            </div>
          </div>
        `;
      } else {
        secDiv.innerHTML = `
          <h3 class="paper-sec-title">${sec.title}</h3>
          ${itemsHtml}
        `;
      }

      paperPageContent.appendChild(secDiv);
    });

    // 绑定真实剪贴板复制事件
    paperPageContent.querySelectorAll('.copy-icon-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const rawText = decodeURIComponent(btn.dataset.clipboard);
        navigator.clipboard.writeText(rawText).then(() => {
          showToast('Address copied to clipboard!');
        }).catch(() => {
          // Fallback 复制兼容
          const textarea = document.createElement('textarea');
          textarea.value = rawText;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          showToast('Address copied to clipboard!');
        });
      });
    });
  }

  // Toast 弹窗通知
  function showToast(msg) {
    toastNotice.textContent = msg;
    toastNotice.classList.add('show');
    setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 2200);
  }

  initApp();
});
