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

const catPhotos = {
    'Kitchen': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200',
    'Bedroom': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200',
    'Bathroom': 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200',
    'Living Room': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200'
};

/* --- STATE --- */
let checked = new Set(JSON.parse(localStorage.getItem('mv') || '[]'));

/* --- CORE FUNCTIONS --- */
function init() {
    const c = document.getElementById('content');
    if (!c) return;
    c.innerHTML = '';

    categories.forEach(cat => {
        const key = cat.name;
        const items = cat.items;
        const checkedCount = items.filter(i => checked.has(key + '|' + i)).length;
        const isDone = checkedCount === items.length;

        const wrapper = document.createElement('div');
        wrapper.className = 'category collapsed';
        wrapper.innerHTML = `
            <div class="category-header" onclick="handleToggle(this, '${cat.name}')">
                <div class="category-title">
                    <div class="cat-icon">${cat.icon}</div>
                    <span class="cat-name">${cat.name}</span>
                </div>
                <div class="right-side">
                    <span class="category-count ${isDone ? 'done' : ''}" id="cnt-${key}">
                        ${checkedCount}/${items.length}
                    </span>
                    <span class="toggle-icon">▼</span>
                </div>
            </div>
            <div class="items-list">
                ${items.map(item => {
                    const id = key + '|' + item;
                    const isChecked = checked.has(id);
                    
                    <div class="item \${isChecked ? 'checked' : ''}" data-id="\${id}" onclick="handleItemClick(event, this)">
                        <div class="checkbox"></div>
                        <div class="item-text">\${item}</div>
                        <div class="shop-logos">
                            <div class="shop-logo logo-flipkart" onclick="openShop('\${item}', 'fk', event)">🛒</div>
                            <div class="shop-logo logo-amazon" onclick="openShop('\${item}', 'amz', event)">📦</div>
                            <div class="shop-logo logo-meesho" onclick="openShop('\${item}', 'meesho', event)">🛍️</div>
                        </div>
                    </div>\`;
                }).join('')}
            </div>`;
        c.appendChild(wrapper);
    });
    updateStats();
    setBackground('Kitchen');
}

function handleToggle(header, name) {
    header.parentElement.classList.toggle('collapsed');
    setBackground(name);
}

function setBackground(name) {
    const url = catPhotos[name] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200';
    const bgA = document.getElementById('bg-a');
    if (bgA) bgA.style.backgroundImage = \`url("\${url}")\`;
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
    
    const catName = id.split('|')[0];
    const cat = categories.find(c => c.name === catName);
    const countEl = document.getElementById(\`cnt-\${catName}\`);
    const newCount = cat.items.filter(i => checked.has(catName + '|' + i)).length;
    countEl.innerText = \`\${newCount}/\${cat.items.length}\`;
    if (newCount === cat.items.length) countEl.classList.add('done');
    else countEl.classList.remove('done');
}

function updateStats() {
    const total = categories.reduce((acc, cat) => acc + cat.items.length, 0);
    const done = checked.size;
    const pct = Math.round((done / total) * 100) || 0;
    
    document.getElementById('statsText').innerText = \`\${done}/\${total} items packed\`;
    document.getElementById('statsPercent').innerText = \`\${pct}%\`;
    document.getElementById('progressBar').style.width = \`\${pct}%\`;
}

function openShop(item, store, e) {
    e.stopPropagation();
    const q = encodeURIComponent(item);
    let url = store === 'fk' ? \`https://www.flipkart.com/search?q=\${q}\` : 
              store === 'amz' ? \`https://www.amazon.in/s?k=\${q}\` : 
              \`https://www.meesho.com/search?q=\${q}\`;
    window.open(url, '_blank');
}

function toggleMenu(){ 
    document.getElementById('menu').classList.toggle('show'); 
    document.getElementById('overlay').classList.toggle('show'); 
}

/* --- START --- */
document.addEventListener('DOMContentLoaded', init);

