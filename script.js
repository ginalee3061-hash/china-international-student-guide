const app = document.querySelector("#app");

const DATA = {};
async function getData(name){
  if(!DATA[name]){
    const res = await fetch(`data/${name}.json?` + Date.now(), {cache:"no-store"});
    if(!res.ok) throw new Error(`Cannot load ${name}.json`);
    DATA[name] = await res.json();
  }
  return DATA[name];
}

const by = (arr, key, val) => arr.find(x => String(x[key]) === String(val));
const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
const titleOf = g => g?.title || g?.guide_title || "Guide";
const itemName = i => i?._display_name || i?.name || "";
const iconFor = i => i?.visual?.logo_text || "✦";
const clsFor = i => i?.visual?.logo_class || "default";

function crumbs(parts){
  return `<div class="breadcrumbs">${parts.map((p, i) => `${i ? '<span>›</span>' : ''}${p.href ? `<a href="#${p.href}">${esc(p.label)}</a>` : `<span>${esc(p.label)}</span>`}`).join("")}</div>`;
}

function guideCard(g, item){
  return `<a class="guide-card" href="#/guide/${g.guide_id}">
    <div class="polaroid"><div class="polaroid-inner ${esc(clsFor(item))}">${esc(iconFor(item))}</div></div>
    <div class="eyebrow">${esc(itemName(item))}</div>
    <h3>${esc(titleOf(g))}</h3>
    <p>${esc(g.short_description || "")}</p>
    <div class="card-spacer"></div><span class="learn">LEARN MORE</span>
  </a>`;
}

// 推荐分类板块配置
const REC_SECTIONS = [
  {
    id: "food-delivery",
    num: "(01)",
    title: "Food & Delivery",
    image: "images/food-delivery-thumb.jpg",
    pageTitle: "01 FOOD & DELIVERY",
    posClass: "pos-food",
    apps: [
      { name: "美团", en: "MeiTuan", icon: "美团", cls: "meituan", id: "FOO-001" },
      { name: "淘宝", en: "TaoBao", icon: "淘", cls: "taobao", id: "APP-003" },
      { name: "京东", en: "JingDong", icon: "京", cls: "jingdong", id: "APP-004" }
    ]
  },
  {
    id: "transit-maps",
    num: "(02)",
    title: "Transit & Maps",
    image: "images/transit-maps-thumb.jpg",
    pageTitle: "02 TRANSIT & MAPS",
    posClass: "pos-transit",
    apps: [
      { name: "高德地图", en: "Amap", icon: "✈", cls: "amap", id: "TRA-002" },
      { name: "哈啰", en: "HaLou", icon: "哈啰", cls: "halou", id: "TRA-003" }
    ]
  },
  {
    id: "finance-payments",
    num: "(03)",
    title: "Finance & Payments",
    image: "images/finance-payments-thumb.jpg",
    pageTitle: "03 FINANCE & PAYMENTS",
    posClass: "pos-finance",
    apps: [
      { name: "支付宝", en: "Alipay", icon: "支", cls: "alipay", id: "APP-001" },
      { name: "工商银行", en: "ICBC", icon: "工", cls: "icbc", id: "ICB-001" },
      { name: "微信", en: "WeChat Pay", icon: "✔", cls: "wechat", id: "APP-005" }
    ]
  },
  {
    id: "shopping",
    num: "(04)",
    title: "Shopping",
    image: "images/shopping-thumb.jpg",
    pageTitle: "04 SHOPPING",
    posClass: "pos-shopping",
    apps: [
      { name: "淘宝", en: "TaoBao", icon: "淘", cls: "taobao", id: "APP-003" },
      { name: "京东", en: "JingDong", icon: "京", cls: "jingdong", id: "APP-004" },
      { name: "菜鸟", en: "CaiNiao", icon: "菜", cls: "cainiao", id: "APP-002" }
    ]
  },
  {
    id: "vpn",
    num: "(05)",
    title: "VPN",
    image: "images/vpn-thumb.jpg",
    pageTitle: "05 VPN",
    posClass: "pos-vpn",
    apps: [
      { name: "Skuracat", en: "", icon: "🐱", cls: "skuracat", id: "VPN-001" },
      { name: "IKuuu", en: "", icon: "S", cls: "ikuuu", id: "VPN-002" }
    ]
  }
];

