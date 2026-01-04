// داتای یارییەکان
const games = [
    { id: 1, league: "La Liga", home: "Real Madrid", away: "Barcelona", odds: [2.10, 3.40, 2.90] },
    { id: 2, league: "Premier League", home: "Arsenal", away: "Man City", odds: [3.20, 3.60, 2.10] },
    { id: 3, league: "Serie A", home: "Juventus", away: "Inter", odds: [2.50, 3.10, 2.80] }
];

// لودکردنی یارییەکان
function loadGames() {
    const container = document.getElementById('dynamic-content');
    if(!container) return;

    games.forEach(g => {
        container.innerHTML += `
            <div class="match-card">
                <div class="match-meta"><span>${g.league}</span> <span>LIVE</span></div>
                <div class="match-body">
                    <b>${g.home}</b> <span>VS</span> <b>${g.away}</b>
                </div>
                <div class="odds-grid">
                    <div class="odd-box" onclick="bet('${g.home}', ${g.odds[0]})"><span>1</span><span class="val">${g.odds[0]}</span></div>
                    <div class="odd-box" onclick="bet('Draw', ${g.odds[1]})"><span>X</span><span class="val">${g.odds[1]}</span></div>
                    <div class="odd-box" onclick="bet('${g.away}', ${g.odds[2]})"><span>2</span><span class="val">${g.odds[2]}</span></div>
                </div>
            </div>
        `;
    });
}

function bet(pick, odd) {
    const amount = prompt(pick + " (@" + odd + ")\nبڕی گرەو بنووسە:");
    if(amount >= 1000) {
        alert("تکێتەکە نێردرا بۆ ئادمین!");
        // لێرەدا کۆدی تێلیگرامەکە دادەنێین
    }
}

function handleLogin() {
    const user = document.getElementById('user').value;
    const pass = document.getElementById('pass').value;
    if(user === "admin" && pass === "1234") {
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = "index.html";
    } else {
        alert("ناوی بەکارهێنەر یان پاسۆرد هەڵەیە");
    }
}

document.addEventListener('DOMContentLoaded', loadGames);
