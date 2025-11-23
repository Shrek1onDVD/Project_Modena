# Project_Modena

## 🌐 DHAIN Website

De officiële website van **DHAIN** — een AI-gedreven innovatiebureau binnen de jeugdzorg en het sociaal domein.  
Deze repository bevat de volledige bronbestanden voor de publieke bedrijfswebsite van DHAIN.

---

## 📄 Over dit project

De site is gebouwd als lichte, statische website zonder frameworks of backend.  
Alles draait client-side en kan eenvoudig worden gehost bij providers zoals Vercel, GitHub Pages of mijn.host.

Kenmerken:
- Geen cookies of analytics
- Volledig AVG-conform
- Eén pagina met scroll-interacties
- Moderne typografie en dark mode
- Contactformulier dat e-mail opent via mailto (geen opslag)

---

## 📁 Structuur

/
├── index.html              → hoofdpagina (one-pager)
├── css/
│   └── styles.css          → alle opmaak (licht en dark mode)
├── js/
│   └── app.js              → animaties, loader, kleurmodus, contact
├── legal/
│   ├── privacy.html        → privacyverklaring
│   └── disclaimer.html     → disclaimer
└── public/
    └── favicon.ico         → tabbladicoon

---

## ▶️ Preview in GitHub Codespaces

1. Open de repository in GitHub Codespaces  
   (Code → Create codespace on main)

2. Open een nieuwe terminal:  
   Terminal → New Terminal  
   of gebruik `Ctrl + `` (accent-grave, links van de 1).

3. Start een lokale webserver:
   ```bash
   python3 -m http.server 8000
   ```
   
   Als port 8000 bezet is, probeer een andere port:
   ```bash
   python3 -m http.server 8080
   # of
   python3 -m http.server 5500
   ```

4. Codespaces toont:
   "Your application is running on port 8000" (of de door jou gekozen port)

   Klik **Open in Browser** om de website te bekijken.

5. **Website opnieuw openen** (als je de browser tab hebt gesloten):
   - **Optie 1:** Ga naar `http://localhost:8000` in een nieuwe tab
   - **Optie 2:** Gebruik de PORTS tab onderaan VS Code → klik op de 🌐 naast port 8000
   - **Optie 3:** In terminal: `$BROWSER http://localhost:8000`
   
   💡 De server blijft draaien ook als je browser tabs sluit!

6. Optioneel: zet port visibility op Private zodat alleen jij de site kunt zien.

---

## 💻 Lokaal draaien op je computer

1. Installeer Python via https://www.python.org/downloads/  
2. Open een terminal (of CTRL+SHIFT+C) in de projectmap en typ:
   ```bash
   python3 -m http.server 8000
   ```
   
   Als je een andere port wilt gebruiken:
   ```bash
   python3 -m http.server 5500
   # of elke andere beschikbare port
   ```

3. Open je browser en ga naar:
   - http://localhost:8000 (voor port 8000)
   - http://localhost:5500 (voor port 5500)
   - Of de port die je hebt gekozen

4. **Website opnieuw openen** na sluiten browser tab:
   - Gewoon opnieuw naar `http://localhost:POORT` in je browser
   - De server blijft draaien in de achtergrond!

De site draait nu lokaal, zonder afhankelijkheden.

---

## 🧠 Werkwijze

- Pas teksten direct aan in index.html  
- Voeg nieuwe secties toe in dezelfde structuur  
- CSS-variabelen voor kleuren en lettertypen staan bovenaan in styles.css  
- Voeg nieuwe afbeeldingen of visuals toe in /public/  
- Het contactformulier opent automatisch de e-mailclient, er wordt niets opgeslagen

---

## 🏁 Deploy

- GitHub Pages: open Settings → Pages → Deploy from branch → root  
- Vercel: importeer de repo, kies “Other” als framework, klik Deploy

De site wordt automatisch gehost zonder extra configuratie.

---

© DHAIN B.V. — kunstmatige intelligentie met menselijk inzicht
