/* =============================================
  Lereng Green View — script.js
   ============================================= */

'use strict';

// ===== Utility =====
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const LGV_CONFIG = window.LGV_CONFIG || {};
const SUPABASE_CDN_URL = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';

async function ensureSupabaseRuntime() {
  if (window.supabaseClient) return true;

  if (window.__LGV_SUPABASE_RUNTIME_PROMISE__) {
    await window.__LGV_SUPABASE_RUNTIME_PROMISE__;
    return Boolean(window.supabaseClient);
  }

  if (!window.LGV_CONFIG || !window.LGV_CONFIG.supabaseUrl || !window.LGV_CONFIG.supabaseAnonKey) {
    window.LGV_CONFIG = {
      supabaseUrl: 'https://mmpiqofugkcimutalmhw.supabase.co',
      supabaseAnonKey: 'sb_publishable_Y7Kr_kCEHe4mfIjDeI4ciA_15JW8t4I',
      storageBucket: 'package-images'
    };
  }

  const initPromise = (async () => {
    if (!window.supabase) {
      await new Promise((resolve, reject) => {
        const existingScript = document.querySelector('script[data-lgv-supabase-sdk="true"]');

        if (existingScript) {
          if (existingScript.dataset.loaded === 'true') {
            resolve();
            return;
          }

          existingScript.addEventListener('load', () => resolve(), { once: true });
          existingScript.addEventListener('error', () => reject(new Error('Gagal memuat SDK Supabase.')), { once: true });
          return;
        }

        const script = document.createElement('script');
        script.src = SUPABASE_CDN_URL;
        script.async = true;
        script.dataset.lgvSupabaseSdk = 'true';
        script.onload = () => {
          script.dataset.loaded = 'true';
          resolve();
        };
        script.onerror = () => reject(new Error('Gagal memuat SDK Supabase.'));
        document.body.appendChild(script);
      });
    }

    const config = window.LGV_CONFIG;
    const isConfigValid = !!(
      config &&
      config.supabaseUrl &&
      config.supabaseUrl !== 'PASTE_YOUR_SUPABASE_URL_HERE' &&
      config.supabaseAnonKey &&
      config.supabaseAnonKey !== 'PASTE_YOUR_SUPABASE_ANON_KEY_HERE' &&
      window.supabase
    );

    if (isConfigValid) {
      window.supabaseClient = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey);
    }

    return Boolean(window.supabaseClient);
  })();

  window.__LGV_SUPABASE_RUNTIME_PROMISE__ = initPromise;

  try {
    const ready = await initPromise;
    return ready;
  } catch (error) {
    console.warn('ensureSupabaseRuntime failed:', error);
    return false;
  } finally {
    if (window.supabaseClient) {
      delete window.__LGV_SUPABASE_RUNTIME_PROMISE__;
    } else {
      delete window.__LGV_SUPABASE_RUNTIME_PROMISE__;
    }
  }
}

// ===== Navbar scroll effect =====
const navbar = qs('#navbar');
function handleNavbarScroll() {
  if (!navbar) return;
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

if (hamburger && navMenu) {
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
}

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

if (backToTop) {
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
}

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

function initPopupModal() {
  let popup = document.getElementById('lgv-popup');
  if (popup) return popup;

  popup = document.createElement('div');
  popup.id = 'lgv-popup';
  popup.className = 'lgv-popup';
  popup.innerHTML = `
    <div class="lgv-popup-backdrop" data-close-popup="true"></div>
    <div class="lgv-popup-card" role="dialog" aria-modal="true" aria-labelledby="lgv-popup-title">
      <div class="lgv-popup-header">
        <h3 id="lgv-popup-title">Informasi</h3>
        <button type="button" class="lgv-popup-close" aria-label="Tutup popup" data-close-popup="true">×</button>
      </div>
      <div class="lgv-popup-body" id="lgv-popup-message"></div>
      <div class="lgv-popup-actions">
        <button type="button" class="btn btn-outline btn-white" id="lgv-popup-cancel" style="display:none;">Batal</button>
        <button type="button" class="btn btn-primary" id="lgv-popup-confirm">OK</button>
      </div>
    </div>
  `;

  document.body.appendChild(popup);

  popup.querySelectorAll('[data-close-popup]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      popup.classList.remove('visible');
      popup.querySelector('#lgv-popup-cancel').style.display = 'none';
    });
  });

  return popup;
}

function showPopup({ title = 'Informasi', message = '', confirmText = 'OK', cancelText = 'Batal', showCancel = false, onConfirm = null, onCancel = null } = {}) {
  const popup = initPopupModal();
  const titleEl = popup.querySelector('#lgv-popup-title');
  const messageEl = popup.querySelector('#lgv-popup-message');
  const confirmBtn = popup.querySelector('#lgv-popup-confirm');
  const cancelBtn = popup.querySelector('#lgv-popup-cancel');

  titleEl.textContent = title;
  messageEl.innerHTML = message;
  confirmBtn.textContent = confirmText;
  cancelBtn.textContent = cancelText;
  cancelBtn.style.display = showCancel ? 'inline-flex' : 'none';

  confirmBtn.onclick = () => {
    popup.classList.remove('visible');
    if (typeof onConfirm === 'function') onConfirm();
  };

  cancelBtn.onclick = () => {
    popup.classList.remove('visible');
    if (typeof onCancel === 'function') onCancel();
  };

  popup.classList.add('visible');
}

