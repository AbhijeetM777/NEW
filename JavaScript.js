/* ================= DATA ================= */

const categories = [
    { icon:'🍳', name:'Kitchen', items:["Plates & bowls","Mugs & glasses","Cutlery set","Chef's knife","Cutting board","Frying pan","Saucepan","Baking sheet","Mixing bowls","Spatula & spoons","Tongs & whisk","Can opener","Coffee maker","Toaster","Blender","Microwave","Kettle","Dish soap & sponges","Trash can","Food containers","Aluminum foil","Paper towels"] },
    { icon:'🛏️', name:'Bedroom', items:["Mattress & bed frame","Pillows & sheets","Duvet/blanket","Bedside table","Lamp","Hangers","Laundry basket","Full length mirror","Curtains","Alarm clock"] },
    { icon:'🚿', name:'Bathroom', items:["Shower curtain","Bath mat","Towels & washcloths","Toilet brush","Plunger","Toilet paper","Soap dispenser","Shampoo","First aid kit","Trash can"] },
    { icon:'🛋️', name:'Living Room', items:["Sofa/couch","Coffee table","TV & stand","Rugs","Curtains","Lamps","Throw pillows","Coasters","WiFi router"] },
    { icon:'🧹', name:'Cleaning', items:["Vacuum cleaner","Broom & dustpan","Mop & bucket","All-purpose cleaner","Glass cleaner","Laundry detergent","Trash bags","Microfiber cloths"] },
    { icon:'🔧', name:'Tools', items:["Hammer","Screwdriver set","Tape measure","Level","Drill","Wrench","Flashlight","Batteries","Extension cords","Light bulbs","Duct tape"] },
    { icon:'🚨', name:'Safety', items:["Smoke detectors","Fire extinguisher","First aid kit","Flashlight","Door locks"] },
    { icon:'🐱', name:"Gwen's Corner Doll", items:[
        "Royal Canin Ragdoll kitten dry food","Wet cat food pouches (pâté)",
        "Cat treats","Freeze-dried chicken treats","Dental treats",
        "Cat water fountain","Stainless steel bowls (x2)",
        "Premium clumping cat litter","Hooded litter box",
        "Litter scoop & mat","Cat carrier","Orthopedic cat bed",
        "Heated cat blanket","Cat tree","Cat hammock",
        "Laser pointer","Catnip toys","Puzzle feeder",
        "Cat grass","Grooming brush","Calming diffuser"
    ]},
    { icon:'✨', name:'House Aesthetics', items:[
        "Ceramic vase","Dried pampas grass","Scented candles",
        "Abstract wall art","LED fairy lights","Macramé wall hanging",
        "Indoor plant","Terracotta pots","Linen throw blanket",
        "Coffee table books","Minimalist wall clock","LED vanity mirror"
    ]}
];

const catPhotos = {
    Kitchen: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200',
    Bedroom: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200',
    Bathroom: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200',
    "Living Room": 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200'
};

let checked = new Set(JSON.parse(localStorage.getItem('mv') || '[]'));
let activeBg = 'a';

document.addEventListener('DOMContentLoaded', init);

function init(){
    renderCategories();
    updateStats();
    setBackground('Kitchen');
    attachEvents();
}

function attachEvents(){
    document.querySelector('.fab').addEventListener('click', toggleMenu);
    document.getElementById('overlay').addEventListener('click', closeAll);
    document.querySelector('.menu-btn').addEventListener('click', confirmReset);
    document.getElementById('resetBtn').addEventListener('click', doReset);
    document.getElementById('cancelReset').addEventListener('click', closeAll);
}

function renderCategories(){
    const container = document.getElementById('content');
    container.innerHTML = '';

    categories.forEach(cat=>{
        const wrapper = document.createElement('div');
        wrapper.className='category collapsed';

        wrapper.innerHTML = `
            <div class="category-header">
                <div class="category-title">
                    <span class="cat-icon">${cat.icon}</span>
                    ${cat.name}
                </div>
                <span id="cnt-${cat.name}" class="category-count">0/${cat.items.length}</span>
            </div>
            <div class="items-list"></div>
        `;

        const header = wrapper.querySelector('.category-header');
        const itemList = wrapper.querySelector('.items-list');

        header.addEventListener('click',()=>{
            wrapper.classList.toggle('collapsed');
            setBackground(cat.name);
        });

        cat.items.forEach(item=>{
            const id = `${cat.name}|${item}`;
            const itemDiv = document.createElement('div');
            itemDiv.className='item';
            if(checked.has(id)) itemDiv.classList.add('checked');

            itemDiv.innerHTML=`
                <div class="checkbox"></div>
                <div class="item-text">${item}</div>
                <div class="shop-logos">
                    <div class="shop-logo">🛒</div>
                    <div class="shop-logo">📦</div>
                    <div class="shop-logo">🛍️</div>
                </div>
            `;

            itemDiv.addEventListener('click',(e)=>{
                if(e.target.closest('.shop-logo')) return;
                toggleItem(id,itemDiv,cat.name);
            });

            itemList.appendChild(itemDiv);
        });

        container.appendChild(wrapper);
        updateCategoryCount(cat.name);
    });
}

function toggleItem(id,el,catName){
    if(checked.has(id)){
        checked.delete(id);
        el.classList.remove('checked');
    }else{
        checked.add(id);
        el.classList.add('checked');
    }
    localStorage.setItem('mv',JSON.stringify([...checked]));
    updateStats();
    updateCategoryCount(catName);
}

function updateCategoryCount(name){
    const cat = categories.find(c=>c.name===name);
    const count = cat.items.filter(i=>checked.has(name+'|'+i)).length;
    document.getElementById(`cnt-${name}`).innerText=`${count}/${cat.items.length}`;
}

function updateStats(){
    const total = categories.reduce((sum,c)=>sum+c.items.length,0);
    const done = checked.size;
    const pct = Math.round((done/total)*100)||0;

    document.getElementById('statsText').innerText=`${done}/${total} items packed`;
    document.getElementById('statsPercent').innerText=`${pct}%`;
    document.getElementById('progressBar').style.width=`${pct}%`;
}

function setBackground(name){
    const url = catPhotos[name];
    if(!url) return;

    const bgA=document.getElementById('bg-a');
    const bgB=document.getElementById('bg-b');

    const next=activeBg==='a'?bgB:bgA;
    const current=activeBg==='a'?bgA:bgB;

    next.style.backgroundImage=`url("${url}")`;
    next.style.opacity=1;
    current.style.opacity=0;

    activeBg=activeBg==='a'?'b':'a';
}

function toggleMenu(){
    document.getElementById('menu').classList.toggle('show');
    document.getElementById('overlay').classList.toggle('show');
}

function closeAll(){
    document.getElementById('menu').classList.remove('show');
    document.getElementById('overlay').classList.remove('show');
    document.getElementById('resetModal').classList.remove('show');
}

function confirmReset(){
    document.getElementById('resetModal').classList.add('show');
    document.getElementById('overlay').classList.add('show');
}

function doReset(){
    checked.clear();
    localStorage.removeItem('mv');
    closeAll();
    renderCategories();
    updateStats();
}
