
const app = document.querySelector("#app");
const progressBar = document.querySelector("#scroll-progress span");

const DATA = {};
async function getData(name){
  if(!DATA[name]){
    const res = await fetch(`data/${name}.json`);
    if(!res.ok) throw new Error(`Cannot load ${name}.json`);
    DATA[name] = await res.json();
  }
  return DATA[name];
}
const by=(arr,key,val)=>arr.find(x=>String(x[key])===String(val));
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[c]));
const titleOf=g=>g.title||g.guide_title||"Guide";
const itemName=i=>i?._display_name||i?.name||"";
const visualClass=i=>i?.visual?.logo_class||"default";

function crumbs(parts){
  return `<div class="breadcrumbs">${parts.map((p,i)=>`${i?'<span>›</span>':''}${p.href?`<a href="#${p.href}">${esc(p.label)}</a>`:`<span>${esc(p.label)}</span>`}`).join("")}</div>`;
}
function placeholder(text="Image coming soon"){return `<div class="step-image placeholder">${esc(text)}</div>`}

function guideCard(g, item, compact=false){
  const v=item?.visual||{};
  return `<a class="guide-card" href="#/guide/${g.guide_id}">
    <div class="polaroid"><div class="polaroid-inner ${esc(v.logo_class||"default")}">${esc(v.logo_text||"✦")}</div></div>
    <div class="eyebrow">${esc(itemName(item))}</div>
    <h3>${esc(titleOf(g))}</h3>
    <p>${esc(g.short_description||"")}</p>
    <div class="card-spacer"></div><span class="learn">LEARN MORE</span>
  </a>`;
}

function appCard(item){
  const v=item.visual||{};
  return `<a class="app-card" href="#/item/${item.item_id}">
    <div class="app-card-visual ${esc(v.logo_class||"default")}">${esc(v.logo_text||"✦")}</div>
    <div class="app-card-body"><strong>${esc(itemName(item))}</strong><span class="triangle">▶</span></div>
  </a>`;
}

async function home(){
  const [items,guides,groups]=await Promise.all([getData("items"),getData("guides"),getData("featured-groups")]);
  const published=new Map(guides.filter(g=>g.status==="published").map(g=>[g.guide_id,g]));
  app.innerHTML=`<section class="hero"><div class="container hero-inner">
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
  <div class="home-sections">${groups.map(group=>{
    const gs=group.guide_ids.map(id=>published.get(id)).filter(Boolean).slice(0,3);
    const its=group.item_ids.map(id=>by(items,"item_id",id)).filter(Boolean);
    return `<section class="section-band ${group.theme}">
      <div class="container">
        <div class="section-tab"><span>${group.number} ${esc(group.title)}</span><span class="arrow">→</span></div>
        <p class="section-note">${esc(group.description)}</p>
        <div class="card-grid">
          ${gs.map(g=>guideCard(g, by(items,"item_id",g.item_id))).join("")}
          ${!gs.length ? its.map(appCard).join("") : ""}
        </div>
      </div>
    </section>`;
  }).join("")}</div>`;
  document.querySelector("#hero-search").addEventListener("submit",e=>{
    e.preventDefault(); const q=new FormData(e.currentTarget).get("q")||""; location.hash=`/search?q=${encodeURIComponent(q)}`;
  });
}

async function recommendedApps(){
  const items=await getData("items");
  const apps=items.filter(i=>i.item_type==="app");
  app.innerHTML=`<section class="page"><div class="container">${crumbs([{label:"Home",href:"/"},{label:"Recommended Apps"}])}
    <div class="page-head"><div class="eyebrow">START WITH THESE</div><h1>RECOMMENDED APPS</h1><p>The apps that solve a surprising number of everyday problems once you arrive.</p></div>
    <div class="apps-grid">${apps.map(appCard).join("")}</div>
  </div></section>`;
}

