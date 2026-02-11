async function processHistory() {
    const response = await fetch('data/history.csv');
    const text = await response.text();
    
    // Sorokra bontás
    const lines = text.split('\n');
    
    // Az első 3 sort kihagyjuk (0, 1, 2 index), mert azok a fejlécek
    const dataLines = lines.slice(3);

    let totalInvested = 0; // Mennyi pénzt tettél be (Deposit)
    let totalDividends = 0; // Mennyi osztalékot kaptál
    let currentCash = 0;

    dataLines.forEach(line => {
        // A CSV sor felvágása (kezelve az idézőjeleket, ha vannak)
        const columns = line.split(',').map(col => col.replace(/"/g, '').trim());
        
        if (columns.length < 8) return; // Üres sorok kiszűrése

        const action = columns[4]; // Action oszlop (Buy, Deposit, Dividend, stb.)
        
        // Összeg kinyerése és tisztítása: "$1,18" -> 1.18
        let totalStr = columns[7]; // Total oszlop
        if (!totalStr) return;
        
        // Tisztítás: dollárjel ki, szóköz ki, tizedesvessző pontra cserélése
        let amount = parseFloat(totalStr.replace('$', '').replace(/\s/g, '').replace(',', '.'));

        if (isNaN(amount)) return;

        // Logika a típusok szerint
        if (action === "Deposit") {
            totalInvested += amount;
        } else if (action === "Dividend") {
            totalDividends += amount;
        }
        // A "Buy" tranzakciók a készpénzedet csökkentik, de a portfólió értékét nem!
    });

    // Adatok kiírása a weboldalra
    document.getElementById('total-invested').innerText = `$${totalInvested.toFixed(2)}`;
    document.getElementById('total-dividend').innerText = `$${totalDividends.toFixed(2)}`;
}
