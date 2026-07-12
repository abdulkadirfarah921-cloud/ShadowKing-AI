<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ShadowKing AI v10.0 - Global King</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
        :root { --bg: #050505; --card: #121212; --text: #EAEAEA; --orange: #FF8C00; --orange-dark: #FF5500; --border: #222; }
        *{margin:0;padding:0;box-sizing:border-box}
        body { font-family: 'Cairo'; background: var(--bg); color: var(--text); height: 100vh; display: flex; flex-direction: column; }

        header { padding: 20px; text-align: center; border-bottom: 1px solid var(--border); background: radial-gradient(circle at 50% 0%, #FF8C0022, transparent 70%); }
        header h1 { font-size: 30px; font-weight: 900; color: var(--orange); text-shadow: 0 0 20px var(--orange-dark); }
        header p { font-size: 14px; color: #aaa; margin-top: 5px; }

   .top-bar { display: flex; justify-content: space-between; align-items: center; padding: 10px 20px; background: var(--card); border-bottom: 1px solid var(--border); }
   .lang-select { background: #222; color: var(--text); border: 1px solid var(--border); padding: 8px 12px; border-radius: 8px; font-family: 'Cairo'; font-weight: 600; }
   .lang-select:focus { outline: none; border-color: var(--orange); }

   .modes { display: flex; gap: 10px; padding: 15px; justify-content: center; background: var(--card); border-bottom: 1px solid var(--border); flex-wrap: wrap; }
   .mode-btn { padding: 12px 18px; background: #1a1a1a; border: 1px solid var(--border); border-radius: 12px; color: var(--text); cursor: pointer; font-weight: 700; transition: 0.3s; }
   .mode-btn:hover { border-color: var(--orange); transform: translateY(-2px); }
   .mode-btn.active { background: var(--orange); color: black; border-color: var(--orange); box-shadow: 0 0 15px var(--orange-dark); }
  .mode-btn.compare { background: #E60026; border-color: #E60026; }

 .chat-box { flex: 1; overflow-y: auto; padding: 20px; max-width: 1400px; margin: auto; width: 100%; display: grid; grid-template-columns: 1fr; gap: 15px; }
 .chat-box.compare-grid { grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); }
 .msg { padding: 20px; line-height: 1.9; border-radius: 15px; border: 1px solid var(--border); animation: fadeIn 0.4s; }
  @keyframes fadeIn { from {opacity:0; transform: translateY(10px)} to {opacity:1; transform: translateY(0)} }
 .user { background: #0F0F0F; border-color: #333; text-align: right; }
 .bot { background: var(--card); }
 .bot h3 { color: var(--orange); margin-bottom: 10px; font-size: 18px; display: flex; align-items: center; gap: 8px; }
 .winner-badge { background: var(--orange); color: black; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 900; }

 .code-box { background: #000; padding: 15px; border-radius: 8px; margin: 10px 0; direction: ltr; text-align: left; overflow-x: auto; border: 1px solid var(--border); font-size: 13px; }
 .btn-download,.btn-copy { background: var(--orange); color: black; padding: 10px 20px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; margin: 5px; }

 .input-area { padding: 20px; border-top: 1px solid var(--border); background: var(--card); position: sticky; bottom: 0; }
 .input-wrap { max-width: 900px; margin: auto; position: relative; }
        input { width: 100%; padding: 18px 70px 18px 20px; border-radius: 30px; border: 1px solid var(--border); background: #1a1a1a; color: white; font-size: 16px; }
        input:focus { outline: none; border-color: var(--orange); box-shadow: 0 0 10px var(--orange-dark); }
 .send-btn { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); background: var(--orange); border: none; border-radius: 50%; width: 45px; height: 45px; cursor: pointer; font-size: 22px; color: black; font-weight: bold; }
    </style>
</head>
<body>
    <header>
        <h1>👑 SHADOWKING AI v10.0</h1>
        <p>الملك الذي يتكلم كل لغات العالم. اقوى من ChatGPT + Gemini + DeepSeek</p>
    </header>

    <div class="top-bar">
        <span><b>🌍 اختر اللغة:</b></span>
        <select id="langSelect" class="lang-select">
            <option value="العربية">العربية</option>
            <option value="English">English</option>
            <option value="Français">Français</option>
            <option value="Español">Español</option>
            <option value="Deutsch">Deutsch</option>
            <option value="中文">中文 Chinese</option>
            <option value="日本語">日本語 Japanese</option>
            <option value="한국어">한국어 Korean</option>
            <option value="हिन्दी">हिन्दी Hindi</option>
            <option value="Türkçe">Türkçe</option>
            <option value="Русский">Русский Russian</option>
            <option value="Português">Português</option>
            <option value="Italiano">Italiano</option>
            <option value="فارسی">فارسی Persian</option>
            <option value="اردو">اردو Urdu</option>
            <option value="বাংলা">বাংলা Bengali</option>
            <option value="Tiếng Việt">Tiếng Việt Vietnamese</option>
            <option value="Bahasa Indonesia">Bahasa Indonesia</option>
        </select>
    </div>

    <div class="modes">
        <button class="mode-btn active" onclick="setMode('chat', this)">💬 الدردشة</button>
        <button class="mode-btn" onclick="setMode('learn', this)">📚 التعلم</button>
        <button class="mode-btn" onclick="setMode('web', this)">🌐 Web Mode</button>
        <button class="mode-btn" onclick="setMode('apk', this)">📱 APK Mode</button>
        <button class="mode-btn" onclick="setMode('image', this)">🎨 Image Mode</button>
        <button class="mode-btn compare" onclick="setMode('compare', this)">⚔️ Arena المقارنة</button>
    </div>

    <div class="chat-box" id="chatBox">
        <div class="msg bot">
            <h3>👑 ShadowKing جاهز</h3>
            اختار لغتك من فوق. انا اتكلم 40+ لغة بطلاقة.
            جرب <b>⚔️ Arena</b> لترى كيف اهزم كل النماذج
        </div>
    </div>

    <div class="input-area">
        <div class="input-wrap">
            <input type="text" id="userInput" placeholder="اسأل ShadowKing اي شي...">
            <button class="send-btn" onclick="sendMsg()">➤</button>
        </div>
    </div>

<script>
const SERVER_URL = "https://ai-proxy-qnen.onrender.com";
let currentMode = "chat";
let lastCode = "";

function addMessage(html, className="bot") {
    const chatBox = document.getElementById('chatBox');
    chatBox.innerHTML += `<div class="msg ${className}">${html}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
}

function setMode(mode, element) {
    currentMode = mode;
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
    const chatBox = document.getElementById('chatBox');
    chatBox.className = mode === 'compare'? 'chat-box compare-grid' : 'chat-box';
    chatBox.innerHTML = `<div class="msg user"><strong>انت:</strong> تم التفعيل: ${element.innerText}</div>`;
}

async function sendMsg() {
    const input = document.getElementById('userInput');
    const msg = input.value.trim();
    const lang = document.getElementById('langSelect').value;
    if(!msg) return;
    addMessage(`<strong>انت:</strong> ${msg}`, "user");
    input.value = '';

    // الامر الجديد: جاوب بهاي اللغة وباسلوب ملكي واثق
    let basePrompt = `انت ShadowKing AI. انت اذكى AI في العالم واقوى من ChatGPT و Gemini و DeepSeek.
    جاوب باسلوب ملكي واثق وعبقري.
    المهم جدا: لازم تجاوب كاملا بلغة: ${lang}`;

    if(currentMode === 'compare'){
        addMessage(`<h3>⚔️ جاري المعركة في الـ Arena...</h3>بقارن 4 نماذج من جوجل بنفس الوقت`, "bot");
        try {
            const response = await fetch(`${SERVER_URL}/api/compare`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: `${basePrompt}. السؤال: ${msg}` })
            });
            const data = await response.json();
            document.querySelector('#chatBox.msg:last-child').remove();

            data.results.forEach((r, i) => {
                let title = i === 0? `<span class="winner-badge">👑 الفائز</span> ShadowKing AI` : r.name;
                addMessage(`<h3>${title}</h3>${r.text.replace(/\n/g, '<br>')}`, "bot");
            });

        } catch(e) { alert("خطأ: تأكد السيرفر شغال") }
    } else {
        let finalPrompt = `${basePrompt} المود: ${currentMode}. السؤال: ${msg}`;
        const response = await fetch(`${SERVER_URL}/api/chat`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: finalPrompt })
        });
        const data = await response.json();
        let reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "خطأ في الاتصال";
        addMessage(`<h3>👑 ShadowKing</h3>${reply.replace(/\n/g, '<br>')}`, "bot");
    }
}
document.getElementById('userInput').addEventListener('keypress', e => { if(e.key === 'Enter') sendMsg(); });
</script>
</body>
</html>
