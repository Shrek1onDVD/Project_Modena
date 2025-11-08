// Theme management: default to light on main load; allow toggle
(function initThemeAndScroll(){
  // Always start at top and in light mode on main page
  if (location.pathname === '/' || location.pathname.endsWith('index.html')){
    // Force scroll to top immediately and repeatedly to ensure it works
    window.scrollTo(0,0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Force again after a short delay in case of timing issues
    setTimeout(()=> {
      window.scrollTo(0,0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 10);
    
    // Re-enable smooth scrolling after forcing position
    setTimeout(()=> {
      document.body.classList.remove('main-page');
    }, 100);
    
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme','light');

    // If returning from legal pages, skip loader and slide page in from left
    const fromSlide = sessionStorage.getItem('skipLoader') === '1';
    if (fromSlide) {
      // mark so loader knows to skip as well
      document.documentElement.dataset.skipLoader = '1';
      const wrapper = document.getElementById('page-wrapper');
      if (wrapper) {
        // Start from left side (matching the slide-out direction)
        wrapper.style.transform = 'translateX(-100vw)';
        wrapper.style.transition = 'none'; // no transition for initial positioning
        wrapper.style.opacity = '1'; // ensure it's visible
        
        // Force a reflow, then animate smoothly to center
        wrapper.offsetHeight;
        
        requestAnimationFrame(()=> {
          wrapper.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
          wrapper.style.transform = 'translateX(0)';
        });
        
        const cleanup = ()=>{
          wrapper.style.transition = '';
          wrapper.style.transform = '';
          wrapper.style.opacity = '';
          wrapper.removeEventListener('transitionend', cleanup);
        };
        wrapper.addEventListener('transitionend', cleanup);
      }
      // clear the flag shortly after paint so future visits show loader normally
      setTimeout(()=> sessionStorage.removeItem('skipLoader'), 1500);
    }
  } else {
    // for legal pages we don't force, but respect saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') document.documentElement.classList.add('dark');
  }
})();

// Loader: staged animation inspired by reference timing (fast -> medium -> slow tail)
(function loaderStaged(){
  const root = document.getElementById('loader');
  if (!root) return;
  // Skip loader if navigating back from legal pages via slide transition
  const shouldSkip = document.documentElement.dataset.skipLoader === '1' || sessionStorage.getItem('skipLoader') === '1';
  if (shouldSkip) {
    root.classList.add('hidden');
    setTimeout(()=> root.remove(), 10);
    return;
  }
  const progressEl = document.getElementById('loader-progress');
  const label = document.getElementById('loader-text');
  const msg = document.getElementById('loader-msg');
  const bg = document.getElementById('loader-bg');
  const big = document.getElementById('loader-big') || document.querySelector('.loader-percent');

  if (msg) msg.textContent = 'De regie terugnemen met AI';
  if (label) label.style.display = 'none';

  // Make the loader message fit into one line by reducing font-size if needed
  const fitText = (el, container, opts={minSize:10, step:0.8, pad:40}) => {
    if (!el || !container) return;
    const pad = opts.pad || 40;
    const cs = window.getComputedStyle(el);
    const defaultSize = parseFloat(cs.fontSize) || 16;
    let size = defaultSize;
    for (let i=0;i<36;i++){
      const fits = el.scrollWidth <= (container.clientWidth - pad);
      if (fits) break;
      size = Math.max(opts.minSize, size - opts.step);
      el.style.fontSize = size + 'px';
    }
  };

  const inner = document.querySelector('.loader-inner');
  setTimeout(()=> fitText(msg, inner), 20);
  setTimeout(()=> fitText(msg, inner), 260);
  window.addEventListener('resize', ()=> fitText(msg, inner));

  // Define stages to mimic the feel of the reference: quick ramp, medium push, slow finish
  const stages = [
    {to:60, duration:500, ease: t => t*t},            // fast (0->60)
    {to:95, duration:1400, ease: t => 1 - Math.pow(1 - t, 2.2)}, // medium (60->95)
    {to:100, duration:1800, ease: t => 1 - Math.pow(1 - t, 3), hold: 380} // slow tail (95->100)
  ];

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  function updateVisuals(p){
    const pct = Math.round(p);
    if (progressEl) progressEl.style.width = p + '%';
    if (bg) bg.style.width = p + '%';
    if (big) big.textContent = pct + '%';
    if (msg){
      const visible = Math.min(1, Math.max(0, (p - 5) / 65));
      msg.style.opacity = String(visible);
      msg.style.transform = `translateY(${(1 - visible) * 6}px)`;
    }
  }

  function animateStage(index, from, done){
    const s = stages[index];
    const start = performance.now();
    function frame(now){
      const t = clamp((now - start) / s.duration, 0, 1);
      const eased = s.ease(t);
      const val = from + (s.to - from) * eased;
      updateVisuals(val);
      if (t < 1) requestAnimationFrame(frame);
      else {
        if (s.hold) setTimeout(()=> done && done(), s.hold);
        else done && done();
      }
    }
    requestAnimationFrame(frame);
  }

  // Run stages sequentially
  animateStage(0, 0, ()=>{
    animateStage(1, 60, ()=>{
      animateStage(2, 95, ()=>{
        updateVisuals(100);
        root.classList.add('hidden');
        setTimeout(()=> root.remove(), 700);
      });
    });
  });

  // Safety: force-complete after 12s
  setTimeout(()=>{
    updateVisuals(100);
    if (!root.classList.contains('hidden')){
      root.classList.add('hidden'); setTimeout(()=> root.remove(), 700);
    }
  }, 12000);

})();

(function(){
  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);

  // Jaar in footer
  const yearEl = $('#year'); if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Thema-toggle
  const root = document.documentElement;
  const btnTheme = $('#theme-toggle');
  const applyTheme = (isDark) => {
    if (isDark) root.classList.add('dark');
    else root.classList.remove('dark');
    if (btnTheme) btnTheme.textContent = isDark ? 'Lichte Modus' : 'Donkere Modus';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };
  // initialize button label from saved state
  if (btnTheme) {
    const initialDark = root.classList.contains('dark');
    applyTheme(initialDark);
    btnTheme.addEventListener('click', ()=>{
      const nowDark = root.classList.contains('dark');
      applyTheme(!nowDark);
    });
  }

  // Smooth slideshow transition for links with .slide-link
  const wrapper = document.getElementById('page-wrapper');
  document.querySelectorAll('.slide-link').forEach(link => {
    link.addEventListener('click', (e)=>{
      if (!wrapper) return; // safeguard
      e.preventDefault();
      // Set flag so destination can skip loader and play slide-in
      try { sessionStorage.setItem('skipLoader','1'); } catch {}
      
      // Smooth slide-out animation
      wrapper.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      wrapper.style.transform = 'translateX(-100vw)';
      
      const href = link.getAttribute('href');
      // Navigate when slide-out is nearly complete
      setTimeout(()=> { window.location.href = href; }, 750);
    });
  });


  // Scroll reveal
    // Scroll reveal for sections and sticky CTA
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          e.target.classList.add('in-view');
          io.unobserve(e.target);
        }
      });
    },{threshold:0.12});
    // Reveal .observe and all main sections
    $$('.observe, .section-intro, .section-wathoe, .section-over, .section-contact').forEach(el=>io.observe(el));
    // Sticky CTA reveal
    const cta = document.querySelector('.sticky-cta');
    if (cta) {
      const ctaIO = new IntersectionObserver((entries)=>{
        entries.forEach(e=>{
          if(e.isIntersecting){
            cta.classList.add('in-view');
            ctaIO.unobserve(cta);
          }
        });
      },{threshold:0.01});
      ctaIO.observe(cta);
    }

  // Right-side scroll navigation (section-by-section)
  const sections = Array.from(document.querySelectorAll('section.section'));
  const btnUp = document.getElementById('scroll-up');
  const btnDown = document.getElementById('scroll-next');
  function currentSectionIndex(){
    let idx = 0;
    const fromTop = window.scrollY + window.innerHeight * 0.4;
    for (let i=0;i<sections.length;i++){
      const rect = sections[i].getBoundingClientRect();
      const absTop = rect.top + window.scrollY;
      if (fromTop >= absTop) idx = i; else break;
    }
    return idx;
  }
  function updateScrollButtons(){
    if (!btnUp || !btnDown || sections.length === 0) return;
    const idx = currentSectionIndex();
    btnUp.hidden = idx <= 0;
    btnDown.hidden = idx >= sections.length - 1;
  }
  function scrollToSection(i){
    if (i < 0 || i >= sections.length) return;
    sections[i].scrollIntoView({behavior:'smooth', block:'start'});
  }
  if (btnUp && btnDown){
    btnUp.addEventListener('click', ()=>{
      const idx = currentSectionIndex();
      scrollToSection(idx - 1);
    });
    btnDown.addEventListener('click', ()=>{
      const idx = currentSectionIndex();
      scrollToSection(idx + 1);
    });
    window.addEventListener('scroll', updateScrollButtons, {passive:true});
    window.addEventListener('resize', updateScrollButtons);
    window.addEventListener('load', updateScrollButtons);
    setTimeout(updateScrollButtons, 0);
  }

  // Contactformulier via mailto, geen opslag
  const form = $('#contact-form');
  if (form) form.addEventListener('submit', (ev)=>{
    ev.preventDefault();
    const fd = new FormData(form);
    // Honeypot
    if ((fd.get('company')||'').trim() !== '') return;

    const name = (fd.get('name')||'').toString().trim();
    const email = (fd.get('email')||'').toString().trim();
    const message = (fd.get('message')||'').toString().trim();

    if(!name || !email || !message){
      alert('vul alle velden in');
      return;
    }

    const subject = encodeURIComponent('Kennismaking met DHAIN');
    const body = encodeURIComponent(`Naam: ${name}\nE-mail: ${email}\n\nBericht:\n${message}`);
    const mailto = `mailto:info@dhain.nl?subject=${subject}&body=${body}`;
    window.location.href = mailto;
  });
})();
