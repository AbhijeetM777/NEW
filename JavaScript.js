const categories = [
    { icon:'🍳', name:'Kitchen', bg:'minimalist+kitchen+interior+aesthetic', items:["Plates & bowls","Mugs & glasses","Cutlery set","Chef's knife","Cutting board","Frying pan","Saucepan","Baking sheet","Mixing bowls","Spatula & spoons","Tongs & whisk","Can opener","Coffee maker","Toaster","Blender","Microwave","Kettle","Dish soap & sponges","Trash can","Food containers","Aluminum foil","Paper towels"] },
    { icon:'🛏️', name:'Bedroom', bg:'minimalist+bedroom+cozy+aesthetic', items:["Mattress & bed frame","Pillows & sheets","Duvet/blanket","Bedside table","Lamp","Hangers","Laundry basket","Full length mirror","Curtains","Alarm clock"] },
    { icon:'🚿', name:'Bathroom', bg:'minimalist+bathroom+spa+aesthetic', items:["Shower curtain","Bath mat","Towels & washcloths","Toilet brush","Plunger","Toilet paper","Soap dispenser","Shampoo","First aid kit","Trash can"] },
    { icon:'🛋️', name:'Living Room', bg:'minimalist+living+room+cozy+aesthetic', items:["Sofa/couch","Coffee table","TV & stand","Rugs","Curtains","Lamps","Throw pillows","Coasters","WiFi router"] },
    { icon:'🧹', name:'Cleaning', bg:'clean+white+home+organization+aesthetic', items:["Vacuum cleaner","Broom & dustpan","Mop & bucket","All-purpose cleaner","Glass cleaner","Laundry detergent","Trash bags","Microfiber cloths"] },
    { icon:'🔧', name:'Tools', bg:'modern+workshop+tools+organized', items:["Hammer","Screwdriver set","Tape measure","Level","Drill","Wrench","Flashlight","Batteries","Extension cords","Light bulbs","Duct tape"] },
    { icon:'🚨', name:'Safety', bg:'modern+home+security+interior', items:["Smoke detectors","Fire extinguisher","First aid kit","Flashlight","Door locks"] },
    { icon:'🐱', name:'Gwen\'s Corner', bg:'ragdoll+cat+aesthetic', items:["Royal Canin Ragdoll kitten dry food","Wet cat food pouches","Cat treats","Cat water fountain","Litter box","Cat tree","Scratching post","Cat toys","Grooming brush","Nail clippers","Feliway diffuser"] },
    { icon:'✨', name:'House Aesthetics', bg:'boho+aesthetic+home+decor+vase+candles', items:["Ceramic vase","Dried pampas grass","Scented candles","Abstract wall art","LED fairy lights","Macramé wall hanging","Woven basket","Indoor plant","Linen throw blanket"] }
];

const catPhotos = {
    'Kitchen': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1400&q=80&fit=crop',
    'Bedroom': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1400&q=80&fit=crop',
    'Bathroom': 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1400&q=80&fit=crop',
    'Living Room': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&q=80&fit=crop',
    'Cleaning': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1400&q=80&fit=crop',
    'Tools': 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1400&q=80&fit=crop',
    'Safety': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80&fit=crop',
    'Gwen\'s Corner': 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=1400&q=80&fit=crop',
    'House Aesthetics': 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1400&q=80&fit=crop',
};

let checked = new Set(JSON.parse(localStorage.getItem('mv') || '[]'));
const itemURLs = new Map();

function init(){
    buildURLs();
    const c = document.getElementById('content');
    c.innerHTML = '';

    categories.forEach(cat => {
        const key = cat.name;
        const done = cat.items.filter(i => checked.has(key+'|'+i)).length;
        const isDone = done === cat.items.length;

        const wrapper = document.createElement('div');
        wrapper.className = 'category';
        wrapper.dataset.catName = cat.name;

        wrapper.innerHTML = `
            <div class="category-header" onclick="this.parentElement.classList.toggle('collapsed')">
                <div class="category-title"><div class="cat-icon">${cat.icon}</div>${cat.name}</div>
                <div class="right-side">
                    <span class="category-count ${isDone?'done':''}" id="cnt-${key}">${done}/${cat.items.length}</span>
                    <span class="toggle-icon">▼</span>
                </div>
            </div>
            <div class="items-list">
                ${cat.items.map(item => {
                    const id = key + '|' + item;
                    const isChecked = checked.has(id);
                    return `
                    <div class="item ${isChecked?'checked':''}" data-id="${id}" onclick="handleItemClick(event, this)">
                        <div class="checkbox"></div>
                        <div class="item-text">${item}</div>
                        <div class="shop-logos">
                            <div class="shop-logo logo-flipkart" onclick="openShop('${item}', 'fk', event)">🛒</div>
                            <div class="shop-logo logo-amazon" onclick="openShop('${item}', 'amz', event)">📦</div>
                        </div>
                    </div>`;
                }).join('')}
            </div>`;
        c.appendChild(wrapper);
    });
    updateStats();
    setupObserver();
}

function handleItemClick(e, el){
    if(e.target.closest('.shop-logo')) return;
    const id = el.dataset.id;
    if(checked.has(id)) checked.delete(id);
    else checked.add(id);
    localStorage.setItem('mv', JSON.stringify([...checked]));
    init();
}

function buildURLs(){
    categories.forEach(cat => cat.items.forEach(item => {
        const q = encodeURIComponent(item);
        itemURLs.set(item, {
            fk: 'https://www.flipkart.com/search?q=' + q,
            amz: 'https://www.amazon.in/s?k=' + q
        });
    }));
}

function openShop(item, site, e){
    e.stopPropagation();
    const urls = itemURLs.get(item);
    window.open(site === 'fk' ? urls.fk : urls.amz, '_blank');
}

function updateStats(){
    let total=0, done=0;
    categories.forEach(cat => {
        total += cat.items.length;
        done += cat.items.filter(i => checked.has(cat.name+'|'+i)).length;
    });
    const pct = Math.round((done/total)*100);
    document.getElementById('statsText').textContent = `${done}/${total} items packed`;
    document.getElementById('statsPercent').textContent = `${pct}%`;
    document.getElementById('progressBar').style.width = `${pct}%`;
}

function setupObserver(){
    const obs = new IntersectionObserver((entries)=>{
        entries.forEach(e => {
            if(e.isIntersecting) setBackground(e.target.dataset.catName);
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.category').forEach(el => obs.observe(el));
}

function setBackground(name){
    const url = catPhotos[name];
    const bgA = document.getElementById('bg-a');
    bgA.style.backgroundImage = `url("${url}")`;
}

// Simple Menu Functions
function toggleMenu(){ document.getElementById('menu').classList.toggle('show'); document.getElementById('overlay').classList.toggle('show'); }
function closeAll(){ document.getElementById('menu').classList.remove('show'); document.getElementById('overlay').classList.remove('show'); document.getElementById('resetModal').classList.remove('show'); }
function confirmReset(){ closeAll(); document.getElementById('resetModal').classList.add('show'); document.getElementById('overlay').classList.add('show'); }
function doReset(){ checked.clear(); localStorage.removeItem('mv'); init(); closeAll(); }

window.onload = init;