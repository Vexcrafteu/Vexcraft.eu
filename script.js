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

    // Obsługa Hamburger Menu na urządzeniach mobilnych
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
        
        // Zablokuj przewijanie strony, gdy menu jest otwarte
        if (navLinks.classList.contains('nav-active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        
        // Zmiana ikony z 3 pasków na X
        const icon = hamburger.querySelector('i');
        if(navLinks.classList.contains('nav-active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });

    // Zamknięcie menu po kliknięciu w link
    const navItems = document.querySelectorAll('.nav-links li a');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if(navLinks.classList.contains('nav-active')) {
                navLinks.classList.remove('nav-active');
                document.body.style.overflow = 'auto'; // Odblokuj przewijanie
                const icon = hamburger.querySelector('i');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    });
});

// Zmienne do płatności
window.currentRank = '';
window.currentPrice = '';
let selectedPaymentMethod = '';

// Modal logic
function openModal(rank, price) {
    window.currentRank = rank;
    window.currentPrice = price;
    
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

// Logika modalu płatności
function openPaymentModal(rank, price) {
    // Jeśli modal z korzyściami jest otwarty, zamknij go
    closeModal();
    
    const finalRank = rank || window.currentRank;
    const finalPrice = price || window.currentPrice;

    window.basePrice = parseFloat(finalPrice.replace(' ZŁ', ''));
    window.isKey = finalRank.toLowerCase().includes('klucz');

    document.getElementById('payment-title').innerHTML = "Zakup: <span class='highlight'>" + finalRank + "</span>";
    document.getElementById('payment-price').innerText = finalPrice;
    
    // Obsługa suwaka dla kluczy
    const quantitySelector = document.getElementById('quantity-selector');
    const quantityInput = document.getElementById('key-quantity');
    const quantityVal = document.getElementById('quantity-val');

    if (window.isKey) {
        quantitySelector.style.display = 'block';
        quantityInput.value = 1;
        quantityVal.innerText = 1;
    } else {
        quantitySelector.style.display = 'none';
    }

    // Resetuj pola
    document.getElementById('mc-nick').value = '';
    document.getElementById('user-email').value = '';
    selectedPaymentMethod = '';
    document.querySelectorAll('.payment-method').forEach(el => el.classList.remove('selected'));

    document.getElementById('payment-modal').style.display = 'flex';
}

function updatePrice() {
    const quantity = document.getElementById('key-quantity').value;
    document.getElementById('quantity-val').innerText = quantity;
    
    const totalPrice = (window.basePrice * quantity).toFixed(2);
    document.getElementById('payment-price').innerText = totalPrice + " ZŁ";
}

function closePaymentModal() {
    document.getElementById('payment-modal').style.display = 'none';
}

function selectPayment(element, method) {
    selectedPaymentMethod = method;
    document.querySelectorAll('.payment-method').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
}

function processPayment() {
    const nick = document.getElementById('mc-nick').value.trim();
    if (!nick) {
        alert('Proszę podać swój nick z Minecraft!');
        return;
    }
    if (!selectedPaymentMethod) {
        alert('Proszę wybrać metodę płatności!');
        return;
    }
    
    alert('Przekierowywanie do płatności (' + selectedPaymentMethod.toUpperCase() + ') dla gracza ' + nick + '...');
    // Tutaj w przyszłości można dodać window.location.href do bramki płatności
}

window.onclick = function(event) {
    const benefitsModal = document.getElementById('benefits-modal');
    const paymentModal = document.getElementById('payment-modal');
    if (event.target == benefitsModal) {
        benefitsModal.style.display = "none";
    }
    if (event.target == paymentModal) {
        paymentModal.style.display = "none";
    }
}