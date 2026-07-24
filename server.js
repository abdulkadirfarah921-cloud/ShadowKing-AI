// ========= SHADOWKING FAB STORE SERVER - PADDLE BILLING =========
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const fs = require('fs');
const app = express();

app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.static('public')); // خلي index.html جوة public

const DB_FILE = 'db.json';
const PADDLE_API_KEY = 'pdl_live_apikey_01ky7xdn2h...'; // API Key من Paddle > Developer Tools

function readDB(){ try{return JSON.parse(fs.readFileSync(DB_FILE,'utf8'))}catch{return {users:[],products:[],orders:[]}} }
function writeDB(data){ fs.writeFileSync(DB_FILE, JSON.stringify(data,null,2)) }

// ===== 1. حماية السعر 100% + انشاء رابط Paddle =====
app.post('/api/checkout', async (req,res)=>{
  const {cart, userId} = req.body;
  const db = readDB();
  
  let items = [];
  
  for(let item of cart){
    const product = db.products.find(p=>p.id==item.id);
    if(!product) return res.status(400).json({error:"منتج غير موجود"});
    
    // السعر بيجي من Paddle مش من عندنا
    items.push({
      price_id: product.paddlePriceId, // ده المهم
      quantity: 1
    });
  }
  
  try {
    const response = await fetch('https://api.paddle.com/checkouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PADDLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: items,
        custom_data: { userId: userId || 'guest' } // عشان نعرف مين اشترى
      })
    });
    
    const data = await response.json();
    res.json({ url: data.data.url }); // رابط الدفع
  } catch(err) {
    res.status(500).json({error: err.message});
  }
});

// ===== 2. Webhook من Paddle =====
app.post('/api/paddle-webhook', express.raw({type: 'application/json'}), (req,res)=>{
  const event = JSON.parse(req.body);
  
  if(event.event_type === 'transaction.completed'){
    const order = event.data;
    const db = readDB();
    
    const userId = order.custom_data?.userId;
    
    // 1. ضيف الطلب
    db.orders.push({
      id: order.id,
      total: order.details.totals.total,
      customer: order.customer.email,
      items: order.items,
      date: new Date()
    });
    
    // 2. ضيف المنتجات لمكتبة اليوزر + نقاط
    let user = db.users.find(u=>u.id==userId);
    if(!user){
      user = {id: userId, library:[], points:0};
      db.users.push(user);
    }
    
    order.items.forEach(item=>{
      user.library.push(item.price.id);
      user.points += order.details.totals.total * 10; // 1200 ميزة: نقاط
    });
    
    writeDB(db);
    console.log('طلب جديد:', order.customer.email);
  }
  
  res.status(200).send('OK');
});

// ===== 3. API مقفول - ما بيرجع سعر =====
app.get('/api/products', (req,res)=>{
  const db = readDB();
  const safe = db.products.map(p=>({
    id:p.id, name:p.name, img:p.img, cat:p.cat, price:p.price // السعر للعرض بس
  }));
  res.json(safe);
});

app.listen(3000, ()=>console.log('SHADOWKING FAB STORE + PADDLE Running on 3000'));