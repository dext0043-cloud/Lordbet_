// Firebase Config (ئەوەی خۆت)
const firebaseConfig = {
  apiKey: "AIzaSyAhQHJrxhrIbiLfqsrBSTX92iVJauhVNLo",
  authDomain: "lordbet-9e8fa.firebaseapp.com",
  projectId: "lordbet-9e8fa",
  storageBucket: "lordbet-9e8fa.firebasestorage.app",
  messagingSenderId: "570613318832",
  appId: "1:570613318832:web:b33d92c46f19edce356775",
  measurementId: "G-VSKR79Y02H"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// --- ١. سیستەمی زمان ---
const translations = {
    ku: { nav_home: "سەرەکی", nav_bets: "گرەوەکانم", nav_wallet: "بانک", min_bet: "کەمترین بڕ 1000", send: "ناردن" },
    ar: { nav_home: "الرئيسية", nav_bets: "رهاناتي", nav_wallet: "المحفظة", min_bet: "أقل مبلغ 1000", send: "ارسال" },
    en: { nav_home: "Home", nav_bets: "My Bets", nav_wallet: "Wallet", min_bet: "Min bet 1000", send: "Send" }
};

function changeLang(lang) {
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        el.innerText = translations[lang][key];
    });
    document.body.dir = (lang === 'en') ? 'ltr' : 'rtl';
}

// --- ٢. دروستکردنی هەژماری پێشکەوتوو ---
async function handleRegister() {
    const name = document.getElementById('reg-name').value;
    const age = document.getElementById('reg-age').value;
    const phone = document.getElementById('reg-phone').value;
    const pass = document.getElementById('reg-pass').value;

    if(age < 18) return alert("تەمەن دەبێت سەروو ١٨ بێت");

    try {
        const res = await auth.createUserWithEmailAndPassword(phone + "@lord.com", pass);
        await db.collection("users").doc(res.user.uid).set({
            fullName: name,
            age: age,
            phone: phone,
            balance: 0,
            role: "user"
        });
        window.location.href = "index.html";
    } catch (e) { alert(e.message); }
}

// --- ٣. سیستەمی سەبەتەی گرەو (Combo Bet) ---
let betSlip = [];
function addToSlip(match, pick, odd) {
    betSlip.push({ match, pick, odd });
    updateSlipUI();
}

function updateSlipUI() {
    const container = document.getElementById('slip-items');
    const count = document.getElementById('count');
    container.innerHTML = "";
    let totalOdds = 1;
    
    betSlip.forEach((item, index) => {
        totalOdds *= item.odd;
        container.innerHTML += `<div class="slip-item">${item.match} - ${item.pick} (@${item.odd}) 
        <button onclick="removeFromSlip(${index})">x</button></div>`;
    });
    
    count.innerText = betSlip.length;
    // نیشاندانی کۆی ئۆدزەکان
    if(betSlip.length > 0) {
        container.innerHTML += `<div class="total-odds">کۆی ئۆدز: ${totalOdds.toFixed(2)}</div>`;
    }
}

async function placeComboBet() {
    const amount = document.getElementById('bet-amount').value;
    if(amount < 1000) return alert("کەمترین بڕ ١٠٠٠ دینارە");
    if(betSlip.length === 0) return alert("سەبەتەکە چۆڵە");

    await db.collection("tickets").add({
        uid: auth.currentUser.uid,
        matches: betSlip,
        totalAmount: amount,
        status: "pending",
        time: new Date()
    });
    alert("گرەوەکە نێردرا بۆ ئادمین!");
    betSlip = [];
    updateSlipUI();
}

// --- ٤. ناردنی وەسڵی پارە (FastPay, Zicharge) ---
async function sendDeposit(type) {
    const amount = (type === 'FastPay') ? document.getElementById('fp-amount').value : 0;
    const pin = (type === 'FastPay') ? document.getElementById('fp-pin').value : document.getElementById('zi-code').value;

    if(!pin) return alert("تکایە زانیارییەکان پڕبکەرەوە");

    await db.collection("deposits").add({
        uid: auth.currentUser.uid,
        type: type,
        amount: amount,
        pin: pin,
        status: "pending",
        time: new Date()
    });
    alert("داواکارییەکەت نێردرا، چاوەڕێی ئادمین بکە");
}

// --- ٥. پیشاندانی خولەکان بە جیا ---
function toggleLeague(id) {
    const el = document.getElementById(id);
    el.style.display = (el.style.display === 'none') ? 'block' : 'none';
    if(el.innerHTML === "") loadLeagueData(id);
}

function loadLeagueData(id) {
    const el = document.getElementById(id);
    // لێرەدا دەتوانیت یارییەکانی هەر خولێک لود بکەیت
    el.innerHTML = `<div class="match-card">یارییەکانی ئەم خولە لێرە دەردەکەون...</div>`;
}
