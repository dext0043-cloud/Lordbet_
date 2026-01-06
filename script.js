// لێرە Firebase Config-ەکەی خۆت دابنێوە وەک ئەوەی پێشوو

// سیستەمی زمان (کوردی، عەرەبی، ئینگلیزی)
const langData = {
    ku: { welcome: "بەخێربێیت", deposit: "بارکردن", withdraw: "ڕاکێشان", history: "گرەوەکانم" },
    ar: { welcome: "أهلاً بك", deposit: "إيداع", withdraw: "سحب", history: "رهاناتي" },
    en: { welcome: "Welcome", deposit: "Deposit", withdraw: "Withdraw", history: "My Bets" }
};

function setLanguage(lang) {
    localStorage.setItem('prefLang', lang);
    location.reload(); // بۆ ئەوەی زمانەکە جێگیر بێت
}

// ناردنی وەسڵی پارە
async function sendDeposit(method) {
    const amount = document.querySelector(`#fp-amount`).value;
    const pin = document.querySelector(`#fp-pin`).value;

    if(!amount || !pin) return alert("تکایە خانەکان پڕبکەرەوە");
    if(amount < 1000 || amount > 1000000) return alert("بڕی پارە دەبێت لە نێوان ١٠٠٠ بۆ ١ ملیۆن بێت");

    try {
        await db.collection("deposits").add({
            userId: auth.currentUser.uid,
            method: method,
            amount: parseInt(amount),
            pin: pin,
            status: "pending",
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        alert("داواکارییەکەت نێردرا بۆ ئادمین. تکایە چاوەڕوان بە.");
    } catch (error) {
        alert("هەڵەیەک ڕوویدا: " + error.message);
    }
}

// لۆگینی پێشکەوتوو (یوزەرنێم یان مۆبایل)
async function advancedLogin(userKey, password) {
    // فایربەیس تەنها ئیمەیڵ دەناسێت، بۆیە ئێمە دەیکەین بە ئیمەیڵ
    const email = userKey.includes('@') ? userKey : userKey + "@lordbet.com";
    return auth.signInWithEmailAndPassword(email, password);
}
