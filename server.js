import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json({limit: '10mb'}));

const PORT = process.env.PORT || 10000;
const GEMINI_KEY = process.env.GEMINI_API_KEY; // حطه في Render Env

// تصليح خطأ Cannot GET /
app.get("/", (req, res) => {
  res.send("👑 ShadowKing API is Running");
});

// مود الدردشة والتعلم والويب
app.post("/api/chat", async (req, res) => {
  try {
    const { prompt, mode, lang } = req.body;
    let system = `انت ShadowKing AI. رد باللغة ${lang} وباسلوب ودود ومفيد.`;
    if(mode === 'learn') system += " انت معلم محترف اشرح خطوة خطوة.";

    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        contents: [{parts: [{text: system + "\nالسؤال: " + prompt}]}]
      })
    });
    const data = await r.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "ما قدرت ارد";
    res.json({text});
  } catch (e) { res.status(500).json({text: "خطأ في السيرفر"})}
});

// مود الصور
app.post("/api/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body;
    // هنا حط API الصور تبعك. هذا مثال Gemini
    res.json({text: "ميزة الصور تحتاج API صور. اربطها هنا"});
  } catch (e) { res.status(500).json({text: "خطأ"})}
});

// مود بناء موقع
app.post("/api/build-web", async (req, res) => {
  const { prompt } = req.body;
  res.json({text: `تم انشاء موقع عن: ${prompt}`, downloadUrl: "#"});
});

// مود بناء تطبيق
app.post("/api/build-apk", async (req, res) => {
  const { prompt } = req.body;
  res.json({text: `تم انشاء كود تطبيق: ${prompt}`, downloadUrl: "#"});
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));