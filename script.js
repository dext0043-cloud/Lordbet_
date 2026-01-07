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
    window.scrollTo(0,0);

    if (p === 'deposit' || p === 'withdraw') {
        const title = p === 'deposit' ? 'بارکردنی باڵانس' : 'کێشانەوەی پارە';
        main.innerHTML = `
            <div style="padding:20px; text-align:center;"><h2>${title}</h2><p style="color:gold;">5,000 - 1,000,000 IQD</p></div>
            <div class="method-grid">
                <div class="method-card" onclick="openInput('Asiacell', '${p}')"><img src="https://i.ibb.co/L8r3rXp/asia.png"><br>Asiacell</div>
                <div class="method-card" onclick="openInput('Korek', '${p}')"><img src="https://i.ibb.co/0V8V2M1/korek.png"><br>Korek</div>
                <div class="method-card" onclick="openInput('Zain', '${p}')"><img src="https://i.ibb.co/mH0Q0Y4/zain.png"><br>Zain Cash</div>
                <div class="method-card" onclick="openInput('ZiCharge', '${p}')"><img src="https://i.ibb.co/7R8mX7z/zicharge.png"><br>ZiCharge</div>
            </div>
            <div id="modal" class="modal"><div class="modal-content">
                <h3 id="m-title" style="color:gold;"></h3>
                <input type="number" id="m-amt" placeholder="بڕی پارە">
                <input type="text" id="m-pin" placeholder="کۆدی کارت یان مۆبایل">
                <button class="btn-gold" onclick="submitRequest('${p}')">ناردن</button>
                <p onclick="closeModal()" style="text-align:center; margin-top:15px; cursor:pointer;">داخستن</p>
            </div></div>`;
    } 
    else if (p === 'sports') {
        main.innerHTML = `<div style="padding:20px;"><h2 style="color:gold; text-align:center;">گرەوی وەرزشی</h2>
            <div style="background:#1a1a1a; padding:15px; border-radius:15px; margin-top:15px;">
                <p style="text-align:center;">Man City vs Arsenal</p>
                <div style="display:flex; justify-content:space-between; margin-top:10px;">
                    <button class="btn-gold" style="width:30%;" onclick="makeBet('Man City', 1.65)">1 (1.65)</button>
                    <button class="btn-gold" style="width:30%; background:#333; color:white;" onclick="makeBet('Draw', 3.40)">X (3.40)</button>
                    <button class="btn-gold" style="width:30%;" onclick="makeBet('Arsenal', 2.90)">2 (2.90)</button>
                </div>
            </div>
            <iframe src="https://www.scorebat.com/embed/livescore/" width="100%" height="500" style="border:none; margin-top:20px;"></iframe></div>`;
    }
    else if (p === 'reg') {
        main.innerHTML = `<div style="padding:40px 20px;"><h2>هەژماری نوێ</h2><input id="un" placeholder="ناو"><input id="ph" placeholder="مۆبایل"><input type="password" id="ps" placeholder="پاسۆرد"><button class="btn-gold" onclick="register()">دروستکردن</button></div>`;
    }
    else if (p === 'profile') {
        const u = auth.currentUser;
        if(!u) main.innerHTML = `<div style="padding:40px 20px;"><h2>چوونە ژوورەوە</h2><input id="li" placeholder="ناو یان مۆبایل"><input type="password" id="lp" placeholder="پاسۆرد"><button class="btn-gold" onclick="login()">داخڵبوون</button></div>`;
        else {
            const d = (await db.collection("users").doc(u.uid).get()).data();
            main.innerHTML = `<div style="text-align:center; padding:50px;"><h2>${d.name}</h2><p>${d.balance} IQD</p><button class="btn-gold" style="background:red; margin-top:20px;" onclick="auth.signOut().then(()=>location.reload())">Logout</button></div>`;
        }
    }
    else { main.innerHTML = `<div style="text-align:center; padding:100px 20px;"><h1 style="color:gold; font-size:40px;">LORDBET</h1><p>خێراترین و پڕۆفیشناڵترین سیستم</p></div>`; }
}

let currentMethod = "";
function openInput(m, p) { currentMethod = m; document.getElementById('m-title').innerText = m; document.getElementById('modal').style.display='flex'; }
function closeModal() { document.getElementById('modal').style.display='none'; }

async function submitRequest(type) {
    const amt = parseInt(document.getElementById('m-amt').value);
    const pin = document.getElementById('m-pin').value;
    if(amt < 5000 || amt > 1000000) return alert("بڕەکە دەبێت لە نێوان ٥ هەزار بۆ ١ ملیۆن بێت");
    await db.collection(type === 'deposit' ? "deposits" : "withdraws").add({ uid: auth.currentUser.uid, method: currentMethod, amount: amt, pin, status: "pending", time: new Date() });
    alert("داواکارییەکەت نێردرا");
    closeModal();
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

async function register() {
    const n=document.getElementById('un').value, p=document.getElementById('ph').value, ps=document.getElementById('ps').value;
    try {
        const res = await auth.createUserWithEmailAndPassword(p+"@bet.com", ps);
        await db.collection("users").doc(res.user.uid).set({ uid: res.user.uid, name: n, phone: p, balance: 0 });
        location.reload();
    } catch(e) { alert(e.message); }
}

async function login() {
    const id=document.getElementById('li').value, ps=document.getElementById('lp').value;
    let q = await db.collection("users").where("name","==",id).get();
    if(q.empty) q = await db.collection("users").where("phone","==",id).get();
    if(!q.empty) { await auth.signInWithEmailAndPassword(q.docs[0].data().phone+"@bet.com", ps); location.reload(); }
    else alert("نەدۆزرایەوە");
}

auth.onAuthStateChanged(u => {
    if(u) db.collection("users").doc(u.uid).onSnapshot(d => { if(d.exists) document.getElementById('main-balance').innerText = d.data().balance.toLocaleString() + " IQD"; });
    showPage('home');
});
