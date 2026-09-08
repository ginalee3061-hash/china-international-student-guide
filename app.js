import { categories, items, guides, steps, related, faq } from "./data.js";

const app = document.querySelector("#app");

const byId = (arr, key, value) => arr.find(x => x[key] === value);
const allBy = (arr, key, value) => arr.filter(x => x[key] === value);

function iconFor(categoryId) {
  const icons = {
    "CAT-001": "🧭",
    "CAT-002": "🏫",
    "CAT-003": "🏠",
    "CAT-004": "📱",
    "CAT-005": "🚇",
    "CAT-006": "💳",
    "CAT-007": "🌐"
  };
  return icons[categoryId] || "✦";
}

function link(path, label, className = "") {
  return `<a class="${className}" href="#${path}">${label}</a>`;
}

function breadcrumbs(parts) {
  return `<div class="breadcrumbs">
    ${parts.map((p, i) => `${i ? "<span>›</span>" : ""}${p.href ? link(p.href, p.label) : `<span>${p.label}</span>`}`).join("")}
  </div>`;
}

function renderHome() {
  const featured = guides.filter(g => g.status === "published" && g.featured);
  const publishedCategories = categories.filter(c => c.status === "active");

  app.innerHTML = `
    <section class="hero">
      <div class="eyebrow">For international students in China</div>
      <h1>Figure out life in China, one task at a time.</h1>
      <p>Practical guides for the small things that are surprisingly hard when you first arrive: payments, transport, campus services, apps, dorm life and more.</p>
      <form class="search-box" id="home-search">
        <input name="q" placeholder="What are you trying to do?" aria-label="Search guides">
        <button class="button">Search</button>
      </form>
    </section>

    <section class="section">
      <div class="section-head">
        <h2>Browse by topic</h2>
      </div>
      <div class="grid grid-4">
        ${publishedCategories.map(c => `
          <a class="card card-link" href="#/category/${c.category_id}">
            <div class="card-icon">${iconFor(c.category_id)}</div>
            <h3>${c.display_name}</h3>
            <p>${c.description}</p>
          </a>
        `).join("")}
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <h2>Popular guides</h2>
        ${link("/search", "View all →", "")}
      </div>
      <div class="grid grid-2">
        ${featured.map(g => guideCard(g)).join("")}
      </div>
    </section>
  `;

  document.querySelector("#home-search").addEventListener("submit", e => {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q")?.trim() || "";
    location.hash = `/search?q=${encodeURIComponent(q)}`;
  });
}

function guideCard(g) {
  const item = byId(items, "item_id", g.item_id);
  return `
    <a class="card card-link" href="#/guide/${g.guide_id}">
      <div class="badge">${item?.name || "Guide"}</div>
      <h3>${g.title}</h3>
      <p>${g.short_description || ""}</p>
      <div class="badge-row">
        ${g.platform && g.platform !== "all" ? `<span class="badge">${g.platform}</span>` : ""}
        ${g.difficulty ? `<span class="badge">${g.difficulty}</span>` : ""}
      </div>
    </a>
  `;
}

function renderCategory(categoryId) {
  const category = byId(categories, "category_id", categoryId);
  if (!category) return renderNotFound();

  const categoryItems = allBy(items, "category_id", categoryId);

  app.innerHTML = `
    ${breadcrumbs([{label:"Home", href:"/"}, {label:category.display_name}])}
    <div class="page-title">
      <div class="eyebrow">${iconFor(categoryId)} Topic</div>
      <h1>${category.display_name}</h1>
      <p>${category.description}</p>
    </div>

    <div class="grid grid-2">
      ${categoryItems.map(item => {
        const itemGuides = guides.filter(g => g.item_id === item.item_id && g.status === "published");
        return `
          <a class="card card-link" href="#/item/${item.item_id}">
            <h3>${item.name}</h3>
            <p>${item.short_description}</p>
            <div class="badge-row">
              <span class="badge">${item.item_type}</span>
              <span class="badge">${itemGuides.length} guide${itemGuides.length === 1 ? "" : "s"}</span>
            </div>
          </a>
        `;
      }).join("")}
    </div>
  `;
}

function renderItem(itemId) {
  const item = byId(items, "item_id", itemId);
  if (!item) return renderNotFound();
  const category = byId(categories, "category_id", item.category_id);
  const itemGuides = guides.filter(g => g.item_id === itemId && g.status === "published");

  app.innerHTML = `
    ${breadcrumbs([
      {label:"Home", href:"/"},
      ...(category ? [{label:category.display_name, href:`/category/${category.category_id}`}] : []),
      {label:item.name}
    ])}

    <div class="page-title">
      <div class="eyebrow">${item.item_type}</div>
      <h1>${item.name}</h1>
      <p>${item.short_description}</p>
    </div>

    <section class="section">
      <div class="section-head">
        <h2>Guides</h2>
      </div>
      <div class="grid grid-2">
        ${itemGuides.length ? itemGuides.map(guideCard).join("") : `<div class="empty">Guides are being added.</div>`}
      </div>
    </section>
  `;
}

