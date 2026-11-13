// Supabase-Anbindung für das Anfrageformular
// Der "publishable key" ist bewusst öffentlich nutzbar (wie ein Stripe Publishable Key) –
// Schreibrechte sind über eine Row-Level-Security-Policy auf reines "Einfügen" begrenzt,
// siehe supabase/schema.sql
const SUPABASE_URL = 'https://hjatmmyyhvqkeqslpolm.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Iq2zDUiovl_pLqdL8s18Lg_10VbRJ0M';

// Header background on scroll
const header = document.querySelector('.site-header');
const onScroll = () => {
  if (window.scrollY > 40) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll);
onScroll();

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Lightbox gallery
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

document.querySelectorAll('.gallery-item').forEach((btn) => {
  btn.addEventListener('click', () => {
    const full = btn.getAttribute('data-full');
    const alt = btn.querySelector('img').getAttribute('alt');
    lightboxImg.setAttribute('src', full);
    lightboxImg.setAttribute('alt', alt);
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox.classList.remove('active');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

// Anfrageformular → Supabase
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  const statusEl = document.getElementById('formStatus');
  const submitBtn = contactForm.querySelector('button[type="submit"]');

  contactForm.addEventListener('submit', (e) => {
    // Honeypot: Bots, die das versteckte Feld ausfüllen, lassen wir einfach ins Leere laufen
    const honeypot = contactForm.querySelector('input[name="bot-field"]');
    if (honeypot && honeypot.value) {
      e.preventDefault();
      return;
    }

    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Wird gesendet …';

    const data = new FormData(contactForm);
    const payload = {
      name: data.get('Name'),
      telefon: data.get('Telefon') || null,
      email: data.get('E-Mail'),
      anlass: data.get('Anlass'),
      datum: data.get('Datum') || null,
      gaeste: data.get('Gästeanzahl') ? Number(data.get('Gästeanzahl')) : null,
      ort: data.get('Ort') || null,
      nachricht: data.get('Nachricht') || null,
    };

    fetch(`${SUPABASE_URL}/rest/v1/anfragen`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Supabase insert failed');
        window.location.href = contactForm.getAttribute('action') || 'danke.html';
      })
      .catch(() => {
        // Falls Supabase nicht erreichbar ist: regulär absenden (z. B. an Netlify Forms)
        submitBtn.disabled = false;
        submitBtn.textContent = 'Anfrage senden';
        if (statusEl) {
          statusEl.textContent = 'Es gab ein Problem beim Senden. Bitte versuchen Sie es erneut oder schreiben Sie uns auf Instagram.';
          statusEl.hidden = false;
        }
      });
  });
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