function closePopup() {
  const popup = document.getElementById('lgv-popup');
  if (popup) popup.classList.remove('visible');
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

async function updateHeroActivityCount() {
  const stat = document.querySelector('.hero-stats .stat-num');
  if (!stat) return;

  const packages = await loadPackagesData();
  const total = Array.isArray(packages) ? packages.length : 0;
  const value = total > 0 ? `${total}+` : '0+';
  stat.textContent = value;
  stat.dataset.target = value;
}

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

/* =============================================
  ADMIN AUTH + PACKAGE MANAGEMENT
   ============================================= */
const ADMIN_SESSION_KEY = 'lgv_admin_session';
const ADMIN_USERS_KEY = 'lgv_admin_users';
const RESERVATIONS_STORAGE_KEY = 'lgv_reservations';
const PACKAGES_STORAGE_KEY = 'lgv_packages';
const ADMIN_SECTION_KEY = 'lgv_admin_active_section';
const GUEST_SESSION_KEY = 'lgv_guest_session';
const PENDING_PACKAGE_KEY = 'lgv_pending_package_name';

function hasSupabaseConfig() {
  return Boolean(
    window.LGV_CONFIG &&
    window.LGV_CONFIG.supabaseUrl &&
    window.LGV_CONFIG.supabaseUrl !== 'PASTE_YOUR_SUPABASE_URL_HERE' &&
    window.LGV_CONFIG.supabaseAnonKey &&
    window.LGV_CONFIG.supabaseAnonKey !== 'PASTE_YOUR_SUPABASE_ANON_KEY_HERE' &&
    window.supabase
  );
}

async function hashPassword(password) {
  if (!password) return '';

  const subtle = window.crypto?.subtle || crypto?.subtle;
  if (!subtle) {
    return String(password);
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(String(password));
  const hashBuffer = await subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function passwordMatches(candidatePassword, storedPassword) {
  if (!candidatePassword || !storedPassword) return false;

  const candidateValue = String(candidatePassword);
  const storedValue = String(storedPassword).trim();
  const hashedCandidate = await hashPassword(candidateValue);

  return storedValue === candidateValue || storedValue === hashedCandidate;
}

function getAdminUsers() {
  try {
    const users = JSON.parse(localStorage.getItem(ADMIN_USERS_KEY) || '[]');
    if (Array.isArray(users) && users.length > 0) return users;
  } catch (error) {
    console.warn('Gagal membaca data admin:', error);
  }

  const fallback = [{
    id: 1,
    username: 'admin',
    password: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
    name: 'Admin Lereng Green View',
    email: 'admin@lerenggreenview.com',
    phone_number: '081234567890',
    role: 'admin'
  }];

  localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(fallback));
  return fallback;
}

function getAdminSession() {
  try {
    return JSON.parse(localStorage.getItem(ADMIN_SESSION_KEY) || 'null');
  } catch (error) {
    return null;
  }
}

function isAdminLoggedIn() {
  return Boolean(getAdminSession());
}

function clearAdminSession() {
  const keysToRemove = [ADMIN_SESSION_KEY, ADMIN_SECTION_KEY, 'lgv_admin_logged_in'];
  keysToRemove.forEach((key) => {
    try {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    } catch (error) {
      console.warn('Gagal membersihkan key sesi admin:', key, error);
    }
  });
}

function setupLogoutButton() {
  const logoutBtn = document.getElementById('logout-admin-btn');

  if (!logoutBtn || logoutBtn.dataset.bound === 'true') return;
  logoutBtn.dataset.bound = 'true';

  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();

    try {
      if (typeof clearAdminSession === 'function') {
        clearAdminSession();
      } else {
        localStorage.removeItem(ADMIN_SESSION_KEY);
        sessionStorage.clear();
      }
    } catch (error) {
      console.error('Error saat clear session:', error);
    } finally {
      window.location.replace('admin-login.html');
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupLogoutButton);
} else {
  setupLogoutButton();
}

function getCurrentGuestSession() {
  try {
    const raw = localStorage.getItem(GUEST_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn('Gagal membaca sesi guest:', error);
    return null;
  }
}

async function ensureGuestUserInDatabase(user) {
  if (!user || !window.supabaseClient) return null;

  const email = (user.email || '').trim();
  const googleId = user.id ? String(user.id) : '';
  const guestName = user.name || email || 'Google User';

  try {
    const client = window.supabaseClient;
    let existingUser = null;

    if (googleId || email) {
      const lookupQuery = client.from('users').select('id, email, google_id, name').limit(1);
      const filters = [];

      if (googleId) filters.push(`google_id.eq.${googleId}`);
      if (email) filters.push(`email.eq.${email}`);

      if (filters.length) {
        const { data, error } = await lookupQuery.or(filters.join(','));
        if (!error && Array.isArray(data) && data.length > 0) {
          existingUser = data[0];
        }
      }
    }

    if (existingUser) {
      const shouldUpdate = existingUser.email !== email || (googleId && existingUser.google_id !== googleId) || existingUser.name !== guestName;

      if (shouldUpdate) {
        const { error: updateError } = await client
          .from('users')
          .update({
            name: guestName,
            email: email || existingUser.email,
            google_id: googleId || existingUser.google_id,
            role: 'guest',
            updated_at: new Date().toISOString()
          })
          .eq('id', existingUser.id);

        if (updateError) {
          console.warn('Gagal update user guest di Supabase:', updateError.message || updateError);
        }
      }

      return { ...existingUser, name: guestName, email: email || existingUser.email, google_id: googleId || existingUser.google_id };
    }

    const payload = {
      name: guestName,
      email: email || `${googleId || Date.now()}@guest.local`,
      phone_number: '',
      role: 'guest',
      ...(googleId ? { google_id: googleId } : {})
    };

    const conflictKey = googleId ? 'google_id' : 'email';
    const { data: newUser, error: insertError } = await client
      .from('users')
      .upsert([payload], { onConflict: conflictKey })
      .select('id, email, google_id, name')
      .single();

    if (insertError) {
      console.warn('Gagal menambahkan user guest ke Supabase:', insertError.message || insertError);

      const { data: fallbackUser, error: retryError } = await client
        .from('users')
        .select('id, email, google_id, name')
        .or([googleId ? `google_id.eq.${googleId}` : '', email ? `email.eq.${email}` : ''].filter(Boolean).join(','))
        .limit(1);

      if (!retryError && Array.isArray(fallbackUser) && fallbackUser.length > 0) {
        return fallbackUser[0];
      }

      return null;
    }

    return newUser;
  } catch (error) {
    console.warn('ensureGuestUserInDatabase error:', error);
    return null;
  }
}

async function syncGuestProfileFromBooking(bookingData, userId, authenticatedUser) {
  if (!window.supabaseClient || !userId) return;

  const guestName = (authenticatedUser && authenticatedUser.name) || bookingData.customer_name || 'Guest User';
  const guestEmail = (authenticatedUser && authenticatedUser.email) || `${bookingData.whatsapp_number || 'guest'}@guest.local`;
  const guestPhone = bookingData.whatsapp_number || '';

  try {
    const { error } = await window.supabaseClient
      .from('users')
      .update({
        name: guestName,
        email: guestEmail,
        phone_number: guestPhone,
        role: 'guest',
        updated_at: new Date().toISOString()
      })
      .eq('id', Number(userId));

    if (error) {
      console.warn('Gagal update profil guest dari reservasi:', error.message || error);
    }

    const guestSession = getCurrentGuestSession() || {};
    persistGuestSession({
      ...guestSession,
      id: authenticatedUser?.id || guestSession.id || String(userId),
      db_user_id: Number(userId),
      name: guestName,
      email: guestEmail,
      phone_number: guestPhone
    });
  } catch (error) {
    console.warn('syncGuestProfileFromBooking error:', error);
  }
}

function getCurrentGuestDbUserId() {
  const guest = getCurrentGuestSession();
  if (!guest) return null;

  const rawValue = guest.db_user_id ?? guest.user_id ?? null;
  if (rawValue !== null && rawValue !== undefined && rawValue !== '') {
    const numericValue = Number(rawValue);
    if (Number.isFinite(numericValue) && numericValue > 0) {
      return numericValue;
    }
  }

  return null;
}

async function resolveCurrentGuestDbUserId() {
  const guest = getCurrentGuestSession();
  if (!guest) return null;

  const existingId = getCurrentGuestDbUserId();
  if (existingId) return existingId;

  const client = window.supabaseClient;
  if (!client) return null;

  const email = (guest.email || '').trim();
  const googleId = guest.id ? String(guest.id) : '';

  try {
    const filters = [];
    if (googleId) filters.push(`google_id.eq.${googleId}`);
    if (email) filters.push(`email.eq.${email}`);

    if (!filters.length) return null;

    const { data, error } = await client
      .from('users')
      .select('id')
      .or(filters.join(','))
      .limit(1);

    if (error) {
      console.warn('Gagal resolve user_id guest dari database:', error.message || error);
      return null;
    }

    if (!Array.isArray(data) || !data.length) return null;

    const dbUserId = Number(data[0].id);
    if (!Number.isFinite(dbUserId) || dbUserId <= 0) return null;

    persistGuestSession({
      ...guest,
      db_user_id: dbUserId
    });

    return dbUserId;
  } catch (error) {
    console.warn('resolveCurrentGuestDbUserId error:', error);
    return null;
  }
}

function persistGuestSession(user) {
  if (!user) {
    localStorage.removeItem(GUEST_SESSION_KEY);
    updateLoginButtonState();
    return;
  }

  const normalizedUser = {
    ...user,
    db_user_id: user.db_user_id ?? user.user_id ?? null,
    phone_number: user.phone_number || user.whatsapp_number || ''
  };

  localStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(normalizedUser));
  updateLoginButtonState();
}

function clearGuestSession() {
  const logoutInProgress = sessionStorage.getItem('lgv_guest_logout_in_progress') === 'true';

  try {
    localStorage.removeItem(GUEST_SESSION_KEY);
    sessionStorage.removeItem(PENDING_PACKAGE_KEY);
    sessionStorage.removeItem('lgv_pending_reservation');
  } catch (error) {
    console.warn('Gagal membersihkan sesi guest:', error);
  }

  if (logoutInProgress) {
    return;
  }

  updateLoginButtonState();

  const client = window.supabaseClient;
  if (client && client.auth && typeof client.auth.signOut === 'function') {
    sessionStorage.setItem('lgv_guest_logout_in_progress', 'true');
    client.auth.signOut().catch((error) => {
      console.warn('Gagal sign out dari Supabase guest session:', error);
    }).finally(() => {
      sessionStorage.removeItem('lgv_guest_logout_in_progress');
    });
  }
}

function updateLoginButtonState() {
  const loginBtn = document.querySelector('.btn-login');
  if (!loginBtn) return;

  const guest = getCurrentGuestSession();
  if (guest && guest.name) {
    loginBtn.innerHTML = `<i class="fas fa-user-check"></i> ${guest.name.split(' ')[0]}`;
    loginBtn.setAttribute('title', guest.name);
    loginBtn.onclick = (event) => {
      event.preventDefault();
      window.location.href = 'dashboard.html';
    };
    return;
  }

  loginBtn.innerHTML = '<i class="fas fa-user-circle"></i> Login';
  loginBtn.onclick = openLoginModal;
}

async function hydrateGuestAuthState() {
  updateLoginButtonState();

  try {
    await ensureSupabaseRuntime();
  } catch (error) {
    console.warn('Supabase runtime belum tersedia saat hydrate auth:', error);
    return;
  }

  const client = window.supabaseClient;
  if (!client || !client.auth) return;

  const hasOAuthCallback = /(?:\?|&)code=|(?:\?|&)state=|(?:\?|&)error=|#access_token=/.test(window.location.search + window.location.hash);
  const isProtectedRoute = /(?:dashboard|admin|admin-login)\.html$/i.test(window.location.pathname);
  const pendingGoogleLogin = sessionStorage.getItem('lgv_google_auth_pending') === 'true';

  if (!isProtectedRoute && !pendingGoogleLogin && !hasOAuthCallback) {
    return;
  }

  try {
    const { data: { session }, error } = await client.auth.getSession();
    if (error) throw error;

    if (session && session.user) {
      const user = {
        id: session.user.id,
        name: session.user.user_metadata?.full_name || session.user.email || 'Google User',
        email: session.user.email || '',
        avatar: session.user.user_metadata?.avatar_url || ''
      };
      const dbUser = await ensureGuestUserInDatabase(user);
      const resolvedDbUserId = dbUser && dbUser.id ? Number(dbUser.id) : await resolveCurrentGuestDbUserId();
      persistGuestSession({
        ...user,
        db_user_id: resolvedDbUserId ?? getCurrentGuestDbUserId()
      });
      sessionStorage.removeItem('lgv_google_auth_pending');
    } else {
      if (pendingGoogleLogin || hasOAuthCallback) {
        console.warn('Sesi Google tidak ditemukan setelah redirect/login.');
      }
      clearGuestSession();
    }
  } catch (error) {
    console.warn('Gagal membaca sesi Google:', error);
    clearGuestSession();
  }

  updateLoginButtonState();

  if (client.auth && client.auth.onAuthStateChange) {
    client.auth.onAuthStateChange((event, session) => {
      if (sessionStorage.getItem('lgv_guest_logout_in_progress') === 'true') {
        return;
      }

      if (session && session.user) {
        const user = {
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.email || 'Google User',
          email: session.user.email || '',
          avatar: session.user.user_metadata?.avatar_url || ''
        };
        ensureGuestUserInDatabase(user).then((dbUser) => {
          const resolvedDbUserId = dbUser && dbUser.id ? Number(dbUser.id) : getCurrentGuestDbUserId();
          persistGuestSession({
            ...user,
            db_user_id: resolvedDbUserId ?? getCurrentGuestDbUserId()
          });
        }).catch(() => {});
        updateLoginButtonState();

        const pendingPackageName = sessionStorage.getItem(PENDING_PACKAGE_KEY);
        if (pendingPackageName) {
          sessionStorage.removeItem(PENDING_PACKAGE_KEY);
          openBookingModal(pendingPackageName);
        }
        return;
      }

      clearGuestSession();
      updateLoginButtonState();
    });
  }
}

//packages management

const PACKAGE_OPTIONS = {
  categories: ['Camping', 'Adventure', 'Keluarga', 'Edukasi', 'Outbound', 'Umum'],
  durations: ['Half day', '1 hari', '1 malam', '2 hari 1 malam', 'Fleksibel'],
  targetAges: ['Semua usia', 'Anak-anak', 'Dewasa', 'Anak & dewasa']
};

// Mengisi opsi dropdown ke elemen <select>
function populatePackageDropdowns() {
  const categorySelect = document.getElementById('package-category');
  const durationSelect = document.getElementById('package-duration');
  const targetAgeSelect = document.getElementById('package-target-age');

  if (categorySelect) {
    categorySelect.innerHTML = '<option value="">-- Pilih Kategori --</option>' + 
      PACKAGE_OPTIONS.categories.map(c => `<option value="${c}">${c}</option>`).join('');
  }

  if (durationSelect) {
    durationSelect.innerHTML = '<option value="">-- Pilih Durasi --</option>' + 
      PACKAGE_OPTIONS.durations.map(d => `<option value="${d}">${d}</option>`).join('');
  }

  if (targetAgeSelect) {
    targetAgeSelect.innerHTML = '<option value="">-- Pilih Target Usia --</option>' + 
      PACKAGE_OPTIONS.targetAges.map(a => `<option value="${a}">${a}</option>`).join('');
  }
}

function ensureDefaultPackages() {
  const existing = JSON.parse(localStorage.getItem(PACKAGES_STORAGE_KEY) || 'null');
  if (Array.isArray(existing) && existing.length > 0) return;

  const defaultPackages = [
    {
      id: 1,
      name: 'Berkemah',
      category: 'Camping',
      description: 'Camping ground yang nyaman dengan suasana alam dan malam yang tenang.',
      price: 150000,
      duration: '1 malam',
      targetAge: 'Semua usia',
      image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80',
      is_active: true
    },
    {
      id: 2,
      name: 'Outbound',
      category: 'Adventure',
      description: 'Kegiatan outbound yang seru untuk tim, keluarga, dan komunitas.',
      price: 200000,
      duration: '1 hari',
      targetAge: 'Anak & dewasa',
      image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
      is_active: true
    },
    {
      id: 3,
      name: 'Agrowisata',
      category: 'Keluarga',
      description: 'Nikmati pengalaman bercocok tanam dengan pemandangan kebun yang asri.',
      price: 125000,
      duration: 'Half day',
      targetAge: 'Semua usia',
      image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&q=80',
      is_active: true
    }
  ];

  localStorage.setItem(PACKAGES_STORAGE_KEY, JSON.stringify(defaultPackages));
}

function getPackages() {
  ensureDefaultPackages();
  try {
    return JSON.parse(localStorage.getItem(PACKAGES_STORAGE_KEY) || '[]');
  } catch (error) {
    return [];
  }
}

async function loadPackagesData(options = { includeInactive: false }) {
  const client = window.supabaseClient || (await ensureSupabaseRuntime() ? window.supabaseClient : null);

  if (!client) {
    const localPackages = getPackages();
    return options.includeInactive ? localPackages : localPackages.filter((item) => item.is_active !== false);
  }

  try {
    let query = client.from('packages').select('*').order('created_at', { ascending: false });

    if (!options.includeInactive) {
      const activeQuery = query.eq('is_active', true);
      const { data, error } = await activeQuery;

      if (error) {
        console.warn('Filter is_active tidak didukung, fallback ke semua paket:', error.message);
        const fallback = await client.from('packages').select('*').order('created_at', { ascending: false });
        const fallbackResult = await fallback;
        return fallbackResult.data || [];
      }

      return data || [];
    }

    const { data, error } = await query;
    if (error) {
      console.error('Gagal mengambil data paket dari Supabase:', error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error loadPackagesData:', error);
    return [];
  }
}

/**
 * Kompresi & Resize gambar menggunakan HTML Canvas hingga ukuran max 100 KB
 * @param {File} file - File gambar asli yang dipilih user
 * @param {number} maxKb - Batas ukuran maksimum dalam KB (default: 100)
 * @param {number} maxDimension - Batas lebar/tinggi piksel maksimum (default: 1200px)
 * @returns {Promise<File>} File gambar terkompresi
 */

function compressAndResizeImage(file, maxKb = 100, maxDimension = 1200) {
  return new Promise((resolve, reject) => {
    // Jika file sudah di bawah 100 KB, langsung kembalikan file asli
    if (file.size <= maxKb * 1024) {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        // 1. Hitung dimensi baru (Resize)
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        // 2. Gambar ke Canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // 3. Kompresi Kualitas Iteratif
        let quality = 0.9; // Mulai dari kualitas 90%
        
        const compressLoop = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                return reject(new Error('Gagal memproses kanvas gambar.'));
              }

              // Jika ukuran blob sudah <= maxKb ATAU kualitas sudah terlalu rendah (<= 0.1)
              if (blob.size <= maxKb * 1024 || quality <= 0.15) {
                // Konversi Blob kembali menjadi File object
                const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                });
                return resolve(compressedFile);
              }

              // Kurangi kualitas 10% setiap iterasi
              quality -= 0.1;
              compressLoop();
            },
            'image/jpeg',
            quality
          );
        };

        compressLoop();
      };

      img.onerror = (err) => reject(err);
    };

    reader.onerror = (err) => reject(err);
  });
}

