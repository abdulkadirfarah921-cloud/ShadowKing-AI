// ========= SHADOWKING TITAN FAB SERVER - FREE =========
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const app = express();

app.use(cors());
app.use(express.json({limit: '50mb'}));
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

const DB_FILE = 'db.json';
const PORT = 3000;

// انشئ المجلدات
['public','uploads'].forEach(dir => {
  if(!fs.existsSync(dir)) fs.mkdirSync(dir)
});
if(!fs.existsSync(DB_FILE)){
  fs.writeFileSync(DB_FILE, JSON.stringify({users:[],products:[],orders:[]},null,2))
}

const readDB = () => JSON.parse(fs.readFileSync(DB_FILE,'utf8'));
const writeDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data,null,2));

// رفع الملفات
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// API المنتجات
app.get('/api/products', (req,res)=>{
  res.json(readDB().products);
});

// اضافة منتج
app.post('/api/add-product', upload.single('file'), (req,res)=>{
  const db = readDB();
  db.products.push({
    id: Date.now(),
    title: req.body.title,
    price: 0,
    file: req.file.filename,
    img: req.body.img || 'placeholder.png'
  });
  writeDB(db);
  res.json({success: true});
});

// تحميل
app.get('/api/download/:file', (req,res)=>{
  res.download(path.join(__dirname, 'uploads', req.params.file));
});

app.listen(PORT, ()=>console.log(`✅ SHADOWKING TITAN FAB FREE شغال على http://localhost:${PORT}`));