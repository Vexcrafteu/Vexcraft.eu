function copyIP() {
    const ip = "vexcraft.eu";
    navigator.clipboard.writeText(ip).then(() => {
        const hint = document.querySelector('.copy-hint');
        const originalText = hint.innerHTML;
        hint.innerHTML = '<i class="fa-solid fa-check"></i> Skopiowano pomyślnie!';
        hint.style.color = '#22c55e';
        
        setTimeout(() => {
            hint.innerHTML = originalText;
            hint.style.color = '#ccc';
        }, 2000);
    });
}

// Prosty skrypt do pobierania statusu serwera Minecraft
// (Używa darmowego API mcsrvstat.us)
async function fetchPlayerCount() {
    const serverIP = "vexcraft.eu";
    const countElement = document.getElementById("online-count");
    const pulse = document.querySelector('.pulse');
    
    try {
        const response = await fetch(`https://api.mcsrvstat.us/3/${serverIP}`);
        const data = await response.json();

        if (data.online) {
            countElement.innerHTML = `${data.players.online} / ${data.players.max}`;
            pulse.style.backgroundColor = '#22c55e'; // Zielony gdy online
        } else {
            countElement.innerHTML = "Serwer Offline";
            countElement.style.color = '#ef4444'; // Czerwony
            pulse.style.backgroundColor = '#ef4444'; 
            pulse.style.animation = 'none'; // wyłącza pulsowanie
        }
    } catch (error) {
        console.error("Błąd podczas pobierania statusu serwera:", error);
        countElement.innerHTML = "Brak danych";
    }
}

// Uruchomienie funkcji po załadowaniu strony
document.addEventListener("DOMContentLoaded", () => {
    fetchPlayerCount();
    
    // Aktualizowanie graczy co 60 sekund
    setInterval(fetchPlayerCount, 60000);
});

// Modal logic
function openModal(rank, price) {
    const modal = document.getElementById('benefits-modal');
    const title = document.getElementById('modal-title');
    const priceVal = document.getElementById('modal-price-val');
    
    title.innerHTML = "Porównanie Rang - <span class='highlight'>" + rank + "</span>";
    priceVal.innerText = price;
    
    // Optional: Highlight the selected rank's column in the table
    const table = document.querySelector('.benefits-table');
    const headers = table.querySelectorAll('th');
    let targetIndex = -1;
    
    headers.forEach((th, index) => {
        th.classList.remove('highlight');
        if(th.innerText.includes(rank)) {
            th.classList.add('highlight');
            targetIndex = index;
        }
    });
    
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        cells.forEach((td, index) => {
            td.style.color = index === targetIndex ? '#a855f7' : '';
            td.style.fontWeight = index === targetIndex ? 'bold' : 'normal';
        });
    });

    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('benefits-modal');
    modal.style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('benefits-modal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}