function getStoragePathFromUrl(publicUrl) {
  if (!publicUrl) return '';

  try {
    const url = new URL(publicUrl);
    const path = decodeURIComponent(url.pathname || '');
    const bucketMarker = '/storage/v1/object/public/';
    const markerIndex = path.indexOf(bucketMarker);

    if (markerIndex >= 0) {
      const rest = path.slice(markerIndex + bucketMarker.length);
      const nextSlash = rest.indexOf('/');
      return nextSlash >= 0 ? rest.slice(nextSlash + 1) : '';
    }

    const segments = path.split('/').filter(Boolean);
    if (segments.length >= 2) {
      return segments.slice(1).join('/');
    }

    return '';
  } catch (error) {
    return '';
  }
}

async function deletePackageImageFromStorage(imageUrl) {
  const client = window.supabaseClient;
  const bucket = window.LGV_CONFIG?.storageBucket;
  const filePath = getStoragePathFromUrl(imageUrl);

  if (!client || !bucket || !filePath) return true;

  try {
    const { error } = await client.storage.from(bucket).remove([filePath]);
    if (error) {
      console.warn('Gagal menghapus gambar lama dari storage:', error.message || error);
      return false;
    }
    return true;
  } catch (error) {
    console.warn('Error saat menghapus gambar lama dari storage:', error);
    return false;
  }
}

async function uploadPackageImage(file) {
  const client = window.supabaseClient;
  if (!client || !window.LGV_CONFIG?.storageBucket || !file) return '';

  try {
    // 1. Kompresi & Resize gambar maksimal 100 KB
    console.log(`Ukuran gambar asli: ${(file.size / 1024).toFixed(2)} KB`);
    const compressedFile = await compressAndResizeImage(file, 100, 1200);
    console.log(`Ukuran gambar setelah kompresi: ${(compressedFile.size / 1024).toFixed(2)} KB`);

    // 2. Buat nama file unik
    const fileExt = 'jpg'; // Hasil kompresi selalu JPEG
    const fileName = `packages/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    // 3. Upload file yang sudah terkompresi ke Storage Bucket Supabase
    const { error } = await client.storage
      .from(window.LGV_CONFIG.storageBucket)
      .upload(fileName, compressedFile, { 
        upsert: true,
        contentType: 'image/jpeg'
      });

    if (error) throw error;

    // 4. Ambil Public URL
    const { data } = client.storage
      .from(window.LGV_CONFIG.storageBucket)
      .getPublicUrl(fileName);

    return data.publicUrl || '';
  } catch (error) {
    console.error('Upload gambar paket gagal:', error.message || error);
    return '';
  }
}

async function savePackageToSupabase(packageData) {
  const client = window.supabaseClient;
  if (!client) return false;

  try {
    const payload = {
      ...packageData,
      is_active: packageData.is_active ?? true
    };

    const { error } = await client
      .from('packages')
      .insert([payload]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Gagal menyimpan paket ke Supabase:', error.message || error);
    return false;
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(Number(value) || 0);
}

function readFileAsDataURL(file, callback) {
  const reader = new FileReader();
  reader.onload = function () {
    callback(reader.result);
  };
  reader.readAsDataURL(file);
}

function ensurePackageEditModal() {
  let modal = document.getElementById('lgv-edit-package-modal');
  if (modal) return modal;

  modal = document.createElement('div');
  modal.id = 'lgv-edit-package-modal';
  modal.className = 'lgv-popup';
  modal.innerHTML = `
    <div class="lgv-popup-backdrop" data-close-edit-package="true"></div>
    <div class="lgv-popup-card" role="dialog" aria-modal="true" aria-labelledby="lgv-edit-package-title">
      <div class="lgv-popup-header">
        <h3 id="lgv-edit-package-title">Edit Paket Wisata</h3>
        <button type="button" class="lgv-popup-close" aria-label="Tutup modal edit" data-close-edit-package="true">×</button>
      </div>

      <form id="lgv-edit-package-form" class="lgv-modal-form">
        <input type="hidden" id="edit-package-id" />

        <div class="form-group">
          <label for="edit-package-name">Nama Paket</label>
          <input id="edit-package-name" type="text" required />
        </div>

        <div class="form-group">
          <label for="edit-package-category">Kategori</label>
          <select id="edit-package-category" required></select>
        </div>

        <div class="form-group">
          <label for="edit-package-description">Deskripsi</label>
          <textarea id="edit-package-description"></textarea>
        </div>

        <div class="form-group">
          <label for="edit-package-price">Harga (Rp)</label>
          <input id="edit-package-price" type="number" min="0" required />
        </div>

        <div class="form-group">
          <label for="edit-package-duration">Durasi</label>
          <select id="edit-package-duration" required></select>
        </div>

        <div class="form-group">
          <label for="edit-package-target-age">Target Usia</label>
          <select id="edit-package-target-age" required></select>
        </div>

        <div class="form-group">
          <label for="edit-package-image">Ganti Gambar</label>
          <input id="edit-package-image" type="file" accept="image/*" />
        </div>

        <div class="lgv-popup-actions">
          <button type="button" class="btn btn-outline" data-close-edit-package="true">Batal</button>
          <button type="submit" class="btn btn-primary">Simpan Perubahan</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelectorAll('[data-close-edit-package]').forEach((trigger) => {
    trigger.addEventListener('click', () => modal.classList.remove('visible'));
  });

  const categorySelect = modal.querySelector('#edit-package-category');
  const durationSelect = modal.querySelector('#edit-package-duration');
  const targetAgeSelect = modal.querySelector('#edit-package-target-age');

  categorySelect.innerHTML = PACKAGE_OPTIONS.categories.map((item) => `<option value="${item}">${item}</option>`).join('');
  durationSelect.innerHTML = PACKAGE_OPTIONS.durations.map((item) => `<option value="${item}">${item}</option>`).join('');
  targetAgeSelect.innerHTML = PACKAGE_OPTIONS.targetAges.map((item) => `<option value="${item}">${item}</option>`).join('');

  modal.querySelector('#lgv-edit-package-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitBtn = modal.querySelector('#lgv-edit-package-form button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';

    try {
      const packageId = Number(modal.querySelector('#edit-package-id').value);
      const fileInput = modal.querySelector('#edit-package-image');
      const currentPackages = await loadPackagesData({ includeInactive: true });
      const existingPackage = currentPackages.find((item) => Number(item.id) === packageId) || {};

      const updatedData = {
        name: modal.querySelector('#edit-package-name').value.trim(),
        category: modal.querySelector('#edit-package-category').value,
        description: modal.querySelector('#edit-package-description').value.trim(),
        price: Number(modal.querySelector('#edit-package-price').value || 0),
        duration: modal.querySelector('#edit-package-duration').value,
        target_age: modal.querySelector('#edit-package-target-age').value,
        image_url: existingPackage.image_url || '',
        is_active: existingPackage.is_active !== false,
        edited_at: new Date().toISOString()
      };

      if (!updatedData.name || !updatedData.category || !updatedData.price) {
        showToast('Nama, kategori, dan harga paket wajib diisi.', 'error');
        return;
      }

      if (fileInput && fileInput.files && fileInput.files[0]) {
        if (existingPackage.image_url) {
          await deletePackageImageFromStorage(existingPackage.image_url);
        }
        const uploadedUrl = await uploadPackageImage(fileInput.files[0]);
        if (uploadedUrl) updatedData.image_url = uploadedUrl;
      }

      const client = window.supabaseClient;
      if (client) {
        const { error } = await client
          .from('packages')
          .update(updatedData)
          .eq('id', packageId);

        if (error) {
          showToast('Gagal memperbarui paket wisata.', 'error');
          return;
        }
      }

      modal.classList.remove('visible');
      await renderPackageCards();
      showToast('Paket wisata berhasil diperbarui.', 'success');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });

  return modal;
}

function openPackageEditModal(packageId) {
  const modal = ensurePackageEditModal();
  const packages = loadPackagesData ? loadPackagesData({ includeInactive: true }) : Promise.resolve([]);

  packages.then((items) => {
    const packageItem = items.find((item) => Number(item.id) === Number(packageId));
    if (!packageItem) {
      showToast('Data paket tidak ditemukan.', 'error');
      return;
    }

    modal.querySelector('#edit-package-id').value = packageItem.id;
    modal.querySelector('#edit-package-name').value = packageItem.name || '';
    modal.querySelector('#edit-package-category').value = packageItem.category || PACKAGE_OPTIONS.categories[0];
    modal.querySelector('#edit-package-description').value = packageItem.description || '';
    modal.querySelector('#edit-package-price').value = packageItem.price || 0;
    modal.querySelector('#edit-package-duration').value = packageItem.duration || PACKAGE_OPTIONS.durations[0];
    modal.querySelector('#edit-package-target-age').value = packageItem.target_age || PACKAGE_OPTIONS.targetAges[0];
    modal.querySelector('#edit-package-image').value = '';
    modal.classList.add('visible');
  });
}

async function confirmPermanentPackageDelete(packageId) {
  const session = getAdminSession();
  if (!session || !session.username) {
    showToast('Sesi admin tidak aktif. Silakan login ulang.', 'error');
    return;
  }

  const packages = await loadPackagesData({ includeInactive: true });
  const packageToDelete = packages.find((item) => Number(item.id) === Number(packageId));

  if (!packageToDelete) {
    showToast('Paket tidak ditemukan.', 'error');
    return;
  }

  showPopup({
    title: 'Hapus paket permanen',
    message: `
      <div style="display:flex; flex-direction:column; gap:12px; min-width:320px;">
        <p style="margin:0; color:#374151;">Anda akan menghapus paket <strong>${packageToDelete.name}</strong> secara permanen.</p>
        <p style="margin:0; color:#b91c1c; font-weight:600;">Konsekuensi: semua data reservasi yang pernah terkait dengan paket ini akan ikut dihapus.</p>
        <label for="package-delete-password" style="font-weight:600; color:#111827;">Masukkan password admin</label>
        <input id="package-delete-password" type="password" placeholder="Password admin" style="width:100%; padding:10px 12px; border:1px solid #d1d5db; border-radius:10px; box-sizing:border-box;" />
      </div>
    `,
    confirmText: 'Hapus Permanen',
    cancelText: 'Batal',
    showCancel: true,
    onConfirm: async () => {
      const password = document.getElementById('package-delete-password')?.value.trim() || '';
      if (!password) {
        showToast('Masukkan password admin untuk konfirmasi penghapusan.', 'error');
        return;
      }

      const client = window.supabaseClient;
      let isPasswordValid = false;

      if (client) {
        const { data, error } = await client
          .from('users')
          .select('*')
          .eq('username', session.username)
          .eq('role', 'admin')
          .maybeSingle();

        if (error) {
          console.error('Gagal validasi password admin sebelum delete:', error);
          showToast('Gagal memverifikasi password admin.', 'error');
          return;
        }

        if (!data) {
          showToast('Akun admin tidak ditemukan.', 'error');
          return;
        }

        isPasswordValid = await passwordMatches(password, data.password);
      } else {
        const users = getAdminUsers();
        const matchingUser = users.find((user) => user.username === session.username && user.role === 'admin');
        isPasswordValid = Boolean(matchingUser && await passwordMatches(password, matchingUser.password));
      }

      if (!isPasswordValid) {
        showToast('Password admin tidak valid.', 'error');
        return;
      }

      try {
        if (client) {
          if (packageToDelete.image_url) {
            await deletePackageImageFromStorage(packageToDelete.image_url);
          }

          const { error: reservationDeleteError } = await client
            .from('reservations')
            .delete()
            .eq('package_id', Number(packageId));

          if (reservationDeleteError) {
            throw reservationDeleteError;
          }

          const { error: packageDeleteError } = await client
            .from('packages')
            .delete()
            .eq('id', Number(packageId));

          if (packageDeleteError) {
            throw packageDeleteError;
          }
        } else {
          const packageStorage = JSON.parse(localStorage.getItem(PACKAGES_STORAGE_KEY) || '[]');
          const reservationStorage = JSON.parse(localStorage.getItem(RESERVATIONS_STORAGE_KEY) || '[]');

          localStorage.setItem(PACKAGES_STORAGE_KEY, JSON.stringify(packageStorage.filter((item) => Number(item.id) !== Number(packageId))));
          localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(reservationStorage.filter((item) => Number(item.package_id) !== Number(packageId))));
        }

        showToast('Paket, gambarnya, dan semua reservasi terkait berhasil dihapus permanen.', 'success');
        await renderPackageCards();
      } catch (error) {
        console.error('Gagal menghapus paket permanen:', error);
        showToast('Gagal menghapus paket permanen.', 'error');
      }
    }
  });
}

