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

// 2. Navigation Function
async function showPage(page) {
    const main = document.getElementById('main-content');
    if (!main) return;

    if (page === 'wallet') {
        main.innerHTML = `
            <h2 style="text-align:center; color:gold; margin-top:20px;">ناردنی کۆدی کارت</h2>
            <div class="wallet-grid">
                <div class="pay-card-box bg-asia" onclick="togglePay('f-asia')"><span>AsiaCell</span></div>
                <div class="pay-card-box bg-korek" onclick="togglePay('f-korek')"><span>Korek</span></div>
                <div class="pay-card-box bg-zain" onclick="togglePay('f-zain')"><span>Zain</span></div>
                <div class="pay-card-box bg-zi" onclick="togglePay('f-zi')"><span>ZiCharge</span></div>
            </div>

            <div id="f-asia" class="pay-detail-form">
                <h3>AsiaCell Card</h3>
                <input type="number" id="amt-asia" placeholder="بڕی کارت">
                <input type="text" id="pin-asia" placeholder="کۆدی کارت">
                <button class="main-btn" onclick="sendCard('AsiaCell', 'amt-asia', 'pin-asia')">ناردن بۆ ئادمین</button>
            </div>

            <div id="f-korek" class="pay-detail-form">
                <h3>Korek Card</h3>
                <input type="number" id="amt-korek" placeholder="بڕی کارت">
                <input type="text" id="pin-korek" placeholder="کۆدی کارت">
                <button class="main-btn" onclick="sendCard('Korek', 'amt-korek', 'pin-korek')">ناردن بۆ ئادمین</button>
            </div>

            <div id="f-zain" class="pay-detail-form">
                <h3>Zain Card</h3>
                <input type="number" id="amt-zain" placeholder="بڕی کارت">
                <input type="text" id="pin-zain" placeholder="کۆدی کارت">
                <button class="main-btn" onclick="sendCard('Zain', 'amt-zain', 'pin-zain')">ناردن بۆ ئادمین</button>
            </div>

            <div id="f-zi" class="pay-detail-form">
                <h3>ZiCharge Card</h3>
                <input type="number" id="amt-zi" placeholder="بڕی کارت">
                <input type="text" id="pin-zi" placeholder="کۆدی کارت">
                <button class="main-btn" onclick="sendCard('ZiCharge', 'amt-zi', 'pin-zi')">ناردن بۆ ئادمین</button>
            </div>
        `;
    } else if (page === 'games') {
        main.innerHTML = `
            <div style="text-align:center; padding:20px;">
                <h2 style="color:gold;">کازینۆ (Slot Machine)</h2>
                <div style="font-size:50px; background:rgba(0,0,0,0.5); padding:20px; border-radius:15px; border:2px solid gold; margin:20px 0;">
                    <span id="s1">🍒</span> <span id="s2">🍒</span> <span id="s3">🍒</span>
                </div>
                <input type="number" id="bet-amt" placeholder="بڕی گرەو (نموونە: 1000)" style="width:85%;">
                <button class="main-btn" onclick="playSlots()">بسوڕێنە (Spin)</button>
                <p style="margin-top:15px;">باڵانسی تۆ: <span id="game-bal" style="color:gold;">0</span> IQD</p>
            </div>`;
        updateBalUI();
    } else if (page === 'profile') {
        const user = auth.currentUser;
        if (!user) {
            main.innerHTML = `
                <div class="pay-card" style="margin:20px; padding:20px; background:rgba(255,255,255,0.05); border-radius:15px;">
                    <h2 style="text-align:center;">چوونە ژوورەوە</h2>
                    <input type="text" id="l-id" placeholder="ناو یان مۆبایل">
                    <input type="password" id="l-pass" placeholder="پاسۆرد">
                    <button class="main-btn" onclick="login()">داخڵبوون</button>
                    <p onclick="showPage('reg')" style="color:gold; cursor:pointer; text-align:center; margin-top:15px;">دروستکردنی هەژمار</p>
                </div>`;
        } else {
            const doc = await db.collection("users").doc(user.uid).get();
            const d = doc.data();
            main.innerHTML = `
                <div style="text-align:center; padding:40px;">
                    <h2 style="color:gold;">${d.name}</h2>
                    <p style="margin:10px 0;">باڵانس: ${d.balance} IQD</p>
                    <button class="main-btn" style="background:red;" onclick="auth.signOut().then(()=>location.reload())">چوونە دەرەوە</button>
                </div>`;
        }
    } else if (page === 'reg') {
        main.innerHTML = `
            <div class="pay-card" style="margin:20px; padding:20px; background:rgba(255,255,255,0.05); border-radius:15px;">
                <h2 style="text-align:center;">دروستکردنی هەژمار</h2>
                <input type="text" id="r-n" placeholder="ناوی بەکارهێنەر">
                <input type="number" id="r-p" placeholder="ژمارەی مۆبایل">
                <input type="password" id="r-ps" placeholder="پاسۆرد">
                <button class="main-btn" onclick="register()">تۆمارکردن</button>
            </div>`;
    } else {
        main.innerHTML = `
            <div style="text-align:center; padding:50px 20px;">
                <h1 style="color:gold; font-size:40px;">LordBet</h1>
                <p>بەخێربێیت بۆ جیهانی کازینۆ و گرەو</p>
                <button class="main-btn" style="width:200px; margin-top:30px;" onclick="showPage('games')">دەستپێکردن</button>
            </div>`;
    }
}

// 3. Logic Functions
function togglePay(id) {
    document.querySelectorAll('.pay-detail-form').forEach(f => f.style.display = 'none');
    const target = document.getElementById(id);
    if(target) target.style.display = 'block';
}

async function sendCard(method, amtId, pinId) {
    const amount = document.getElementById(amtId).value;
    const pin = document.getElementById(pinId).value;
    if(!pin || !amount) return alert("بڕ و کۆد بنووسە");
    await db.collection("deposits").add({
        uid: auth.currentUser.uid,
        method: method,
        amount: parseInt(amount),
        pin: pin,
        status: "pending",
        time: new Date()
    });
    alert("کۆدەکە نێردرا بۆ ئادمین");
}

async function playSlots() {
    const user = auth.currentUser;
    if (!user) return alert("سەرەتا لۆگین بکە");
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
        newBal += (bet * 10);
        alert("پیرۆزە! جاکپۆت!");
    } else if (r1 === r2 || r2 === r3 || r1 === r3) {
        newBal += (bet * 2);
        alert("پیرۆزە! بردتەوە");
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
