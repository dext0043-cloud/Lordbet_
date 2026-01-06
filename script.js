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

// 2. Navigation Function (گۆڕینی لاپەڕەکان)
async function showPage(page) {
    const main = document.getElementById('main-content');
    
    if (page === 'profile') {
        const user = auth.currentUser;
        if (!user) {
            main.innerHTML = `
                <div class="pay-card">
                    <h2>چوونە ژوورەوە</h2>
                    <input type="text" id="login-id" placeholder="یوزەرنێم یان ژمارە">
                    <input type="password" id="login-pass" placeholder="پاسۆرد">
                    <button class="main-btn" onclick="login()">داخڵبوون</button>
                    <p onclick="showPage('register')" style="text-align:center; color:gold; cursor:pointer; margin-top:10px;">هەژمارت نییە؟ دروستی بکە</p>
                </div>`;
        } else {
            const doc = await db.collection("users").doc(user.uid).get();
            const data = doc.data();
            main.innerHTML = `
                <div class="profile-container" style="padding:20px; text-align:center;">
                    <i class="fa fa-user-circle" style="font-size:60px; color:gold;"></i>
                    <h2>${data.name}</h2>
                    <div class="info-row"><span>مۆبایل:</span> <b>${data.phone}</b></div>
                    <div class="info-row"><span>باڵانس:</span> <b style="color:gold;">${data.balance} IQD</b></div>
                    <button class="main-btn" style="background:red; margin-top:20px;" onclick="logout()">چوونە دەرەوە</button>
                </div>`;
        }
    } else if (page === 'register') {
        main.innerHTML = `
            <div class="pay-card">
                <h2>تۆمارکردن</h2>
                <input type="text" id="reg-name" placeholder="ناوی بەکارهێنەر">
                <input type="number" id="reg-phone" placeholder="ژمارەی مۆبایل">
                <input type="password" id="reg-pass" placeholder="پاسۆرد">
                <input type="number" id="reg-age" placeholder="تەمەن">
                <button class="main-btn" onclick="register()">دروستکردن</button>
            </div>`;
    } else if (page === 'wallet') {
        main.innerHTML = `
            <div class="pay-card">
                <h3>FastPay / AsiaCell</h3>
                <input type="number" id="amt" placeholder="بڕی پارە">
                <input type="text" id="pin" placeholder="پین یان ترانزاکشن">
                <button class="main-btn" onclick="deposit('FastPay')">ناردن بۆ ئادمین</button>
            </div>`;
    } else {
        main.innerHTML = `<div style="padding:20px;"><h2>سەرەکی</h2><p>یارییەکان لێرە دەردەکەون...</p></div>`;
    }
}

// 3. Authentication Functions (لۆگین و تۆمارکردن)
async function register() {
    const name = document.getElementById('reg-name').value;
    const phone = document.getElementById('reg-phone').value;
    const pass = document.getElementById('reg-pass').value;
    const age = document.getElementById('reg-age').value;

    try {
        const res = await auth.createUserWithEmailAndPassword(phone + "@bet.com", pass);
        await db.collection("users").doc(res.user.uid).set({
            uid: res.user.uid, name, phone, balance: 0, age
        });
        alert("سەرکەوتوو بوو!");
        showPage('profile');
    } catch (e) { alert(e.message); }
}

async function login() {
    const input = document.getElementById('login-id').value;
    const pass = document.getElementById('login-pass').value;

    try {
        let query = await db.collection("users").where("name", "==", input).get();
        if (query.empty) query = await db.collection("users").where("phone", "==", input).get();

        if (!query.empty) {
            const email = query.docs[0].data().phone + "@bet.com";
            await auth.signInWithEmailAndPassword(email, pass);
            location.reload();
        } else { alert("بەکارهێنەر نەدۆزرایەوە"); }
    } catch (e) { alert("زانیارییەکان هەڵەن"); }
}

function logout() {
    auth.signOut().then(() => location.reload());
}

// 4. Real-time Balance Update
auth.onAuthStateChanged(user => {
    if (user) {
        db.collection("users").doc(user.uid).onSnapshot(doc => {
            if (doc.exists) document.getElementById('main-balance').innerText = doc.data().balance + " IQD";
        });
    }
    showPage('home');
});