// 点击图标自动全选文字并复制到剪贴板
window.selectAndCopyText = function(elementId, textToCopy) {
  const el = document.getElementById(elementId);
  if (el) {
    const range = document.createRange();
    range.selectNodeContents(el);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  navigator.clipboard.writeText(textToCopy).then(() => {
    showToast("Address copied & selected!");
  }).catch(() => {
    document.execCommand('copy');
    showToast("Address copied & selected!");
  });
};

function showToast(msg) {
  let toast = document.getElementById("copy-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "copy-toast";
    toast.className = "copy-toast";
    document.body.appendChild(toast);
  }
  toast.innerText = msg;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

// 图片全屏灯箱放大
window.openLightbox = function(src){
  const modal = document.getElementById("lightbox-modal");
  const img = document.getElementById("lightbox-img");
  if(modal && img && src){
    img.src = src;
    modal.classList.add("active");
  }
};

async function home(){
  const [items, guides] = await Promise.all([getData("items"), getData("guides")]);
  const pub = new Map(guides.filter(g => g.status === "published").map(g => [g.guide_id, g]));

  // 严格指派前两个板块的卡片
  const packageFoodGuideIds = ["GUIDE-010", "GUIDE-008"]; // FOO-001 和 APP-003
  const moneyPaymentGuideIds = ["GUIDE-011", "GUIDE-009", "GUIDE-001"]; // ICB-001, DOR-001, APP-001

  const packageGuides = packageFoodGuideIds.map(id => pub.get(id)).filter(Boolean);
  const moneyGuides = moneyPaymentGuideIds.map(id => pub.get(id)).filter(Boolean);

  app.innerHTML = `<section class="hero"><div class="container hero-inner">
    <div>
      <div class="hero-kicker">THE INTERNATIONAL STUDENT GUIDE</div>
      <h1>WHAT DO I NEED<br>TO FIGURE OUT?</h1>
      <p class="hero-copy">A visual, practical guide to the everyday systems you suddenly need to understand after arriving in China.</p>
      <form class="hero-search" id="hero-search"><input name="q" placeholder="Try “packages”, “Alipay”, “metro”"><button class="btn">SEARCH</button></form>
    </div>
    <div class="hero-art">
      <div class="hero-card">
        <div class="eyebrow">START HERE</div>
        <h2>ONE TASK<br>AT A TIME.</h2>
        <div class="mini-line"></div><div class="mini-line"></div>
        <p>Choose a topic, pick what you need, and follow the steps.</p>
      </div>
      <div class="hero-note">No university jargon. Just what to do.</div>
    </div>
  </div></section>

  <!-- 前两个特色板块 -->
  <div class="home-sections">
    <section class="section-band blue">
      <div class="container">
        <div class="section-tab"><span>01 PACKAGES & FOOD</span><span class="arrow">→</span></div>
        <p class="section-note">How to order food and retrieve your parcel deliveries around campus.</p>
        <div class="card-grid">
          ${packageGuides.map(g => guideCard(g, by(items, "item_id", g.item_id))).join("")}
        </div>
      </div>
    </section>

    <section class="section-band rose">
      <div class="container">
        <div class="section-tab"><span>02 MONEY & PAYMENTS</span><span class="arrow">→</span></div>
        <p class="section-note">Bank debit card, dorm electricity top-ups, and Alipay setup.</p>
        <div class="card-grid">
          ${moneyGuides.map(g => guideCard(g, by(items, "item_id", g.item_id))).join("")}
        </div>
      </div>
    </section>
  </div>

  <!-- RECOMMENDED APPS 拼贴看板板块 -->
  <section class="rec-board-section">
    <div class="container">
      <div class="rec-board-header">
        <h2>RECOMMENDED APPS</h2>
      </div>
      <div class="rec-board-canvas">
        ${REC_SECTIONS.map(sec => `
          <a href="#/rec-category/${sec.id}" class="rec-board-item ${sec.posClass}">
            <div class="rec-board-img">
              <img src="${sec.image}" alt="${sec.title}" onerror="this.src='images/5_2.jpg'; this.onerror=null;">
            </div>
            <div class="rec-board-label">
              <span class="num">${sec.num}</span>
              <span class="title">${sec.title}</span>
            </div>
          </a>
        `).join("")}
      </div>
    </div>
  </section>

  <!-- 档案袋封面 -->
  <section class="folder-banner-section">
    <div class="container">
      <a href="#/dorm-book" class="folder-card">
        <img src="images/12.png" alt="Building 12 Dormitory Information" class="folder-inner-img" onerror="if(!this.dataset.t){this.dataset.t=1;this.src='images/12.jpg';}">
      </a>
    </div>
  </section>`;

  document.querySelector("#hero-search").addEventListener("submit", e => {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q") || "";
    location.hash = `/search?q=${encodeURIComponent(q)}`;
  });
}

function recCategoryPage(catId){
  const sec = REC_SECTIONS.find(s => s.id === catId);
  if(!sec) return notFound();

  app.innerHTML = `<section class="category-view">
    <div class="container">
      ${crumbs([{label:"Home", href:"/"}, {label: sec.title}])}
      <div class="category-title-underline">${sec.pageTitle}</div>
      <div class="category-cards-row">
        ${sec.apps.map(app => `
          <a href="#/item/${app.id}" class="square-app-card">
            <div class="square-app-icon ${app.cls}">${app.icon}</div>
            <div class="square-app-footer">
              <div class="square-app-name">${app.name} <small style="color:#666">${app.en}</small></div>
              <span class="square-app-arrow">▶</span>
            </div>
          </a>
        `).join("")}
      </div>
    </div>
  </section>`;
}

/* 档案册全屏轮播（拟真底图 + 真实可选文字 + 双页Copy图标 + 拍立得图片点击放大） */
async function dormBookPage(){
  app.innerHTML = `<section class="dorm-book-page">
    <div class="container" style="margin-bottom:20px;">
      ${crumbs([{label:"Home", href:"/"}, {label:"Building 12: Dormitory Information"}])}
    </div>

    <div class="dorm-canvas-wrap" id="dorm-canvas-wrap">
      <div class="dorm-slide-wrapper" id="dorm-slide-wrapper" style="display:flex;width:100%;height:100%;transition:transform 0.35s cubic-bezier(0.25, 1, 0.5, 1);">
        
        <!-- Page 1：地址与门禁信息 (对应 13.png) -->
        <div class="dorm-slide" style="min-width:100%;height:100%;position:relative;">
          <img src="images/13.png" alt="Dorm Address" class="dorm-bg-art" onerror="this.src='images/13.jpg'">
          
          <div class="dorm-overlay-layer">
            <!-- 英文地址可选文字层 -->
            <div id="text-en-addr" class="selectable-text-block" style="left:35%;top:27%;width:46%;font-size:14px;">
              Building 12, Graduate Student Apartments<br>
              East China Normal University (Minhang Campus)<br>
              No. 5800 Hongmei South Road, Minhang District, Shanghai
            </div>
            <!-- 英文地址复制按钮（对准图上的线框小图标） -->
            <button class="hotspot-copy-btn" style="right:17.5%;top:26.5%;" title="Copy English Address" 
              onclick="selectAndCopyText('text-en-addr', 'Building 12, Graduate Student Apartments, East China Normal University (Minhang Campus), No. 5800 Hongmei South Road, Minhang District, Shanghai')">
              <svg viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>
            </button>

            <!-- 中文地址可选文字层 -->
            <div id="text-cn-addr" class="selectable-text-block" style="left:35%;top:35%;width:46%;font-size:14px;">
              上海市闵行区虹梅南路5800号华东师范大学闵行校区<br>
              研究生公寓12号楼
            </div>
            <!-- 中文地址复制按钮 -->
            <button class="hotspot-copy-btn" style="right:17.5%;top:36.5%;" title="复制中文地址" 
              onclick="selectAndCopyText('text-cn-addr', '上海市闵行区虹梅南路5800号华东师范大学闵行校区研究生公寓12号楼')">
              <svg viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>
            </button>

            <!-- 门禁与安静时间可选文字 -->
            <div class="selectable-text-block" style="left:35%;top:53.5%;width:46%;font-size:14px;">The dormitory entrance closes at 23:00.</div>
            <div class="selectable-text-block" style="left:35%;top:66.5%;width:46%;font-size:14px;">
              Please keep noise to a minimum after 23:00.<br>
              Do not use washing machines or hair dryers after 23:00.
            </div>
          </div>
        </div>

        <!-- Page 2：厨房与垃圾分类 (对应 14.png) -->
        <div class="dorm-slide" style="min-width:100%;height:100%;position:relative;">
          <img src="images/14.png" alt="Kitchen & Garbage" class="dorm-bg-art" onerror="this.src='images/14.jpg'">
          
          <div class="dorm-overlay-layer">
            <div class="selectable-text-block" style="left:29%;top:26%;width:32%;font-size:13px;">
              • Please clean the kitchen after use.<br><br>
              • Do not leave personal items, pots, dishes, or cooking utensils on the countertops.<br><br>
              • Please return them to the cabinets or take them back to your room.
            </div>
            <div class="selectable-text-block" style="left:50%;top:63%;width:30%;font-size:13px;">
              • The kitchen trash bins are for food waste only.<br><br>
              • Trash from your room must be taken to the public garbage station located between Building 14 and the cafeteria.
            </div>

            <!-- 可点击放大的拍立得图片插槽 -->
            <div class="dorm-photo-slot" style="right:12%;top:24%;width:33%;height:33%;" onclick="openLightbox('images/14.png')"></div>
            <div class="dorm-photo-slot" style="left:24%;bottom:8%;width:26%;height:27%;" onclick="openLightbox('images/14.png')"></div>
          </div>
        </div>

        <!-- Page 3：饮水机与吹风机房 (对应 15.png) -->
        <div class="dorm-slide" style="min-width:100%;height:100%;position:relative;">
          <img src="images/15.png" alt="Water & Hair Dryer" class="dorm-bg-art" onerror="this.src='images/15.jpg'">
          
          <div class="dorm-overlay-layer">
            <div class="selectable-text-block" style="left:61%;top:30%;width:24%;font-size:13px;">
              Water dispensers are located near the small staircases on the 2nd and 5th floors.
            </div>
            <div class="selectable-text-block" style="left:26.5%;top:63%;width:26%;font-size:13px;">
              Hair dryer rooms are located near the small staircases on the 2nd, 4th, and 6th floors.
            </div>

            <!-- 可点击放大的拍立得图片插槽 -->
            <div class="dorm-photo-slot" style="left:28%;top:24%;width:29%;height:24%;" onclick="openLightbox('images/15.png')"></div>
            <div class="dorm-photo-slot" style="right:18%;bottom:12%;width:25%;height:29%;" onclick="openLightbox('images/15.png')"></div>
          </div>
        </div>

      </div>
    </div>

    <!-- 底部操作导航栏 -->
    <div class="dorm-nav-bar">
      <button class="dorm-nav-btn" id="prev-btn">← Prev</button>
      <div class="dorm-indicators">
        <div class="dorm-dot active" data-index="0"></div>
        <div class="dorm-dot" data-index="1"></div>
        <div class="dorm-dot" data-index="2"></div>
      </div>
      <button class="dorm-nav-btn" id="next-btn">Next →</button>
    </div>
  </section>

  <!-- 全屏灯箱查看容器 -->
  <div class="lightbox-modal" id="lightbox-modal" onclick="this.classList.remove('active')">
    <img id="lightbox-img" src="" alt="Enlarged view">
  </div>`;

  // 轮播与滑动逻辑
  let currentIndex = 0;
  const totalSlides = 3;
  const wrapper = document.getElementById("dorm-slide-wrapper");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const dots = document.querySelectorAll(".dorm-dot");
  const container = document.getElementById("dorm-canvas-wrap");

  function updateSlide(index){
    currentIndex = Math.max(0, Math.min(index, totalSlides - 1));
    wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === totalSlides - 1;
    dots.forEach((dot, idx) => dot.classList.toggle("active", idx === currentIndex));
  }

  prevBtn.addEventListener("click", () => updateSlide(currentIndex - 1));
  nextBtn.addEventListener("click", () => updateSlide(currentIndex + 1));
  dots.forEach(dot => {
    dot.addEventListener("click", (e) => {
      const idx = parseInt(e.target.getAttribute("data-index"));
      updateSlide(idx);
    });
  });

  // 移动端/触摸滑动翻页
  let startX = 0;
  container.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, {passive:true});
  container.addEventListener("touchend", (e) => {
    const diff = e.changedTouches[0].clientX - startX;
    if(diff < -50 && currentIndex < totalSlides - 1) updateSlide(currentIndex + 1);
    else if(diff > 50 && currentIndex > 0) updateSlide(currentIndex - 1);
  });

  updateSlide(0);
}

async function itemPage(id){
  const [items, guides, details] = await Promise.all([getData("items"), getData("guides"), getData("app-details")]);
  const item = by(items, "item_id", id) || { name: id, chinese_name: id, _display_name: id, visual: { logo_class: "default", logo_text: "✦" } };
  const detail = details[id] || { tagline:"Useful everyday tool", intro: item._display_description || item.short_description || "Everything you need to know about using this app.", recommended:"Use this for daily campus life.", related_guide_ids: guides.filter(g => g.item_id === id && g.status === "published").map(g => g.guide_id) };
  const related = (detail.related_guide_ids || []).map(gid => by(guides, "guide_id", gid)).filter(Boolean).filter(g => g.status === "published");

  app.innerHTML = `<section class="page"><div class="container">
    ${crumbs([{label:"Home", href:"/"}, {label: itemName(item)}])}
    <div class="app-showcase">
      <div class="app-showcase-grid">
        <div class="app-logo ${esc(clsFor(item))}">${esc(iconFor(item))}</div>
        <div class="app-meta">
          <div class="eyebrow">${esc(item.chinese_name || item.item_type || "app")}</div>
          <h2>${esc(itemName(item))}</h2>
          <p><strong>${esc(detail.tagline)}</strong><br>${esc(detail.intro)}</p>
          <div class="pill-row">
            ${item.platform ? `<span class="pill">${esc(item.platform)}</span>` : ""}
            ${item.importance ? `<span class="pill">${esc(item.importance)}</span>` : ""}
          </div>
        </div>
      </div>
      <div class="app-sections">
        <div class="info-box"><h3>When you’ll use it</h3><p>${esc(detail.recommended)}</p></div>
        <div class="info-box"><h3>Start here</h3><p>Pick one of the guides below instead of learning the whole app at once.</p></div>
      </div>
    </div>
    <section class="related"><h2>RELATED GUIDES</h2><div class="related-grid">${related.map(g => guideCard(g, item)).join("") || '<div class="empty" style="padding:20px;border-radius:12px;background:#eee;">More guides coming soon.</div>'}</div></section>
  </div></section>`;
}

// 步骤详情页（严格关联：仅在属于 Alipay 相关时展示支付宝卡片，支持放大）
async function guidePage(id){
  const [items, guides, steps, shots] = await Promise.all([getData("items"), getData("guides"), getData("steps"), getData("screenshots")]);
  const g = by(guides, "guide_id", id); if(!g) return notFound();
  const item = by(items, "item_id", g.item_id);
  const guideSteps = steps.filter(s => String(s.guide_id) === String(id)).sort((a, b) => (a.step_number || 0) - (b.step_number || 0));
  
  const shotMapById = new Map(shots.map(s => [s.image_id, s]));
  const shotMapByStep = new Map(shots.map(s => [s.step_id, s]));

  // 严格条件过滤：仅当是 Alipay 系列教程时才关联支付宝全套（绑卡/支付/乘车）
  let relatedGuides = [];
  const isAlipayRelated = g.item_id === "APP-001" || id === "GUIDE-004";

  if (isAlipayRelated) {
    relatedGuides = guides.filter(x => 
      x.status === "published" && 
      x.guide_id !== id && 
      (x.item_id === "APP-001" || x.guide_id === "GUIDE-004")
    );
  } else {
    relatedGuides = guides.filter(x => 
      x.status === "published" && 
      x.guide_id !== id && 
      x.item_id === g.item_id
    );
  }

  app.innerHTML = `<section class="page"><div class="container">
    ${crumbs([{label:"Home", href:"/"}, ...(item ? [{label: itemName(item), href:`/item/${item.item_id}`}] : []), {label: titleOf(g)}])}
    <div class="guide-layout">
      <aside class="progress-rail"><div class="progress-track"></div><div class="progress-fill" id="progress-fill"></div><div class="progress-list">
        ${guideSteps.map((s, i) => `<div class="progress-item" data-step="${i}"><div class="progress-dot">${i+1}</div></div>`).join("")}
      </div></aside>
      <article>
        <header class="guide-title">
          <div class="eyebrow">${esc(itemName(item))}</div>
          <h1>${esc(titleOf(g))}</h1>
          <p>${esc(g.user_question || g.short_description || "")}</p>
        </header>
        <div class="guide-steps">
          ${guideSteps.map((s, i) => {
            let sh = shotMapById.get(s.image_id);
            if(!sh && s.step_id) {
              sh = shotMapByStep.get(s.step_id) || shotMapByStep.get(s.step_id.replace('-S', '-S0'));
            }
            
            let rawFilename = sh?.filename || (s.image_path ? s.image_path.split('/').pop() : '');
            if (!rawFilename && id === "GUIDE-010") {
              rawFilename = `meituan-order-${String(i+1).padStart(2, '0')}.png`;
            } else if (!rawFilename && id === "GUIDE-013") {
              rawFilename = `maintenance-${String(i+1).padStart(2, '0')}.png`;
            }

            let primarySrc = rawFilename ? `images/${rawFilename}` : '';
            
            return `<section class="guide-step" data-step-section="${i}">
              <div class="step-kicker">[ ${String(i+1).padStart(2, "0")} ] ${esc(s.step_title || "STEP")}</div>
              <div class="step-grid">
                <div class="step-copy">
                  <h2>${esc(s.step_title || "")}</h2>
                  <p>${esc(s.instruction || "")}</p>
                  ${s.tip ? `<div class="step-note">💡 ${esc(s.tip)}</div>` : ""}
                </div>
                <div class="iphone-mockup" style="cursor:zoom-in;" onclick="${primarySrc ? `openLightbox('${primarySrc}')` : ''}">
                  <div class="iphone-screen">
                    ${primarySrc ? `
                      <img src="${primarySrc}" 
                           alt="Step screenshot" 
                           loading="lazy" 
                           onerror="
                             if(!this.dataset.t) {
                               this.dataset.t = 1;
                               this.src = '${rawFilename}';
                             } else {
                               this.parentElement.innerHTML = '<div class=&quot;step-image placeholder&quot; style=&quot;padding:15px;font-size:12px;color:#c8102e;&quot;>未找到图片：<br><b>${rawFilename}</b></div>';
                             }
                           ">
                    ` : `<div class="step-image placeholder">未绑定图片</div>`}
                  </div>
                </div>
              </div>
            </section>`;
          }).join("")}
        </div>
        
        ${relatedGuides.length > 0 ? `
          <section class="related">
            <h2>YOU MAY ALSO NEED</h2>
            <div class="related-grid">
              ${relatedGuides.map(x => guideCard(x, by(items, "item_id", x.item_id))).join("")}
            </div>
          </section>
        ` : ''}
      </article>
    </div>
  </section>
  
  <div class="lightbox-modal" id="lightbox-modal" onclick="this.classList.remove('active')">
    <img id="lightbox-img" src="" alt="Enlarged screenshot">
  </div>`;

  const fill = document.querySelector("#progress-fill");
  const sections = [...document.querySelectorAll("[data-step-section]")];
  const dots = [...document.querySelectorAll(".progress-item")];

  function guideProgress(){
    const top = window.scrollY;
    const start = document.querySelector(".guide-title")?.offsetTop || 0;
    const end = document.body.scrollHeight;
    const pct = Math.max(0, Math.min(100, ((top - start) / (end - start)) * 100));
    if(fill) fill.style.height = `${pct}%`;
    sections.forEach((sec, i) => {
      const r = sec.getBoundingClientRect();
      const active = r.top < window.innerHeight * .45 && r.bottom > 0;
      dots[i]?.classList.toggle("active", active);
      if(r.bottom < window.innerHeight * .45) dots[i]?.classList.add("done");
      else dots[i]?.classList.remove("done");
    });
  }
  window.addEventListener("scroll", guideProgress, {passive:true});
  guideProgress();
}

function notFound(){
  app.innerHTML = `<section class="page"><div class="container"><div class="step-note"><strong>Page not found.</strong><br><a href="#/">Back to home</a></div></div></section>`;
}

async function route(){
  const raw = location.hash.replace(/^#/, "") || "/";
  const [path, query] = raw.split("?"); 
  window.scrollTo(0, 0);
  if(path === "/") return home();
  if(path === "/dorm-book") return dormBookPage();
  const parts = path.split("/");
  if(parts[1] === "rec-category") return recCategoryPage(parts[2]);
  if(parts[1] === "item") return itemPage(parts[2]);
  if(parts[1] === "guide") return guidePage(parts[2]);
  return notFound();
}

window.addEventListener("hashchange", () => route().catch(err => { console.error(err); notFound(); }));
route().catch(err => { console.error(err); notFound(); });