async function itemPage(id){
  const [items,guides,details]=await Promise.all([getData("items"),getData("guides"),getData("app-details")]);
  const item=by(items,"item_id",id); if(!item)return notFound();
  const detail=details[id]||{tagline:"Useful everyday tool",intro:item._display_description,recommended:"Learn the parts you need.",related_guide_ids:guides.filter(g=>g.item_id===id&&g.status==="published").map(g=>g.guide_id)};
  const related=detail.related_guide_ids.map(gid=>by(guides,"guide_id",gid)).filter(Boolean).filter(g=>g.status==="published");
  const v=item.visual||{};
  app.innerHTML=`<section class="page"><div class="container">
    ${crumbs([{label:"Home",href:"/"},{label:"Recommended Apps",href:"/recommended-apps"},{label:itemName(item)}])}
    <div class="app-showcase">
      <div class="app-showcase-grid">
        <div class="app-logo ${esc(v.logo_class||"default")}">${esc(v.logo_text||"✦")}</div>
        <div class="app-meta">
          <div class="eyebrow">${esc(item.chinese_name||item.item_type||"app")}</div>
          <h2>${esc(itemName(item))}</h2>
          <p><strong>${esc(detail.tagline)}</strong><br>${esc(detail.intro)}</p>
          <div class="pill-row">
            ${item.platform?`<span class="pill">${esc(item.platform)}</span>`:""}
            ${item.importance?`<span class="pill">${esc(item.importance)}</span>`:""}
          </div>
        </div>
      </div>
      <div class="app-sections">
        <div class="info-box"><h3>When you’ll use it</h3><p>${esc(detail.recommended)}</p></div>
        <div class="info-box"><h3>Start here</h3><p>Pick one of the guides below instead of learning the whole app at once.</p></div>
      </div>
    </div>
    <section class="related"><h2>RELATED GUIDES</h2><div class="related-grid">${related.map(g=>guideCard(g,item)).join("")||'<div class="empty">More guides are coming soon.</div>'}</div></section>
  </div></section>`;
}

function updateScrollProgress(){
  const max=document.documentElement.scrollHeight-window.innerHeight;
  const pct=max>0?(window.scrollY/max)*100:0;
  if(progressBar)progressBar.style.height=`${Math.min(100,Math.max(0,pct))}%`;
}
window.addEventListener("scroll",updateScrollProgress,{passive:true});

async function guidePage(id){
  const [cats,items,guides,steps,shots]=await Promise.all([getData("categories"),getData("items"),getData("guides"),getData("steps"),getData("screenshots")]);
  const g=by(guides,"guide_id",id); if(!g)return notFound();
  const item=by(items,"item_id",g.item_id);
  const category=item?by(cats,"category_id",item.category_id):null;
  const guideSteps=steps.filter(s=>String(s.guide_id)===String(id)).sort((a,b)=>(a.step_number||0)-(b.step_number||0));
  const publishedShots=new Map(shots.map(s=>[s.image_id,s]));
  app.innerHTML=`<section class="page"><div class="container">
    ${crumbs([{label:"Home",href:"/"},...(category?[{label:category.display_name,href:`/`}]:[]),...(item?[{label:itemName(item),href:`/item/${item.item_id}`}]:[]),{label:titleOf(g)}])}
    <div class="guide-layout">
      <aside class="progress-rail"><div class="progress-track"></div><div class="progress-fill" id="progress-fill"></div><div class="progress-list">
        ${guideSteps.map((s,i)=>`<div class="progress-item" data-step="${i}"><div class="progress-dot">${i+1}</div></div>`).join("")}
      </div></aside>
      <article>
        <header class="guide-title">
          <div class="eyebrow">${esc(itemName(item))}</div>
          <h1>${esc(titleOf(g))}</h1>
          <p>${esc(g.user_question||g.short_description||"")}</p>
          ${g.status!=="published"?`<div class="step-note">This guide is being prepared and may change.</div>`:""}
        </header>
        <div class="guide-steps">
          ${guideSteps.map((s,i)=>{
            const sh=publishedShots.get(s.image_id);
            const path=s.image_path;
            return `<section class="guide-step" data-step-section="${i}">
              <div class="step-kicker">[ ${String(i+1).padStart(2,"0")} ] ${esc(s.step_title||"STEP")}</div>
              <div class="step-grid">
                <div class="step-copy"><h2>${esc(s.step_title||"")}</h2><p>${esc(s.instruction||"")}</p>
                  ${s.tip?`<div class="step-note">${esc(s.tip)}</div>`:""}
                  ${s.warning?`<div class="step-note">${esc(s.warning)}</div>`:""}
                </div>
                ${path?`<div class="step-image"><img src="${esc(path)}" alt="${esc(s.alt_text||sh?.alt_text||s.step_title||"Guide image")}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=&quot;step-image placeholder&quot;>Add image file:<br><code>${esc(sh?.filename||"filename")}</code></div>'"></div>`:placeholder(`Screenshot placeholder — ${s.image_id||""}`)}
              </div>
            </section>`;
          }).join("")}
        </div>
        <section class="related"><h2>YOU MAY ALSO NEED</h2><div class="related-grid">
          ${guides.filter(x=>x.status==="published" && x.guide_id!==id && (x.item_id===g.item_id || (item && ["GUIDE-004","GUIDE-009"].includes(x.guide_id)))).slice(0,3).map(x=>guideCard(x,by(items,"item_id",x.item_id))).join("")}
        </div></section>
      </article>
    </div>
  </div></section>`;

  const rail=document.querySelector(".progress-rail");
  const fill=document.querySelector("#progress-fill");
  const sections=[...document.querySelectorAll("[data-step-section]")];
  const dots=[...document.querySelectorAll(".progress-item")];

  function guideProgress(){
    const top=window.scrollY;
    const start=document.querySelector(".guide-title")?.offsetTop||0;
    const end=document.querySelector(".related")?.offsetTop||document.body.scrollHeight;
    const pct=Math.max(0,Math.min(100,((top-start)/(end-start))*100));
    if(fill) fill.style.height=`${pct}%`;
    sections.forEach((sec,i)=>{
      const r=sec.getBoundingClientRect();
      const active=r.top < window.innerHeight*.45 && r.bottom > 0;
      dots[i]?.classList.toggle("active",active);
      if(r.bottom < window.innerHeight*.45) dots[i]?.classList.add("done");
      else dots[i]?.classList.remove("done");
    });
  }
  window.addEventListener("scroll",guideProgress,{passive:true});
  updateScrollProgress(); guideProgress();
}

