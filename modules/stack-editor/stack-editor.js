import Sortable from "https://cdn.jsdelivr.net/npm/sortablejs@1.15.3/modular/sortable.esm.js";

// References
const stackEl = document.getElementById('stack');
const stackDropIndicator = document.getElementById('stackDropIndicator');
const btnNewStep = document.getElementById('btnNewStep');
const btnPublish = document.getElementById('btnPublish');
const btnPublishBottom = document.getElementById('btnPublishBottom');
const statusPill = document.getElementById('statusPill');
const lastSaved = document.getElementById('lastSaved');
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const btnBrowse = document.getElementById('btnBrowse');
const assetsEl = document.getElementById('assets');
const stage = document.getElementById('stage');
const stageEmpty = document.getElementById('stageEmpty');
const btnImport = document.getElementById('btnImport');
const globalSearch = document.getElementById('globalSearch');
const stepCount = document.getElementById('stepCount');
const assetCount = document.getElementById('assetCount');
const btnExpandAll = document.getElementById('btnExpandAll');
const btnCollapseAll = document.getElementById('btnCollapseAll');
const btnClearSteps = document.getElementById('btnClearSteps');
const btnGuides = document.getElementById('btnGuides');
const guides = document.getElementById('guides');
const btnClearStage = document.getElementById('btnClearStage');
const btnAddDemoTile = document.getElementById('btnAddDemoTile');

// Minimal local state
const state = {
  steps: [],
  assets: [],
  publishCounter: 0,
  assetFilter: 'all'
};

// Utilities
const nowStr = () => new Date().toLocaleString();
const uid = () => Math.random().toString(36).slice(2,9);
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const save = (silent=false) => {
  localStorage.setItem('stack-editor-state', JSON.stringify(state));
  lastSaved.textContent = nowStr();
  if(!silent){
    flashStatus('Gespeichert', 'ok');
  }
};

const load = () => {
  try{
    const raw = localStorage.getItem('stack-editor-state');
    if(raw){
      const parsed = JSON.parse(raw);
      if(Array.isArray(parsed.steps)) state.steps = parsed.steps;
      if(Array.isArray(parsed.assets)) state.assets = parsed.assets;
      if(typeof parsed.publishCounter === 'number') state.publishCounter = parsed.publishCounter;
      if(typeof parsed.assetFilter === 'string') state.assetFilter = parsed.assetFilter;
    } else {
      state.steps = [
        { id: uid(), name: 'Entwurf', info: 'Start' },
        { id: uid(), name: 'Review', info: 'Feedback' },
        { id: uid(), name: 'Freigabe', info: 'QA' }
      ];
    }
  }catch(e){}
};

// Step rendering
function renderSteps(filterText=''){
  stackEl.innerHTML = '';
  const q = filterText.trim().toLowerCase();
  const list = state.steps.filter(s => !q || s.name.toLowerCase().includes(q) || (s.info||'').toLowerCase().includes(q));
  list.forEach(step => {
    const el = document.createElement('div');
    el.className = 'step';
    el.draggable = true;
    el.dataset.id = step.id;
    el.innerHTML = `
      <div class="dot" aria-hidden="true"></div>
      <div>
        <div class="name" contenteditable="true" spellcheck="false" aria-label="Schrittname">${escapeHtml(step.name)}</div>
        <div class="meta" contenteditable="true" spellcheck="false" aria-label="Beschreibung">${escapeHtml(step.info || '')}</div>
      </div>
      <div class="handles">
        <button class="handle" title="Duplizieren" data-action="dup">⧉</button>
        <button class="handle" title="Löschen" data-action="del">✕</button>
      </div>
    `;
    const nameEl = el.querySelector('.name');
    const metaEl = el.querySelector('.meta');
    const saveName = () => {
      const s = state.steps.find(s => s.id === step.id);
      if(s){ s.name = nameEl.textContent.trim(); touch(); }
    };
    const saveMeta = () => {
      const s = state.steps.find(s => s.id === step.id);
      if(s){ s.info = metaEl.textContent.trim(); touch(); }
    };
    nameEl.addEventListener('input', saveName);
    nameEl.addEventListener('keydown', e => { if(e.key==='Enter'){ e.preventDefault(); nameEl.blur(); } });
    metaEl.addEventListener('input', saveMeta);
    metaEl.addEventListener('keydown', e => { if(e.key==='Enter'){ e.preventDefault(); metaEl.blur(); } });

    el.querySelectorAll('.handle').forEach(btn=>{
      btn.addEventListener('click', (ev)=>{
        ev.stopPropagation();
        const act = btn.dataset.action;
        if(act === 'del'){
          state.steps = state.steps.filter(s => s.id !== step.id);
          renderSteps(q); touch();
        } else if(act === 'dup'){
          const copy = { ...step, id: uid(), name: step.name + ' (Kopie)' };
          const idx = state.steps.findIndex(s => s.id === step.id);
          state.steps.splice(idx+1, 0, copy);
          renderSteps(q); touch();
        }
      });
    });
    stackEl.appendChild(el);
  });
  stepCount.textContent = state.steps.length;
  setupSortable();
  updateStage();
}

