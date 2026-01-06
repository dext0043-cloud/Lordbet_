// Firebase Config - دڵنیابە ئەمە ڕێک وەک خۆیەتی
const firebaseConfig = {
  apiKey: "AIzaSyAhQHJrxhrIbiLfqsrBSTX92iVJauhVNLo",
  authDomain: "lordbet-9e8fa.firebaseapp.com",
  projectId: "lordbet-9e8fa",
  storageBucket: "lordbet-9e8fa.firebasestorage.app",
  messagingSenderId: "570613318832",
  appId: "1:570613318832:web:b33d92c46f19edce356775"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// نیشاندانی لاپەڕەکان بەبێ ئەوەی سایتەکە ئیرۆر بدات
function showPage(page) {
    const content = document.getElementById('app-content');
    if (page === 'wallet') {
        content.innerHTML = `
            <div class="wallet-section">
                <h3>بارکردنی باڵانس (FastPay)</h3>
                <p>بنێرە بۆ: 0750 000 0000</p>
                <input type="number" id="dep-amount" placeholder="بڕی پارە">
                <input type="text" id="dep-pin" placeholder="پین">
                <button onclick="sendMoneyRequest()">ناردن</button>
            </div>
        `;
    } else {
        content.innerHTML = `<h2>بەخێربێیت بۆ لۆردبێت</h2><p>یارییەکان لێرە لود دەبن...</p>`;
    }
}

// لودکردنی سەرەتایی
document.addEventListener('DOMContentLoaded', () => {
    showPage('home');
});
