# 🚀 GHID RAPID - Axa Cronologică JavaScript

## 📋 Lansare Rapidă

### 1. Pornire Aplicație

```bash
# Varianta 1: Dublu-click
start_js.bat

# Varianta 2: PowerShell
.\start_js.ps1

# Varianta 3: Manual
python -m http.server 8000
# Apoi deschide: http://localhost:8000
```

### 2. Navigare

- **🔍 Zoom**: Scroll mouse
- **👆 Pan**: Drag cu mouse
- **🎯 Reset**: Buton "Reset la Anul 1"

### 3. Evenimente

- **➕ Adaugă**: Buton verde sau click dreapta
- **✏️ Editează**: Selectează + buton albastru
- **🗑️ Șterge**: Selectează + buton roșu sau Delete

## 🎨 Interfață

### Toolbar

| Buton              | Funcție           | Culoare       |
| ------------------ | ----------------- | ------------- |
| Adaugă Eveniment   | Creează nou       | 🟢 Verde      |
| Editează Eveniment | Modifică selectat | 🔵 Albastru   |
| Șterge Eveniment   | Elimină selectat  | 🔴 Roșu       |
| Reset la Anul 1    | Centrat pe anul 1 | 🟠 Portocaliu |
| Salvează           | Export JSON       | 🟣 Violet     |
| Încarcă            | Import JSON       | ⚫ Gri        |

### Culori Evenimente

- 🟢 Verde: Natură, viață, dezvoltare
- 🔵 Albastru: Tehnologie, apă, ceruri
- 🟠 Portocaliu: Civilizații, energie
- 🔴 Roșu: Războaie, catastrofe
- 🟣 Violet: Religie, spiritual
- ⚫ Gri: Geologie, materie

## ⚡ Scurtături

### Mouse

- **Click**: Selectare
- **Drag**: Mișcare timeline
- **Wheel**: Zoom
- **Right-click**: Meniu context
- **Double-click**: Editare rapidă

### Keyboard

- **Delete**: Șterge eveniment
- **Esc**: Închide modal

## 💾 Date

### Auto-salvare

- Local storage browser
- Persistent între sesiuni

### Export/Import

- Format: JSON
- Download automat la salvare
- Upload cu buton "Încarcă"

## 🌟 Timeline

### Amplitudine

- **15.000.000.000 î.Hr.** → **2.100 d.Hr.**
- **Startup**: Anul 1 CE (zoom maxim)

### Zoom Range

- **Minim**: 0.000001x (toată istoria)
- **Maxim**: 100.000.000.000x (detalii fine)

### 32 Evenimente Predefinite

- Big Bang → Era Digitală
- Evoluție → Viitorul apropiat
- Civilizații → Colonizarea spațiului

## 🔧 Tehnic

### Cerințe

- Browser modern (Chrome 60+, Firefox 55+)
- JavaScript activat
- ~2MB RAM pentru evenimente

### Fișiere

- `index.html` - Interfața
- `timeline.js` - Logica
- `styles.css` - Design
- `events.json` - Date

### Port-uri

- **Implicit**: 8000
- **Alternativ**: 3000, 8080

## 🆘 Probleme Frecvente

### Nu se încarcă aplicația

1. Verifică dacă Python/Node.js sunt instalate
2. Folosește `start_js.bat` sau deschide direct `index.html`

### Evenimente nu se salvează

1. Verifică localStorage browser
2. Exportă manual cu buton "Salvează"

### Performance scăzut

1. Reduce zoom-ul pentru timeline lung
2. Închide alte tab-uri browser

---

🎉 **Gata de explorare! 15 miliarde de ani te așteaptă!**
