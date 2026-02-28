/* ==============================
   DATA
============================== */

const categories = [
    { icon:'🍳', name:'Kitchen', items:["Plates & bowls","Mugs & glasses","Cutlery set","Chef's knife","Cutting board","Frying pan","Saucepan","Baking sheet","Mixing bowls","Spatula & spoons","Tongs & whisk","Can opener","Coffee maker","Toaster","Blender","Microwave","Kettle","Dish soap & sponges","Trash can","Food containers","Aluminum foil","Paper towels"] },
    { icon:'🛏️', name:'Bedroom', items:["Mattress & bed frame","Pillows & sheets","Duvet/blanket","Bedside table","Lamp","Hangers","Laundry basket","Full length mirror","Curtains","Alarm clock"] },
    { icon:'🚿', name:'Bathroom', items:["Shower curtain","Bath mat","Towels & washcloths","Toilet brush","Plunger","Toilet paper","Soap dispenser","Shampoo","First aid kit","Trash can"] },
    { icon:'🛋️', name:'Living Room', items:["Sofa/couch","Coffee table","TV & stand","Rugs","Curtains","Lamps","Throw pillows","Coasters","WiFi router"] }
];

const catPhotos = {
    Kitchen: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200',
    Bedroom: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200',
    Bathroom: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200',
    "Living Room": 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200'
};

/* ==============================
   STATE
============================== */

let checked = new Set(JSON.parse(localStorage.getItem('mv') || '[]'));
let activeBg = 'a';

/* ==============================
   INIT
============================== */

document.addEventListener('DOMContentLoaded', init);

function init() {
    renderCategories();
    updateStats();
    setBackground('Kitchen');
    attachGlobalEvents();
}

/* ==============================
   GLOBAL EVENTS
============================== */

function attachGlobalEvents() {
    const fab = document.querySelector('.fab');
    const overlay = document.getElementById('overlay');
    const menuBtn = document.querySelector('.menu-btn');
    const resetBtn = document.getElementById('resetBtn');
    const cancelBtn = document.getElementById('cancelReset');

    if (fab) fab.addEventListener('click', toggleMenu);
    if (overlay) overlay.addEventListener('click', closeAll);
    if (menuBtn) menuBtn.addEventListener('click', confirmReset);
    if (resetBtn) resetBtn.addEventListener('click', doReset);
    if (cancelBtn) cancelBtn.addEventListener('click', closeAll);
}

/* ==============================
   RENDER
============================== */

function renderCategories() {
    const container = document.getElementById('content');
    if (!container) return;

    container.innerHTML = '';

    categories.forEach(cat => {

        const wrapper = document.createElement('div');
        wrapper.className = 'category collapsed';

        const header = document.createElement('div');
        header.className = 'category-header';

        header.innerHTML = `
            <div class="category-title">
                <div class="cat-icon">${cat.icon}</div>
                <span>${cat.name}</span>
            </div>
            <div class="right-side">
                <span class="category-count" id="cnt-${cat.name}">0/${cat.items.length}</span>
                <span class="toggle-icon">▼</span>
            </div>
        `;

        header.addEventListener('click', () => {
            wrapper.classList.toggle('collapsed');
            setBackground(cat.name);
        });

        const itemList = document.createElement('div');
        itemList.className = 'items-list';

        cat.items.forEach(item => {

            const id = `${cat.name}|${item}`;

            const itemDiv = document.createElement('div');
            itemDiv.className = 'item';
            itemDiv.dataset.id = id;

            if (checked.has(id)) itemDiv.classList.add('checked');

            itemDiv.innerHTML = `
                <div class="checkbox"></div>
                <div class="item-text">${item}</div>
                <div class="shop-logos">
                    <div class="shop-logo logo-flipkart">🛒</div>
                    <div class="shop-logo logo-amazon">📦</div>
                    <div class="shop-logo logo-meesho">🛍️</div>
                </div>
            `;

            // Item toggle
            itemDiv.addEventListener('click', (e) => {
                if (e.target.closest('.shop-logo')) return;
                toggleItem(itemDiv, id, cat.name);
            });

            // Shop links
            itemDiv.querySelectorAll('.shop-logo').forEach((logo, index) => {
                logo.addEventListener('click', (e) => {
                    e.stopPropagation();
                    openShop(item, index);
                });
            });

            itemList.appendChild(itemDiv);
        });

        wrapper.appendChild(header);
        wrapper.appendChild(itemList);
        container.appendChild(wrapper);

        updateCategoryCount(cat.name);
    });
}

/* ==============================
   LOGIC
============================== */

function toggleItem(el, id, categoryName) {

    if (checked.has(id)) {
        checked.delete(id);
        el.classList.remove('checked');
    } else {
        checked.add(id);
        el.classList.add('checked');
    }

    localStorage.setItem('mv', JSON.stringify([...checked]));

    updateStats();
    updateCategoryCount(categoryName);
}

function updateCategoryCount(name) {

    const cat = categories.find(c => c.name === name);
    if (!cat) return;

    const count = cat.items.filter(i => checked.has(name + '|' + i)).length;
    const el = document.getElementById(`cnt-${name}`);

    if (!el) return;

    el.innerText = `${count}/${cat.items.length}`;
    el.classList.toggle('done', count === cat.items.length);
}

function updateStats() {

    const total = categories.reduce((sum, c) => sum + c.items.length, 0);
    const done = checked.size;
    const pct = total ? Math.round((done / total) * 100) : 0;

    const statsText = document.getElementById('statsText');
    const statsPercent = document.getElementById('statsPercent');
    const progressBar = document.getElementById('progressBar');

    if (statsText) statsText.innerText = `${done}/${total} items packed`;
    if (statsPercent) statsPercent.innerText = `${pct}%`;
    if (progressBar) progressBar.style.width = `${pct}%`;
}

/* ==============================
   BACKGROUND CROSSFADE
============================== */

function setBackground(name) {

    const url = catPhotos[name];
    if (!url) return;

    const bgA = document.getElementById('bg-a');
    const bgB = document.getElementById('bg-b');

    if (!bgA || !bgB) return;

    const next = activeBg === 'a' ? bgB : bgA;
    const current = activeBg === 'a' ? bgA : bgB;

    next.style.backgroundImage = `url("${url}")`;
    next.style.opacity = 1;
    current.style.opacity = 0;

    activeBg = activeBg === 'a' ? 'b' : 'a';
}

/* ==============================
   SHOP LINKS
============================== */

function openShop(item, index) {

    const q = encodeURIComponent(item);
    let url = '';

    if (index === 0) url = `https://www.flipkart.com/search?q=${q}`;
    if (index === 1) url = `https://www.amazon.in/s?k=${q}`;
    if (index === 2) url = `https://www.meesho.com/search?q=${q}`;

    if (url) window.open(url, '_blank');
}

/* ==============================
   MENU / RESET
============================== */

function toggleMenu() {
    document.getElementById('menu')?.classList.toggle('show');
    document.getElementById('overlay')?.classList.toggle('show');
}

function closeAll() {
    document.getElementById('menu')?.classList.remove('show');
    document.getElementById('overlay')?.classList.remove('show');
    document.getElementById('resetModal')?.classList.remove('show');
}

function confirmReset() {
    document.getElementById('resetModal')?.classList.add('show');
    document.getElementById('overlay')?.classList.add('show');
}

function doReset() {
    checked.clear();
    localStorage.removeItem('mv');
    closeAll();
    renderCategories();
    updateStats();
}
