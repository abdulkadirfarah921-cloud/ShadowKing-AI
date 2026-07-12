<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ShadowKing AI v7.0</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        body { font-family: 'Cairo'; background: #212121; color: #ececec; height: 100vh; display: flex; flex-direction: column; }
        header { padding: 15px; text-align: center; border-bottom: 1px solid #4d4d4d; font-size: 20px; font-weight: 900; color: #ff8800; }
    .modes { display: flex; gap: 8px; padding: 15px; justify-content: center; background: #2f2f2f; border-bottom: 1px solid #4d4d4d; flex-wrap: wrap; }
    .mode-btn { padding: 10px 14px; background: #404040; border: 2px solid #565656; border-radius: 20px; color: white; cursor: pointer; font-weight: 600; transition: 0.3s; font-size: 13px; }
    .mode-btn:hover { border-color: #ff8800; transform: translateY(-2px); }
    .mode-btn.active { background: #ff8800; color: black; border-color: #ff8800; }
   .chat-box { flex: 1; overflow-y: auto; padding: 20px; max-width: 800px; margin: auto; width: 100%; }
   .msg { padding: 20px; margin: 0; line-height: 1.8; border-bottom: 1px solid #2f2f2f; }
   .user { background: #212121; }
   .bot { background: #2f2f2f; }
   .msg strong { color: #ff8800; }
   .code-box { background: #1a1a1a; padding: 15px; border-radius: 8px; margin: 10px 0; direction: ltr; text-align: left; overflow-x: auto; border: 1px solid #4d4d4d; font-size: 13px; white-space: pre-wrap; }
   .btn-download { background: #ff8800; color: black; padding: 10px 20px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; margin: 5px 5px 5px 0; }
   .btn-download:hover { background: #ff5500; }
   .btn-copy { background: #4d4d4d; color: white; padding: 10px 20px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; margin: 5px; }
   .btn-copy:hover { background: #666; }
   .input-area { padding: 20px; border-top: 1px solid #4d4d4d; background: #212121; position: sticky; bottom: 0; }
   .input-wrap { max-width: 800px; margin: auto; position: relative; }
        input { width: 100%; padding: 16px 60px 16px 16px; border-radius: 25px; border: 1px solid #565656; background: #404040; color: white; font-size: 16px; }
        input:focus { outline: none; border-color: #ff8800; }
   .send-btn { position: absolute; left: 8px; top: 50%; transform: translateY(-50%); background: #ff8800; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; font-size: 20px; color: black; font-weight: bold; transition: 0.2s; }
   .send-btn:hover { background: #ff5500; transform: translateY(-50%) scale(1.1); }
    </style>
</head>
<body>
    <header><span id="modeIcon">💬</span> <span id="modeTitle">ShadowKing AI - الدردشة</span> 👑</header>

    <div class="modes">
        <button class="mode-btn active" onclick="setMode('chat', this)">💬 الدردشة</button>
        <button class="mode-btn" onclick="setMode('learn', this)">📚 التعلم</button>
        <button class="mode-btn" onclick="setMode('web', this)">🌐 Web Mode</button>
        <button class="mode-btn" onclick="setMode('apk', this)">📱 APK Mode</button>
        <button class="mode-btn" onclick="setMode('image', this)">🎨 Image Mode</button>
    </div>

    <div class="chat-box" id="chatBox">
        <div class="msg bot">
            <strong>ShadowKing:</strong> مرحبا! اختار المود اللي بدك ياه من فوق<br><br>
            <b>💬 الدردشة:</b> اسألني اي شي ونتكلم<br>
            <b>📚 التعلم:</b> بعلمك برمجة وتصميم من الصفر<br>
            <b>🌐 Web Mode:</b> لصنع مواقع<br>
            <b>📱 APK Mode:</b> لصنع تطبيقات اندرويد<br>
            <b>🎨 Image Mode:</b> لصنع صور بالذكاء الاصطناعي
        </div>
    </div>

    <div class="input-area">
        <div class="input-wrap">
            <input type="text" id="userInput" placeholder="ارسل رسالة الى ShadowKing AI">
            <button class="send-btn" onclick="sendMsg()">➤</button>
        </div>
    </div>

<script>
// ⚠️ مهم: غير المفتاح هذا بمفتاح جديد من Google AI Studio
const API_KEY = "حط_مفتاحك_الجديد_هون";
let lastCode = "";
let currentMode = "chat";

const modeIcons = {
    'chat': '💬', 'learn': '📚', 'web': '🌐', 'apk': '📱', 'image': '🎨'
};
const modeNames = {
    'chat': 'الدردشة', 'learn': 'التعلم', 'web': 'Web Mode', 'apk': 'APK Mode', 'image': 'Image Mode'
};

function addMessage(text, sender) {
    const chatBox = document.getElementById('chatBox');
    chatBox.innerHTML += `<div class="msg ${sender}"><strong>${sender === 'user'? 'انت' : 'ShadowKing'}:</strong> ${text}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
}

function setMode(mode, element) {
    currentMode = mode;
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');

    document.getElementById('modeIcon').innerText = modeIcons[mode];
    document.getElementById('modeTitle').innerText = `ShadowKing AI - ${modeNames[mode]}`;

    addMessage(`تم التحويل الى ${modeNames[mode]} ${modeIcons[mode]}`, 'bot');
}

function downloadFile(filename, content) {
    const blob = new Blob([content], {type: 'text/html;charset=utf-8'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

function copyCode() {
    navigator.clipboard.writeText(lastCode);
    alert('تم نسخ الكود!');
}

async function sendMsg() {
    const input = document.getElementById('userInput');
    const msg = input.value.trim();
    if(!msg) return;
    addMessage(msg, 'user');
    input.value = '';

    const modeName = modeNames[currentMode];
    const loadingId = 'loading-' + Date.now();
    document.getElementById('chatBox').innerHTML += `<div class="msg bot" id="${loadingId}"><strong>ShadowKing:</strong> بصنع في ${modeName}...</div>`;

    try {
        let prompt = `انت ShadowKing AI خبرة 200 سنة. المود الحالي: ${currentMode}. `;
        if(currentMode === 'chat') prompt += `دردش فقط باللغة العربية وباسلوب ودود. `;
        if(currentMode === 'learn') prompt += `اشرح بالتفصيل خطوة خطوة بالعربي. `;
        if(currentMode === 'web' || currentMode === 'apk') prompt += `اعطي الكود كامل داخل \`\`html... \`\`. اشرح الكود باختصار بعد الكود. `;
        if(currentMode === 'image') prompt += `اوصف الصورة المطلوبة بالتفصيل بالانجليزي لذكاء اصطناعي يولد صور. `;
        prompt += `السؤال: ${msg}`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] })
        });

        if(!response.ok) throw new Error("خطأ في API: " + response.status);

        const data = await response.json();
        let reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "ما قدرت اجيب رد. تأكد من المفتاح والنت";

        const codeMatch = reply.match(/```html([\s\S]*?)```/);
        if(codeMatch){
            lastCode = codeMatch[1];
            reply = reply.replace(/```html[\s\S]*?```/, '');
            let filename = currentMode === 'apk'? 'app.html' : 'index.html';
            reply += `<div class="code-box">${lastCode}</div>
            <button class="btn-download" onclick="downloadFile('${filename}', lastCode)">📥 تحميل ${filename}</button>
            <button class="btn-copy" onclick="copyCode()">📋 نسخ</button>`;
        }
        document.getElementById(loadingId).remove();
        addMessage(reply.replace(/\n/g, '<br>'), 'bot');
    } catch(e) {
        document.getElementById(loadingId).innerText = "صار خطأ: " + e.message;
        console.log(e);
    }
}

document.getElementById('userInput').addEventListener('keypress', function(e) {
    if(e.key === 'Enter') sendMsg();
});
</script>
</body>
</html>
