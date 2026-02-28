/* ============ DATA ============ */
const categories = [
    { icon:'🍳', name:'Kitchen', items:["Plates & bowls","Mugs & glasses","Cutlery set","Chef's knife","Cutting board","Frying pan","Saucepan","Baking sheet","Mixing bowls","Spatula & spoons","Tongs & whisk","Can opener","Coffee maker","Toaster","Blender","Microwave","Kettle","Dish soap & sponges","Trash can","Food containers","Aluminum foil","Paper towels"] },
    { icon:'🛏️', name:'Bedroom', items:["Mattress & bed frame","Pillows & sheets","Duvet/blanket","Bedside table","Lamp","Hangers","Laundry basket","Full length mirror","Curtains","Alarm clock"] },
    { icon:'🚿', name:'Bathroom', items:["Shower curtain","Bath mat","Towels & washcloths","Toilet brush","Plunger","Toilet paper","Soap dispenser","Shampoo","First aid kit","Trash can"] },
    { icon:'🛋️', name:'Living Room', items:["Sofa/couch","Coffee table","TV & stand","Rugs","Curtains","Lamps","Throw pillows","Coasters","WiFi router"] },
    { icon:'🧹', name:'Cleaning', items:["Vacuum cleaner","Broom & dustpan","Mop & bucket","All-purpose cleaner","Glass cleaner","Laundry detergent","Trash bags","Microfiber cloths"] },
    { icon:'🔧', name:'Tools', items:["Hammer","Screwdriver set","Tape measure","Level","Drill","Wrench","Flashlight","Batteries","Extension cords","Light bulbs","Duct tape"] },
    { icon:'🚨', name:'Safety', items:["Smoke detectors","Fire extinguisher","First aid kit","Flashlight","Door locks"] },
    { icon:'🐱', name:"Gwen's Corner", items:["Royal Canin Ragdoll kitten dry food","Wet cat food pouches (pâté)","Cat treats (Temptations / Dreamies)","Freeze-dried chicken cat treats","Dental treats for cats","Cat water fountain (ceramic)","Stainless steel food bowls (x2)","Premium clumping cat litter (bentonite)","Hooded litter box with carbon filter","Litter scoop & mat","Litter disposal bags","Cat carrier (airline approved)","Orthopedic cat bed (plush)","Heated cat blanket","Large multi-level cat tree (tall, sturdy)","Cat tree with condo & hammock perch","Wall-mounted cat hammock","Hanging canvas cat hammock","Window cat hammock (suction cup)","Feather wand teaser toy","Interactive laser pointer","Crinkle & catnip tunnel","Catnip spray & dried catnip","Soft plush mice toys","Puzzle feeder / slow feeder bowl","Cat grass & catnip pot","Grooming slicker brush (for long fur)","Wide-tooth dematting comb","Nail clippers for cats","Cat-safe wipes","Flea & tick monthly spot-on treatment","Cat toothbrush & enzymatic toothpaste","Pet first aid kit","Breakaway safety collar with ID tag","GPS pet tracker tag","Cat window perch / suction shelf","Calming diffuser (Feliway)","Pheromone calming collar"] },
    { icon:'✨', name:'House Aesthetics', items:["Ceramic vase (neutral tones)","Dried pampas grass","Scented candles (vanilla/sandalwood)","Candle holder set","Abstract wall art print","Boho wall tapestry","LED fairy string lights","Macramé wall hanging","Woven rattan basket","Indoor plant (pothos/snake plant)","Terracotta plant pots","Linen throw blanket","Embroidered cushion covers","Table lamp with warm bulb","Bamboo tray organiser","Coffee table books (art/fashion)","Acrylic photo frames","Aesthetic desk organiser","Gold/brass accent bowl or tray","Wax melt warmer","Reed diffuser set","Velvet storage pouches","Minimalist wall clock","LED vanity mirror","Sage room spray"] }
];

const catPhotos = {
    'Kitchen':          'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1400&q=80&fit=crop',
    'Bedroom':          'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1400&q=80&fit=crop',
    'Bathroom':         'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1400&q=80&fit=crop',
    'Living Room':      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&q=80&fit=crop',
    'Cleaning':         'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1400&q=80&fit=crop',
    'Tools':            'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1400&q=80&fit=crop',
    'Safety':           'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80&fit=crop',
    "Gwen's Corner":    'https://images.unsplash.com/photo-1591871937573-74dbba515c4c?w=1400&q=80&fit=crop',
    'House Aesthetics': 'https://images.unsplash.com/photo-1615873968403-89e068629265?w=1400&q=80&fit=crop'
};

