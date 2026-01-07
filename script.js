// لێرەدا کۆنفیگی فایربەیسەکەی خۆت دابنێوە (هەمان کۆدەکەی پێشوو)
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
    const s = document.getElementById('side-menu');
    s.style.right = s.style.right === '0px' ? '-280px' : '0px';
}

async function showPage(p) {
    const main = document.getElementById('main-content');
    if(document.getElementById('side-menu').style.right === '0px') toggleMenu();

    if (p === 'deposit' || p === 'withdraw') {
        const isDep = p === 'deposit';
        main.innerHTML = `
            <h2>${isDep ? 'بارکردنی باڵانس' : 'کێشانەوە'}</h2>
            <div class="method-grid">
                <div class="card" onclick="openForm('Asiacell', '${p}')"><img src="https://i.ibb.co/L8r3rXp/asia.png"><br>Asiacell</div>
                <div class="card" onclick="openForm('Korek', '${p}')"><img src="https://i.ibb.co/0V8V2M1/korek.png"><br>Korek</div>
                <div class="card" onclick="openForm('ZainCash', '${p}')"><img src="https://i.ibb.co/mH0Q0Y4/zain.png"><br>Zain Cash</div>
                <div class="card" onclick="openForm('ZiCharge', '${p}')"><img src="https://i.ibb.co/7R8mX7z/zicharge.png"><br>ZiCharge</div>
            </div>
            <div id="form-area" style="display:none; margin-top:20px; background:#111; padding:20px; border-radius:15px; border:1px solid gold;">
                <h3 id="form-title" style="color:gold;"></h3>
                <input type="number" id="f-amt" placeholder="بڕی پارە (5,000 - 1,000,000)">
                <input type="text" id="f-pin" placeholder="${isDep ? 'کۆدی کارت' : 'ژمارەی مۆبایل'}">
                <button class="btn" onclick="submitForm('${p}')">ناردن بۆ ئادمین</button>
            </div>`;
    } 
    else if (p === 'sports') {
        main.innerHTML = `
            <h2 style="color:gold;">گرەوی وەرزشی</h2>
            <div style="background:#1a1a1a; padding:15px; border-radius:15px; margin-top:15px; border:1px solid #333;">
                <p>Real Madrid vs Barcelona</p>
                <div style="display:flex; justify-content:space-around; margin-top:10px;">
                    <button class="btn" style="width:30%;" onclick="makeBet('R.Madrid', 1.80)">1 (1.80)</button>
                    <button class="btn" style="width:30%; background:#333; color:white;" onclick="makeBet('Draw', 3.50)">X (3.50)</button>
                    <button class="btn" style="width:30%;" onclick="makeBet('Barca', 2.10)">2 (2.10)</button>
                </div>
            </div>
            <iframe src="https://www.scorebat.com/embed/livescore/" width="100%" height="450" style="border:none; border-radius:15px; margin-top:20px;"></iframe>`;
    }
    else if (p === 'profile') {
        const user = auth.currentUser;
        if(!user) {
            main.innerHTML = `<h2>Login</h2><input id="l-ph" placeholder="مۆبایل"><input type="password" id="l-ps" placeholder="پاسۆرد"><button class="btn" onclick="login()">چوونە ژوورەوە</button><p onclick="showPage('reg')" style="margin-top:15px; color:gold;">دروستکردنی هەژمار</p>`;
        } else {
            const d = (await db.collection("users").doc(user.uid).get()).data();
            main.innerHTML = `<h2>بەخێربێیت ${d.name}</h2><p style="margin:20px 0;">باڵانس: ${d.balance} IQD</p><button class="btn" style="background:red;" onclick="auth.signOut().then(()=>location.reload())">Logout</button>`;
        }
    }
    else if (p === 'reg') {
        main.innerHTML = `<h2>تۆمارکردن</h2><input id="r-n" placeholder="ناو"><input id="r-p" placeholder="مۆبایل"><input type="password" id="r-ps" placeholder="پاسۆرد"><button class="btn" onclick="register()">تۆمارکردن</button>`;
    }
    else {
        main.innerHTML = `<h1 style="color:gold; margin-top:50px; font-size:40px;">LORDBET</h1><p>خێراترین و پڕۆفیشناڵترین سیستەم</p>`;
    }
}

let activeMethod = "";
function openForm(m, p) {
    activeMethod = m;
    document.getElementById('form-area').style.display = 'block';
    document.getElementById('form-title').innerText = m;
    window.scrollTo(0, document.body.scrollHeight);
}

async function submitForm(type) {
    const amt = parseInt(document.getElementById('f-amt').value);
    const pin = document.getElementById('f-pin').value;
    if(amt < 5000 || amt > 1000000) return alert("بڕەکە دەبێت لە نێوان ٥ هەزار بۆ ١ ملیۆن بێت");
    await db.collection(type === 'deposit' ? "deposits" : "withdraws").add({ uid: auth.currentUser.uid, method: activeMethod, amount: amt, pin, status: "pending", time: new Date() });
    alert("داواکارییەکەت نێردرا بۆ ئادمین");
    showPage('home');
}

async function makeBet(team, rate) {
    const amt = prompt("بڕی گرەو (IQD):", "1000");
    if(!amt || amt < 1000) return;
    const ref = db.collection("users").doc(auth.currentUser.uid);
    const d = (await ref.get()).data();
    if(d.balance < amt) return alert("باڵانس بەس نییە");
    const tid = "LB-" + Math.floor(Math.random()*900000);
    await db.collection("bets").add({ uid: auth.currentUser.uid, tid, team, rate, amount: parseInt(amt), status: "pending", time: new Date() });
    await ref.update({ balance: d.balance - parseInt(amt) });
    alert("پسوولە دروستکرا: " + tid);
}

// Login/Register Functions
async function register() {
    const n=document.getElementById('r-n').value, p=document.getElementById('r-p').value, ps=document.getElementById('r-ps').value;
    try {
        const res = await auth.createUserWithEmailAndPassword(p+"@bet.com", ps);
        await db.collection("users").doc(res.user.uid).set({ uid: res.user.uid, name: n, phone: p, balance: 0 });
        location.reload();
    } catch(e) { alert(e.message); }
}

async function login() {
    const p=document.getElementById('l-ph').value, ps=document.getElementById('l-ps').value;
    try {
        await auth.signInWithEmailAndPassword(p+"@bet.com", ps);
        location.reload();
    } catch(e) { alert("زانیارییەکان هەڵەن"); }
}

auth.onAuthStateChanged(u => {
    if(u) db.collection("users").doc(u.uid).onSnapshot(d => { if(d.exists) document.getElementById('main-balance').innerText = d.data().balance.toLocaleString() + " IQD"; });
    showPage('home');
});
