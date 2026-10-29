# Drexler – portfolio

Zdrojové soubory webu https://drexler-digital.vercel.app/ (čisté HTML/CSS/JS, bez build kroku).

- `index.html` – obsah stránky
- `styles.css`, `sekce.css`, `lightbox.css` – styly
- `main.js` – interakce (menu, galerie/lightbox, kontaktní formulář přes Web3Forms)
- `assets/img/` – obrázky

Lokální náhled: otevři `index.html` v prohlížeči, nebo spusť `python3 -m http.server` a jdi na http://localhost:8000.

## Karel Drexler st.

Samostatná stránka ve složce `starsi/` (na webu `/starsi/`), postavená ze stejného design systému: načítá `../styles.css` a `../sekce.css`, vlastní věci jsou v `starsi/starsi.css` a `starsi/starsi.js`.

- Fotka: stačí nahrát portrét jako `starsi/assets/img/karel-starsi.webp` (ideálně na výšku 4:5). Dokud tam není, hero stojí na razítku „od roku 1992“.
- Formulář chodí přes FormSubmit na karel.drexler@volny.cz. První odeslání pošle na tu adresu aktivační e-mail, je potřeba ho potvrdit.
- Životopis (`#cesta`) obsahuje jen veřejně dohledatelné milníky, další doplnit z LinkedInu.
