/* Stránka Karla Drexlera st. Chování přebírá z ../main.js: nájezd sekcí,
 * navigaci, mobilní menu a časovou osu. Navíc hlídá fotku
 * v heru a dopočítává roky v oboru.
 */

const hero = document.querySelector('.hero');

/* Fotka v heru ---------------------------------------------------------
 *
 * Dokud assets/img/karel-starsi.webp neexistuje, hero stojí na razítku.
 * Jakmile se fotka načte, dostane hero třídu hero--foto.
 */
const foto = document.querySelector('.hs__foto img');
if (hero && foto) {
  const ukaz = () => { if (foto.naturalWidth) hero.classList.add('hero--foto'); };
  if (foto.complete) ukaz();
  else foto.addEventListener('load', ukaz);
}

/* Roky v oboru se počítají z roku založení, ať text nezastará. */
const letos = new Date().getFullYear();
document.querySelectorAll('[data-let-od]').forEach((el) => {
  const od = Number(el.dataset.letOd);
  if (od && letos > od) el.textContent = String(letos - od);
});

/* Sekce a jejich bloky najíždějí, jakmile se dostanou do zorného pole.
 *
 * Záměrně bez IntersectionObserver: kdyby z jakéhokoli důvodu nevystřelil,
 * zůstal by celý obsah pod herem neviditelný. Tohle počítá polohu samo
 * a navíc má pojistku, která po chvíli odkryje všechno.
 */
const najizdi = [...document.querySelectorAll(
  '.sekce__hlava, .karta, .cisla li, .umim li, .postup li, .osa li, .velky-odkaz'
)];

/* Nadpisy se neodkrývají posunem, ale odhrnutím masky zleva doprava. */
const odhrnout = [...document.querySelectorAll('.sekce__nadpis')];

if (najizdi.length || odhrnout.length) {
  najizdi.forEach((el) => el.classList.add('najede'));
  odhrnout.forEach((el) => el.classList.add('odhrne'));

  /* Sousedi ve stejné skupině nastupují po sobě, ne naráz. */
  const skupiny = new Map();
  najizdi.forEach((el) => {
    const rodic = el.parentElement;
    const rada = skupiny.get(rodic) || [];
    rada.push(el);
    skupiny.set(rodic, rada);
  });
  skupiny.forEach((rada) => {
    if (rada.length < 2) return;
    rada.forEach((el, i) => {
      el.style.setProperty('--nastup', (i * 80) + 'ms');
    });
  });

  const vse = [...najizdi, ...odhrnout];

  let ceka = false;
  const odkryj = () => {
    ceka = false;
    const mez = innerHeight * 0.88;
    vse.forEach((el) => {
      if (el.classList.contains('je-videt')) return;
      if (el.getBoundingClientRect().top < mez) el.classList.add('je-videt');
    });
  };
  const naplanuj = () => {
    if (ceka) return;
    ceka = true;
    requestAnimationFrame(odkryj);
  };

  addEventListener('scroll', naplanuj, { passive: true });
  addEventListener('resize', naplanuj);
  naplanuj();

  // Pojistka: kdyby výpočet selhal a neodkryl ani první blok, odkryjeme
  // po dvou vteřinách všechno — prázdná stránka je horší než chybějící efekt.
  setTimeout(() => {
    if (document.querySelector('.je-videt')) return;
    vse.forEach((el) => el.classList.add('je-videt'));
  }, 2000);
}

/* Navigace se označí, jakmile hero odjede z dohledu. */
const nav = document.querySelector('.nav');
if (nav && hero && 'IntersectionObserver' in window) {
  new IntersectionObserver(
    ([entry]) => nav.classList.toggle('nav--past', !entry.isIntersecting),
    { rootMargin: '-60px 0px 0px 0px' }
  ).observe(hero);
}

/* Mobilní menu: tlačítko ho rozbalí přes celou obrazovku, kliknutí na odkaz, mimo menu nebo
   Escape ho zase zavře. */
const burger = document.querySelector('.nav__burger');
if (nav && burger) {
  const popisek = burger.querySelector('.nav__burger-text');
  const prepni = (otevrit) => {
    nav.classList.toggle('nav--open', otevrit);
    // Otevřené menu kryje celou obrazovku, stránka pod ním nemá jezdit.
    document.documentElement.classList.toggle('menu-otevrene', otevrit);
    burger.setAttribute('aria-expanded', String(otevrit));
    if (popisek) popisek.textContent = otevrit ? 'Zavřít' : 'Menu';
  };
  burger.addEventListener('click', () => prepni(!nav.classList.contains('nav--open')));
  nav.querySelectorAll('.nav__menu a').forEach((a) => a.addEventListener('click', () => prepni(false)));
  document.addEventListener('click', (e) => { if (!nav.contains(e.target)) prepni(false); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') prepni(false); });
}


/* Časová osa ------------------------------------------------------------
 *
 * Linka se plní podle toho, kam až čtenář doscrolloval, a body i roky,
 * kolem kterých prošla, se rozsvítí.
 */
const osa = document.querySelector('.osa');
if (osa) {
  const polozky = [...osa.querySelectorAll('li')];
  let ceka = false;
  const obnov = () => {
    ceka = false;
    const mez = innerHeight * 0.62;
    const r = osa.getBoundingClientRect();
    const postup = Math.min(1, Math.max(0, (mez - r.top - 12) / (r.height - 24)));
    osa.style.setProperty('--postup', postup.toFixed(4));
    polozky.forEach((li) => {
      li.classList.toggle('je-aktivni', li.getBoundingClientRect().top + 14 <= mez);
    });
  };
  const naplanuj = () => {
    if (ceka) return;
    ceka = true;
    requestAnimationFrame(obnov);
  };
  addEventListener('scroll', naplanuj, { passive: true });
  addEventListener('resize', naplanuj);
  obnov();
}
