// 1. Firebase Config
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

// 2. Sidebar Toggle
function toggleMenu() {
    const s = document.getElementById('side-menu');
    s.style.right = s.style.right === '0px' ? '-280px' : '0px';
}

// 3. Navigation
async function showPage(p) {
    const main = document.getElementById('main-content');
    if(document.getElementById('side-menu').style.right === '0px') toggleMenu();
    window.scrollTo(0,0);

    if (p === 'sports') {
        main.innerHTML = `
            <div class="sports-page">
                <div class="date-header">ئەمڕۆ - لالیگا</div>
                <div class="match-card">
                    <div class="match-info">خێتافی <span>23:00</span> ڕیاڵ سۆسیاد</div>
                    <div class="odds-row">
                        <button onclick="makeBet('خێتافی - سۆسیاد', '1', 2.45)">1 (2.45)</button>
                        <button onclick="makeBet('خێتافی - سۆسیاد', 'X', 3.10)">X (3.10)</button>
                        <button onclick="makeBet('خێتافی - سۆسیاد', '2', 2.80)">2 (2.80)</button>
                    </div>
                </div>

                <div class="date-header">بەیانی - لالیگا</div>
                <div class="match-card">
                    <div class="match-info">ڕیال ئۆڤیێدۆ <span>16:00</span> ڕیال بێتیس</div>
                    <div class="odds-row">
                        <button onclick="makeBet('ئۆڤیێدۆ - بێتیس', '1', 3.20)">1 (3.20)</button>
                        <button onclick="makeBet('ئۆڤیێدۆ - بێتیس', 'X', 3.40)">X (3.40)</button>
                        <button onclick="makeBet('ئۆڤیێدۆ - بێتیس', '2', 2.15)">2 (2.15)</button>
                    </div>
                </div>

                <div class="match-card">
                    <div class="match-info">ڤیاڕیال <span>18:15</span> ئالاڤێس</div>
                    <div class="odds-row">
                        <button onclick="makeBet('ڤیاڕیال - ئالاڤێس', '1', 1.75)">1 (1.75)</button>
                        <button onclick="makeBet('ڤیاڕیال - ئالاڤێس', 'X', 3.80)">X (3.80)</button>
                        <button onclick="makeBet('ڤیاڕیال - ئالاڤێس', '2', 4.50)">2 (4.50)</button>
                    </div>
                </div>

                <div class="match-card">
                    <div class="match-info">جیڕۆنا <span>20:30</span> ئوساسونا</div>
                    <div class="odds-row">
                        <button onclick="makeBet('جیڕۆنا - ئوساسونا', '1', 1.90)">1 (1.90)</button>
                        <button onclick="makeBet('جیڕۆنا - ئوساسونا', 'X', 3.50)">X (3.50)</button>
                        <button onclick="makeBet('جیڕۆنا - ئوساسونا', '2', 3.75)">2 (3.75)</button>
                    </div>
                </div>

                <div class="match-card">
                    <div class="match-info">ڤالێنسیا <span>23:00</span> ئێلچێ</div>
                    <div class="odds-row">
                        <button onclick="makeBet('ڤالێنسیا - ئێلچێ', '1', 1.65)">1 (1.65)</button>
                        <button onclick="makeBet('ڤالێنسیا - ئێلچێ', 'X', 3.90)">X (3.90)</button>
                        <button onclick="makeBet('ڤالێنسیا - ئێلچێ', '2', 5.00)">2 (5.00)</button>
                    </div>
                </div>

                <div class="date-header">ڕۆژی دواتر</div>
                <div class="match-card">
                    <div class="match-info">رایۆ ڤایێکانۆ <span>16:00</span> مایۆرکا</div>
                    <div class="odds-row">
                        <button onclick="makeBet('رایۆ - مایۆرکا', '1', 2.20)">1 (2.20)</button>
                        <button onclick="makeBet('رایۆ - مایۆرکا', 'X', 3.10)">X (3.10)</button>
                        <button onclick="makeBet('رایۆ - مایۆرکا', '2', 3.30)">2 (3.30)</button>
                    </div>
                </div>

                <div class="match-card">
                    <div class="match-info">لێڤانتێ <span>18:15</span> ئێسپانیۆل</div>
                    <div class="odds-row">
                        <button onclick="makeBet('لێڤانتێ - ئێسپانیۆل', '1', 2.50)">1 (2.50)</button>
                        <button onclick="makeBet('لێڤانتێ - ئێسپانیۆل', 'X', 3.25)">X (3.25)</button>
                        <button onclick="makeBet('لێڤانتێ - ئێسپانیۆل', '2', 2.70)">2 (2.70)</button>
                    </div>
                </div>

                <div class="date-header" style="background:gold; color:black;">کلاسیکۆ - جامی سوپەر</div>
                <div class="match-card" style="border: 2px solid gold;">
                    <div class="match-info" style="font-size:18px; font-weight:bold;">بەرشەلۆنە <span>22:00</span> ڕیاڵ مەدرید</div>
                    <div class="odds-row">
                        <button onclick="makeBet('بەرشە - ڕیاڵ', '1', 2.85)" style="background:gold; color:black;">1 (2.85)</button>
                        <button onclick="makeBet('بەرشە - ڕیاڵ', 'X', 3.60)" style="background:gold; color:black;">X (3.60)</button>
                        <button onclick="makeBet('بەرشە - ڕیاڵ', '2', 2.30)" style="background:gold; color:black;">2 (2.30)</button>
                    </div>
                </div>
            </div>`;
    } 
    else if (p === 'deposit' || p === 'withdraw') {
        const isDep = p === 'deposit';
        main.innerHTML = `
            <div class="payment-section">
                <h2>${isDep ? 'بارکردنی باڵانس' : 'کێشانەوە'}</h2>
                <div class="method-grid">
                    <div class="method-card" onclick="openForm('Asiacell', '${p}')"><img src="https://upload.wikimedia.org/wikipedia/commons/a/a3/Asiacell_Logo.png">Asiacell</div>
                    <div class="method-card" onclick="openForm('Korek', '${p}')"><img src="https://www.korektelecom.com/static/icons/logo.png">Korek</div>
                    <div class="method-card" onclick="openForm('Zain', '${p}')"><img src="https://upload.wikimedia.org/wikipedia/en/thumb/5/52/Zain_Group_Logo.svg/1200px-Zain_Group_Logo.svg.png">Zain</div>
                    <div class="method-card" onclick="openForm('ZiCharge', '${p}')"><img src="https://zicharge.com/assets/images/logo.png">ZiCharge</div>
                </div>
                <div id="form-area" class="pay-form">
                    <h3 id="form-title"></h3>
                    <input type="number" id="f-amt" placeholder="بڕی پارە (5,000 - 1,000,000)">
                    <input type="text" id="f-pin" placeholder="${isDep ? 'کۆدی کارت' : 'ژمارەی مۆبایل'}">
                    <button class="btn" onclick="submitForm('${p}')">ناردن بۆ ئادمین</button>
                </div>
            </div>`;
    }
    else if (p === 'profile') {
        const u = auth.currentUser;
        if(!u) main.innerHTML = `<h2>چوونە ژوورەوە</h2><input id="l-p" placeholder="مۆبایل"><input type="password" id="l-s" placeholder="پاسۆرد"><button class="btn" onclick="login()">Login</button><p onclick="showPage('reg')" style="margin-top:20px; color:gold;">دروستکردنی هەژمار</p>`;
        else {
            const d = (await db.collection("users").doc(u.uid).get()).data();
            main.innerHTML = `<div class="user-info"><h2>بەخێربێیت ${d.name}</h2><div class="bal-box">${d.balance.toLocaleString()} IQD</div><button class="btn" style="background:red;" onclick="auth.signOut().then(()=>location.reload())">چوونە دەرەوە</button></div>`;
        }
    }
    else if (p === 'reg') {
        main.innerHTML = `<h2>تۆمارکردن</h2><input id="r-n" placeholder="ناو"><input id="r-p" placeholder="مۆبایل"><input type="password" id="r-s" placeholder="پاسۆرد"><button class="btn" onclick="register()">تۆمارکردن</button>`;
    }
    else {
        main.innerHTML = `<div class="hero"><h1>LORDBET</h1><p>پلاتفۆرمی یەکەم بۆ گرەوی وەرزشی</p><button class="btn" style="width:200px;" onclick="showPage('sports')">گرەو بکە</button></div>`;
    }
}

