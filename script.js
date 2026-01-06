// 1. Firebase Setup
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

// 2. Navigation Function (ئەمە هەموو لاپەڕەکان بەیەکەوە دەبەستێت)
async function showPage(page) {
    const main = document.getElementById('main-content');
    
    if (page === 'wallet') {
        main.innerHTML = `
            <div class="wallet-wrapper">
                <h2 style="text-align:center; color:gold;">بارکردنی باڵانس</h2>
                
                <div class="pay-item asia" onclick="togglePay('asia-form')">
                    <span>AsiaCell</span>
                </div>
                <div id="asia-form" class="pay-form">
                    <p class="limit">تێبینی: کەمترین بڕ 10,000 و زۆرترین 1,000,000 دینارە.</p>
                    <input type="number" id="amt-asia" placeholder="بڕی پارە">
                    <input type="text" id="pin-asia" placeholder="پین یان کۆدی کارت">
                    <button class="main-btn" onclick="sendDeposit('AsiaCell', 'amt-asia', 'pin-asia')">ناردن</button>
                </div>

                <div class="pay-item korek" onclick="togglePay('korek-form')">
                    <span>Korek Telecom</span>
                </div>
                <div id="korek-form" class="pay-form">
                    <p class="limit">تێبینی: 10,000 بۆ 1,000,000 دینار.</p>
                    <input type="number" id="amt-korek" placeholder="بڕی پارە">
                    <input type="text" id="pin-korek" placeholder="پین یان کۆدی کارت">
                    <button class="main-btn" onclick="sendDeposit('Korek', 'amt-korek', 'pin-korek')">ناردن</button>
                </div>

                <div class="pay-item zain" onclick="togglePay('zain-form')">
                    <span>Zain Cash</span>
                </div>
                <div id="zain-form" class="pay-form">
                    <input type="number" id="amt-zain" placeholder="بڕی پارە">
                    <input type="text" id="pin-zain" placeholder="پین">
                    <button class="main-btn" onclick="sendDeposit('ZainCash', 'amt-zain', 'pin-zain')">ناردن</button>
                </div>

                <div class="pay-item zicharge" onclick="togglePay('zi-form')">
                    <span>ZiCharge</span>
                </div>
                <div id="zi-form" class="pay-form">
                    <input type="text" id="pin-zi" placeholder="کۆدی کارت بنووسە">
                    <button class="main-btn" onclick="sendDeposit('ZiCharge', null, 'pin-zi')">ناردن</button>
                </div>
            </div>`;
    } 
    else if (page === 'profile') {
        const user = auth.currentUser;
        if (!user) {
            main.innerHTML = `
                <div class="pay-card">
                    <h2>چوونە ژوورەوە</h2>
                    <input type="text" id="login-id" placeholder="یوزەرنێم یان ژمارە">
                    <input type="password" id="login-pass" placeholder="پاسۆرد">
                    <button class="main-btn" onclick="login()">داخڵبوون</button>
                    <p onclick="showPage('register')" style="text-align:center; color:gold; cursor:pointer; margin-top:10px;">دروستکردنی هەژمار</p>
                </div>`;
        } else {
            const doc = await db.collection("users").doc(user.uid).get();
            const data = doc.data();
            main.innerHTML = `
                <div class="profile-container" style="padding:20px; text-align:center;">
                    <h2>بەخێربێیت ${data.name}</h2>
                    <div class="info-row"><span>باڵانس:</span> <b style="color:gold;">${data.balance} IQD</b></div>
                    <button class="main-btn" style="background:red; margin-top:20px;" onclick="auth.signOut().then(()=>location.reload())">چوونە دەرەوە</button>
                </div>`;
        }
    } 
    else if (page === 'register') {
        main.innerHTML = `
            <div class="pay-card">
                <h2>تۆمارکردن</h2>
                <input type="text" id="reg-name" placeholder="ناوی بەکارهێنەر">
                <input type="number" id="reg-phone" placeholder="ژمارەی مۆبایل">
                <input type="password" id="reg-pass" placeholder="پاسۆرد">
                <input type="number" id="reg-age" placeholder="تەمەن">
                <button class="main-btn" onclick="register()">دروستکردن</button>
            </div>`;
    } 
    else {
        main.innerHTML = `<div style="padding:20px;"><h2>سەرەکی</h2><p>یارییەکان بەم زووانە لود دەبن...</p></div>`;
    }
}

// 3. Logic Functions
function togglePay(id) {
    const form = document.getElementById(id);
    document.querySelectorAll('.pay-form').forEach(f => { if(f.id !== id) f.style.display = 'none'; });
    form.style.display = (form.style.display === 'block') ? 'none' : 'block';
}

async function sendDeposit(method, amtId, pinId) {
    const amount = amtId ? document.getElementById(amtId).value : 0;
    const pin = document.getElementById(pinId).value;

    if(!pin) return alert("پین بنووسە");
    if(amtId && (amount < 10000 || amount > 1000000)) return alert("بڕی پارە دەبێت لە نێوان 10,000 بۆ 1,000,000 بێت");

    await db.collection("deposits").add({
        uid: auth.currentUser.uid,
        method: method,
        amount: parseInt(amount),
        pin: pin,
        status: "pending",
        time: new Date()
    });
    alert("نێردرا بۆ ئادمین");
}

async function register() {
    const name = document.getElementById('reg-name').value;
    const phone = document.getElementById('reg-phone').value;
    const pass = document.getElementById('reg-pass').value;
    const age = document.getElementById('reg-age').value;
    try {
        const res = await auth.createUserWithEmailAndPassword(phone + "@bet.com", pass);
        await db.collection("users").doc(res.user.uid).set({ uid: res.user.uid, name, phone, balance: 0, age });
        location.reload();
    } catch (e) { alert(e.message); }
}

async function login() {
    const input = document.getElementById('login-id').value;
    const pass = document.getElementById('login-pass').value;
    try {
        let q = await db.collection("users").where("name", "==", input).get();
        if (q.empty) q = await db.collection("users").where("phone", "==", input).get();
        if (!q.empty) {
            await auth.signInWithEmailAndPassword(q.docs[0].data().phone + "@bet.com", pass);
            location.reload();
        } else alert("نەدۆزرایەوە");
    } catch (e) { alert("هەڵەیە"); }
}

// 4. Initial Load
auth.onAuthStateChanged(user => {
    if (user) {
        db.collection("users").doc(user.uid).onSnapshot(doc => {
            if (doc.exists) document.getElementById('main-balance').innerText = doc.data().balance + " IQD";
        });
    }
    showPage('home');
});