function renderGuide(guideId) {
  const guide = byId(guides, "guide_id", guideId);
  if (!guide) return renderNotFound();

  const item = byId(items, "item_id", guide.item_id);
  const category = item ? byId(categories, "category_id", item.category_id) : null;
  const guideSteps = steps
    .filter(s => s.guide_id === guideId && s.status !== "hidden")
    .sort((a, b) => a.step_number - b.step_number);

  const rels = allBy(related, "from_id", guideId)
    .map(r => byId(guides, "guide_id", r.to_id))
    .filter(g => g && g.status === "published");

  app.innerHTML = `
    ${breadcrumbs([
      {label:"Home", href:"/"},
      ...(category ? [{label:category.display_name, href:`/category/${category.category_id}`}] : []),
      ...(item ? [{label:item.name, href:`/item/${item.item_id}`}] : []),
      {label:guide.title}
    ])}

    <div class="guide-head">
      <div class="page-title">
        <div class="eyebrow">${item?.name || "Guide"}</div>
        <h1>${guide.title}</h1>
        <p>${guide.user_question || guide.short_description || ""}</p>
      </div>

      <div class="quick-info">
        ${guide.platform ? `<div class="quick-item"><strong>Platform</strong>${guide.platform}</div>` : ""}
        ${guide.difficulty ? `<div class="quick-item"><strong>Difficulty</strong>${guide.difficulty}</div>` : ""}
        ${guide.time_required ? `<div class="quick-item"><strong>Time</strong>${guide.time_required}</div>` : ""}
      </div>
    </div>

    <section class="guide-steps">
      ${guideSteps.map(step => `
        <article class="step">
          <div class="step-number"><span>${step.step_number}</span></div>
          <div>
            <h2>${step.step_title}</h2>
            <p>${step.instruction}</p>
            ${step.tip ? `<div class="step-tip"><strong>Tip:</strong> ${step.tip}</div>` : ""}
            ${step.warning ? `<div class="step-warning"><strong>Note:</strong> ${step.warning}</div>` : ""}
            <div class="step-image">
              ${step.image_path
                ? `<img src="${step.image_path}" alt="${step.alt_text || step.step_title}" loading="lazy">`
                : `<div class="image-placeholder">Screenshot placeholder<br><code>${step.image_id || "IMG-..."}</code></div>`
              }
            </div>
          </div>
        </article>
      `).join("")}
    </section>

    ${rels.length ? `
      <section class="related">
        <div class="section-head"><h2>You may also need</h2></div>
        <div class="grid grid-2">
          ${rels.map(guideCard).join("")}
        </div>
      </section>
    ` : ""}
  `;
}

function renderSearch(query = "") {
  const q = query.trim().toLowerCase();
  const results = guides.filter(g => {
    if (g.status !== "published") return false;
    const item = byId(items, "item_id", g.item_id);
    const haystack = [
      g.title, g.short_description, g.user_question,
      item?.name, item?.chinese_name
    ].filter(Boolean).join(" ").toLowerCase();
    return !q || haystack.includes(q);
  });

  app.innerHTML = `
    ${breadcrumbs([{label:"Home", href:"/"}, {label:"Search"}])}
    <div class="page-title">
      <div class="eyebrow">Find a guide</div>
      <h1>${q ? `Results for “${escapeHtml(query)}”` : "Search"}</h1>
      <p>Search by task, app, service or keyword.</p>
    </div>

    <form class="search-box" id="search-form">
      <input name="q" value="${escapeAttr(query)}" placeholder="e.g. bank card, metro, Wi-Fi" aria-label="Search">
      <button class="button">Search</button>
    </form>

    <section class="section">
      <div class="search-results">
        ${results.length
          ? results.map(g => `
              <a class="search-result" href="#/guide/${g.guide_id}">
                <strong>${g.title}</strong>
                <span>${byId(items, "item_id", g.item_id)?.name || ""} · ${g.short_description || ""}</span>
              </a>
            `).join("")
          : `<div class="empty">No published guides match this search yet.</div>`
        }
      </div>
    </section>
  `;

  document.querySelector("#search-form").addEventListener("submit", e => {
    e.preventDefault();
    const newQ = new FormData(e.currentTarget).get("q")?.trim() || "";
    location.hash = `/search?q=${encodeURIComponent(newQ)}`;
  });
}

function renderFAQ() {
  app.innerHTML = `
    ${breadcrumbs([{label:"Home", href:"/"}, {label:"FAQ"}])}
    <div class="page-title">
      <div class="eyebrow">Frequently asked questions</div>
      <h1>FAQ</h1>
      <p>Quick answers to common questions. More will be added as the guide grows.</p>
    </div>
    <div class="grid">
      ${faq.filter(x => x.status === "published").map(x => `
        <details class="card">
          <summary><strong>${x.question}</strong></summary>
          <p class="muted">${x.answer}</p>
          ${x.related_guide_id ? link(`/guide/${x.related_guide_id}`, "Read the guide →") : ""}
        </details>
      `).join("")}
    </div>
  `;
}

function renderNotFound() {
  app.innerHTML = `
    <div class="empty">
      <h2>Page not found</h2>
      <p>The page you are looking for does not exist or is not published yet.</p>
      ${link("/", "Back to home", "button")}
    </div>
  `;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, ch => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[ch]));
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}

function route() {
  const raw = location.hash.replace(/^#/, "") || "/";
  const [pathPart, queryPart] = raw.split("?");
  const path = pathPart || "/";
  const params = new URLSearchParams(queryPart || "");

  if (path === "/") return renderHome();
  if (path === "/search") return renderSearch(params.get("q") || "");
  if (path === "/faq") return renderFAQ();

  const [, type, id] = path.split("/");
  if (type === "category") return renderCategory(id);
  if (type === "item") return renderItem(id);
  if (type === "guide") return renderGuide(id);

  return renderNotFound();
}

window.addEventListener("hashchange", route);
route();
