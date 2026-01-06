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

// --- هەژمار دروستکردن ---
async function register() {
    const name = document.getElementById('reg-name').value;
    const phone = document.getElementById('reg-phone').value;
    const pass = document.getElementById('reg-pass').value;
    const age = document.getElementById('reg-age').value;

    if (!name || !phone || !pass || !age) return alert("تکایە هەموو خانەکان پڕبکەرەوە");

    try {
        const res = await auth.createUserWithEmailAndPassword(phone + "@bet.com", pass);
        // دروستکردنی فایلی یوزەر لە داتابەیس (ئەمە زۆر گرنگە بۆ ئادمین)
        await db.collection("users").doc(res.user.uid).set({
            uid: res.user.uid,
            name: name,
            phone: phone,
            balance: 0,
            age: age,
            joinedAt: new Date()
        });
        alert("تەواو! هەژمار دروستکرا");
        location.reload();
    } catch(e) { alert("هەڵە: " + e.message); }
}

// --- ناردنی وەسڵی پارە ---
async function deposit(method) {
    const amount = document.getElementById('amt').value;
    const pin = document.getElementById('pin').value;
    if(!amount || !pin) return alert("بڕ و پین بنووسە");

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

// --- نیشاندانی باڵانس بە لایڤ ---
auth.onAuthStateChanged(user => {
    if (user) {
        db.collection("users").doc(user.uid).onSnapshot(doc => {
            if (doc.exists) {
                document.getElementById('main-balance').innerText = doc.data().balance + " IQD";
            }
        });
    }
});
