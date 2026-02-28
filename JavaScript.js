/* --- DATA --- */
const categories = [
    { icon:'🍳', name:'Kitchen', items:["Plates & bowls","Mugs & glasses","Cutlery set","Chef's knife","Cutting board","Frying pan","Saucepan","Baking sheet","Mixing bowls","Spatula & spoons","Tongs & whisk","Can opener","Coffee maker","Toaster","Blender","Microwave","Kettle","Dish soap & sponges","Trash can","Food containers","Aluminum foil","Paper towels"] },
    { icon:'🛏️', name:'Bedroom', items:["Mattress & bed frame","Pillows & sheets","Duvet/blanket","Bedside table","Lamp","Hangers","Laundry basket","Full length mirror","Curtains","Alarm clock"] },
    { icon:'🚿', name:'Bathroom', items:["Shower curtain","Bath mat","Towels & washcloths","Toilet brush","Plunger","Toilet paper","Soap dispenser","Shampoo","First aid kit","Trash can"] },
    { icon:'🛋️', name:'Living Room', items:["Sofa/couch","Coffee table","TV & stand","Rugs","Curtains","Lamps","Throw pillows","Coasters","WiFi router"] },
    { icon:'🧹', name:'Cleaning', items:["Vacuum cleaner","Broom & dustpan","Mop & bucket","All-purpose cleaner","Glass cleaner","Laundry detergent","Trash bags","Microfiber cloths"] },
    { icon:'🔧', name:'Tools', items:["Hammer","Screwdriver set","Tape measure","Level","Drill","Wrench","Flashlight","Batteries","Extension cords","Light bulbs","Duct tape"] },
    { icon:'🚨', name:'Safety', items:["Smoke detectors","Fire extinguisher","First aid kit","Flashlight","Door locks"] },
    { icon:'🐱', name:'Gwen\'s Corner', items:["Royal Canin Ragdoll kitten dry food","Wet cat food pouches","Cat treats","Cat water fountain","Litter box","Cat tree","Scratching post","Cat toys","Grooming brush","Nail clippers","Feliway diffuser"] },
    { icon:'✨', name:'House Aesthetics', items:["Ceramic vase","Dried pampas grass","Scented candles","Abstract wall art","LED fairy lights","Macramé wall hanging","Woven basket","Indoor plant","Linen throw blanket"] }
];

/* --- STATE --- */
let checked = new Set(JSON.parse(localStorage.getItem('mv') || '[]'));

/* --- CORE FUNCTIONS --- */
function init() {
    const c = document.getElementById('content');
    if (!c) return;
    c.innerHTML = '';

    categories.forEach(cat => {
        const key = cat.name;
        const itemsInCategory = cat.items;
        const checkedCount = itemsInCategory.filter(i => checked.has(key + '|' + i)).length;
        const isDone = checkedCount === itemsInCategory.length;

        const wrapper = document.createElement('div');
        wrapper.className = `category ${isDone ? '' : ''}`;
        wrapper.innerHTML = `
            <div class="category-header" onclick="this.parentElement.classList.toggle('collapsed')">
                <div class="category-title">
                    <div class="cat-icon">${cat.icon}</div>
                    <span class="cat-name">${cat.name}</span>
                </div>
                <div class="right-side">
                    <span class="category-count ${isDone ? 'done' : ''}" id="cnt-${key}">
                        ${checkedCount}/${itemsInCategory.length}
                    </span>
                    <span class="toggle-icon">▼</span>
                </div>
            </div>
            <div class="items-list">
                ${itemsInCategory.map(item => {
                    const id = key + '|' + item;
                    const isChecked = checked.has(id);
                    return `
                    <div class="item ${isChecked ? 'checked' : ''}" data-id="${id}" onclick="handleItemClick(event, this)">
                        <div class="checkbox"></div>
                        <div class="item-text">${item}</div>
                        <div class="shop-logos">
                            <div class="shop-logo logo-flipkart" onclick="openShop('${item}', 'fk', event)">🛒</div>
                            <div class="shop-logo logo-amazon" onclick="openShop('${item}', 'amz', event)">📦</div>
                            <div class="shop-logo logo-meesho" onclick="openShop('${item}', 'meesho', event)">🛍️</div>
                        </div>
                    </div>`;
                }).join('')}
            </div>`;
        c.appendChild(wrapper);
    });
    updateStats();
}

function handleItemClick(e, el) {
    if (e.target.closest('.shop-logo')) return;
    const id = el.dataset.id;
    if (checked.has(id)) {
        checked.delete(id);
        el.classList.remove('checked');
    } else {
        checked.add(id);
        el.classList.add('checked');
    }
    localStorage.setItem('mv', JSON.stringify([...checked]));
    updateStats();
    
    // Update category count
    const catName = id.split('|')[0];
    const cat = categories.find(c => c.name === catName);
    const countEl = document.getElementById(`cnt-${catName}`);
    const newCount = cat.items.filter(i => checked.has(catName + '|' + i)).length;
    countEl.innerText = `${newCount}/${cat.items.length}`;
    if (newCount === cat.items.length) countEl.classList.add('done');
    else countEl.classList.remove('done');
}

function updateStats() {
    const total = categories.reduce((acc, cat) => acc + cat.items.length, 0);
    const done = checked.size;
    const percent = Math.round((done / total) * 100) || 0;
    
    document.getElementById('statsText').innerText = `${done}/${total} items packed`;
    document.getElementById('statsPercent').innerText = `${percent}%`;
    document.getElementById('progressBar').style.width = `${percent}%`;
}

function openShop(item, store, e) {
    e.stopPropagation();
    let url = '';
    const q = encodeURIComponent(item);
    if (store === 'fk') url = `https://www.flipkart.com/search?q=${q}`;
    if (store === 'amz') url = `https://www.amazon.in/s?k=${q}`;
    if (store === 'meesho') url = `https://www.meesho.com/search?q=${q}`;
    window.open(url, '_blank');
}

/* --- UI MENU FUNCTIONS --- */
function toggleMenu(){ document.getElementById('menu').classList.toggle('show'); document.getElementById('overlay').classList.toggle('show'); }
function closeAll(){ document.getElementById('menu').classList.remove('show'); document.getElementById('overlay').classList.remove('show'); document.getElementById('resetModal').classList.remove('show'); }
function confirmReset(){ closeAll(); document.getElementById('resetModal').classList.add('show'); document.getElementById('overlay').classList.add('show'); }
function doReset(){ checked.clear(); localStorage.removeItem('mv'); init(); closeAll(); }

// Start
init();
