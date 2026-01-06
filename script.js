const firebaseConfig = {
  apiKey: "AIzaSyAhQHJrxhrIbiLfqsrBSTX92iVJauhVNLo",
  authDomain: "lordbet-9e8fa.firebaseapp.com",
  projectId: "lordbet-9e8fa",
  storageBucket: "lordbet-9e8fa.firebasestorage.app",
  messagingSenderId: "570613318832",
  appId: "1:570613318832:web:b33d92c46f19edce356775"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// --- ١. زمان ---
const translations = {
    ku: { home: "سەرەکی", leagues: "خولەکان", wallet: "بانک", profile: "هەژمار", send: "ناردن" },
    ar: { home: "الرئيسية", leagues: "الدوريات", wallet: "المحفظة", profile: "الحساب", send: "ارسال" },
    en: { home: "Home", leagues: "Leagues", wallet: "Wallet", profile: "Profile", send: "Send" }
};

function changeLang(lang) {
    document.querySelectorAll('[data-key]').forEach(el => {
        el.innerText = translations[lang][el.getAttribute('data-key')];
    });
    document.body.dir = (lang === 'en') ? 'ltr' : 'rtl';
}

// --- ٢. گۆڕینی پەیجەکان ---
function showPage(page) {
    const main = document.getElementById('main-content');
    if (page === 'wallet') {
        main.innerHTML = `
            <div class="pay-card">
                <h3>FastPay</h3>
                <p>بنێرە بۆ: 0750 XXX XXXX</p>
                <input type="number" id="amt" placeholder="[بڕی پارەی نێردراو]">
                <input type="text" id="pin" placeholder="[ژمارەی پین]">
                <button class="main-btn" onclick="deposit('FastPay')">ناردن</button>
            </div>
            <div class="pay-card">
                <h3>AsiaCell</h3>
                <input type="text" id="asia-pin" placeholder="[کۆدی کارت یان پین]">
                <button class="main-btn" onclick="deposit('AsiaCell')">ناردن</button>
            </div>
            <div class="pay-card">
                <h3>ZiCharge</h3>
                <input type="text" id="zi-pin" placeholder="[کۆدی کارت]">
                <button class="main-btn" onclick="deposit('ZiCharge')">ناردن</button>
            </div>
        `;
    } else if (page === 'leagues') {
        main.innerHTML = `
            <div class="league-item" onclick="alert('خولەکە لود دەبێت...')">La Liga <i class="fa fa-chevron-left"></i></div>
            <div class="league-item">Premier League <i class="fa fa-chevron-left"></i></div>
            <div class="league-item">Champions League <i class="fa fa-chevron-left"></i></div>
        `;
    } else if (page === 'profile') {
        main.innerHTML = `
            <div class="pay-card">
                <h2>تۆمارکردنی هەژمار</h2>
                <input type="text" id="reg-name" placeholder="ناو">
                <input type="number" id="reg-age" placeholder="تەمەن">
                <input type="text" id="reg-phone" placeholder="ژمارەی مۆبایل">
                <input type="password" id="reg-pass" placeholder="پاسۆرد">
                <button class="main-btn" onclick="register()">تۆمارکردن</button>
            </div>
        `;
    } else {
        main.innerHTML = `<h2 style="padding:20px;">بەخێربێیت بۆ LordBet</h2><p style="padding:20px;">یارییەکان لێرە بە لایڤ دادەنرێن...</p>`;
    }
}

// --- ٣. فایربەیس (پارە و تۆمارکردن) ---
async function deposit(method) {
    const amount = document.getElementById('amt')?.value || 0;
    const pin = document.getElementById('pin')?.value || document.getElementById('asia-pin')?.value || document.getElementById('zi-pin')?.value;
    
    if(!pin) return alert("تکایە پین بنووسە");
    
    await db.collection("deposits").add({
        method, amount, pin, status: "pending", time: new Date(), uid: auth.currentUser?.uid || "guest"
    });
    alert("داواکارییەکەت نێردرا بۆ ئادمین");
}

async function register() {
    const name = document.getElementById('reg-name').value;
    const phone = document.getElementById('reg-phone').value;
    const pass = document.getElementById('reg-pass').value;
    const age = document.getElementById('reg-age').value;
    
    if(age < 18) return alert("تەمەن نابێت کەمتر بێت لە ١٨ ساڵ");

    try {
        const res = await auth.createUserWithEmailAndPassword(phone + "@bet.com", pass);
        await db.collection("users").doc(res.user.uid).set({ name, age, phone, balance: 0 });
        alert("هەژمار دروستکرا!");
        location.reload();
    } catch(e) { alert(e.message); }
}

// لودکردنی یەکەمجار
showPage('home');
