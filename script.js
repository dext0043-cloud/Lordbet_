// 1. Firebase Configuration
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
    const menu = document.getElementById('side-menu');
    menu.style.right = (menu.style.right === '0px') ? '-280px' : '0px';
}

// 3. Main Navigation System
async function showPage(page) {
    const main = document.getElementById('main-content');
    if(document.getElementById('side-menu').style.right === '0px') toggleMenu();

    if (page === 'wallet' || page === 'withdraw') {
        const isDep = page === 'wallet';
        main.innerHTML = `
            <div class="page-header">
                <h2>${isDep ? 'بارکردنی باڵانس' : 'کێشانەوەی پارە'}</h2>
                <p style="font-size:12px; color:gold;">(کەمترین: 5,000 | زۆرترین: 1,000,000 IQD)</p>
            </div>
            <div class="wallet-grid">
                <div class="pay-box" onclick="openPay('Asiacell', '${page}')">
                    <img src="https://i.ibb.co/L8r3rXp/asia.png">
                    <span>Asiacell</span>
                </div>
                <div class="pay-box" onclick="openPay('Korek', '${page}')">
                    <img src="https://i.ibb.co/0V8V2M1/korek.png">
                    <span>Korek</span>
                </div>
                <div class="pay-box" onclick="openPay('ZainCash', '${page}')">
                    <img src="https://i.ibb.co/mH0Q0Y4/zain.png">
                    <span>Zain Cash</span>
                </div>
                <div class="pay-box" onclick="openPay('ZiCharge', '${page}')">
                    <img src="https://i.ibb.co/7R8mX7z/zicharge.png">
                    <span>ZiCharge</span>
                </div>
            </div>
            <div id="p-area" class="pay-form-overlay" style="display:none;">
                <div class="pay-modal">
                    <h3 id="p-method-title"></h3>
                    <input type="number" id="p-amt" placeholder="بڕی پارە (IQD)">
                    <input type="text" id="p-pin" placeholder="${isDep ? 'کۆدی کارت' : 'ژمارەی وەرگرتن'}">
                    <button class="main-btn" onclick="processTransaction('${page}')">ناردنی داواکاری</button>
                    <button class="main-btn" style="background:#444;" onclick="document.getElementById('p-area').style.display='none'">پاشگەزبوونەوە</button>
                </div>
            </div>`;
    } 
    else if (page === 'sports') {
        main.innerHTML = `
            <div class="sports-section">
                <h2 style="text-align:center; color:gold; margin:15px;">گرەوی وەرزشی</h2>
                <div class="match-card">
                    <div class="match-teams">Real Madrid <span>vs</span> Barcelona</div>
                    <div class="odds-grid">
                        <button onclick="placeBet('Real Madrid vs Barca', 'Real Madrid', 1.85)">1<br>1.85</button>
                        <button onclick="placeBet('Real Madrid vs Barca', 'Draw', 3.40)">X<br>3.40</button>
                        <button onclick="placeBet('Real Madrid vs Barca', 'Barcelona', 2.10)">2<br>2.10</button>
                    </div>
                </div>
                <div class="match-card">
                    <div class="match-teams">Arsenal <span>vs</span> Liverpool</div>
                    <div class="odds-grid">
                        <button onclick="placeBet('Arsenal vs Liverpool', 'Arsenal', 2.05)">1<br>2.05</button>
                        <button onclick="placeBet('Arsenal vs Liverpool', 'Draw', 3.10)">X<br>3.10</button>
                        <button onclick="placeBet('Arsenal vs Liverpool', 'Liverpool', 2.40)">2<br>2.40</button>
                    </div>
                </div>
                <iframe src="https://www.scorebat.com/embed/livescore/" width="100%" height="400" style="border:none; border-radius:15px; margin-top:15px;"></iframe>
            </div>`;
    }
    else if (page === 'register') {
        main.innerHTML = `
            <div class="pay-card" style="margin:20px; padding:20px; background:rgba(255,255,255,0.05); border-radius:15px;">
                <h2 style="text-align:center; color:gold;">تۆمارکردنی نوێ</h2>
                <input type="text" id="r-n" placeholder="ناوی تەواو">
                <input type="number" id="r-p" placeholder="ژمارەی مۆبایل">
                <input type="password" id="r-ps" placeholder="پاسۆرد">
                <button class="main-btn" onclick="registerUser()">دروستکردنی هەژمار</button>
            </div>`;
    }
    else {
        main.innerHTML = `<div style="text-align:center; padding:100px 20px;"><h1 style="color:gold; font-size:45px;">LORDBET</h1><p>خێراترین پلاتفۆرمی گرەوی وەرزشی</p></div>`;
    }
}

// 4. Betting & Transactions Logic
function openPay(method, type) {
    document.getElementById('p-area').style.display = 'flex';
    document.getElementById('p-method-title').innerText = method;
}

async function processTransaction(type) {
    const amt = parseInt(document.getElementById('p-amt').value);
    const pin = document.getElementById('p-pin').value;
    const method = document.getElementById('p-method-title').innerText;

    if (amt < 5000 || amt > 1000000) return alert("بڕی پارە دەبێت لە نێوان 5,000 بۆ 1,000,000 بێت");
    if (!pin) return alert("تکایە زانیارییەکان تەواو بکە");

    await db.collection(type === 'wallet' ? "deposits" : "withdraws").add({
        uid: auth.currentUser.uid,
        method, amount: amt, pin, status: "pending", time: new Date()
    });
    alert("داواکارییەکەت نێردرا، پاش کەمێکی تر چالاک دەبێت");
    document.getElementById('p-area').style.display = 'none';
}

async function placeBet(match, pick, rate) {
    const user = auth.currentUser;
    if (!user) return alert("تکایە سەرەتا لۆگین بکە");

    const amount = prompt(`${match}\nهەڵبژاردن: ${pick} (${rate})\n\nبڕی گرەو بنووسە:`, "1000");
    if (!amount || amount < 1000) return alert("کەمترین گرەو 1,000 دینارە");

    const userRef = db.collection("users").doc(user.uid);
    const doc = await userRef.get();
    
    if (doc.data().balance < amount) return alert("باڵانست بەس نییە");

    const ticketID = "LB-" + Math.floor(Math.random() * 900000 + 100000); // دروستکردنی کۆدی پسوولە

    await db.collection("bets").add({
        uid: user.uid,
        ticketID: ticketID,
        match: match,
        pick: pick,
        rate: rate,
        amount: parseInt(amount),
        status: "pending",
        time: new Date()
    });

    await userRef.update({ balance: doc.data().balance - parseInt(amount) });
    alert(`گرەو بەسەرکەوتوویی کرا!\nکۆدی پسوولە: ${ticketID}`);
}

async function registerUser() {
    const n = document.getElementById('r-n').value, p = document.getElementById('r-p').value, ps = document.getElementById('r-ps').value;
    if(!n || !p || ps.length < 6) return alert("تکایە زانیارییەکان ڕاست بنووسە");
    try {
        const res = await auth.createUserWithEmailAndPassword(p + "@bet.com", ps);
        await db.collection("users").doc(res.user.uid).set({ uid: res.user.uid, name: n, phone: p, balance: 0 });
        location.reload();
    } catch (e) { alert("هەڵەیەک ڕوویدا یان ژمارەکە پێشتر هەیە"); }
}

auth.onAuthStateChanged(user => {
    if (user) {
        db.collection("users").doc(user.uid).onSnapshot(doc => {
            if (doc.exists) document.getElementById('main-balance').innerText = doc.data().balance.toLocaleString() + " IQD";
        });
    }
    showPage('home');
});
