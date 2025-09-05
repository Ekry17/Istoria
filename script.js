// script.js - protecție cu parolă pentru paginile de testare inițială

document.addEventListener('DOMContentLoaded', function () {
    // Parole pentru fiecare clasă (poți schimba valorile după preferință)
    const parole = {
        'clasa a V-a': 'istorie5',
        'clasa a VI-a': 'istorie6',
        'clasa a VII-a': 'istorie7',
        'clasa a VIII-a': 'istorie8'
    };

    // Detectează dacă există overlay-ul de parolă
    const overlay = document.getElementById('passwordOverlay');
    const form = document.getElementById('passwordForm');
    const input = document.getElementById('passwordInput');
    const error = document.getElementById('passwordError');
    const protectedContent = document.getElementById('protectedContent');

    if (overlay && form && input && protectedContent) {
        // Ascunde mesajul de eroare la început
        error.style.display = 'none';

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            // Determină clasa din placeholder (sau titlu)
            let clasa = 'clasa a V-a';
            if (input.placeholder.includes('VI')) clasa = 'clasa a VI-a';
            if (input.placeholder.includes('VII')) clasa = 'clasa a VII-a';
            if (input.placeholder.includes('VIII')) clasa = 'clasa a VIII-a';
            // Verifică parola
            if (input.value === parole[clasa]) {
                overlay.style.display = 'none';
                protectedContent.style.display = '';
                error.style.display = 'none';
                input.value = '';
            } else {
                error.style.display = 'block';
                input.value = '';
            }
        });
    }
});
