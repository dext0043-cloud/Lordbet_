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

function toggleMenu() {
    const menu = document.getElementById('side-menu');
    menu.style.right = (menu.style.right === '0px') ? '-280px' : '0px';
}

async function showPage(page) {
    const main = document.getElementById('main-content');
    if(document.getElementById('side-menu').style.right === '0px') toggleMenu();

    if (page === 'sports') {
        main.innerHTML = `
            <h2 style="text-align:center; color:gold; margin-top:20px;">گرەوی وەرزشی</h2>
            <div class="match-card">
                <p style="text-align:center;">Real Madrid vs Barcelona</p>
                <div class="odds-row">
                    <button onclick="placeBet('Real Madrid', 1.85)">1 (1.85)</button>
                    <button onclick="placeBet('Draw', 3.40)">X (3.40)</button>
                    <button onclick="placeBet('Barcelona', 2.10)">2 (2.10)</button>
                </div>
            </div>
            <iframe src="https://www.scorebat.com/embed/livescore/" width="100%" height="500" style="border:none; margin-top:10px;"></iframe>`;
    } 
    else if (page === 'games') {
        main.innerHTML = `
            <div style="text-align:center; padding:20px;">
                <h2 style="color:gold;">Slot Machine</h2>
                <div style="font-size:50px; background:#111; padding:20px; border-radius:15px; border:2px solid gold; margin:20px 0;">
                    <span id="s1">🎰</span> <span id="s2">🎰</span> <span id="s3">🎰</span>
                </div>
                <input type="number" id="bet-amt" placeholder="بڕی گرەو">
                <button class="main-btn" onclick="playSlots()">Spin</button>
            </div>`;
    }
    else if (page === 'wallet' || page === 'withdraw') {
        const isDep = page === 'wallet';
        main.innerHTML = `
            <h2 style="text-align:center; color:gold; margin-top:20px;">${isDep ? 'بارکردن' : 'کێشانەوە'}</h2>
            <div class="wallet-grid">
                <div class="pay-box" onclick="openPay('Asiacell', '${page}')"><img src="https://i.ibb.co/L8r3rXp/asia.png"><br>Asiacell</div>
                <div class="pay-box" onclick="openPay('FastPay', '${page}')"><img src="https://i.ibb.co/7R8mX7z/zicharge.png"><br>FastPay/Other</div>
            </div>
            <div id="p-area" class="pay-form" style="display:none;">
                <h3 id="p-method"></h3>
                <input type="number" id="p-amt" placeholder="بڕی پارە">
                <input type="text" id="p-pin" placeholder="${isDep ? 'کۆدی کارت' : 'ژمارەی وەرگرتن'}">
                <button class="main-btn" onclick="sendTrans('${page}')">ناردن</button>
            </div>`;
    }
    else if (page === 'register') {
        main.innerHTML = `<div class="pay-form" style="display:block;"><h2>تۆمارکردن</h2><input type="text" id="r-n" placeholder="ناو"><input type="number" id="r-p" placeholder="مۆبایل"><input type="password" id="r-ps" placeholder="پاسۆرد"><button class="main-btn" onclick="register()">دروستکردن</button></div>`;
    }
    else if (page === 'profile') {
        const user = auth.currentUser;
        if(!user) {
            main.innerHTML = `<div class="pay-form" style="display:block;"><h2>چوونە ژوورەوە</h2><input type="text" id="l-id" placeholder="ناو یان مۆبایل"><input type="password" id="l-ps" placeholder="پاسۆرد"><button class="main-btn" onclick="login()">داخڵبوون</button></div>`;
        } else {
            const doc = await db.collection("users").doc(user.uid).get();
            main.innerHTML = `<div style="text-align:center; padding:50px;"><h2>بەخێربێیت ${doc.data().name}</h2><button class="main-btn" style="background:red;" onclick="auth.signOut().then(()=>location.reload())">چوونە دەرەوە</button></div>`;
        }
    }
    else {
        main.innerHTML = `<div style="text-align:center; padding:100px 20px;"><h1 style="color:gold;">LORDBET</h1><p>خێراترین و باوەڕپێکراوترین پلاتفۆرم</p><button class="main-btn" style="width:150px;" onclick="showPage('sports')">دەستپێبکە</button></div>`;
    }
}

// Functions (Logic)
function openPay(m, type) { document.getElementById('p-area').style.display='block'; document.getElementById('p-method').innerText=m; }

async function sendTrans(type) {
    const amt = document.getElementById('p-amt').value;
    const pin = document.getElementById('p-pin').value;
    const method = document.getElementById('p-method').innerText;
    if(!amt || !pin) return alert("هەموو خانەکان پڕ بکەرەوە");
    await db.collection(type === 'wallet' ? "deposits" : "withdraws").add({ uid: auth.currentUser.uid, method, amount: parseInt(amt), pin, status: "pending", time: new Date() });
    alert("نێردرا بۆ ئادمین");
}

async function placeBet(team, rate) {
    const amt = prompt("بڕی گرەو (IQD):", "1000");
    if(!amt || amt < 1000) return;
    const userRef = db.collection("users").doc(auth.currentUser.uid);
    const doc = await userRef.get();
    if(doc.data().balance < amt) return alert("باڵانست بەس نییە");
    await db.collection("bets").add({ uid: auth.currentUser.uid, team, rate, amount: parseInt(amt), status: "pending", time: new Date() });
    await userRef.update({ balance: doc.data().balance - parseInt(amt) });
    alert("گرەوەکە کرا!");
}

async function register() {
    const n = document.getElementById('r-n').value, p = document.getElementById('r-p').value, ps = document.getElementById('r-ps').value;
    try {
        const res = await auth.createUserWithEmailAndPassword(p + "@bet.com", ps);
        await db.collection("users").doc(res.user.uid).set({ uid: res.user.uid, name: n, phone: p, balance: 0 });
        location.reload();
    } catch (e) { alert(e.message); }
}

async function login() {
    const id = document.getElementById('l-id').value, ps = document.getElementById('l-ps').value;
    try {
        let q = await db.collection("users").where("name", "==", id).get();
        if (q.empty) q = await db.collection("users").where("phone", "==", id).get();
        if (!q.empty) {
            await auth.signInWithEmailAndPassword(q.docs[0].data().phone + "@bet.com", ps);
            location.reload();
        } else alert("نەدۆزرایەوە");
    } catch (e) { alert("هەڵەیە"); }
}

auth.onAuthStateChanged(user => {
    if (user) {
        db.collection("users").doc(user.uid).onSnapshot(doc => {
            if (doc.exists) document.getElementById('main-balance').innerText = doc.data().balance + " IQD";
        });
    }
    showPage('home');
});