/* ============ STORAGE ============ */
function storageGet(k){
    try{ const v=localStorage.getItem(k); if(v!==null) return v; }catch(e){}
    try{ return sessionStorage.getItem(k); }catch(e){}
    return null;
}
function storageSet(k,v){
    try{ localStorage.setItem(k,v); return; }catch(e){}
    try{ sessionStorage.setItem(k,v); }catch(e){}
}

let checked = new Set(JSON.parse(storageGet('mv')||'[]'));
const itemURLs = new Map();

/* ============ BACKGROUND ============ */
const bgA = document.getElementById('bg-a');
const bgB = document.getElementById('bg-b');
const bgLabel = document.getElementById('bg-label');
let bgActive = 'a', currentCat = null, labelTimer = null;

function preloadImages(){
    Object.values(catPhotos).forEach(url=>{ const i=new Image(); i.src=url; });
}

function setBackground(name){
    if(name === currentCat) return;
    currentCat = name;
    const url = catPhotos[name];
    if(!url) return;
    const inc = bgActive==='a' ? bgB : bgA;
    const out = bgActive==='a' ? bgA : bgB;
    inc.style.backgroundImage = `url("${url}")`;
    inc.style.opacity = '1';
    out.style.opacity = '0';
    bgActive = bgActive==='a' ? 'b' : 'a';
    bgLabel.textContent = name.toUpperCase();
    bgLabel.classList.add('show');
    if(labelTimer) clearTimeout(labelTimer);
    labelTimer = setTimeout(()=>bgLabel.classList.remove('show'), 2200);
}

function setupObserver(){
    const obs = new IntersectionObserver(entries=>{
        let best=null, bestR=0;
        entries.forEach(e=>{ if(e.isIntersecting && e.intersectionRatio>bestR){ bestR=e.intersectionRatio; best=e.target; }});
        if(best) setBackground(best.dataset.catName);
    }, {threshold:[0.2,0.4,0.6,0.8]});
    document.querySelectorAll('.category[data-cat-name]').forEach(el=>obs.observe(el));
}

/* ============ SHOP URLS ============ */
function buildURLs(){
    for(const cat of categories){
        for(const item of cat.items){
            const q = encodeURIComponent(item);
            itemURLs.set(item,{
                fk:     'https://www.flipkart.com/search?q='+q,
                amz:    'https://www.amazon.in/s?k='+q,
                meesho: 'https://www.meesho.com/search?q='+q
            });
        }
    }
}

function openShop(itemName, site, e){
    e.stopPropagation(); e.preventDefault();
    const urls = itemURLs.get(itemName);
    if(!urls) return;
    window.open(urls[site], '_blank', 'noopener,noreferrer');
}

/* ============ RENDER ============ */
function init(){
    buildURLs();
    preloadImages();
    const c = document.getElementById('content');
    c.innerHTML = '';

    for(const cat of categories){
        const key = cat.name;
        const done = cat.items.filter(i=>checked.has(key+'|'+i)).length;
        const isDone = done === cat.items.length;
        const isGwen = key === "Gwen's Corner";

        const wrapper = document.createElement('div');
        wrapper.className = 'category' + (isGwen ? ' gwen-cat' : '');
        wrapper.dataset.catName = key;

        // Header
        const header = document.createElement('div');
        header.className = 'category-header';
        const badge = isGwen ? ' <span class="cat-gwen-badge">Doll 🐾</span>' : '';
        header.innerHTML = `
            <div class="category-title">
                <div class="cat-icon">${cat.icon}</div>
                <span>${cat.name}${badge}</span>
            </div>
            <div class="right-side">
                <span class="category-count${isDone?' done':''}" id="cnt-${key}">${done}/${cat.items.length}</span>
                <span class="toggle-icon">▼</span>
            </div>`;
        header.addEventListener('click', ()=> wrapper.classList.toggle('collapsed'));

        // Items
        const list = document.createElement('div');
        list.className = 'items-list';

        for(const item of cat.items){
            const id = key+'|'+item;
            const isChecked = checked.has(id);

            const itemEl = document.createElement('div');
            itemEl.className = 'item' + (isChecked ? ' checked' : '');
            itemEl.dataset.id = id;
            itemEl.addEventListener('click', e=>{
                if(!e.target.closest('.shop-logo')) toggleItem(itemEl);
            });

            const cb  = document.createElement('div'); cb.className = 'checkbox';
            const txt = document.createElement('div'); txt.className = 'item-text'; txt.textContent = item;

            // Shop logos
            const logos = document.createElement('div');
            logos.className = 'shop-logos';
            [
                {site:'fk',    cls:'logo-flipkart', icon:'https://img.icons8.com/color/48/flipkart.png',  alt:'Flipkart'},
                {site:'amz',   cls:'logo-amazon',   icon:'https://img.icons8.com/color/48/amazon.png',    alt:'Amazon'},
                {site:'meesho',cls:'logo-meesho',   icon:'https://img.icons8.com/color/48/meesho.png',    alt:'Meesho'}
            ].forEach(({site,cls,icon,alt})=>{
                const logo = document.createElement('div');
                logo.className = 'shop-logo '+cls;
                logo.title = 'Shop on '+alt;
                const img = document.createElement('img');
                img.src=icon; img.alt=alt; img.width=15; img.height=15;
                logo.appendChild(img);
                logo.addEventListener('click', e=>openShop(item,site,e));
                logos.appendChild(logo);
            });

            itemEl.appendChild(cb);
            itemEl.appendChild(txt);
            itemEl.appendChild(logos);
            list.appendChild(itemEl);
        }

        wrapper.appendChild(header);
        wrapper.appendChild(list);
        c.appendChild(wrapper);
    }

    updateStats();
    setBackground(categories[0].name);
    requestAnimationFrame(()=>requestAnimationFrame(setupObserver));
}