function setupSortable(){
  if(stackEl._sortable){ return; }
  Sortable.create(stackEl, {
    animation: 160,
    ghostClass: 'dragging',
    handle: '.step',
    onStart(){ stackDropIndicator.classList.add('visible'); },
    onEnd(evt){
      stackDropIndicator.classList.remove('visible');
      const order = [...stackEl.children].map(ch => ch.dataset.id);
      state.steps.sort((a,b)=> order.indexOf(a.id) - order.indexOf(b.id));
      touch();
    }
  });
  stackEl._sortable = true;
}

// Assets
function renderAssets(filterText=''){
  assetsEl.innerHTML = '';
  const q = filterText.trim().toLowerCase();
  const kind = state.assetFilter;
  const filtered = state.assets.filter(a => {
    const byKind = kind === 'all' ? true : a.kind === kind;
    const byText = !q || a.name.toLowerCase().includes(q) || a.kind.toLowerCase().includes(q);
    return byKind && byText;
  });
  filtered.forEach(a=>{
    const card = document.createElement('div');
    card.className = 'asset';
    const c = document.createElement('canvas');
    c.width = 256; c.height = 256;
    drawPlaceholderPreview(c.getContext('2d'), a);
    const caption = document.createElement('div');
    caption.className = 'caption';
    caption.innerHTML = `<span title="${escapeAttr(a.name)}">${truncate(a.name, 18)}</span><span class="tag">${a.kind.toUpperCase()}</span>`;
    card.appendChild(c);
    card.appendChild(caption);
    card.tabIndex = 0;
    // Drag onto stage [MDN Drag and Drop API docs: developer.mozilla.org]
    // Reference: HTML Drag and Drop API - details on setData and drag images [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)
    card.draggable = true;
    card.addEventListener('dragstart', (e)=>{
      e.dataTransfer.setData('text/plain', a.id);
      e.dataTransfer.setData('text/html', `<asset id="${a.id}"></asset>`);
      e.dataTransfer.effectAllowed = 'copy';
    });
    // Keyboard "send to stage"
    card.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter'){
        addStageTile(a);
        touch();
      }
    });
    assetsEl.appendChild(card);
  });
  assetCount.textContent = state.assets.length;
}

function truncate(s, n){
  if(s.length <= n) return s;
  return s.slice(0, n-1) + '…';
}

// Procedural preview generator (no external assets)
function drawPlaceholderPreview(ctx, asset){
  const {width, height} = ctx.canvas;
  const h = hash(asset.id + asset.kind);
  const c1 = hueToRGB((h % 360), 65, 18);
  const c2 = hueToRGB(((h+60) % 360), 75, 12);
  const grd = ctx.createLinearGradient(0,0,width,height);
  grd.addColorStop(0, c1);
  grd.addColorStop(1, c2);
  ctx.fillStyle = grd;
  ctx.fillRect(0,0,width,height);

  // soft noise pattern
  for(let i=0;i<240;i++){
    const x = (noise(h+i*13))*width;
    const y = (noise(h+i*7))*height;
    const r = (noise(h+i*17)*0.4+0.1)* (Math.min(width,height)/16);
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2);
    ctx.fillStyle = `rgba(255,255,255,${0.02 + r/50})`;
    ctx.fill();
  }

  // label
  ctx.fillStyle = 'rgba(255,255,255,.9)';
  ctx.font = '600 20px ui-sans-serif, system-ui';
  ctx.textAlign = 'center';
  ctx.fillText(asset.kind.toUpperCase(), width/2, height/2 + 8);

  // corner badge
  ctx.fillStyle = 'rgba(0,0,0,.25)';
  ctx.fillRect(0,0,100,28);
  ctx.fillStyle = 'rgba(255,255,255,.9)';
  ctx.font = '12px ui-sans-serif, system-ui';
  ctx.textAlign = 'left';
  ctx.fillText(truncate(asset.name, 14), 8, 18);
}

