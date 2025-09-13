# Axa Cronologică JavaScript

O implementare modernă în JavaScript a aplicației timeline interactive.

## Structura Proiectului JavaScript

### Fișiere principale:
- `index.html` - Interfața principală HTML
- `timeline.js` - Logica aplicației JavaScript
- `styles.css` - Stilizarea CSS
- `events.json` - Datele evenimentelor (backup)
- `start_js.bat` / `start_js.ps1` - Scripturi de lansare

## Pornirea Aplicației

### Metoda 1: Server HTTP Local (Recomandat)
```bash
# Cu Python
python -m http.server 8000

# Cu Node.js
npx http-server -p 8000

# Apoi deschide: http://localhost:8000
```

### Metoda 2: Scripturi de lansare
- **Windows**: Dublu-click pe `start_js.bat`
- **PowerShell**: `.\start_js.ps1`

### Metoda 3: Direct în browser
- Dublu-click pe `index.html` (funcționalitatea poate fi limitată)

## Funcționalități

### 🎯 Navigare Timeline
- **Zoom**: Scroll mouse (0.000001x - 100,000x)
- **Pan**: Drag cu mouse
- **Reset**: Buton "Reset la Anul 1" (centrat pe anul 1 CE cu zoom maxim)

### 📝 Gestionare Evenimente
- **Adăugare**: Buton "Adaugă Eveniment" sau click dreapta pe timeline
- **Editare**: Selectează eveniment + buton "Editează" sau dublu-click
- **Ștergere**: Selectează eveniment + buton "Șterge" sau tasta Delete
- **Culori**: 6 opțiuni predefinite pentru categorii

### 💾 Persistența Datelor
- **Auto-salvare**: În localStorage browser
- **Export**: Descarcă automat fișier JSON
- **Import**: Buton "Încarcă" pentru fișiere JSON

### 🎨 Interfață
- **Design modern**: Gradient backgrounds, animații CSS
- **Responsive**: Se adaptează la dimensiunea ferestrei
- **Context menu**: Click dreapta pentru opțiuni rapide
- **Modal dialog**: Interfață intuitivă pentru evenimente

## Avantajele versiunii JavaScript

### ✅ Portabilitate
- Rulează în orice browser modern
- Nu necesită instalare Python
- Cross-platform (Windows, Mac, Linux)

### ✅ Performance
- Rendering rapid cu Canvas HTML5
- Animații fluide CSS
- Responsive design nativ

### ✅ Funcționalități Web
- LocalStorage pentru persistență
- Download/Upload fișiere automat
- Interfață touch-friendly pentru tablete

### ✅ Tehnologii moderne
- ES6+ JavaScript
- CSS Grid/Flexbox
- HTML5 Canvas
- Vanilla JavaScript (fără dependențe)

## Compatibilitate Browser

| Browser | Versiune Minimă | Suport |
|---------|-----------------|--------|
| Chrome | 60+ | ✅ Complet |
| Firefox | 55+ | ✅ Complet |
| Safari | 12+ | ✅ Complet |
| Edge | 79+ | ✅ Complet |

## Timeline Range
- **Start**: 15 miliarde ani î.Hr. (Big Bang)
- **End**: 2100 d.Hr.
- **Startup**: Zoom maxim pe anul 1 CE
- **Evenimente**: 32 evenimente predefinite din istoria universului

## Controluri

### Mouse
- **Click**: Selectare eveniment
- **Drag**: Pan timeline
- **Wheel**: Zoom in/out
- **Right-click**: Context menu
- **Double-click**: Edit eveniment

### Keyboard
- **Delete**: Șterge eveniment selectat
- **Esc**: Închide modal

## Dezvoltare

Aplicația folosește Vanilla JavaScript pentru performanță maximă și compatibilitate largă. 
Toate funcționalitățile din versiunea Python au fost portate și optimizate pentru web.

Pentru debugging, deschide Developer Tools (F12) și verifică console-ul pentru log-uri.

---

🚀 **Ready to explore 15 billion years of history in your browser!**