/* ============ ITEM TOGGLE ============ */
function toggleItem(el){
    const id = el.dataset.id; if(!id) return;
    if(checked.has(id)){ checked.delete(id); el.classList.remove('checked'); }
    else { checked.add(id); el.classList.add('checked'); if(navigator.vibrate) navigator.vibrate(35); }
    const catName = id.split('|')[0];
    const cat = categories.find(c=>c.name===catName);
    if(cat){
        const d = cat.items.filter(i=>checked.has(catName+'|'+i)).length;
        const cnt = document.getElementById('cnt-'+catName);
        if(cnt){ cnt.textContent=d+'/'+cat.items.length; cnt.classList.toggle('done', d===cat.items.length); }
    }
    save(); updateStats();
}

/* ============ STATS ============ */
function updateStats(){
    let total=0, done=0;
    for(const cat of categories){ total+=cat.items.length; done+=cat.items.filter(i=>checked.has(cat.name+'|'+i)).length; }
    const pct = total ? Math.round((done/total)*100) : 0;
    document.getElementById('statsText').textContent = done+'/'+total+' items packed';
    document.getElementById('statsPercent').textContent = pct+'%';
    document.getElementById('progressBar').style.width = pct+'%';
}

/* ============ SAVE ============ */
function save(){ storageSet('mv', JSON.stringify([...checked])); }

/* ============ MENU & MODALS ============ */
function toggleMenu(){
    document.getElementById('menu').classList.toggle('show');
    document.getElementById('overlay').classList.toggle('show');
}
function closeAll(){
    ['menu','overlay','exportModal','resetModal'].forEach(id=>document.getElementById(id)?.classList.remove('show'));
}
function expandAll(){ document.querySelectorAll('.category').forEach(c=>c.classList.remove('collapsed')); closeAll(); }
function collapseAll(){ document.querySelectorAll('.category').forEach(c=>c.classList.add('collapsed')); closeAll(); }

function showExport(){
    let md = `# Manaya's New House Checklist\n${new Date().toLocaleDateString()}\n\n`;
    for(const cat of categories){
        md += `## ${cat.icon} ${cat.name}\n`;
        cat.items.forEach(i=>md+=`- [${checked.has(cat.name+'|'+i)?'x':' '}] ${i}\n`);
        md += '\n';
    }
    document.getElementById('exportArea').value = md;
    document.getElementById('exportModal').classList.add('show');
    document.getElementById('overlay').classList.add('show');
}
function copyExport(){
    navigator.clipboard.writeText(document.getElementById('exportArea').value)
        .then(()=>showToast('Copied to clipboard!'));
}
function confirmReset(){
    closeAll();
    document.getElementById('resetModal').classList.add('show');
    document.getElementById('overlay').classList.add('show');
}
function doReset(){ checked.clear(); save(); init(); closeAll(); showToast('Progress reset!'); }

function showToast(msg){
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(()=>t.classList.remove('show'), 2200);
}

/* ============ START ============ */
document.addEventListener('DOMContentLoaded', init);
