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
    'Kitchen': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1400',
    'Bedroom': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1400',
    'Bathroom': 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1400',
    'Living Room': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400',
    'Cleaning': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1400',
    'Tools': 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1400',
    'Safety': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400',
    'Gwen\'s Corner': 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=1400',
    'House Aesthetics': 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1400'
};

/* --- STATE --- */
let checked = new Set(JSON.parse(localStorage.getItem('mv') || '[]'));

/* --- CORE FUNCTIONS --- */
function init() {
    const c = document.getElementById('content');
    if (!c) return;
    c.innerHTML =
