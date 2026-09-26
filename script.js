/* =============================================
   Lereng Green View — script.js
   ============================================= */

'use strict';

// ===== Utility =====
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ===== Navbar scroll effect =====
const navbar = qs('#navbar');
function handleNavbarScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll();

// ===== Hamburger mobile menu =====
const hamburger = qs('#hamburger');
const navMenu   = qs('#nav-menu');

hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('open');
  const isOpen = navMenu.classList.contains('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu when a link is clicked
qsa('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ===== Smooth active nav link on scroll =====
const sections = qsa('section[id]');

function updateActiveNav() {
  const scrollY = window.scrollY + 100;
  sections.forEach(sec => {
    const top    = sec.offsetTop;
    const height = sec.offsetHeight;
    const id     = sec.getAttribute('id');
    const link   = qs(`.nav-link[href="#${id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        qsa('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });

// ===== Back to top button =====
const backToTop = qs('#back-to-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== Floating particles in hero =====
function createParticles() {
  const container = qs('#particles');
  if (!container) return;

  const colors = ['#7adf90', '#5dc97a', '#ffffff', '#a8f0bc', '#3da85f'];

  for (let i = 0; i < 20; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size = Math.random() * 20 + 6;
    const left = Math.random() * 100;
    const delay = Math.random() * 15;
    const duration = Math.random() * 20 + 15;
    const color = colors[Math.floor(Math.random() * colors.length)];

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      background: ${color};
      animation-delay: ${delay}s;
      animation-duration: ${duration}s;
    `;

    container.appendChild(p);
  }
}
createParticles();

// ===== Scroll-reveal animation =====
function revealOnScroll() {
  const items = qsa('[data-aos]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(40px)';
    item.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    observer.observe(item);
  });
}
revealOnScroll();

// ===== Card hover depth effect =====
qsa('.aktivitas-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect   = card.getBoundingClientRect();
    const x      = e.clientX - rect.left;
    const y      = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ===== Contact Form — open WhatsApp =====
const form = qs('#contact-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();

    const nama      = qs('#nama', form).value.trim();
    const telepon   = qs('#telepon', form).value.trim();
    const keperluan = qs('#keperluan', form).value;
    const pesan     = qs('#pesan', form).value.trim();

    if (!nama || !telepon || !pesan) {
      showToast('Mohon lengkapi semua bidang yang wajib diisi (*).', 'error');
      return;
    }

    const msg = encodeURIComponent(
      `Halo Lereng Green View 🌿\n\n` +
      `*Nama*: ${nama}\n` +
      `*No. WhatsApp*: ${telepon}\n` +
      `*Keperluan*: ${keperluan || 'Tidak dipilih'}\n\n` +
      `*Pesan*:\n${pesan}`
    );

    window.open(`https://wa.me/6282385648456?text=${msg}`, '_blank', 'noopener');
    showToast('Terima kasih! Anda akan diarahkan ke WhatsApp. 🎉', 'success');
    form.reset();
  });
}

// ===== Toast notification =====
function showToast(msg, type = 'success') {
  const existing = qs('.toast-notif');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast-notif toast-${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✅' : '⚠️'}</span>
    <span>${msg}</span>
  `;
  toast.style.cssText = `
    position: fixed;
    bottom: 180px;
    right: 28px;
    background: ${type === 'success' ? '#2d8a47' : '#c0392b'};
    color: #fff;
    padding: 14px 22px;
    border-radius: 12px;
    font-size: 0.88rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 9999;
    box-shadow: 0 8px 32px rgba(0,0,0,0.25);
    transform: translateX(120%);
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    max-width: 320px;
  `;

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(0)';
  });

  setTimeout(() => {
    toast.style.transform = 'translateX(120%)';
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

// ===== Galeri lightbox (simple) =====
function initLightbox() {
  const galeriItems = qsa('.galeri-item');

  // Create overlay
  const overlay = document.createElement('div');
  overlay.id = 'lightbox';
  overlay.style.cssText = `
    position: fixed; inset: 0; background: rgba(0,0,0,0.92);
    z-index: 9999; display: none; align-items: center;
    justify-content: center; cursor: zoom-out;
    animation: fadeInLB 0.3s ease;
  `;
  overlay.innerHTML = `
    <button id="lb-close" style="
      position:absolute; top:20px; right:24px;
      background:rgba(255,255,255,0.15); border:none; color:#fff;
      font-size:1.8rem; cursor:pointer; border-radius:50%;
      width:48px; height:48px; display:flex; align-items:center; justify-content:center;
    ">✕</button>
    <img id="lb-img" src="" alt="" style="
      max-width:90vw; max-height:88vh; border-radius:12px;
      box-shadow:0 20px 80px rgba(0,0,0,0.8); object-fit:contain;
    " />
    <p id="lb-caption" style="
      position:absolute; bottom:24px; left:50%; transform:translateX(-50%);
      color:rgba(255,255,255,0.8); font-size:1rem; font-weight:600; text-align:center;
    "></p>
  `;

  document.body.appendChild(overlay);

  const lbImg     = qs('#lb-img', overlay);
  const lbCap     = qs('#lb-caption', overlay);
  const lbClose   = qs('#lb-close', overlay);

  galeriItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = qs('img', item);
      const cap = qs('.galeri-overlay span', item);
      lbImg.src = img.src.replace('w=400', 'w=1200');
      lbImg.alt = img.alt;
      lbCap.textContent = cap ? cap.textContent : '';
      overlay.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLb() {
    overlay.style.display = 'none';
    document.body.style.overflow = '';
  }

  overlay.addEventListener('click', e => { if (e.target === overlay) closeLb(); });
  lbClose.addEventListener('click', closeLb);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });
}

initLightbox();

// ===== Number counter animation =====
function animateCounters() {
  const stats = qsa('.stat-num');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const raw = el.textContent.trim();
        if (raw === '∞' || raw === 'All') return;
        const target = parseInt(raw);
        if (isNaN(target)) return;
        let current = 0;
        const step = target / 40;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            el.textContent = raw;
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(current) + (raw.includes('+') ? '+' : '');
          }
        }, 40);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(s => observer.observe(s));
}
animateCounters();

// ===== Add keyframe for lightbox =====
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInLB {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
`;
document.head.appendChild(style);

// ===== Log welcome =====
console.log(
  '%c🌿 Lereng Green View\n%cWebsite promosi wisata alam Nagari Tanjung Alai, Kab. Solok, Sumbar.',
  'color: #2d8a47; font-size: 1.2rem; font-weight: 800;',
  'color: #7a8fa6; font-size: 0.9rem;'
);
