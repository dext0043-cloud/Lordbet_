// ١. فایربەیس کۆنفیگ (هەمان کۆدی خۆتە)
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

// ٢. فانکشنی دروستکردنی هەژمار (ئەمە کێشەکەی تۆ چارەسەر دەکات)
async function register() {
    const name = document.getElementById('reg-name').value;
    const phone = document.getElementById('reg-phone').value;
    const pass = document.getElementById('reg-pass').value;
    const age = document.getElementById('reg-age').value;

    if (!name || !phone || !pass || !age) {
        return alert("تکایە هەموو خانەکان پڕبکەرەوە");
    }

    try {
        // دروستکردنی هەژمار لە Authentication
        const res = await auth.createUserWithEmailAndPassword(phone + "@bet.com", pass);
        
        // دروستکردنی زانیاری لە Firestore - ئەمە وادەکات یوزەرەکە لە ئادمین دەرکەوێت
        await db.collection("users").doc(res.user.uid).set({
            uid: res.user.uid,
            name: name,
            phone: phone,
            balance: 0,
            age: age,
            role: "user",
            joinedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        alert("هەژمارەکەت بە سەرکەوتوویی دروست کرا!");
        location.reload(); // لاپەڕەکە نوێ بکەرەوە
    } catch(e) {
        alert("هەڵە لە دروستکردنی هەژمار: " + e.message);
    }
}

// ٣. ناردنی وەسڵی پارە
async function deposit(method) {
    const amount = document.getElementById('amt')?.value || 0;
    const pin = document.getElementById('pin')?.value || document.getElementById('asia-pin')?.value || document.getElementById('zi-pin')?.value;
    
    if(!pin || !amount) return alert("تکایە بڕی پارە و پین بنووسە");
    if(!auth.currentUser) return alert("تکایە سەرەتا بچۆ ناو هەژمارەکەت");

    try {
        await db.collection("deposits").add({
            uid: auth.currentUser.uid,
            method: method,
            amount: parseInt(amount),
            pin: pin,
            status: "pending",
            time: firebase.firestore.FieldValue.serverTimestamp()
        });
        alert("داواکارییەکەت نێردرا بۆ ئادمین");
    } catch(e) {
        alert("هەڵە لە ناردنی داواکاری: " + e.message);
    }
}

// ٤. گۆڕینی پەیجەکان (وەک ئەوەی پێشوو کە هەبوو)
function showPage(page) {
    const main = document.getElementById('main-content');
    // لێرە کۆدی نیشاندانی پەیجەکان وەک خۆی بهێڵەرەوە...
    // (ئەگەر کۆدی showPage لایە، لێرەدا دایبنێوە)
}

// دڵنیابوونەوە لەوەی باڵانس بە لایڤ نوێ دەبێتەوە
auth.onAuthStateChanged(user => {
    if (user) {
        db.collection("users").doc(user.uid).onSnapshot(doc => {
            if (doc.exists) {
                document.getElementById('main-balance').innerText = doc.data().balance + " IQD";
            }
        });
    }
});