async function renderPackageCards() {
  const list = document.getElementById('admin-package-list');
  if (!list) return;

  list.innerHTML = `
    <div class="empty-state">
      <i class="fas fa-spinner fa-spin"></i>
      <p>Memuat paket wisata...</p>
    </div>
  `;

  const packages = await loadPackagesData({ includeInactive: true });

  if (!packages.length) {
    list.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-box-open"></i>
        <p>Belum ada paket wisata di database Supabase.</p>
      </div>
    `;
    return;
  }

  list.innerHTML = packages.map((pkg) => {
    const isActive = pkg.is_active !== false;
    const statusLabel = isActive ? 'Aktif' : 'Nonaktif';
    const statusClass = isActive ? 'success' : 'warning';

    return `
    <article class="package-item">
      <div class="package-image-wrap">
        ${pkg.image_url ? `<img src="${pkg.image_url}" alt="${pkg.name}" />` : `<div class="package-placeholder"><i class="fas fa-camera"></i></div>`}
      </div>
      <div class="package-body">
        <div class="package-head">
          <h4>${pkg.name}</h4>
          <span class="package-tag">${pkg.category || 'Umum'}</span>
        </div>
        <p>${pkg.description || 'Belum ada deskripsi.'}</p>
        <div class="package-meta">
          <span><strong>${formatCurrency(pkg.price)}</strong></span>
          <span>${pkg.duration || 'Fleksibel'}</span>
          <span>${pkg.target_age || 'Semua usia'}</span>
        </div>
        <div class="package-meta" style="margin-top: 10px;">
          <span class="status-pill ${statusClass}">${statusLabel}</span>
        </div>
        <div class="package-action-group">
          <button type="button" class="btn btn-primary btn-small" data-edit-package="${pkg.id}">
            <i class="fas fa-pen"></i> Edit
          </button>
          ${isActive
            ? `<button type="button" class="btn btn-danger btn-small btn-toggle-active" data-toggle-package-status="${pkg.id}" data-is-active="true">
                <i class="fas fa-toggle-off"></i> Nonaktifkan
              </button>`
            : `<div style="display:flex; gap:8px; width:100%;">
                <button type="button" class="btn btn-small btn-toggle-inactive half-width" data-toggle-package-status="${pkg.id}" data-is-active="false">
                  <i class="fas fa-toggle-on"></i> Aktifkan
                </button>
                <button type="button" class="btn btn-small btn-delete-permanent half-width" data-delete-package-permanent="${pkg.id}">
                  <i class="fas fa-trash"></i> Hapus
                </button>
              </div>`}
        </div>
      </div>
    </article>
  `;
  }).join('');

  list.querySelectorAll('[data-edit-package]').forEach((button) => {
    button.addEventListener('click', () => {
      openPackageEditModal(button.dataset.editPackage);
    });
  });

  list.querySelectorAll('[data-delete-package-permanent]').forEach((button) => {
    button.addEventListener('click', () => {
      confirmPermanentPackageDelete(button.dataset.deletePackagePermanent);
    });
  });

  list.querySelectorAll('[data-toggle-package-status]').forEach((button) => {
    button.addEventListener('click', async () => {
      const id = Number(button.dataset.togglePackageStatus);
      const nextIsActive = button.dataset.isActive !== 'true';

      if (!nextIsActive) {
        const hasPendingReservations = await hasPendingReservationsForPackage(id);

        if (hasPendingReservations) {
          showPopup({
            title: 'Reservasi masih berlangsung',
            message: 'Paket ini masih memiliki reservasi yang sedang menunggu validasi. Selesaikan atau batalkan reservasi tersebut terlebih dahulu sebelum menonaktifkan paket.',
            confirmText: 'Mengerti',
            showCancel: false
          });
          return;
        }
      }

      showPopup({
        title: nextIsActive ? 'Aktifkan paket' : 'Nonaktifkan paket',
        message: nextIsActive
          ? 'Apakah Anda ingin mengaktifkan paket wisata ini agar tampil kembali di halaman publik?'
          : 'Apakah Anda yakin ingin menonaktifkan paket wisata ini? Paket tidak akan tampil di halaman publik, tetapi data reservasinya tetap aman.',
        confirmText: nextIsActive ? 'Aktifkan' : 'Nonaktifkan',
        cancelText: 'Batal',
        showCancel: true,
        onConfirm: async () => {
          const client = window.supabaseClient;

          if (client) {
            const { error } = await client
              .from('packages')
              .update({ is_active: nextIsActive, edited_at: new Date().toISOString() })
              .eq('id', id);

            if (!error) {
              showToast(nextIsActive ? 'Paket wisata berhasil diaktifkan.' : 'Paket wisata berhasil dinonaktifkan.', 'success');
              await renderPackageCards();
              return;
            }

            showToast('Gagal mengubah status paket: ' + (error.message || 'tidak diketahui'), 'error');
            return;
          }

          showToast('Status paket berhasil diperbarui secara lokal.', 'success');
          await renderPackageCards();
        }
      });
    });
  });
}

async function renderActivityCards() {
  const grid = document.querySelector('.aktivitas-grid');
  if (!grid) return;

  await ensureSupabaseRuntime().catch(() => {});
  const packages = await loadPackagesData({ includeInactive: false });
  await updateHeroActivityCount();

  if (!packages.length) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <i class="fas fa-box-open"></i>
        <p>Belum ada paket wisata yang tersedia saat ini.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = packages.map((pkg, index) => {
    const imageUrl = pkg.image_url || pkg.image || 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80';
    const safeName = String(pkg.name || 'Paket Wisata').replace(/'/g, "\\'");

    return `
      <div class="aktivitas-card" data-aos="fade-up" data-delay="${index * 100}">
        <div class="card-img">
          <img src="${imageUrl}" alt="${pkg.name || 'Paket Wisata'}" loading="lazy" />
          <div class="card-overlay">
            <span class="card-tag"><i class="fas fa-tag"></i> ${pkg.category || 'Wisata'}</span>
          </div>
        </div>
        <div class="card-body">
          <h3>${pkg.name || 'Paket Wisata'}</h3>
          <p>${pkg.description || 'Nikmati pengalaman wisata yang menyenangkan bersama keluarga.'}</p>
          <div class="card-meta" style="margin-bottom: 16px;">
            <span><i class="fas fa-clock"></i> ${pkg.duration || 'Fleksibel'}</span>
            <span><i class="fas fa-users"></i> ${pkg.target_age || 'Semua usia'}</span>
          </div>
          <div class="card-meta" style="margin-bottom: 16px;">
            <span><i class="fas fa-wallet"></i> ${formatCurrency(pkg.price || 0)}</span>
          </div>
          <button class="btn btn-primary btn-full" onclick="openBookingModal('${safeName}')">Reservasi</button>
        </div>
      </div>
    `;
  }).join('');
}

function setupPackageFormHandler() {
  const form = document.getElementById('package-form');
  if (!form || form.dataset.packageSubmitBound === 'true') return;

  form.dataset.packageSubmitBound = 'true';

  const newForm = form.cloneNode(true);
  form.parentNode.replaceChild(newForm, form);

  newForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const submitBtn = newForm.querySelector('button[type="submit"]');
    if (submitBtn.disabled) return; // Cegah double click saat loading

    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Menyimpan...';

    try {
      const name = document.getElementById('package-name').value.trim();
      const category = document.getElementById('package-category').value;
      const description = document.getElementById('package-description').value.trim();
      const price = Number(document.getElementById('package-price').value) || 0;
      const duration = document.getElementById('package-duration').value;
      const target_age = document.getElementById('package-target-age').value;
      const imageInput = document.getElementById('package-image');

      let image_url = '';
      if (imageInput && imageInput.files.length > 0) {
        image_url = await uploadPackageImage(imageInput.files[0]);
      }

      const packageData = {
        name,
        category,
        description,
        price,
        duration,
        target_age,
        image_url,
        is_active: true
      };

      const success = await savePackageToSupabase(packageData);

      if (success) {
        if (typeof showToast === 'function') showToast('Paket wisata berhasil ditambahkan!', 'success');
        newForm.reset();
        await renderPackageCards();
      } else {
        showToast('Gagal menambahkan paket wisata ke Supabase.', 'error');
      }
    } catch (err) {
      console.error('Error submit form:', err);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}

// Inisialisasi saat DOM SIAP
document.addEventListener('DOMContentLoaded', () => {
  if (document.body.dataset.publicPageInit === 'true') return;
  document.body.dataset.publicPageInit = 'true';

  populatePackageDropdowns();
  setupPackageFormHandler();
  updateLoginButtonState();

  if (document.getElementById('admin-package-list')) {
    renderPackageCards();
  }

  if (document.querySelector('.aktivitas-grid')) {
    setTimeout(() => {
      renderActivityCards();
      updateHeroActivityCount();
    }, 250);
  }

  hydrateGuestAuthState();
});

async function loadReservationsData(options = {}) {
  const client = window.supabaseClient;
  const rawUserId = options.userId ?? options.userDbId;
  const userId = rawUserId !== undefined && rawUserId !== null && rawUserId !== '' ? Number(rawUserId) : null;

  if (client) {
    try {
      let query = client
        .from('reservations')
        .select('*, packages(name, price, image_url), users(name, username, phone_number)')
        .order('created_at', { ascending: false });

      if (Number.isFinite(userId) && userId > 0) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (!error && Array.isArray(data)) {
        localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(data));
        return data;
      }

      if (error) {
        console.warn('Reservasi gagal dimuat dari Supabase:', error.message);
      }
    } catch (error) {
      console.warn('Supabase reservasi tidak tersedia:', error);
    }
  }

  try {
    const saved = JSON.parse(localStorage.getItem(RESERVATIONS_STORAGE_KEY) || '[]');
    if (!Array.isArray(saved)) return [];

    if (Number.isFinite(userId) && userId > 0) {
      return saved.filter((reservation) => Number(reservation.user_id) === userId);
    }

    return saved;
  } catch (error) {
    console.warn('Gagal membaca reservasi lokal:', error);
  }

  return [];
}

async function hasPendingReservationsForPackage(packageId) {
  const reservations = await loadReservationsData();
  const normalizedPackageId = Number(packageId);

  return reservations.some((reservation) => {
    const reservationPackageId = Number(reservation.package_id ?? reservation.packageId ?? 0);
    const reservationStatus = reservation.status || 'pending';
    return reservationPackageId === normalizedPackageId && reservationStatus === 'pending';
  });
}

async function finalizeReservationDecision(reservationId, status) {
  const client = window.supabaseClient;
  const targetStatus = status === 'approved' ? 'validated' : 'rejected';

  let proofUrl = '';

  if (client) {
    const { data, error } = await client
      .from('reservations')
      .select('payment_proof')
      .eq('id', reservationId)
      .maybeSingle();

    if (!error && data) {
      proofUrl = data.payment_proof || '';
    }
  } else {
    const saved = JSON.parse(localStorage.getItem(RESERVATIONS_STORAGE_KEY) || '[]');
    const reservation = saved.find((item) => Number(item.id) === Number(reservationId));
    proofUrl = reservation?.payment_proof || '';
  }

  if (proofUrl) {
    await deletePackageImageFromStorage(proofUrl);
  }

  if (client) {
    const { error } = await client
      .from('reservations')
      .update({
        status: targetStatus,
        payment_proof: null,
        edited_at: new Date().toISOString()
      })
      .eq('id', reservationId);

    if (error) return { ok: false, error };
  } else {
    const saved = JSON.parse(localStorage.getItem(RESERVATIONS_STORAGE_KEY) || '[]');
    const updated = saved.map((item) => {
      if (Number(item.id) === Number(reservationId)) {
        return {
          ...item,
          status: targetStatus,
          payment_proof: '',
          edited_at: new Date().toISOString()
        };
      }
      return item;
    });

    localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(updated));
  }

  return { ok: true };
}

async function renderAdminReservationTable() {
  const tbody = document.getElementById('admin-reservations-table-body');
  if (!tbody) return;

  const reservations = await loadReservationsData();

  if (!reservations.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8">
          <div class="empty-state small">
            <i class="fas fa-receipt"></i>
            <p>Belum ada reservasi masuk.</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = reservations.map((reservation) => {
    const packageName = reservation.packages?.name || reservation.package_name || 'Paket';
    const customerName = reservation.users?.name || reservation.customer_name || 'Pengunjung';
    const customerPhone = reservation.users?.phone_number || reservation.whatsapp_number || '-';
    const status = reservation.status || 'pending';
    const proofIsDeleted = status === 'validated' || status === 'rejected' || !reservation.payment_proof;
    const statusTextMap = {
      pending: 'Menunggu Validasi',
      validated: 'Disetujui',
      rejected: 'Ditolak'
    };
    const statusClassMap = {
      pending: 'pending',
      validated: 'valid',
      rejected: 'rejected'
    };

    const proofCellHtml = proofIsDeleted
      ? '<span class="text-muted">Bukti dihapus</span>'
      : `<button type="button" class="receipt-link" data-view-proof="${reservation.payment_proof}"><i class="fas fa-image"></i> Lihat Foto</button>`;

    return `
      <tr>
        <td><strong>${reservation.reservation_code || `#${reservation.id}`}</strong></td>
        <td>${customerName}<br><small>${customerPhone}</small></td>
        <td>${packageName}<br><small>${reservation.total_participants || 1} Orang</small></td>
        <td>${reservation.reservation_date || '-'}</td>
        <td>${formatCurrency(reservation.total_amount || 0)}</td>
        <td>
          ${proofCellHtml}
        </td>
        <td>
          <div class="status-stack">
            <span class="admin-badge ${statusClassMap[status] || 'pending'}">${statusTextMap[status] || status}</span>
          </div>
        </td>
        <td>
          ${status === 'validated' || status === 'rejected'
            ? '<span class="text-muted">Selesai</span>'
            : `<div class="admin-action-group">
                <button type="button" class="btn btn-primary btn-small" data-approve-reservation="${reservation.id}">
                  <i class="fas fa-check"></i> Disetujui
                </button>
                <button type="button" class="btn btn-danger btn-small" data-reject-reservation="${reservation.id}">
                  <i class="fas fa-times"></i> Ditolak
                </button>
              </div>`}
        </td>
      </tr>
    `;
  }).join('');

  tbody.querySelectorAll('[data-view-proof]').forEach((button) => {
    button.addEventListener('click', () => {
      const imageUrl = button.dataset.viewProof;
      if (!imageUrl) return;

      showPopup({
        title: 'Bukti Transfer',
        message: `<div class="lgv-proof-image-wrap"><img src="${imageUrl}" alt="Bukti transfer" /></div>`,
        confirmText: 'Tutup',
        showCancel: false
      });
    });
  });

  tbody.querySelectorAll('[data-approve-reservation]').forEach((button) => {
    button.addEventListener('click', async () => {
      const id = Number(button.dataset.approveReservation);
      const result = await finalizeReservationDecision(id, 'approved');

      if (result.ok) {
        showToast('Reservasi berhasil disetujui.', 'success');
        await renderAdminReservationTable();
        return;
      }

      console.error('Gagal menyetujui reservasi:', result.error);
      showToast('Gagal menyetujui reservasi.', 'error');
    });
  });

  tbody.querySelectorAll('[data-reject-reservation]').forEach((button) => {
    button.addEventListener('click', async () => {
      const id = Number(button.dataset.rejectReservation);
      const result = await finalizeReservationDecision(id, 'rejected');

      if (result.ok) {
        showToast('Reservasi berhasil ditolak.', 'success');
        await renderAdminReservationTable();
        return;
      }

      console.error('Gagal menolak reservasi:', result.error);
      showToast('Gagal menolak reservasi.', 'error');
    });
  });
}

async function loadUsersData() {
  const client = window.supabaseClient;

  if (client) {
    try {
      const { data, error } = await client
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(data));
        return data;
      }

      if (error) {
        console.warn('Users gagal dimuat dari Supabase:', error.message);
      }
    } catch (error) {
      console.warn('Supabase users tidak tersedia:', error);
    }
  }

  return getAdminUsers();
}

function getUserStatusText(status) {
  const statusTextMap = {
    pending: 'Menunggu Validasi',
    validated: 'Disetujui',
    rejected: 'Ditolak'
  };

  return statusTextMap[status] || (status || 'Pending');
}

function getUserStatusClass(status) {
  const statusClassMap = {
    pending: 'pending',
    validated: 'valid',
    rejected: 'rejected'
  };

  return statusClassMap[status] || 'pending';
}

function downloadReservationReceipt(reservation) {
  const guest = getCurrentGuestSession();
  const reservationCode = reservation.reservation_code || reservation.id || 'RSV';
  const packageName = reservation.packages?.name || reservation.package_name || 'Paket Wisata';
  const customerName = reservation.customer_name || guest?.name || 'Wisatawan';
  const customerEmail = reservation.email || guest?.email || '-';
  const customerPhone = reservation.whatsapp_number || guest?.phone_number || '-';
  const amount = formatCurrency(reservation.total_amount || 0);
  const date = reservation.reservation_date || '-';
  const participants = reservation.total_participants || 1;
  const createdAt = reservation.created_at || new Date().toISOString();

  if (!window.jspdf || !window.jspdf.jsPDF) {
    const fallbackContent = [
      'Lereng Green View - Receipt',
      '==========================',
      `ID Reservasi: ${reservationCode}`,
      `Nama: ${customerName}`,
      `Paket: ${packageName}`,
      `Tanggal Kunjungan: ${date}`,
      `Jumlah Peserta: ${participants}`,
      `Total Bayar: ${amount}`,
      `Status: Disetujui`,
      `Waktu Diproses: ${new Date(createdAt).toLocaleString('id-ID')}`,
      '',
      'Terima kasih atas kepercayaan Anda.'
    ].join('\n');

    const blob = new Blob([fallbackContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `receipt-${String(reservationCode).replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const primaryColor = [22, 96, 58];
  const textColor = [31, 41, 55];
  const mutedColor = [75, 85, 99];
  const borderColor = [205, 216, 210];
  const softColor = [239, 246, 235];

  doc.setFillColor(236, 244, 232);
  doc.rect(0, 0, pageWidth, 104, 'F');

  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('Lereng Green View', margin, 63);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
  doc.text('Official Receipt', pageWidth - margin, 63, { align: 'right' });

  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, 120, pageWidth - margin * 2, 360, 14, 14, 'S');

  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('DETAIL RESERVASI', margin + 20, 152);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  const leftColX = margin + 20;
  const rightColX = pageWidth / 2 + 20;
  let y = 182;

  const detailRows = [
    ['ID Reservasi', reservationCode],
    ['Nama Pelanggan', customerName],
    ['Email', customerEmail],
    ['Nomor WhatsApp', customerPhone],
    ['Paket Wisata', packageName],
    ['Tanggal Kunjungan', date],
    ['Jumlah Peserta', `${participants} orang`],
    ['Status', 'Disetujui']
  ];

  detailRows.forEach(([label, value]) => {
    doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
    doc.text(label, leftColX, y);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
    doc.text(String(value), rightColX, y, { maxWidth: 220 });
    y += 26;
  });

  doc.setFillColor(softColor[0], softColor[1], softColor[2]);
  doc.roundedRect(margin + 20, 410, pageWidth - (margin + 20) * 2, 52, 10, 10, 'F');

  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('TOTAL PEMBAYARAN', margin + 34, 438);
  doc.setFontSize(17);
  doc.text(amount, pageWidth - margin - 85, 438, { align: 'right' });

  doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Diproses pada: ${new Date(createdAt).toLocaleString('id-ID')}`, margin + 20, 492);
  doc.text('Terima kasih atas kepercayaan Anda.', pageWidth - margin - 20, 492, { align: 'right' });

  doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
  doc.line(margin, pageHeight - 54, pageWidth - margin, pageHeight - 54);
  doc.setTextColor(mutedColor[0], mutedColor[1], mutedColor[2]);
  doc.text('Lereng Green View • Wisata Alam dan Petualangan', margin, pageHeight - 28);

  const fileName = `receipt-${String(reservationCode).replace(/\s+/g, '-').toLowerCase()}.pdf`;
  doc.save(fileName);
}

function reservationMatchesCurrentGuest(reservation, guest) {
  if (!guest) return false;

  const guestId = guest.id ? String(guest.id) : '';
  const reservationUserId = reservation.user_id ? String(reservation.user_id) : '';
  const guestName = guest.name ? String(guest.name).trim().toLowerCase() : '';
  const reservationCustomerName = reservation.customer_name ? String(reservation.customer_name).trim().toLowerCase() : '';
  const guestEmail = guest.email ? String(guest.email).trim().toLowerCase() : '';
  const reservationEmail = reservation.email ? String(reservation.email).trim().toLowerCase() : '';
  const reservationGuestEmail = reservation.user?.email ? String(reservation.user.email).trim().toLowerCase() : '';
  const reservationPhone = reservation.whatsapp_number ? String(reservation.whatsapp_number).trim() : '';
  const guestPhone = guest.phone_number ? String(guest.phone_number).trim() : '';

  if (guestId && reservationUserId && reservationUserId === guestId) return true;
  if (guestEmail && (reservationEmail === guestEmail || reservationGuestEmail === guestEmail)) return true;
  if (guestPhone && reservationPhone && reservationPhone === guestPhone) return true;

  if (!guestId && !guestEmail && !guestPhone && guestName && guestName !== 'google user') {
    if (reservationCustomerName === guestName || reservationCustomerName.includes(guestName) || guestName.includes(reservationCustomerName)) {
      return true;
    }
  }

  return false;
}

async function renderDashboardReservations() {
  const guest = getCurrentGuestSession();
  const nameNode = document.getElementById('dashboard-user-name');
  const emailNode = document.getElementById('dashboard-user-email');
  const tbody = document.getElementById('dashboard-reservation-body');

  if (!tbody) return;

  if (!guest) {
    window.location.href = 'index.html';
    return;
  }

  if (nameNode) {
    nameNode.textContent = `Halo, ${guest.name || 'Wisatawan'}!`;
  }

  if (emailNode) {
    emailNode.textContent = guest.email || 'guest@lerenggreenview.com';
  }

  const guestDbUserId = await resolveCurrentGuestDbUserId();
  const reservations = await loadReservationsData({ userId: guestDbUserId ?? undefined });
  const userReservations = reservations.filter((reservation) => {
    if (guestDbUserId && Number(reservation.user_id) === guestDbUserId) return true;
    return false;
  });

  if (!userReservations.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6">
          <div class="empty-state small">
            <i class="fas fa-receipt"></i>
            <p>Belum ada reservasi untuk akun Anda.</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = userReservations.map((reservation) => {
    const packageName = reservation.packages?.name || reservation.package_name || 'Paket Wisata';
    const status = reservation.status || 'pending';
    const isApproved = status === 'validated';
    const receiptButton = isApproved
      ? `<button type="button" class="btn btn-primary btn-small" data-download-receipt="${reservation.id}"><i class="fas fa-download"></i> Download Receipt</button>`
      : '<span class="text-muted">Belum tersedia</span>';

    return `
      <tr>
        <td><strong>${reservation.reservation_code || `RSV-${reservation.id}`}</strong></td>
        <td>${packageName}<br><small>${reservation.total_participants || 1} Orang</small></td>
        <td>${reservation.reservation_date || '-'}</td>
        <td>${formatCurrency(reservation.total_amount || 0)}</td>
        <td><span class="badge ${getUserStatusClass(status)}">${getUserStatusText(status)}</span></td>
        <td>${receiptButton}</td>
      </tr>
    `;
  }).join('');

  tbody.querySelectorAll('[data-download-receipt]').forEach((button) => {
    button.addEventListener('click', () => {
      const reservationId = Number(button.dataset.downloadReceipt);
      const reservation = userReservations.find((item) => Number(item.id) === reservationId);
      if (reservation) {
        downloadReservationReceipt(reservation);
      }
    });
  });
}

async function renderAdminUsersTable() {
  const tbody = document.getElementById('admin-users-table-body');
  if (!tbody) return;

  const users = await loadUsersData();

  if (!users.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5">
          <div class="empty-state small">
            <i class="fas fa-users"></i>
            <p>Belum ada data pengguna.</p>
          </div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = users.map((user) => `
    <tr>
      <td>${user.name || user.username || '-'}</td>
      <td>${user.email || '-'}</td>
      <td>${user.phone_number || '-'}</td>
      <td><span class="admin-badge ${user.role === 'admin' ? 'valid' : 'pending'}">${user.role || 'guest'}</span></td>
      <td><span class="admin-badge valid">Aktif</span></td>
    </tr>
  `).join('');
}

function setupAdminPackageForm() {
  const form = document.getElementById('package-form');
  if (!form || form.dataset.adminPackageSubmitBound === 'true') return;

  form.dataset.adminPackageSubmitBound = 'true';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('package-name').value.trim();
    const category = document.getElementById('package-category').value.trim();
    const description = document.getElementById('package-description').value.trim();
    const price = document.getElementById('package-price').value.trim();
    const duration = document.getElementById('package-duration').value.trim();
    const targetAge = document.getElementById('package-target-age').value.trim();
    const imageInput = document.getElementById('package-image');

    if (!name || !price) {
      showToast('Nama paket dan harga wajib diisi.', 'error');
      return;
    }

    try {
      let imageUrl = 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80';

      if (imageInput && imageInput.files && imageInput.files[0]) {
        imageUrl = await uploadPackageImage(imageInput.files[0]) || imageUrl;
      }

      const nextPackage = {
        name,
        category: category || 'Umum',
        description: description || 'Paket wisata baru.',
        price: Number(price) || 0,
        duration: duration || 'Fleksibel',
        target_age: targetAge || 'Semua usia',
        image_url: imageUrl
      };

      const savedToSupabase = await savePackageToSupabase(nextPackage);

      if (!savedToSupabase) {
        const packages = getPackages();
        packages.push({
          id: Date.now(),
          ...nextPackage,
          targetAge: nextPackage.target_age,
          image: imageUrl
        });
        localStorage.setItem(PACKAGES_STORAGE_KEY, JSON.stringify(packages));
      }

      form.reset();
      renderPackageCards();
      showToast('Paket wisata berhasil ditambahkan.', 'success');
    } catch (error) {
      console.error('Tambah paket gagal:', error);
      showToast('Gagal menambahkan paket wisata.', 'error');
    }
  });
}

function setupPasswordToggleButtons() {
  const toggleButtons = document.querySelectorAll('.password-toggle-btn');

  toggleButtons.forEach((button) => {
    const targetId = button.dataset.target;
    const input = targetId ? document.getElementById(targetId) : null;

    if (!input || button.dataset.bound === 'true') return;

    button.dataset.bound = 'true';
    button.addEventListener('click', () => {
      const shouldShow = input.type === 'password';
      input.type = shouldShow ? 'text' : 'password';
      button.innerHTML = shouldShow ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
      button.setAttribute('aria-label', shouldShow ? 'Sembunyikan password' : 'Lihat password');
    });
  });
}

function setupGuestLogoutButton() {
  const logoutButton = document.getElementById('guest-logout-btn');
  if (!logoutButton || logoutButton.dataset.bound === 'true') return;
  logoutButton.dataset.bound = 'true';

  logoutButton.addEventListener('click', async () => {
    sessionStorage.setItem('lgv_guest_logout_in_progress', 'true');

    try {
      const client = window.supabaseClient;
      if (client && client.auth && typeof client.auth.signOut === 'function') {
        await client.auth.signOut();
      }
    } catch (error) {
      console.warn('Logout guest gagal saat signOut Supabase:', error);
    } finally {
      clearGuestSession();
      sessionStorage.removeItem('lgv_guest_logout_in_progress');
      updateLoginButtonState();
      window.location.replace('index.html');
    }
  });
}

async function refreshAdminSectionData(targetId) {
  if (!targetId) return;

  try {
    if (targetId === 'panel-validasi') {
      await renderAdminReservationTable();
    }

    if (targetId === 'panel-users') {
      await renderAdminUsersTable();
    }

    if (targetId === 'panel-packages') {
      populatePackageDropdowns();
      await renderPackageCards();
    }
  } catch (error) {
    console.error('Gagal me-refresh data admin untuk panel:', targetId, error);
  }
}

function setupAdminNavigation() {
  const navButtons = document.querySelectorAll('[data-admin-panel]');
  const panels = document.querySelectorAll('.admin-panel');

  if (!navButtons.length || !panels.length) return;

  async function activatePanel(targetId) {
    navButtons.forEach((item) => item.classList.toggle('active', item.dataset.adminPanel === targetId));
    panels.forEach((panel) => {
      panel.classList.toggle('active', panel.id === targetId);
    });
    localStorage.setItem(ADMIN_SECTION_KEY, targetId);
    await refreshAdminSectionData(targetId);
  }

  const savedSection = localStorage.getItem(ADMIN_SECTION_KEY) || 'panel-validasi';
  const matchedButton = [...navButtons].find((button) => button.dataset.adminPanel === savedSection);
  if (matchedButton) {
    activatePanel(savedSection);
  }

  navButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activatePanel(button.dataset.adminPanel);
    });
  });
}

async function loginAdminToSupabase(username, password) {
  const client = window.supabaseClient;

  if (!client) {
    const users = getAdminUsers();
    for (const user of users) {
      if (user.username === username && await passwordMatches(password, user.password)) {
        return user;
      }
    }

    return null;
  }

  try {
    const { data, error } = await client
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('role', 'admin')
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) return null;
    const isValid = await passwordMatches(password, data.password);
    if (!isValid) return null;
    return data;
  } catch (error) {
    console.warn('Login admin via Supabase gagal:', error.message || error);
    return null;
  }
}

async function resetAdminPassword(oldPassword, newPassword) {
  const session = getAdminSession();
  const username = session?.username;

  if (!username) {
    throw new Error('Sesi admin tidak ditemukan. Silakan login ulang.');
  }

  const client = window.supabaseClient;
  const newHashedPassword = await hashPassword(newPassword);

  if (!client) {
    const users = getAdminUsers();
    const userIndex = users.findIndex((user) => user.username === username && user.role === 'admin');

    if (userIndex === -1) {
      throw new Error('Akun admin tidak ditemukan.');
    }

    const user = users[userIndex];
    const isOldPasswordValid = await passwordMatches(oldPassword, user.password);

    if (!isOldPasswordValid) {
      throw new Error('Password lama tidak sesuai.');
    }

    users[userIndex].password = newHashedPassword;
    localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(users));
    return true;
  }

  const { data, error: fetchError } = await client
    .from('users')
    .select('*')
    .eq('username', username)
    .eq('role', 'admin')
    .maybeSingle();

  if (fetchError) {
    throw fetchError;
  }

  if (!data) {
    throw new Error('Akun admin tidak ditemukan di database.');
  }

  const isOldPasswordValid = await passwordMatches(oldPassword, data.password);
  if (!isOldPasswordValid) {
    throw new Error('Password lama tidak sesuai.');
  }

  const { error: updateError } = await client
    .from('users')
    .update({
      password: newHashedPassword,
      edited_at: new Date().toISOString()
    })
    .eq('id', data.id);

  if (updateError) {
    throw updateError;
  }

  return true;
}

function openResetPasswordPopup() {
  showPopup({
    title: 'Ganti Password Admin',
    message: `
      <div class="admin-reset-password-form" style="display:flex; flex-direction:column; gap:12px; min-width:320px;">
        <div class="form-group" style="margin:0;">
          <label for="admin-old-password" style="display:block; margin-bottom:6px; font-weight:600;">Password Lama</label>
          <input id="admin-old-password" type="password" placeholder="Masukkan password lama" style="width:100%; padding:10px 12px; border:1px solid #d9dfe5; border-radius:10px;" required />
        </div>
        <div class="form-group" style="margin:0;">
          <label for="admin-new-password" style="display:block; margin-bottom:6px; font-weight:600;">Password Baru</label>
          <input id="admin-new-password" type="password" placeholder="Masukkan password baru" style="width:100%; padding:10px 12px; border:1px solid #d9dfe5; border-radius:10px;" required />
        </div>
        <div class="form-group" style="margin:0;">
          <label for="admin-confirm-password" style="display:block; margin-bottom:6px; font-weight:600;">Konfirmasi Password Baru</label>
          <input id="admin-confirm-password" type="password" placeholder="Ulangi password baru" style="width:100%; padding:10px 12px; border:1px solid #d9dfe5; border-radius:10px;" required />
        </div>
      </div>
    `,
    confirmText: 'Simpan Password',
    cancelText: 'Batal',
    showCancel: true,
    onConfirm: async () => {
      const oldPassword = document.getElementById('admin-old-password')?.value.trim() || '';
      const newPassword = document.getElementById('admin-new-password')?.value.trim() || '';
      const confirmPassword = document.getElementById('admin-confirm-password')?.value.trim() || '';

      if (!oldPassword || !newPassword || !confirmPassword) {
        showToast('Semua field password harus diisi.', 'error');
        return;
      }

      if (newPassword.length < 6) {
        showToast('Password baru minimal 6 karakter.', 'error');
        return;
      }

      if (newPassword !== confirmPassword) {
        showToast('Konfirmasi password baru tidak sama.', 'error');
        return;
      }

      try {
        await resetAdminPassword(oldPassword, newPassword);
        showToast('Password admin berhasil diubah.', 'success');
      } catch (error) {
        console.error('Gagal reset password admin:', error);
        showToast(error.message || 'Gagal mengubah password admin.', 'error');
      }
    }
  });
}

function initAdminPage() {
  if (document.body.dataset.adminPageInit === 'true') return;
  document.body.dataset.adminPageInit = 'true';

  const adminLoginForm = document.getElementById('admin-login-form');
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const username = document.getElementById('admin-username').value.trim();
      const password = document.getElementById('admin-password').value.trim();

      const matchedUser = await loginAdminToSupabase(username, password);

      if (!matchedUser) {
        showToast('Username atau password admin salah.', 'error');
        return;
      }

      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({
        username: matchedUser.username,
        name: matchedUser.name || matchedUser.username,
        role: 'admin'
      }));

      showToast('Login admin berhasil.', 'success');
      window.location.href = 'admin.html';
    });
  }

  setupPasswordToggleButtons();

  setupGuestLogoutButton();

  if (document.body.classList.contains('dashboard-page')) {
    renderDashboardReservations();
  }

  if (document.body.classList.contains('admin-page')) {
    if (!isAdminLoggedIn()) {
      window.location.href = 'admin-login.html';
      return;
    }

    const session = getAdminSession();
    const adminName = document.getElementById('admin-profile-name');
    if (adminName && session) {
      adminName.textContent = session.name || session.username;
    }

    const sidebarToggleBtn = document.getElementById('admin-sidebar-toggle');
    const mobileSidebarOpenBtn = document.getElementById('admin-sidebar-open-mobile');

    const syncSidebarState = () => {
      const collapsed = document.body.classList.contains('admin-sidebar-collapsed');
      if (sidebarToggleBtn) {
        sidebarToggleBtn.setAttribute('aria-label', collapsed ? 'Buka sidebar' : 'Tutup sidebar');
        sidebarToggleBtn.setAttribute('title', collapsed ? 'Buka sidebar' : 'Tutup sidebar');
      }
      if (mobileSidebarOpenBtn) {
        mobileSidebarOpenBtn.setAttribute('aria-label', collapsed ? 'Buka sidebar' : 'Tutup sidebar');
        mobileSidebarOpenBtn.setAttribute('title', collapsed ? 'Buka sidebar' : 'Tutup sidebar');
      }
    };

    const toggleSidebar = () => {
      const isMobile = window.matchMedia('(max-width: 899px)').matches;
      if (!isMobile) return;
      const isCollapsed = document.body.classList.toggle('admin-sidebar-collapsed');
      syncSidebarState();
      if (isCollapsed) {
        sidebarToggleBtn && sidebarToggleBtn.setAttribute('aria-expanded', 'false');
        mobileSidebarOpenBtn && mobileSidebarOpenBtn.setAttribute('aria-expanded', 'false');
      } else {
        sidebarToggleBtn && sidebarToggleBtn.setAttribute('aria-expanded', 'true');
        mobileSidebarOpenBtn && mobileSidebarOpenBtn.setAttribute('aria-expanded', 'true');
      }
    };

    if (sidebarToggleBtn) {
      sidebarToggleBtn.addEventListener('click', toggleSidebar);
      sidebarToggleBtn.setAttribute('aria-expanded', 'true');
    }

    if (mobileSidebarOpenBtn) {
      mobileSidebarOpenBtn.addEventListener('click', () => {
        document.body.classList.remove('admin-sidebar-collapsed');
        syncSidebarState();
        if (sidebarToggleBtn) {
          sidebarToggleBtn.setAttribute('aria-expanded', 'true');
        }
      });
      mobileSidebarOpenBtn.setAttribute('aria-expanded', 'false');
    }

    window.addEventListener('resize', () => {
      const isMobile = window.matchMedia('(max-width: 899px)').matches;
      if (!isMobile) {
        document.body.classList.remove('admin-sidebar-collapsed');
      }
      syncSidebarState();
    });

    syncSidebarState();

    const logoutBtn = document.getElementById('logout-admin-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (event) => {
        event.preventDefault();
        clearAdminSession();
        window.location.replace('admin-login.html');
      });
    }

    const resetPasswordBtn = document.getElementById('admin-reset-password-btn');
    if (resetPasswordBtn) {
      resetPasswordBtn.addEventListener('click', () => {
        const targetButton = document.querySelector('[data-admin-panel="panel-reset-password"]');
        if (targetButton) {
          targetButton.click();
        }
      });
    }

    const resetPasswordForm = document.getElementById('admin-reset-password-form');
    if (resetPasswordForm) {
      const submitButton = document.getElementById('admin-save-password-btn');
      const originalButtonHtml = submitButton ? submitButton.innerHTML : '';

      const setSubmitLoading = (isLoading) => {
        if (!submitButton) return;
        submitButton.disabled = isLoading;
        submitButton.classList.toggle('btn-loading', isLoading);

        if (isLoading) {
          submitButton.innerHTML = '<span class="btn-spinner" aria-hidden="true"></span> Menyimpan...';
          return;
        }

        submitButton.innerHTML = originalButtonHtml;
      };

      resetPasswordForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const oldPassword = document.getElementById('admin-old-password')?.value.trim() || '';
        const newPassword = document.getElementById('admin-new-password')?.value.trim() || '';
        const confirmPassword = document.getElementById('admin-confirm-password')?.value.trim() || '';

        if (!oldPassword || !newPassword || !confirmPassword) {
          showToast('Semua field password harus diisi.', 'error');
          return;
        }

        if (newPassword.length < 6) {
          showToast('Password baru minimal 6 karakter.', 'error');
          return;
        }

        if (newPassword !== confirmPassword) {
          showToast('Konfirmasi password baru tidak sama.', 'error');
          return;
        }

        try {
          setSubmitLoading(true);
          await resetAdminPassword(oldPassword, newPassword);
          showToast('Password admin berhasil diubah.', 'success');
          resetPasswordForm.reset();
        } catch (error) {
          console.error('Gagal reset password admin:', error);
          showToast(error.message || 'Gagal mengubah password admin.', 'error');
        } finally {
          setSubmitLoading(false);
        }
      });
    }

    setupAdminNavigation();
    setupPackageFormHandler();
    renderPackageCards();
    renderAdminUsersTable();
    renderAdminReservationTable();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdminPage);
} else {
  initAdminPage();
}

/* =============================================
   MODAL LOGIC (LOGIN, RESERVASI, PAYMENT)
   ============================================= */
const modalOverlay = document.getElementById('modal-overlay');
const loginModal = document.getElementById('login-modal');
const bookingModal = document.getElementById('booking-modal');
const paymentModal = document.getElementById('payment-modal');

function closeModals() {
  if (!modalOverlay || !loginModal || !bookingModal || !paymentModal) return;
  modalOverlay.classList.remove('active');
  loginModal.classList.remove('active');
  bookingModal.classList.remove('active');
  paymentModal.classList.remove('active');
}

function openLoginModal(e) {
  if (e) e.preventDefault();
  if (!modalOverlay || !loginModal || !bookingModal || !paymentModal) return;
  closeModals();
  modalOverlay.classList.add('active');
  loginModal.classList.add('active');
}

async function syncBookingPackageOptions(preselectedName = '') {
  const select = document.getElementById('booking-package');
  if (!select) return;

  const packages = await loadPackagesData({ includeInactive: false });
  select.innerHTML = '<option value="" disabled selected>Pilih paket...</option>' + packages.map((pkg) => `
    <option value="${pkg.id}" data-price="${Number(pkg.price || 0)}" data-name="${pkg.name}">${pkg.name}</option>
  `).join('');

  const matchName = preselectedName || select.dataset.defaultName;
  if (matchName) {
    for (let i = 0; i < select.options.length; i++) {
      if (select.options[i].text.includes(matchName)) {
        select.selectedIndex = i;
        document.getElementById('booking-package-id').value = select.value;
        break;
      }
    }
  }
}

function openBookingModal(packageName) {
  const currentGuest = getCurrentGuestSession();
  if (!currentGuest) {
    if (packageName) {
      sessionStorage.setItem(PENDING_PACKAGE_KEY, packageName);
    }
    openLoginModal();
    return;
  }

  if (!modalOverlay || !bookingModal || !paymentModal) return;
  closeModals();
  modalOverlay.classList.add('active');
  bookingModal.classList.add('active');

  const select = document.getElementById('booking-package');
  if (!select) return;

  syncBookingPackageOptions(packageName);

  for (let i = 0; i < select.options.length; i++) {
    if (select.options[i].text.includes(packageName)) {
      select.selectedIndex = i;
      document.getElementById('booking-package-id').value = select.value;
      break;
    }
  }
}

async function handleGoogleLogin() {
  sessionStorage.setItem('lgv_google_auth_pending', 'true');

  try {
    const ready = await ensureSupabaseRuntime();
    const client = window.supabaseClient;

    if (ready && client && client.auth) {
      try {
        const redirectUrl = `${window.location.origin}${window.location.pathname}`;
        const { error } = await client.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: redirectUrl,
            queryParams: {
              access_type: 'offline',
              prompt: 'consent'
            }
          }
        });

        if (error) throw error;

        showToast('Mengalihkan ke Google untuk masuk...', 'success');
        return;
      } catch (error) {
        console.error('Google login gagal:', error);
        sessionStorage.removeItem('lgv_google_auth_pending');
        showToast('Login Google gagal. Silakan coba lagi.', 'error');
        return;
      }
    }
  } catch (error) {
    console.warn('Supabase runtime tidak tersedia, lanjutkan mode demo:', error);
    sessionStorage.removeItem('lgv_google_auth_pending');
  }

  const fallbackUser = {
    id: `guest-${Date.now()}`,
    name: 'Google User',
    email: 'google-user@example.com'
  };

  persistGuestSession(fallbackUser);
  updateLoginButtonState();
  closeModals();

  const pendingPackageName = sessionStorage.getItem(PENDING_PACKAGE_KEY);
  if (pendingPackageName) {
    sessionStorage.removeItem(PENDING_PACKAGE_KEY);
    openBookingModal(pendingPackageName);
    return;
  }

  showToast('Login demo berhasil.', 'success');
}

function handleBookingSubmit(e) {
  e.preventDefault();
  const select = document.getElementById('booking-package');
  const packageId = document.getElementById('booking-package-id');
  const packageName = select && select.selectedOptions[0] ? select.selectedOptions[0].dataset.name : 'Paket';
  const price = select && select.selectedOptions[0] ? Number(select.selectedOptions[0].dataset.price || 0) : 0;

  if (!select || !select.value) {
    showToast('Pilih paket wisata terlebih dahulu.', 'error');
    return;
  }

  if (packageId) {
    packageId.value = String(select.value);
  }

  const date = document.getElementById('booking-date').value;
  const participants = document.getElementById('booking-participants').value;
  const fullName = document.getElementById('booking-name').value.trim();
  const whatsapp = document.getElementById('booking-whatsapp').value.trim();

  if (!date || !participants || !fullName || !whatsapp) {
    showToast('Lengkapi semua data reservasi.', 'error');
    return;
  }

  const bookingData = {
    package_id: Number(select.value),
    package_name: packageName,
    reservation_date: date,
    total_participants: Number(participants),
    customer_name: fullName,
    whatsapp_number: whatsapp,
    total_amount: Number(price) || 0
  };

  sessionStorage.setItem('lgv_pending_reservation', JSON.stringify(bookingData));
  const paymentTotal = document.getElementById('payment-total-amount');
  if (paymentTotal) {
    paymentTotal.textContent = formatCurrency(bookingData.total_amount);
  }

  if (!modalOverlay || !paymentModal || !bookingModal) return;
  closeModals();
  modalOverlay.classList.add('active');
  paymentModal.classList.add('active');
}

async function handlePaymentSubmit(e) {
  e.preventDefault();

  const fileInput = document.getElementById('payment-proof-file');
  if (!fileInput || !fileInput.files || !fileInput.files[0]) {
    showToast('Silakan upload bukti pembayaran.', 'error');
    return;
  }

  const bookingData = JSON.parse(sessionStorage.getItem('lgv_pending_reservation') || '{}');
  if (!bookingData.package_id) {
    showToast('Data reservasi tidak ditemukan. Silakan ulangi pemesanan.', 'error');
    return;
  }

  const fallbackReservation = {
    ...bookingData,
    id: Date.now(),
    payment_proof: '',
    status: 'pending',
    created_at: new Date().toISOString(),
    edited_at: new Date().toISOString()
  };

  try {
    const client = window.supabaseClient;
    let paymentProofUrl = '';
    let authenticatedUser = getCurrentGuestSession();

    if (client) {
      try {
        const { data: { session }, error: sessionError } = await client.auth.getSession();
        if (sessionError) throw sessionError;

        authenticatedUser = session && session.user ? {
          id: session.user.id,
          name: session.user.user_metadata?.full_name || session.user.email || bookingData.customer_name,
          email: session.user.email || ''
        } : authenticatedUser;

        paymentProofUrl = await uploadPackageImage(fileInput.files[0]);
      } catch (error) {
        console.warn('Upload bukti gagal, lanjutkan dengan fallback lokal:', error);
        paymentProofUrl = '';
      }

      const authUserEmail = (authenticatedUser && authenticatedUser.email) || `${bookingData.whatsapp_number || 'guest'}@guest.local`;
      const authGoogleId = authenticatedUser && authenticatedUser.id ? String(authenticatedUser.id) : '';

      let userId = null;
      try {
        const guestUser = await ensureGuestUserInDatabase(authenticatedUser || {
          id: `guest-${Date.now()}`,
          name: bookingData.customer_name,
          email: authUserEmail
        });

        if (guestUser && guestUser.id) {
          userId = Number(guestUser.id);
        }
      } catch (error) {
        console.warn('Penyusunan user reservasi gagal:', error);
      }

      if (!userId) {
        const { data: fallbackUser, error: fallbackError } = await client
          .from('users')
          .select('id')
          .or([authUserEmail ? `email.eq.${authUserEmail}` : '', authGoogleId ? `google_id.eq.${authGoogleId}` : ''].filter(Boolean).join(','))
          .limit(1);

        if (!fallbackError && Array.isArray(fallbackUser) && fallbackUser.length > 0) {
          userId = Number(fallbackUser[0].id);
        }
      }

      if (userId) {
        const reservationCode = `RSV-${Date.now().toString().slice(-6)}`;
        const { error } = await client.from('reservations').insert([
          {
            reservation_code: reservationCode,
            user_id: Number(userId),
            package_id: Number(bookingData.package_id),
            reservation_date: bookingData.reservation_date,
            total_participants: Number(bookingData.total_participants),
            customer_name: bookingData.customer_name,
            whatsapp_number: bookingData.whatsapp_number,
            total_amount: Number(bookingData.total_amount),
            payment_proof: paymentProofUrl || '',
            status: 'pending'
          }
        ]);

        if (!error) {
          await syncGuestProfileFromBooking(bookingData, userId, authenticatedUser);
          sessionStorage.removeItem('lgv_pending_reservation');
          closeModals();
          showToast('Pembayaran berhasil diunggah! Menunggu validasi admin.', 'success');
          window.location.href = 'dashboard.html';
          return;
        }

        console.warn('Insert reservasi Supabase gagal:', error);
      }
    }

    const localReservations = JSON.parse(localStorage.getItem(RESERVATIONS_STORAGE_KEY) || '[]');
    localReservations.unshift({
      ...fallbackReservation,
      payment_proof: paymentProofUrl || ''
    });
    localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(localReservations));

    sessionStorage.removeItem('lgv_pending_reservation');
    closeModals();
    showToast('Reservasi berhasil disimpan secara lokal. Tunggu validasi admin.', 'success');
    window.location.href = 'dashboard.html';
  } catch (error) {
    console.error('Reservasi gagal disimpan:', error);

    const localReservations = JSON.parse(localStorage.getItem(RESERVATIONS_STORAGE_KEY) || '[]');
    localReservations.unshift({
      ...fallbackReservation,
      payment_proof: ''
    });
    localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(localReservations));

    sessionStorage.removeItem('lgv_pending_reservation');
    closeModals();
    showToast('Reservasi tersimpan secara lokal. Silakan cek statusnya nanti.', 'success');
    window.location.href = 'dashboard.html';
  }
}

if (document.getElementById('booking-package')) {
  syncBookingPackageOptions();
}
