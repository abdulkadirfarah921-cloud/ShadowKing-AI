const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));
app.use('/uploads', express.static('uploads'));

// انشاء مجلد الرفع
if(!fs.existsSync('uploads')) fs.mkdirSync('uploads');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// قاعدة البيانات
const adapter = new JSONFile('db.json');
const db = new Low(adapter);
await db.read();
db.data ||= { products: [] };

// API جيب كل المنتجات
app.get('/api/products', async (req, res) => {
  await db.read();
  res.json(db.data.products);
});

// API اضافة منتج جديد
app.post('/api/add', upload.fields([{name:'image'}, {name:'file'}]), async (req, res) => {
  const { name, desc, price, type } = req.body;
  const product = {
    id: Date.now(),
    name,
    desc,
    type,
    price: price || 'مجاني',
    image: req.files.image[0].filename,
    file: req.files.file[0].filename
  };
  db.data.products.push(product);
  await db.write();
  res.json({success: true, product});
});

app.listen(PORT, () => console.log(`✅ السيرفر شغال على http://localhost:${PORT}`));