async function searchPage(q=""){
  const [items,guides]=await Promise.all([getData("items"),getData("guides")]);
  const clean=q.trim().toLowerCase();
  const results=guides.filter(g=>g.status==="published").filter(g=>{
    const it=by(items,"item_id",g.item_id);
    const text=[titleOf(g),g.short_description,g.user_question,itemName(it),it?.chinese_name].filter(Boolean).join(" ").toLowerCase();
    return !clean || text.includes(clean);
  });
  app.innerHTML=`<section class="page"><div class="container">${crumbs([{label:"Home",href:"/"},{label:"Search"}])}
    <div class="page-head"><div class="eyebrow">FIND A GUIDE</div><h1>SEARCH</h1><p>Search by task, app, service, or the thing you are trying to do.</p></div>
    <form class="search-form" id="search-form"><input name="q" value="${esc(q)}" placeholder="e.g. Alipay, package, metro"><button class="btn">SEARCH</button></form>
    <div class="grid">${results.map(g=>`<a class="search-result" href="#/guide/${g.guide_id}"><strong>${esc(titleOf(g))}</strong><span>${esc(itemName(by(items,"item_id",g.item_id)))}</span></a>`).join("") || '<div class="step-note">No published guides match this search yet.</div>'}</div>
  </div></section>`;
  document.querySelector("#search-form").addEventListener("submit",e=>{e.preventDefault();const v=new FormData(e.currentTarget).get("q")||"";location.hash=`/search?q=${encodeURIComponent(v)}`});
}

async function faqPage(){
  const [guides]=await Promise.all([getData("guides")]);
  app.innerHTML=`<section class="page"><div class="container">${crumbs([{label:"Home",href:"/"},{label:"FAQ"}])}
    <div class="page-head"><div class="eyebrow">QUICK ANSWERS</div><h1>FAQ</h1><p>Common questions will live here as the guide grows.</p></div>
    <div class="faq-list"><details><summary>Which apps should I set up first?</summary><p>Start with the apps you need for the tasks you actually do: payments, transport, parcels, campus services and communication.</p></details><details><summary>Where can I find a step-by-step tutorial?</summary><p>Browse a topic on the home page, open the relevant item, and choose a guide.</p></details><details><summary>What happens to guides that are not ready?</summary><p>They can stay in the data with a draft or collecting status and remain hidden from the public interface until they are ready.</p></details></div>
  </div></section>`;
}

function notFound(){app.innerHTML=`<section class="page"><div class="container"><div class="step-note"><strong>Page not found.</strong><br><a href="#/">Back to home</a></div></div></section>`}

async function route(){
  const raw=location.hash.replace(/^#/,"")||"/";
  const [path,query]=raw.split("?"); const params=new URLSearchParams(query||"");
  window.scrollTo(0,0);
  document.body.classList.remove("guide-route");
  if(path==="/") return home();
  if(path==="/recommended-apps") return recommendedApps();
  if(path==="/search") return searchPage(params.get("q")||"");
  if(path==="/faq") return faqPage();
  const parts=path.split("/");
  if(parts[1]==="item") return itemPage(parts[2]);
  if(parts[1]==="guide"){ document.body.classList.add("guide-route"); return guidePage(parts[2]); }
  return notFound();
}

window.addEventListener("hashchange",()=>route().catch(err=>{console.error(err);notFound()}));
route().catch(err=>{console.error(err);notFound()});

