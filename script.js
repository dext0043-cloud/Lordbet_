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

// 2. Navigation
async function showPage(page) {
    const main = document.getElementById('main-content');
    if (!main) return;

    if (page === 'wallet') {
        main.innerHTML = `
            <h2 style="text-align:center; color:gold; margin-top:10px;">ناردنی کۆدی کارت</h2>
            <div class="wallet-grid">
                <div class="pay-card-box bg-asia" onclick="togglePay('f-asia')"><span>AsiaCell</span></div>
                <div class="pay-card-box bg-korek" onclick="togglePay('f-korek')"><span>Korek</span></div>
                <div class="pay-card-box bg-zain" onclick="togglePay('f-zain')"><span>Zain</span></div>
                <div class="pay-card-box bg-zi" onclick="togglePay('f-zi')"><span>ZiCharge</span></div>
            </div>
            <div id="f-asia" class="pay-detail-form"><h3>AsiaCell</h3><input type="number" id="amt-asia" placeholder="بڕ"><input type="text" id="pin-asia" placeholder="کۆدی کارت"><button class="main-btn" onclick="sendCard('AsiaCell', 'amt-asia', 'pin-asia')">ناردن</button></div>
            <div id="f-korek" class="pay-detail-form"><h3>Korek</h3><input type="number" id="amt-korek" placeholder="بڕ"><input type="text" id="pin-korek" placeholder="کۆدی کارت"><button class="main-btn" onclick="sendCard('Korek', 'amt-korek', 'pin-korek')">ناردن</button></div>
            <div id="f-zain" class="pay-detail-form"><h3>Zain</h3><input type="number" id="amt-zain" placeholder="بڕ"><input type="text" id="pin-zain" placeholder="کۆد"><button class="main-btn" onclick="sendCard('Zain', 'amt-zain', 'pin-zain')">ناردن</button></div>
            <div id="f-zi" class="pay-detail-form"><h3>ZiCharge</h3><input type="number" id="amt-zi" placeholder="بڕ"><input type="text" id="pin-zi" placeholder="کۆدی کارت"><button class="main-btn" onclick="sendCard('ZiCharge', 'amt-zi', 'pin-zi')">ناردن</button></div>
        `;
    } else if (page === 'games') {
        main.innerHTML = `
            <div style="text-align:center; padding:20px;">
                <h2 style="color:gold;">کازینۆ - Slot Machine</h2>
                <div id="slot-machine" style="font-size:50px; background:#111; padding:20px; border-radius:15px; border:3px gold solid; margin:20px 0;">
                    <span id="s1">🎰</span> <span id="s2">🎰</span> <span id="s3">🎰</span>
                </div>
                <input type="number" id="bet-amt" placeholder="بڕی گرەو (نموونە: 1000)" style="width:80%; margin-bottom:10px;">
                <button class="main-btn" onclick="playSlots()" style="background:gold; color:black;">بسوڕێنە (Spin)</button>
                <p style="margin-top:10px;">باڵانسی تۆ: <span id="game-bal">0</span> IQD</p>
            </div>`;
        updateBalUI();
    } else if (page === 'profile') {
        const user = auth.currentUser;
        if (!user) {
            main.innerHTML = `<div class="pay-card"><h2>Login</h2><input type="text" id="l-id" placeholder="ناو یان مۆبایل"><input type="password" id="l-pass" placeholder="پاسۆرد"><button class="main-btn" onclick="login()">Login</button><p onclick="showPage('reg')" style="color:gold;cursor:pointer;">Registration</p></div>`;
        } else {
            const doc = await db.collection("users").doc(user.uid).get();
            const d = doc.data();
            main.innerHTML = `<div style="text-align:center;padding:20px;"><h2>${d.name}</h2><p>Balance: <b style="color:gold;">${d.balance} IQD</b></p><button class="main-btn" style="background:red;" onclick="auth.signOut().then(()=>location.reload())">Logout</button></div>`;
        }
    } else if (page === 'reg') {
        main.innerHTML = `<div class="pay-card"><h2>Account</h2><input type="text" id="r-n" placeholder="ناو"><input type="number" id="r-p" placeholder="مۆبایل"><input type="password" id="r-ps" placeholder="پاسۆرد"><button class="main-btn" onclick="register()">Create</button></div>`;
    } else {
        main.innerHTML = `<div style="padding:20px; text-align:center;"><h2>بەخێربێیت بۆ LordBet</h2><p>باشترین یارییەکانی کازینۆ و گرەو</p><button class="main-btn" onclick="showPage('games')">بڕۆ بۆ یارییەکان</button></div>`;
    }
}

// 3. Game Logic (Slot Machine)
async function playSlots() {
    const user = auth.currentUser;
    if (!user) return alert("سەرەتا بچۆ ناو هەژمارەکەت");
    
    const bet = parseInt(document.getElementById('bet-amt').value);
    const userRef = db.collection("users").doc(user.uid);
    const doc = await userRef.get();
    const bal = doc.data().balance;

    if (isNaN(bet) || bet < 500) return alert("کەمترین گرەو ٥٠٠ دینارە");
    if (bet > bal) return alert("باڵانست بەشی ئەم گرەوە ناکات");

    const items = ['🍎', '🍒', '🍋', '💎', '🔔'];
    const r1 = items[Math.floor(Math.random() * items.length)];
    const r2 = items[Math.floor(Math.random() * items.length)];
    const r3 = items[Math.floor(Math.random() * items.length)];

    document.getElementById('s1').innerText = r1;
    document.getElementById('s2').innerText = r2;
    document.getElementById('s3').innerText = r3;

    let newBal = bal - bet;
    if (r1 === r2 && r2 === r3) {
        newBal += (bet * 10); // ئەگەر هەر سێ وەک یەک بوون ١٠ ئەوەندە دەباتەوە
        alert("پیرۆزە! جاکپۆت! " + (bet * 10) + " دینارت بردەوە!");
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
        newBal += (bet * 2); // ئەگەر دووان وەک یەک بوون ٢ ئەوەندە
        alert("پیرۆزە! " + (bet * 2) + " دینارت بردەوە");
    }

    await userRef.update({ balance: newBal });
    updateBalUI();
}

function updateBalUI() {
    const user = auth.currentUser;
    if (user) {
        db.collection("users").doc(user.uid).get().then(doc => {
            if (document.getElementById('game-bal')) document.getElementById('game-bal').innerText = doc.data().balance;
            document.getElementById('main-balance').innerText = doc.data().balance + " IQD";
        });
    }
}

// 4. Other Functions (Login/Register/Card)
function togglePay(id) {
    document.querySelectorAll('.pay-detail-form').forEach(f => f.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

async function sendCard(method, amtId, pinId) {
    const amount = document.getElementById(amtId).value;
    const pin = document.getElementById(pinId).value;
    if(!pin || !amount) return alert("بڕ و کۆد بنووسە");
    await db.collection("deposits").add({ uid: auth.currentUser.uid, method, amount: parseInt(amount), pin, status: "pending", time: new Date() });
    alert("کۆد نێردرا بۆ ئادمین");
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
    const id = document.getElementById('l-id').value, ps = document.getElementById('l-pass').value;
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
