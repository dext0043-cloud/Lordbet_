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
    toggleMenu(); 

    if (page === 'wallet' || page === 'withdraw') {
        const title = page === 'wallet' ? "بارکردنی باڵانس (کۆدی کارت)" : "کێشانەوەی پارە";
        const btnText = page === 'wallet' ? "ناردنی کۆد" : "داواکردنی ڕاکێشان";
        
        main.innerHTML = `
            <h2 style="text-align:center; margin-top:20px; color:gold;">${title}</h2>
            <div class="wallet-grid">
                <div class="pay-box" onclick="togglePay('f-asia')"><img src="https://i.ibb.co/L8r3rXp/asia.png"><br>Asiacell</div>
                <div class="pay-box" onclick="togglePay('f-korek')"><img src="https://i.ibb.co/0V8V2M1/korek.png"><br>Korek</div>
                <div class="pay-box" onclick="togglePay('f-zain')"><img src="https://i.ibb.co/mH0Q0Y4/zain.png"><br>Zain</div>
                <div class="pay-box" onclick="togglePay('f-fast')"><img src="https://i.ibb.co/7R8mX7z/zicharge.png"><br>ZiCharge</div>
            </div>
            <div id="f-asia" class="pay-form">
                <input type="number" id="amt" placeholder="بڕی پارە">
                <input type="text" id="pin" placeholder="${page === 'wallet' ? 'کۆدی کارت' : 'ژمارەی مۆبایلت'}">
                <button class="main-btn" onclick="handleTransaction('${page}', 'Asiacell')">${btnText}</button>
            </div>
        `;
    } 
    else if (page === 'sports') {
        main.innerHTML = `<iframe src="https://www.scorebat.com/embed/livescore/" width="100%" height="700" style="border:none;"></iframe>`;
    }
    else if (page === 'profile') {
        const user = auth.currentUser;
        if(!user) {
            main.innerHTML = `<div class="pay-form" style="display:block;"><h2>Login</h2><input type="text" id="l-id" placeholder="ناو"><input type="password" id="l-ps" placeholder="Password"><button class="main-btn" onclick="login()">Login</button></div>`;
        } else {
            const doc = await db.collection("users").doc(user.uid).get();
            main.innerHTML = `<div style="text-align:center; padding:50px;"><h2>${doc.data().name}</h2><button class="main-btn" onclick="auth.signOut().then(()=>location.reload())">Logout</button></div>`;
        }
    }
    else {
        main.innerHTML = `<div style="text-align:center; padding:100px 20px;"><h1 style="color:gold;">LORDBET</h1><p>گەورەترین پلاتفۆرمی گرەو لە عێراق</p></div>`;
    }
}

function togglePay(id) {
    document.querySelectorAll('.pay-form').forEach(f => f.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

async function handleTransaction(type, method) {
    const amt = document.getElementById('amt').value;
    const pin = document.getElementById('pin').value;
    const collection = type === 'wallet' ? "deposits" : "withdraws";
    
    await db.collection(collection).add({
        uid: auth.currentUser.uid,
        method: method,
        amount: parseInt(amt),
        pin: pin,
        status: "pending",
        time: new Date()
    });
    alert("داواکارییەکە نێردرا بۆ ئادمین");
}

async function login() {
    const id = document.getElementById('l-id').value;
    const ps = document.getElementById('l-ps').value;
    // لێرەدا هەمان کۆدی لۆگینەکەی پێشوو دابنێوە بۆ گەڕان بەپێی ناو...
}

auth.onAuthStateChanged(user => {
    if (user) {
        db.collection("users").doc(user.uid).onSnapshot(doc => {
            if (doc.exists) document.getElementById('main-balance').innerText = doc.data().balance + " IQD";
        });
    }
    showPage('home');
});
