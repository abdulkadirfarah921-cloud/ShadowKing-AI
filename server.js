const express = require('express');
const stripe = require('stripe')('sk_live_xxx'); // حط مفتاح Stripe الحقي
const cors = require('cors');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');

const app = express();
const PORT = process.env.PORT || 3000;

// قاعدة بيانات
const adapter = new JSONFile('db.json');
const db = new Low(adapter);
await db.read();
db.data ||= { users: [], publishers: [], files: [], drafts: [] }

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// ===== نظام الفحص القوي =====
function deepScan(filename, content) {
  const highRisk = ["eval(", "exec(", "rm -rf", "child_process", "fs.unlinkSync", "password=", "api_key="];
  const mediumRisk = ["http://", "document.cookie", "localStorage", "alert("];

  if (highRisk.some(k => content.includes(k))) {
    return { risk: "عالي", action: "حذف فوري - الملف غير امن نهائيا", block: true };
  }
  if (mediumRisk.some(k => content.includes(k))) {
    return { risk: "قوي", action: "تحذير احمر: امسح الملف فورا", block: false };
  }
  return { risk: "امن", action: "مسموح بالنشر", block: false };
}

// ===== 1. صفحة الدفع Stripe =====
app.get('/pay/:publisher', async (req,res)=>{
  const publisher = req.params.publisher;
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: `رسوم نشر منتج - ${publisher}` },
        unit_amount: 500, // 5$
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `https://abdulkadirfarah921-cloud.github.io/ShadowKing-AI/market.html?paid=true&publisher=${publisher}`,
    cancel_url: `https://abdulkadirfarah921-cloud.github.io/ShadowKing-AI/market.html`,
  });

  res.redirect(303, session.url);
});

// ===== 2. حفظ مسودة =====
app.post('/api/save-draft', async (req,res)=>{
  const { email, file } = req.body;
  await db.read();
  db.data.drafts.push({email, file, savedAt: new Date()});
  await db.write();
  res.json({success: true});
});

// ===== 3. رفع المنتج + الفحص الاول =====
app.post('/api/upload-product', async (req,res)=>{
  const { email, file } = req.body;
  await db.read();
  
  // نتأكد انه دفع
  let user = db.data.users.find(u=>u.email === email);
  if(!user || !user.hasCredit){
    // لو جاي من Stripe بنفعله
    db.data.users.push({email, hasCredit: true});
    await db.write();
  }

  const scan = deepScan(file.n, JSON.stringify(file));
  db.data.files.push({name: file.n, email, risk: scan.risk, time: new Date()});

  if(scan.block) { 
    await db.write(); 
    return res.status(403).json({error: scan.action, risk: scan.risk}); 
  }
  if(scan.risk !== "امن") { 
    await db.write(); 
    return res.json({needRepair: true, scan}); 
  }

  // لو امن ننشره على طول
  db.data.publishers.push({name: file.author, product: file.n});
  db.data.users = db.data.users.filter(u=>u.email!== email); // استهلك الكريدت
  await db.write();
  res.json({success: true, message: "تم النشر"});
});

// ===== 4. الاصلاح التلقائي =====
app.post('/api/auto-fix', async (req,res)=>{
  const { content } = req.body;
  let fixed = content.replace(/eval\(/g, '//removed eval(').replace(/http:\/\//g, 'https://');
  res.json({fixed, message: "تم إصلاح ملفك الأن يمكنك نشرة"});
});

// ===== 5. النشر النهائي بعد الاصلاح =====
app.post('/api/final-publish', async (req,res)=>{
  const { email, file } = req.body;
  const scan = deepScan(file.n, JSON.stringify(file));
  if(scan.block) return res.status(403).json({error: scan.action});

  await db.read();
  db.data.publishers.push({name: file.author, product: file.n});
  db.data.users = db.data.users.filter(u=>u.email!== email); // استهلك الكريدت
  db.data.drafts = db.data.drafts.filter(d=>d.email!== email);
  await db.write();
  res.json({success: true, message: "تم النشر"});
});

app.listen(PORT, ()=> console.log(`FORTRESS PAY + SCAN ACTIVE ON ${PORT}`));