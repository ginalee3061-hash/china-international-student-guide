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

// 首页卡片：右上角呈现拍立得相框小图
function guideCard(g, item, polaroidImg){
  return `<a class="guide-card" href="#/guide/${g.guide_id}" style="position:relative;">
    ${polaroidImg ? `
      <div class="polaroid-badge-right">
        <img src="images/${polaroidImg}" alt="Polaroid photo" onerror="this.parentElement.style.display='none';">
      </div>` : ''}
    <div class="eyebrow">${esc(itemName(item))}</div>
    <h3>${esc(titleOf(g))}</h3>
    <p>${esc(g.short_description || "")}</p>
    <div class="card-spacer"></div><span class="learn">LEARN MORE</span>
  </a>`;
}

const REC_SECTIONS = [
  {
    id: "food-delivery",
    num: "(01)",
    title: "Food & Delivery",
    image: "images/food-delivery-thumb.jpg",
    pageTitle: "01 FOOD & DELIVERY",
    posClass: "pos-food",
    apps: [
      { name: "美团", en: "MeiTuan", iconImg: "images/meituanicon.png", id: "FOO-001" },
      { name: "淘宝", en: "TaoBao", iconImg: "images/taobaoicon.png", id: "APP-003" },
      { name: "京东", en: "JingDong", iconImg: "images/taobaoicon.png", id: "APP-004" }
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
      { name: "高德地图", en: "Amap", iconImg: "images/amapicon.png", id: "TRA-002" },
      { name: "哈啰", en: "HaLou", iconImg: "images/haloicon.png", id: "TRA-003" }
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
      { name: "支付宝", en: "Alipay", iconImg: "images/alipayicon.png", id: "APP-001" },
      { name: "工商银行", en: "ICBC", iconImg: "images/icbcicon.png", id: "ICB-001" },
      { name: "微信", en: "WeChat Pay", iconImg: "images/wechatpayicon.png", id: "APP-005" }
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
      { name: "淘宝", en: "TaoBao", iconImg: "images/taobaoicon.png", id: "APP-003" },
      { name: "京东", en: "JingDong", iconImg: "images/taobaoicon.png", id: "APP-004" },
      { name: "菜鸟", en: "CaiNiao", iconImg: "images/cainiaoicon.png", id: "APP-002" }
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
      { name: "Skuracat", en: "", iconImg: "images/sakuracaticon.png", id: "VPN-001" },
      { name: "IKuuu", en: "", iconImg: "images/ikuuuicon.png", id: "VPN-002" }
    ]
  }
];

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
  setTimeout(() => toast.classList.remove("show"), 2000);
}

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

  // 配置前两大板块及其右上角的拍立得小图素材名（对应你上传的图片命名）
  const packageFoodConfigs = [
    { id: "GUIDE-010", photo: "packagesandfood-01.png" }, 
    { id: "GUIDE-008", photo: "packagesandfood-02.png" }
  ];
  const moneyPaymentConfigs = [
    { id: "GUIDE-011", photo: "moneyandpayments-01.png" }, 
    { id: "GUIDE-009", photo: "moneyandpayments-02.png" }, 
    { id: "GUIDE-001", photo: "moneyandpayments-03.png" }
  ];

  const packageGuides = packageFoodConfigs.map(c => ({ g: pub.get(c.id), photo: c.photo })).filter(x => x.g);
  const moneyGuides = moneyPaymentConfigs.map(c => ({ g: pub.get(c.id), photo: c.photo })).filter(x => x.g);

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

  <div class="home-sections">
    <section class="section-band blue">
      <div class="container">
        <div class="section-tab"><span>01 PACKAGES & FOOD</span><span class="arrow">→</span></div>
        <p class="section-note">How to order food and retrieve your parcel deliveries around campus.</p>
        <div class="card-grid">
          ${packageGuides.map(itemObj => guideCard(itemObj.g, by(items, "item_id", itemObj.g.item_id), itemObj.photo)).join("")}
        </div>
      </div>
    </section>

    <section class="section-band rose">
      <div class="container">
        <div class="section-tab"><span>02 MONEY & PAYMENTS</span><span class="arrow">→</span></div>
        <p class="section-note">Bank debit card, dorm electricity top-ups, and Alipay setup.</p>
        <div class="card-grid">
          ${moneyGuides.map(itemObj => guideCard(itemObj.g, by(items, "item_id", itemObj.g.item_id), itemObj.photo)).join("")}
        </div>
      </div>
    </section>
  </div>

  <section class="rec-board-section">
    <div class="container">
      <div class="rec-board-header"><h2>RECOMMENDED APPS</h2></div>
      <div class="rec-board-canvas">
        ${REC_SECTIONS.map(sec => `
          <a href="#/rec-category/${sec.id}" class="rec-board-item ${sec.posClass}">
            <div class="rec-board-img"><img src="${sec.image}" alt="${sec.title}"></div>
            <div class="rec-board-label"><span class="num">${sec.num}</span><span class="title">${sec.title}</span></div>
          </a>
        `).join("")}
      </div>
    </div>
  </section>

  <section class="folder-banner-section">
    <div class="container">
      <a href="#/dorm-book" class="folder-card">
        <img src="images/dorm12file.jpg" alt="Building 12 Dormitory Information" class="folder-inner-img">
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
  app.innerHTML = `<section class="category-view"><div class="container">
    ${crumbs([{label:"Home", href:"/"}, {label: sec.title}])}
    <div class="category-title-underline">${sec.pageTitle}</div>
    <div class="category-cards-row">
      ${sec.apps.map(app => `
        <a href="#/item/${app.id}" class="square-app-card" style="display:flex;flex-direction:column;border:2px solid var(--line);background:var(--white);">
          <div style="width:100%;aspect-ratio:1;display:grid;place-items:center;background:#fff;overflow:hidden;">
            <img src="${app.iconImg}" alt="${app.name}" style="width:100%;height:100%;object-fit:cover;">
          </div>
          <div class="square-app-footer" style="display:flex;justify-content:space-between;align-items:center;padding:14px 18px;border-top:2px solid var(--line);background:var(--white);">
            <div class="square-app-name" style="font-size:15px;font-weight:800;">${app.name} <small style="color:#666">${app.en}</small></div>
            <span class="square-app-arrow" style="font-size:14px;">▶</span>
          </div>
        </a>
      `).join("")}
    </div>
  </div></section>`;
}

