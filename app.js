
const root = document.querySelector("#app");
const DATA = {};
const load = async (name) => (DATA[name] ||= await fetch(`data/${name}.json`).then(r => r.json()));

const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const by = (arr,key,val) => arr.find(x => x[key] === val);
const many = (arr,key,val) => arr.filter(x => x[key] === val);
const icon = c => c?.icon || "✦";

function crumbs(parts){
  return `<div class="breadcrumbs">${parts.map((p,i)=>`${i?'<span>›</span>':''}${p.href?`<a href="#${p.href}">${esc(p.label)}</a>`:`<span>${esc(p.label)}</span>`}`).join('')}</div>`;
}
function guideCard(g, item){
  const title = g.guide_title || g.title || "";
  return `<a class="card card-link" href="#/guide/${g.guide_id}">
    <div class="badge">${esc(item?._display_name || item?.name || "Guide")}</div>
    <h3>${esc(title)}</h3>
    <p>${esc(g.short_description || "")}</p>
    <div class="badge-row">${g.platform?`<span class="badge">${esc(g.platform)}</span>`:""}<span class="badge">${esc(g.guide_type || "guide")}</span></div>
  </a>`;
}

async function renderHome(){
  const [cats,items,guides] = await Promise.all([load("categories"),load("items"),load("guides")]);
  const featured = guides.filter(g=>g.status==="published").slice(0,6);
  root.innerHTML = `<section class="hero">
    <div class="eyebrow">For international students in China</div>
    <h1>Figure out life in China, one task at a time.</h1>
    <p>Practical guides for everyday things that can be surprisingly confusing when you first arrive.</p>
    <form class="search-box" id="hs"><input name="q" placeholder="What are you trying to do?"><button class="button">Search</button></form>
  </section>
  <section class="section"><div class="section-head"><h2>Browse by topic</h2></div>
    <div class="grid grid-4">${cats.filter(c=>c.status==="active").sort((a,b)=>(a.order||99)-(b.order||99)).map(c=>`<a class="card card-link" href="#/category/${c.category_id}"><div class="card-icon">${icon(c)}</div><h3>${esc(c.display_name)}</h3><p>${esc(c.description)}</p></a>`).join("")}</div>
  </section>
  <section class="section"><div class="section-head"><h2>Guides available now</h2></div>
    <div class="grid grid-2">${featured.map(g=>guideCard(g,by(items,"item_id",g.item_id))).join("")}</div>
  </section>`;
  document.querySelector("#hs").addEventListener("submit",e=>{e.preventDefault();location.hash=`/search?q=${encodeURIComponent(new FormData(e.currentTarget).get("q")||"")}`;});
}

async function renderCategory(id){
  const [cats,items,guides]=await Promise.all([load("categories"),load("items"),load("guides")]);
  const c=by(cats,"category_id",id); if(!c) return notFound();
  const its=many(items,"category_id",id);
  root.innerHTML=crumbs([{label:"Home",href:"/"},{label:c.display_name}])+`<div class="page-title"><div class="eyebrow">${icon(c)} Topic</div><h1>${esc(c.display_name)}</h1><p>${esc(c.description)}</p></div>
  <div class="grid grid-2">${its.map(it=>{const gs=guides.filter(g=>g.item_id===it.item_id&&g.status==="published");return `<a class="card card-link" href="#/item/${it.item_id}"><h3>${esc(it._display_name||it.name)}</h3><p>${esc(it._display_description||it.short_description)}</p><div class="badge-row"><span class="badge">${esc(it.item_type||"service")}</span><span class="badge">${gs.length} guide${gs.length===1?"":"s"}</span></div></a>`}).join("")||'<div class="empty">No items yet.</div>'}</div>`;
}

async function renderItem(id){
  const [cats,items,guides]=await Promise.all([load("categories"),load("items"),load("guides")]);
  const it=by(items,"item_id",id); if(!it) return notFound();
  const c=by(cats,"category_id",it.category_id);
  const gs=guides.filter(g=>g.item_id===id&&g.status==="published");
  root.innerHTML=crumbs([{label:"Home",href:"/"},...(c?[{label:c.display_name,href:`/category/${c.category_id}`}]:[]),{label:it._display_name||it.name}])+
  `<div class="page-title"><div class="eyebrow">${esc(it.item_type||"service")}</div><h1>${esc(it._display_name||it.name)}</h1><p>${esc(it._display_description||it.short_description)}</p></div>
  <section class="section"><div class="section-head"><h2>Guides</h2></div><div class="grid grid-2">${gs.map(g=>guideCard(g,it)).join("")||'<div class="empty">Guides are being added.</div>'}</div></section>`;
}

