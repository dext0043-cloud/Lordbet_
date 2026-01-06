const firebaseConfig = {
  apiKey: "AIzaSyAhQHJrxhrIbiLfqsrBSTX92iVJauhVNLo",
  authDomain: "lordbet-9e8fa.firebaseapp.com",
  projectId: "lordbet-9e8fa",
  storageBucket: "lordbet-9e8fa.firebasestorage.app",
  messagingSenderId: "570613318832",
  appId: "1:570613318832:web:b33d92c46f19edce356775",
  measurementId: "G-VSKR79Y02H"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// پاراستنی پەیجەکان: ئەگەر لۆگین نەبوو، بگەڕێتەوە بۆ لۆگین
if(!window.location.href.includes('login.html')) {
    auth.onAuthStateChanged(user => {
        if (!user) window.location.href = "login.html";
    });
}

async function handleLogin() {
    const user = document.getElementById('user').value;
    const pass = document.getElementById('pass').value;
    if(!user || !pass) return alert("خانەکان پڕبکەرەوە");
    const email = user + "@bet.com";
    try {
        await auth.signInWithEmailAndPassword(email, pass);
        window.location.href = "index.html";
    } catch (e) {
        try {
            const res = await auth.createUserWithEmailAndPassword(email, pass);
            await db.collection("users").doc(res.user.uid).set({ balance: 5000 });
            window.location.href = "index.html";
        } catch (err) { alert("هەڵە: " + err.message); }
    }
}

auth.onAuthStateChanged(user => {
    if (user) {
        db.collection("users").doc(user.uid).onSnapshot(doc => {
            if(doc.exists) document.getElementById('main-balance').innerText = doc.data().balance.toLocaleString() + " IQD";
        });
    }
});

async function bet(match, odd) {
    const amount = prompt(match + " (@"+odd+")\nبڕی گرەو:");
    if(amount >= 1000) {
        await db.collection("tickets").add({
            uid: auth.currentUser.uid,
            match: match,
            odd: odd,
            amount: amount,
            status: "pending"
        });
        alert("تۆمارکرا!");
    }
}

const games = [
    {h:"Real Madrid", a:"Barcelona", o:[2.1, 3.4, 2.9]},
    {h:"Arsenal", a:"Man City", o:[3.2, 3.6, 2.1]}
];

function loadGames() {
    const cont = document.getElementById('dynamic-content');
    if(!cont) return;
    games.forEach(g => {
        cont.innerHTML += `<div class="match-card">
            <div class="match-body"><b>${g.h}</b> vs <b>${g.a}</b></div>
            <div class="odds-grid">
                <div class="odd-box" onclick="bet('${g.h}',${g.o[0]})"><span class="val">${g.o[0]}</span></div>
                <div class="odd-box" onclick="bet('Draw',${g.o[1]})"><span class="val">${g.o[1]}</span></div>
                <div class="odd-box" onclick="bet('${g.a}',${g.o[2]})"><span class="val">${g.o[2]}</span></div>
            </div>
        </div>`;
    });
}
document.addEventListener('DOMContentLoaded', loadGames);
