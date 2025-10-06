# Project_Modena

# DHAIN Website

De officiële website van **DHAIN** — een AI-gedreven innovatiebureau binnen de jeugdzorgsector.  
Deze repository bevat de volledige HTML-, CSS- en JS-bestanden voor de publieke bedrijfswebsite.

---

## 📄 Over dit project

De site is ontwikkeld als lichte, statische website zonder afhankelijkheden van frameworks of backends.  
Alle content draait in de browser en kan eenvoudig worden gehost bij elke standaard webhostingprovider (zoals mijn.host, Vercel of GitHub Pages).

De focus ligt op:
- Snelheid en toegankelijkheid
- Privacy (geen cookies of tracking)
- Heldere structuur en AVG-conforme inhoud
- Strakke, moderne vormgeving afgestemd op de zorgsector

---

## 📁 Structuur

```
/
├── index.html          → hoofdpagina
├── over.html           → pagina over DHAIN
├── contact.html        → contactformulier (mailto)
├── privacy.html        → privacyverklaring
├── disclaimer.html     → disclaimer
├── style.css           → hoofdopmaak (volledig custom)
├── script.js           → interacties en jaarautomatisering footer
└── images/             → logo, banner en voorbeeldafbeeldingen
```

---

## ▶️ Preview in GitHub Codespaces

1. Open de repo in **GitHub Codespaces**  
   (knop **Code → Create codespace on main**)

2. Open een nieuwe terminal:  
   - Menu: **Terminal → New Terminal**, of  
   - Sneltoets: `Ctrl + ``  (accent-grave, links van de 1)

3. Start een lokale webserver:
   ```bash
   python3 -m http.server 3000
   ```

4. Codespaces toont automatisch een melding:
   > “Your application is running on port 3000”

   Klik **Open in Browser** om de website te bekijken.

5. Zet de **port visibility** op *Private*, zodat alleen jij de site kunt zien.

---

## 🧩 Preview lokaal op je computer

Als je liever lokaal werkt:

1. Installeer [Python](https://www.python.org/downloads/)  
2. Open een terminal in de projectmap en typ:
   ```bash
   python3 -m http.server 5500
   ```
3. Open je browser en ga naar:
   ```
   http://localhost:5500
   ```

De website wordt lokaal geladen.

---

## 🛠️ Aanpassingen

- Bewerk de HTML-bestanden direct in **VS Code** of **GitHub Codespaces**
- Alle afbeeldingen staan in de map `/images/`
- CSS-variabelen voor kleuren e