async function renderGuide(id){
  const [cats,items,guides,steps,shots]=await Promise.all([load("categories"),load("items"),load("guides"),load("steps"),load("screenshots")]);
  const g=by(guides,"guide_id",id); if(!g) return notFound();
  const it=by(items,"item_id",g.item_id), c=it?by(cats,"category_id",it.category_id):null;
  const ss=many(steps,"guide_id",id).sort((a,b)=>(a.step_number||0)-(b.step_number||0));
  const published = g.status==="published";
  root.innerHTML=crumbs([{label:"Home",href:"/"},...(c?[{label:c.display_name,href:`/category/${c.category_id}`}]:[]),...(it?[{label:it._display_name||it.name,href:`/item/${it.item_id}`}]:[]),{label:g.title||g.guide_title}])+
  `<div class="guide-head"><div class="page-title"><div class="eyebrow">${esc(it?._display_name||it?.name||"Guide")}</div><h1>${esc(g.title||g.guide_title)}</h1><p>${esc(g.user_question||g.short_description||"")}</p>${published?"":'<div class="status-note">This guide is still being prepared and is not yet published.</div>'}</div>
  <div class="quick-info">${g.platform?`<div class="quick-item"><strong>Platform</strong>${esc(g.platform)}</div>`:""}<div class="quick-item"><strong>Status</strong>${esc(g.status||"draft")}</div></div></div>
  <section class="guide-steps">${ss.map(s=>{
    const sh=by(shots,"image_id",s.image_id);
    const img=s.image_path;
    return `<article class="step"><div class="step-number"><span>${esc(s.step_number)}</span></div><div><h2>${esc(s.step_title)}</h2><p>${esc(s.instruction||"")}</p>${s.tip?`<div class="step-tip"><strong>Tip:</strong> ${esc(s.tip)}</div>`:""}${sh?.caption?`<div class="step-tip">${esc(sh.caption)}</div>`:""}<div class="step-image">${img?`<img src="${esc(img)}" alt="${esc(s.alt_text||sh?.alt_text||s.step_title)}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=&quot;image-placeholder&quot;>Image file not added yet:<br><code>${esc(sh?.filename||"filename")}</code></div>'">`:`<div class="image-placeholder">${s.image_id?`Screenshot: <code>${esc(s.image_id)}</code>`:"No screenshot yet"}</div>`}</div></div></article>`;
  }).join("")||'<div class="empty">No steps added yet.</div>'}</section>`;
}

async function renderSearch(q=""){
  const [items,guides]=await Promise.all([load("items"),load("guides")]); q=q.trim().toLowerCase();
  const rs=guides.filter(g=>g.status==="published"&&[g.title,g.guide_title,g.short_description,g.user_question,by(items,"item_id",g.item_id)?.name].filter(Boolean).join(" ").toLowerCase().includes(q));
  root.innerHTML=crumbs([{label:"Home",href:"/"},{label:"Search"}])+`<div class="page-title"><div class="eyebrow">Find a guide</div><h1>${q?`Results for “${esc(q)}”`:"Search"}</h1><p>Search by task, app, service or keyword.</p></div><form class="search-box" id="sf"><input name="q" value="${esc(q)}" placeholder="e.g. Alipay, parcel, metro"><button class="button">Search</button></form><section class="section"><div class="grid">${rs.length?rs.map(g=>`<a class="result" href="#/guide/${g.guide_id}"><strong>${esc(g.title||g.guide_title)}</strong><span>${esc(by(items,"item_id",g.item_id)?.name||"")}</span></a>`).join(""):'<div class="empty">No published guides match this search.</div>'}</div></section>`;
  document.querySelector("#sf").addEventListener("submit",e=>{e.preventDefault();location.hash=`/search?q=${encodeURIComponent(new FormData(e.currentTarget).get("q")||"")}`;});
}

async function renderFAQ(){
  const [faqs,guides]=await Promise.all([load("faq"),load("guides")]);
  root.innerHTML=crumbs([{label:"Home",href:"/"},{label:"FAQ"}])+`<div class="page-title"><div class="eyebrow">Frequently asked questions</div><h1>FAQ</h1><p>Quick answers to common questions.</p></div><div class="grid">${faqs.filter(x=>x.status==="published").map(x=>`<details class="card"><summary><strong>${esc(x.question)}</strong></summary><p>${esc(x.answer)}</p>${x.related_guide_id?`<a href="#/guide/${x.related_guide_id}">Read guide →</a>`:""}</details>`).join("")}</div>`;
}
function notFound(){root.innerHTML='<div class="empty"><h2>Page not found</h2><p>This page does not exist or is not published yet.</p><a class="button" href="#/">Back to home</a></div>'}
async function route(){
  const raw=location.hash.replace(/^#/,"")||"/"; const [p,q]=raw.split("?"); const params=new URLSearchParams(q||"");
  if(p==="/")return renderHome(); if(p==="/search")return renderSearch(params.get("q")||""); if(p==="/faq")return renderFAQ();
  const [,type,id]=p.split("/"); if(type==="category")return renderCategory(id); if(type==="item")return renderItem(id); if(type==="guide")return renderGuide(id); return notFound();
}
window.addEventListener("hashchange",route); route().catch(err=>{console.error(err);root.innerHTML='<div class="empty"><h2>Something went wrong</h2><p>Check the browser console for details.</p></div>'});