// 4. Logic Functions
let activeM = "";
function openForm(m, p) { activeM = m; document.getElementById('form-area').style.display = 'block'; document.getElementById('form-title').innerText = m; }

async function submitForm(t) {
    const amt = parseInt(document.getElementById('f-amt').value);
    const pin = document.getElementById('f-pin').value;
    if(amt < 5000 || amt > 1000000) return alert("بڕەکە دەبێت لە نێوان ٥ هەزار بۆ ١ ملیۆن بێت");
    await db.collection(t === 'deposit' ? "deposits" : "withdraws").add({ uid: auth.currentUser.uid, method: activeM, amount: amt, pin, status: "pending", time: new Date() });
    alert("داواکارییەکەت نێردرا");
    showPage('home');
}

async function makeBet(match, pick, rate) {
    const u = auth.currentUser; if(!u) return alert("سەرەتا لۆگین بکە");
    const amt = prompt(match + "\nبڕی گرەو (IQD):", "1000");
    if(!amt || amt < 1000) return;
    const ref = db.collection("users").doc(u.uid);
    const d = (await ref.get()).data();
    if(d.balance < amt) return alert("باڵانس بەس نییە");
    const tid = "LB-" + Math.floor(Math.random()*900000);
    await db.collection("bets").add({ uid: u.uid, tid, match, pick, rate, amount: parseInt(amt), status: "pending", time: new Date() });
    await ref.update({ balance: d.balance - parseInt(amt) });
    alert("پسوولە دروستکرا: " + tid);
}

async function register() {
    const n=document.getElementById('r-n').value, p=document.getElementById('r-p').value, ps=document.getElementById('r-s').value;
    try {
        const res = await auth.createUserWithEmailAndPassword(p+"@bet.com", ps);
        await db.collection("users").doc(res.user.uid).set({ uid: res.user.uid, name: n, phone: p, balance: 0 });
        location.reload();
    } catch(e) { alert("هەڵە هەیە"); }
}

async function login() {
    const p=document.getElementById('l-p').value, ps=document.getElementById('l-s').value;
    try { await auth.signInWithEmailAndPassword(p+"@bet.com", ps); location.reload(); } catch(e) { alert("زانیارییەکان هەڵەن"); }
}

auth.onAuthStateChanged(u => {
    if(u) db.collection("users").doc(u.uid).onSnapshot(d => { if(d.exists) document.getElementById('main-balance').innerText = d.data().balance.toLocaleString() + " IQD"; });
    showPage('home');
});
