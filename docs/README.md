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
   python3 -m http.server 3000

4. Codespaces toont:
   “Your application is running on port 3000”

   Klik **Open in Browser** om de website te bekijken.

5. Optioneel: zet port visibility op Private zodat alleen jij de site kunt zien.

---

Troubleshooting
--
- Als de site ongestyled verschijnt: zorg dat je de site opent via de HTTP-server (bijv. http://localhost:3000) en niet direct met file://. Direct openen kan relatieve paden en browser security breken.
- Wis de browsercache of open een incognito/privé-venster om verouderde CSS/JS te vermijden.
- Voor snelle cache-busting tijdens ontwikkeling kun je in `index.html` tijdelijk de stylesheet link aanpassen naar bijvoorbeeld `css/styles.css?v=1.0` en de `v` verhogen na updates.


## 💻 Lokaal draaien op je computer

1. Installeer Python via https://www.python.org/downloads/  
2. Open een terminal (of CTRL+SHIFT+C) in de projectmap en typ:
   python3 -m http.server 5500
3. Open je browser en ga naar:
   http://localhost:5500

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
