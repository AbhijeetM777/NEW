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

function init() {
    buildURLs();
    const c = document.getElementById('content');
    if (!c) return; // Safety check
    
    c.innerHTML = '';

    categories.forEach(cat => {
        const key = cat.name;
        const itemsInCategory = cat.items;
        const checkedItems = itemsInCategory.filter(i => checked.has(key + '|' + i)).length;
        const isDone = checkedItems === itemsInCategory.length;

        const wrapper = document.createElement('div');
        wrapper.className = 'category';
        wrapper.dataset.catName = cat.name;

        wrapper.innerHTML = `
            <div class="category-header" onclick="this.parentElement.classList.toggle('collapsed')">
                <div class="category-title">
                    <div class="cat-icon">${cat.icon}</div>
                    <span class="cat-name">${cat.name}</span>
                </div>
                <div class="right-side">
                    <span class="category-count ${isDone ? 'done' : ''}" id="cnt-${key}">
                        ${checkedItems}/${itemsInCategory.length}
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
    setupObserver();
}

// Call init immediately and also on window load to be safe
init(); 
window.onload = init;
