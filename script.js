// Firebase Config - ئەو کۆدەی خۆت ناردمت
const firebaseConfig = {
  apiKey: "AIzaSyAhQHJrxhrIbiLfqsrBSTX92iVJauhVNLo",
  authDomain: "lordbet-9e8fa.firebaseapp.com",
  projectId: "lordbet-9e8fa",
  storageBucket: "lordbet-9e8fa.firebasestorage.app",
  messagingSenderId: "570613318832",
  appId: "1:570613318832:web:b33d92c46f19edce356775",
  measurementId: "G-VSKR79Y02H"
};

// دەستپێکردنی سێرڤەر
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// سیستەمی لۆگین
async function handleLogin() {
    const userVal = document.getElementById('user').value;
    const passVal = document.getElementById('pass').value;

    if (!userVal || !passVal) return alert("تکایە خانەکان پڕ بکەرەوە");

    const email = userVal + "@lordbet.com"; // دروستکردنی ئیمەیڵێکی وەک وەهمی

    try {
        // هەوڵدان بۆ چوونە ژوورەوە
        await auth.signInWithEmailAndPassword(email, passVal);
        window.location.href = "index.html";
    } catch (error) {
        // ئەگەر یوزەرەکە نەبوو، بۆی دروست دەکات بۆ یەکەمجار
        try {
            const res = await auth.createUserWithEmailAndPassword(email, passVal);
            await db.collection("users").doc(res.user.uid).set({
                balance: 10000, // دیاری یەکەمجار ١٠ هەزار دینار
                role: "user"
            });
            window.location.href = "index.html";
        } catch (err) {
            alert("هەڵە هەیە: " + err.message);
        }
    }
}

// نیشاندانی باڵانسی ڕاستەقینە لە سێرڤەرەوە
auth.onAuthStateChanged(user => {
    if (user) {
        db.collection("users").doc(user.uid).onSnapshot(doc => {
            if(doc.exists) {
                const balElement = document.getElementById('main-balance');
                if(balElement) balElement.innerText = doc.data().balance.toLocaleString() + " IQD";
            }
        });
    }
});

// ناردنی گرەو بۆ داتابەیس (بۆ ئادمین)
async function bet(pick, odd) {
    const user = auth.currentUser;
    if (!user) return alert("سەرەتا لۆگین بکە");

    const amount = prompt(pick + " (@" + odd + ")\nبڕی گرەو بنووسە:");
    if (amount && amount >= 1000) {
        await db.collection("tickets").add({
            userId: user.uid,
            match: pick,
            odds: odd,
            stake: parseInt(amount),
            status: "pending",
            createdAt: new Date()
        });
        alert("گرەوەکە بە سەرکەوتوویی تۆمارکرا لە سێرڤەر!");
    }
}

// لودکردنی یارییەکان (ئەمەیان وەک دیزاینە)
const games = [
    { id: 1, league: "کوردستان", home: "هەولێر", away: "دهۆک", odds: [1.80, 3.20, 4.10] },
    { id: 2, league: "ئیسپانیا", home: "ڕیاڵ مەدرید", away: "بەرشەلۆنە", odds: [2.05, 3.50, 3.10] }
];

function loadGames() {
    const container = document.getElementById('dynamic-content');
    if(!container) return;
    games.forEach(g => {
        container.innerHTML += `
            <div class="match-card">
                <div class="match-meta"><span>${g.league}</span> <span>LIVE</span></div>
                <div class="match-body"><b>${g.home}</b> <span>VS</span> <b>${g.away}</b></div>
                <div class="odds-grid">
                    <div class="odd-box" onclick="bet('${g.home}', ${g.odds[0]})"><span>1</span><span class="val">${g.odds[0]}</span></div>
                    <div class="odd-box" onclick="bet('Draw', ${g.odds[1]})"><span>X</span><span class="val">${g.odds[1]}</span></div>
                    <div class="odd-box" onclick="bet('${g.away}', ${g.odds[2]})"><span>2</span><span class="val">${g.odds[2]}</span></div>
                </div>
            </div>`;
    });
}
document.addEventListener('DOMContentLoaded', loadGames);