/* 使用 page.jpg 作为响应式底图的档案册内页 */
async function dormBookPage(){
  app.innerHTML = `<section class="dorm-native-page">
    <div class="container" style="margin-bottom:12px; width:min(920px, 100%);">
      ${crumbs([{label:"Home", href:"/"}, {label:"Building 12: Dormitory Information"}])}
    </div>

    <div class="dorm-canvas-box">
      <!-- 纸张底图采用 page.jpg -->
      <img src="images/page.jpg" alt="Dorm Information" class="dorm-bg-img" onerror="this.src='images/13_2.jpg'">

      <div class="dorm-interactive-layer">
        
        <!-- 顶部小标签栏 -->
        <div class="dorm-top-tabs">
          <button class="dorm-tab-pill active" onclick="switchDormTab(0)">01. Address & Rules</button>
          <button class="dorm-tab-pill" onclick="switchDormTab(1)">02. Kitchen & Garbage</button>
          <button class="dorm-tab-pill" onclick="switchDormTab(2)">03. Water & Facilities</button>
        </div>

        <!-- Tab 01 -->
        <div class="dorm-panel-content active" id="dorm-panel-0">
          <div class="sheet-sec-title">DORMITORY ADDRESS</div>
          <div class="sheet-sec-line"></div>
          
          <div class="sheet-row-item">
            <div class="sheet-row-left">
              <span>★</span>
              <div id="addr-en" style="cursor:text;">
                Building 12, Graduate Student Apartments<br>
                East China Normal University (Minhang Campus)<br>
                No. 5800 Hongmei South Road, Minhang District, Shanghai
              </div>
            </div>
            <button class="sheet-copy-icon-btn" title="Copy" onclick="selectAndCopyText('addr-en', 'Building 12, Graduate Student Apartments, East China Normal University (Minhang Campus), No. 5800 Hongmei South Road, Minhang District, Shanghai')">
              <svg viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>
            </button>
          </div>

          <div class="sheet-row-item" style="margin-top:10px;">
            <div class="sheet-row-left">
              <span>★</span>
              <div id="addr-cn" style="cursor:text;">
                上海市闵行区虹梅南路5800号华东师范大学闵行校区<br>
                研究生公寓12号楼
              </div>
            </div>
            <button class="sheet-copy-icon-btn" title="复制" onclick="selectAndCopyText('addr-cn', '上海市闵行区虹梅南路5800号华东师范大学闵行校区研究生公寓12号楼')">
              <svg viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>
            </button>
          </div>

          <div class="sheet-sec-title" style="margin-top:25px;">ACCESS HOURS</div>
          <div class="sheet-sec-line"></div>
          <div class="sheet-row-item">
            <div class="sheet-row-left"><span>★</span><div>The dormitory entrance closes at 23:00.</div></div>
          </div>

          <div class="sheet-sec-title" style="margin-top:25px;">QUIET HOURS</div>
          <div class="sheet-sec-line"></div>
          <div class="sheet-row-item">
            <div class="sheet-row-left"><span>★</span><div>Please keep noise to a minimum after 23:00. Do not use washing machines or hair dryers after 23:00.</div></div>
          </div>
        </div>

        <!-- Tab 02 -->
        <div class="dorm-panel-content" id="dorm-panel-1">
          <div class="sheet-sec-title">SHARED KITCHEN</div>
          <div class="sheet-sec-line"></div>
          <div class="sheet-row-item"><div class="sheet-row-left"><span>•</span><div>Please clean the kitchen after use.</div></div></div>
          <div class="sheet-row-item"><div class="sheet-row-left"><span>•</span><div>Do not leave personal items, pots, dishes, or cooking utensils on the countertops.</div></div></div>
          <div class="sheet-row-item"><div class="sheet-row-left"><span>•</span><div>Please return them to the cabinets or take them back to your room.</div></div></div>

          <div class="sheet-sec-title" style="margin-top:22px;">GARBAGE DISPOSAL</div>
          <div class="sheet-sec-line"></div>
          <div class="sheet-row-item"><div class="sheet-row-left"><span>•</span><div>The kitchen trash bins are for food waste only.</div></div></div>
          <div class="sheet-row-item"><div class="sheet-row-left"><span>•</span><div>Trash from your room must be taken to the public garbage station located between Building 14 and the cafeteria.</div></div></div>
        </div>

        <!-- Tab 03 -->
        <div class="dorm-panel-content" id="dorm-panel-2">
          <div class="sheet-sec-title">DRINKING WATER DISPENSERS</div>
          <div class="sheet-sec-line"></div>
          <div class="sheet-row-item"><div class="sheet-row-left"><span>•</span><div>Water dispensers are located near the small staircases on the 2nd and 5th floors.</div></div></div>

          <div class="sheet-sec-title" style="margin-top:25px;">HAIR DRYER ROOMS</div>
          <div class="sheet-sec-line"></div>
          <div class="sheet-row-item"><div class="sheet-row-left"><span>•</span><div>Hair dryer rooms are located near the small staircases on the 2nd, 4th, and 6th floors.</div></div></div>
        </div>

      </div>
    </div>
  </section>`;

  window.switchDormTab = function(index) {
    document.querySelectorAll('.dorm-tab-pill').forEach((btn, idx) => {
      btn.classList.toggle('active', idx === index);
    });
    document.querySelectorAll('.dorm-panel-content').forEach((panel, idx) => {
      panel.classList.toggle('active', idx === index);
    });
  };
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

async function guidePage(id){
  const [items, guides, steps, shots] = await Promise.all([getData("items"), getData("guides"), getData("steps"), getData("screenshots")]);
  const g = by(guides, "guide_id", id); if(!g) return notFound();
  const item = by(items, "item_id", g.item_id);
  const guideSteps = steps.filter(s => String(s.guide_id) === String(id)).sort((a, b) => (a.step_number || 0) - (b.step_number || 0));
  
  const shotMapById = new Map(shots.map(s => [s.image_id, s]));
  const shotMapByStep = new Map(shots.map(s => [s.step_id, s]));

  let relatedGuides = guides.filter(x => x.status === "published" && x.guide_id !== id && x.item_id === g.item_id);

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
            if (!rawFilename && id === "GUIDE-010") rawFilename = `meituan-order-${String(i+1).padStart(2, '0')}.png`;
            else if (!rawFilename && id === "GUIDE-013") rawFilename = `maintenance-${String(i+1).padStart(2, '0')}.png`;

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
                    ${primarySrc ? `<img src="${primarySrc}" alt="Step" loading="lazy" onerror="this.parentElement.innerHTML='<div class=&quot;step-image placeholder&quot;>图片未找到：${rawFilename}</div>'">` : `<div class="step-image placeholder">未绑定图片</div>`}
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
              ${relatedGuides.map(x => guideCard(x, by(items, "item_id", x.item_id), null)).join("")}
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