function hueToRGB(h, s=70, l=40){
  return hslToRgb(h/360, s/100, l/100);
}
function hslToRgb(h, s, l){
  const a = s * Math.min(l, 1-l);
  const f = n=>{
    const k = (n + h*12)%12;
    const color = l - a * Math.max(Math.min(k-3, 9-k, 1), -1);
    return Math.round(255*color);
  };
  return `rgb(${f(0)} ${f(8)} ${f(4)})`;
}
function hash(str){
  let h=0; for(let i=0;i<str.length;i++) h = (h<<5) - h + str.charCodeAt(i) | 0;
  return Math.abs(h);
}
function noise(n){
  const x = Math.sin(n) * 43758.5453;
  return x - Math.floor(x);
}
function escapeHtml(s){ return s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m])); }
function escapeAttr(s){ return escapeHtml(s).replace(/"/g, '&quot;'); }

// Stage interactions: accept assets to create a "tile"
stage.addEventListener('dragover', (e)=>{
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';
  stage.classList.add('dragover');
});
stage.addEventListener('dragleave', ()=>{
  stage.classList.remove('dragover');
});
stage.addEventListener('drop', (e)=>{
  e.preventDefault();
  stage.classList.remove('dragover');
  // MDN drag data transfer usage [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)
  const id = e.dataTransfer.getData('text/plain');
  const asset = state.assets.find(a=>a.id===id);
  if(asset){
    addStageTile(asset, e);
    touch();
  }
});

function addStageTile(asset, e){
  if(document.getElementById('stageEmpty')){
    stageEmpty.remove();
  }
  const tile = document.createElement('div');
  tile.className = 'tile';
  const srect = stage.getBoundingClientRect();
  const targetLeft = e ? (e.clientX - srect.left) : srect.width * (Math.random()*0.7+0.1);
  const targetTop  = e ? (e.clientY - srect.top)  : srect.height * (Math.random()*0.6+0.1);

  tile.style.position='absolute';
  tile.style.left = clamp(targetLeft, 0, srect.width - 180) + 'px';
  tile.style.top  = clamp(targetTop, 0, srect.height - 110) + 'px';
  tile.style.width='200px';
  tile.style.aspectRatio='16/10';
  tile.style.border='1px solid rgba(255,255,255,.12)';
  tile.style.borderRadius='12px';
  tile.style.overflow='hidden';
  tile.style.background='#0c1218';
  tile.style.boxShadow='0 8px 20px rgba(0,0,0,.35)';
  tile.style.cursor='move';
  tile.tabIndex=0;
  tile.setAttribute('aria-label', `Tile: ${asset.name}`);

  const header = document.createElement('div');
  header.style.position='absolute';
  header.style.left='6px'; header.style.top='6px';
  header.style.display='flex'; header.style.gap='6px';
  header.style.zIndex='2';
  const btnDel = document.createElement('button');
  btnDel.className='chip'; btnDel.textContent='Löschen';
  btnDel.addEventListener('click', ()=>{ tile.remove(); updateStage(); touch(); });
  const btnSm = document.createElement('button');
  btnSm.className='chip'; btnSm.textContent='-';
  const btnLg = document.createElement('button');
  btnLg.className='chip'; btnLg.textContent='+';
  btnSm.addEventListener('click', ()=>{ resizeTile(tile, -20); touch(); });
  btnLg.addEventListener('click', ()=>{ resizeTile(tile, +20); touch(); });
  header.append(btnSm, btnLg, btnDel);

  const cnv = document.createElement('canvas');
  cnv.width = 400; cnv.height = 250;
  drawPlaceholderPreview(cnv.getContext('2d'), asset);
  cnv.style.width='100%'; cnv.style.height='100%';

  tile.appendChild(cnv);
  tile.appendChild(header);

  // Draggable within stage (mouse & touch)
  let sx=0, sy=0, ox=0, oy=0, dragging=false;
  const onDown = (e)=>{
    dragging=true;
    const rect = tile.getBoundingClientRect();
    sx = ('touches' in e ? e.touches[0].clientX : e.clientX);
    sy = ('touches' in e ? e.touches[0].clientY : e.clientY);
    ox = rect.left; oy = rect.top;
    e.preventDefault();
  };
  const onMove = (e)=>{
    if(!dragging) return;
    const cx = ('touches' in e ? e.touches[0].clientX : e.clientX);
    const cy = ('touches' in e ? e.touches[0].clientY : e.clientY);
    const dx = cx - sx; const dy = cy - sy;
    const srect2 = stage.getBoundingClientRect();
    let nx = ox + dx - srect2.left;
    let ny = oy + dy - srect2.top;
    nx = clamp(nx, 0, srect2.width - tile.offsetWidth);
    ny = clamp(ny, 0, srect2.height - tile.offsetHeight);
    tile.style.left = nx + 'px';
    tile.style.top  = ny + 'px';
  };
  const onUp = ()=>{
    if(dragging){ dragging=false; touch(); }
  };
  tile.addEventListener('mousedown', onDown);
  tile.addEventListener('touchstart', onDown, {passive:false});
  window.addEventListener('mousemove', onMove);
  window.addEventListener('touchmove', onMove, {passive:false});
  window.addEventListener('mouseup', onUp);
  window.addEventListener('touchend', onUp);

  stage.appendChild(tile);
}

function resizeTile(tile, delta){
  const w = tile.getBoundingClientRect().width + delta;
  const srect = stage.getBoundingClientRect();
  const newW = clamp(w, 120, Math.min(420, srect.width));
  tile.style.width = newW + 'px';
}

function updateStage(){
  const hasTile = [...stage.children].some(ch => ch.className === 'tile');
  const emptyEl = document.getElementById('stageEmpty');
  if(!hasTile && !emptyEl){
    const el = document.createElement('div');
    el.id='stageEmpty'; el.className='empty';
    el.innerHTML = 'Lege Assets ab oder erstelle Schritte – die Vorschau erscheint hier.';
    stage.appendChild(el);
  }
  if(hasTile && emptyEl){ emptyEl.remove(); }
}

// Upload handling:
// Implementation follows browser DnD patterns from MDN [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API).
const acceptKinds = ['image','audio','video','text','application'];
function handleFiles(files){
  [...files].forEach(file=>{
    const kind = (file.type || 'application/octet-stream').split('/')[0];
    const safeKind = acceptKinds.includes(kind) ? kind : 'application';
    const asset = { id: uid(), name: file.name || 'Unbenannt', kind: safeKind, size: file.size || 0 };
    optimisticProgress(asset);
  });
}

function optimisticProgress(asset){
  const temp = document.createElement('div');
  temp.className='asset';
  const progress = document.createElement('div');
  progress.style.height='6px';
  progress.style.background='rgba(255,255,255,.06)';
  progress.style.margin='10px';
  progress.style.borderRadius='999px';
  const bar = document.createElement('div');
  bar.style.height='100%';
  bar.style.width='0%';
  bar.style.borderRadius='999px';
  bar.style.background='linear-gradient(90deg, var(--accent), var(--accent-strong))';
  progress.appendChild(bar);

  const holder = document.createElement('div');
  holder.style.display='grid';
  holder.style.placeItems='center';
  holder.style.aspectRatio='1/1';
  const spinner = document.createElement('div');
  spinner.style.width='40px'; spinner.style.height='40px';
  spinner.style.border='3px solid rgba(255,255,255,.15)';
  spinner.style.borderTopColor='var(--accent)';
  spinner.style.borderRadius='50%';
  spinner.style.animation='spin 1s linear infinite';
  holder.appendChild(spinner);

  const cap = document.createElement('div');
  cap.className='caption';
  cap.innerHTML = `<span>${truncate(asset.name,18)}</span><span class="tag">NEU</span>`;

  temp.appendChild(holder);
  temp.appendChild(progress);
  temp.appendChild(cap);
  assetsEl.prepend(temp);

  let p=0;
  const t = setInterval(()=>{
    p += Math.random()*22+8;
    if(p>=100){ p=100; clearInterval(t);
      state.assets.unshift(asset);
      renderAssets(globalSearch.value || '');
      touch();
    }
    bar.style.width = p+'%';
  }, 180);
}

// Dropzone events
;['dragenter','dragover'].forEach(ev=>{
  dropzone.addEventListener(ev, (e)=>{ e.preventDefault(); dropzone.classList.add('dragover'); });
});
;['dragleave','drop'].forEach(ev=>{
  dropzone.addEventListener(ev, (e)=>{ e.preventDefault(); dropzone.classList.remove('dragover'); });
});
dropzone.addEventListener('drop', (e)=>{
  const files = e.dataTransfer?.files;
  if(files && files.length){ handleFiles(files); }
});
btnBrowse.addEventListener('click', ()=> fileInput.click());
fileInput.addEventListener('change', ()=> {
  if(fileInput.files?.length){ handleFiles(fileInput.files); fileInput.value=''; }
});

// Filters (assets)
document.querySelectorAll('.dz-content .chip[data-kind]').forEach(chip=>{
  chip.addEventListener('click', ()=>{
    document.querySelectorAll('.dz-content .chip[data-kind]').forEach(c=>c.classList.remove('active'));
    chip.classList.add('active');
    state.assetFilter = chip.dataset.kind;
    renderAssets(globalSearch.value || '');
    touch();
  });
});

// Buttons
btnNewStep.addEventListener('click', ()=>{
  state.steps.push({ id: uid(), name: 'Neuer Schritt', info: 'Beschreibung' });
  renderSteps(globalSearch.value || '');
  touch();
  const last = stackEl.lastElementChild?.querySelector('.name'); last?.focus();
});

btnExpandAll.addEventListener('click', ()=>{
  stackEl.querySelectorAll('.meta').forEach(m => m.style.display = '');
});
btnCollapseAll.addEventListener('click', ()=>{
  stackEl.querySelectorAll('.meta').forEach(m => m.style.display = 'none');
});
btnClearSteps.addEventListener('click', ()=>{
  if(confirm('Alle Schritte wirklich entfernen?')){ state.steps = []; renderSteps(globalSearch.value || ''); touch(); }
});

btnGuides.addEventListener('click', ()=>{
  const on = guides.hasAttribute('hidden');
  if(on){ guides.removeAttribute('hidden'); btnGuides.classList.add('active'); }
  else { guides.setAttribute('hidden',''); btnGuides.classList.remove('active'); }
});

btnClearStage.addEventListener('click', ()=>{
  stage.querySelectorAll('.tile').forEach(t => t.remove());
  updateStage(); touch();
});

btnAddDemoTile.addEventListener('click', ()=>{
  const a = state.assets[0] || { id: uid(), name: 'Demo.png', kind: 'image' };
  if(!state.assets.length){ state.assets.unshift(a); renderAssets(globalSearch.value || ''); }
  addStageTile(a);
  touch();
});

function doPublish(){
  state.publishCounter++;
  flashStatus('Veröffentlicht', 'ok');
  save(true);
}
btnPublish.addEventListener('click', doPublish);
btnPublishBottom.addEventListener('click', doPublish);
btnImport.addEventListener('click', ()=>{
  // quick import: procedurally generate 3 assets without files
  const demo = [
    { id: uid(), name: 'Gradient.png', kind: 'image' },
    { id: uid(), name: 'Whoosh.wav', kind: 'audio' },
    { id: uid(), name: 'Intro.mp4', kind: 'video' },
  ];
  state.assets.unshift(...demo);
  renderAssets(globalSearch.value || '');
  touch();
});

// Global Search (steps + assets)
globalSearch.addEventListener('input', ()=>{
  const q = globalSearch.value;
  renderSteps(q);
  renderAssets(q);
});

// Status feedback
function flashStatus(text, kind='info'){
  statusPill.textContent = text;
  if(kind==='ok'){
    statusPill.style.borderColor = 'color-mix(in oklab, var(--ok) 40%, rgba(255,255,255,.12))';
    statusPill.style.color = '#d6ffee';
    statusPill.style.background = 'linear-gradient(180deg, color-mix(in oklab, var(--ok) 20%, #0e141b), #0e141b)';
  } else if(kind==='warn'){
    statusPill.style.borderColor = 'color-mix(in oklab, var(--warn) 40%, rgba(255,255,255,.12))';
    statusPill.style.color = '#fff5d6';
    statusPill.style.background = 'linear-gradient(180deg, color-mix(in oklab, var(--warn) 20%, #0e141b), #0e141b)';
  } else {
    statusPill.removeAttribute('style');
  }
  setTimeout(()=>{ statusPill.textContent='Bereit'; statusPill.removeAttribute('style'); }, 1400);
}

function touch(){
  save(true);
  lastSaved.textContent = nowStr();
}

// Keyboard shortcuts
window.addEventListener('keydown', (e)=>{
  if((e.metaKey || e.ctrlKey) && e.key.toLowerCase()==='s'){
    e.preventDefault(); save();
  }
  if(e.key === 'Escape'){
    // Simple escape behavior: remove dragover visuals
    stage.classList.remove('dragover');
  }
});

// Initialize
load();
renderSteps();
renderAssets();
lastSaved.textContent = nowStr();

// CITED SOURCES:
// We used patterns and API usage from MDN:
// - HTML Drag and Drop API (dataTransfer.setData, drop effects) [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)
// DOM creation and insertion references:
// - Document.createElement() usage [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement)
// - Node.appendChild() notes [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild) 