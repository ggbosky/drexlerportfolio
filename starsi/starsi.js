/* Stránka Karla Drexlera st. Hlídá fotku v profilové kartě a dopočítává
 * roky v IT, ať text nezastará. Všechno ostatní je čisté CSS.
 */

/* Dokud assets/img/karel-starsi.webp neexistuje, karta ukazuje monogram.
 * Jakmile se fotka načte, dostane stránka třídu ma-foto. */
const foto = document.querySelector('.karta__foto img');
if (foto) {
  const ukaz = () => { if (foto.naturalWidth) document.documentElement.classList.add('ma-foto'); };
  if (foto.complete) ukaz();
  else foto.addEventListener('load', ukaz);
}

const letos = new Date().getFullYear();
document.querySelectorAll('[data-let-od]').forEach((el) => {
  const od = Number(el.dataset.letOd);
  if (od && letos > od) el.textContent = String(letos - od);
});
