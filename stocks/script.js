// Segédfüggvény a CSV beolvasásához
async function fetchCSV(url) {
    const response = await fetch(url);
    const text = await response.text();
    return text.split('\n').map(row => row.split(','));
}

async function initDashboard() {
    // 1. Adatok beolvasása (Példa a Dashboard CSV-ből)
    // A valóságban ide a GitHub repód elérési útját írd: 'data/IBKR Portfolio - Dashboard.csv'
    const dashboardData = await fetchCSV('data/history.csv');

    // Példa: Az értékek kinyerése a snippet alapján (Account Value a 2. sorban van)
    // Megjegyzés: A CSV formátumtól függően az indexeket finomhangolni kell!
    const accountValue = dashboardData[1][1].replace(/"/g, ''); 
    const unrealizedGains = dashboardData[5][1].replace(/"/g, '');
    const dividendIncome = dashboardData[13][1].replace(/"/g, '');

    // UI frissítése
    document.getElementById('total-value').innerText = accountValue;
    document.getElementById('total-pnl').innerText = unrealizedGains;
    document.getElementById('total-dividend').innerText = dividendIncome;

    // 2. Grafikonok kirajzolása (Chart.js)
    setupCharts();
}

function setupCharts() {
    // Portfólió megoszlás - Kördiagram
    const ctx1 = document.getElementById('allocationChart').getContext('2d');
    new Chart(ctx1, {
        type: 'doughnut',
        data: {
            labels: ['BAC', 'MAIN', 'VZ', 'UGI', 'Egyéb'],
            datasets: [{
                data: [221, 310, 426, 414, 150], // Ide jönnek majd a kiszámolt értékek
                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
                borderWidth: 0
            }]
        },
        options: { plugins: { legend: { position: 'bottom', labels: { color: 'white' } } } }
    });
}

initDashboard();
