/* QhawAI Docs — main.js */

document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initAccordion();
  initCopyButtons();
  initTOC();
  initSearch();
  initVideo();
});

function initSidebar() {
  const hamburger = document.querySelector('.hamburger');
  const sidebar   = document.querySelector('.sidebar');
  const overlay   = document.querySelector('.sidebar-overlay');
  if (!hamburger || !sidebar) return;

  function open()  { sidebar.classList.add('open'); overlay?.classList.add('show'); }
  function close() { sidebar.classList.remove('open'); overlay?.classList.remove('show'); }

  hamburger.addEventListener('click', () => sidebar.classList.contains('open') ? close() : open());
  overlay?.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

function initAccordion() {
  document.querySelectorAll('.acc-header').forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen = btn.classList.contains('open');
      document.querySelectorAll('.acc-header').forEach(b => {
        b.classList.remove('open');
        const body = document.getElementById('acc-' + b.dataset.acc);
        if (body) body.classList.remove('open');
      });
      if (!isOpen) {
        btn.classList.add('open');
        const body = document.getElementById('acc-' + btn.dataset.acc);
        if (body) body.classList.add('open');
      }
    });
  });
}

function initTOC() {
  const links = document.querySelectorAll('.toc-link[href^="#"]');
  if (!links.length) return;
  const targets = [];
  links.forEach(l => {
    const id = l.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) targets.push({ el, link: l });
  });
  if (!targets.length) return;
  const activate = idx => {
    links.forEach(l => l.classList.remove('toc-active'));
    if (targets[idx]) targets[idx].link.classList.add('toc-active');
  };
  const onScroll = () => {
    const top = window.scrollY + 90;
    let cur = 0;
    targets.forEach((t, i) => { if (t.el.offsetTop <= top) cur = i; });
    activate(cur);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initSearch() {
  const input = document.getElementById('page-search');
  const drop  = document.getElementById('search-drop');
  if (!input || !drop) return;
  const headings = Array.from(document.querySelectorAll('h2[id], h3[id]'));
  const render = q => {
    if (!q) { drop.classList.remove('open'); return; }
    const hits = headings.filter(h => h.textContent.toLowerCase().includes(q.toLowerCase()));
    drop.innerHTML = hits.length
      ? hits.map(h => `<a class="search-item" href="#${h.id}"><span class="search-item-tag">${h.tagName==='H3'?'›':'§'}</span>${h.textContent.trim()}</a>`).join('')
      : '<div class="search-empty">Sin resultados</div>';
    drop.classList.add('open');
  };
  input.addEventListener('input', () => render(input.value.trim()));
  input.addEventListener('focus',  () => { if (input.value.trim()) render(input.value.trim()); });
  drop.addEventListener('click', e => {
    if (e.target.closest('.search-item')) { drop.classList.remove('open'); input.value = ''; }
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.search-wrap') && !e.target.closest('#search-drop')) drop.classList.remove('open');
  });
}

function initCopyButtons() {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const block = btn.closest('.code-wrap');
      const pre   = block?.querySelector('pre');
      if (!pre) return;
      navigator.clipboard.writeText(pre.innerText).then(() => {
        const orig = btn.textContent;
        btn.textContent = 'Copiado';
        btn.style.color = '#10B981';
        setTimeout(() => { btn.textContent = orig; btn.style.color = ''; }, 1800);
      });
    });
  });
}

function initVideo() {
  const wrap = document.getElementById('heroVideoWrap');
  const heroVideo = document.getElementById('heroVideo');
  const playBtn = document.getElementById('heroVideoPlay');
  const expandBtn = document.getElementById('heroVideoExpand');
  const modal = document.getElementById('videoModal');
  const backdrop = document.getElementById('videoModalBackdrop');
  const closeBtn = document.getElementById('videoModalClose');
  const modalVideo = document.getElementById('modalVideo');
  const modalBody = document.getElementById('videoModalBody');

  if (!heroVideo || !modal) return;

  /* Reproducir / pausar hero */
  if (playBtn) {
    playBtn.addEventListener('click', e => {
      e.stopPropagation();
      heroVideo.play();
      playBtn.classList.add('playing');
    });
    heroVideo.addEventListener('click', () => {
      if (heroVideo.paused) {
        heroVideo.play();
        playBtn.classList.add('playing');
      } else {
        heroVideo.pause();
        playBtn.classList.remove('playing');
      }
    });
    heroVideo.addEventListener('pause', () => playBtn.classList.remove('playing'));
    heroVideo.addEventListener('ended', () => playBtn.classList.remove('playing'));
  }

  /* Abrir modal */
  const openModal = () => {
    modal.classList.add('open');
    modalBody.classList.remove('zoomed');
    modalVideo.currentTime = heroVideo.currentTime;
    if (!heroVideo.paused) modalVideo.play();
    document.body.style.overflow = 'hidden';
  };

  expandBtn?.addEventListener('click', e => { e.stopPropagation(); openModal(); });
  heroVideo?.addEventListener('dblclick', openModal);

  /* Cerrar modal */
  const closeModal = () => {
    modal.classList.remove('open');
    modalVideo.pause();
    document.body.style.overflow = '';
  };
  closeBtn?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

  /* Zoom con click en el modal */
  modalBody?.addEventListener('click', e => {
    if (e.target === modalVideo) {
      modalBody.classList.toggle('zoomed');
      if (modalBody.classList.contains('zoomed')) {
        modalVideo.style.transform = 'scale(1.5)';
      } else {
        modalVideo.style.transform = 'scale(1)';
      }
    }
  });
}
