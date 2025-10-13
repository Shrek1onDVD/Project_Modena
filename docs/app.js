// Theme management: persist on documentElement using html.dark class
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') document.documentElement.classList.add('dark');

// Loader: staged animation inspired by reference timing (fast -> medium -> slow tail)
(function loaderStaged(){
  const root = document.getElementById('loader');
  if (!root) return;
  const progressEl = document.getElementById('loader-progress');
  const label = document.getElementById('loader-text');
  const msg = document.getElementById('loader-msg');
  const bg = document.getElementById('loader-bg');
  const big = document.getElementById('loader-big') || document.querySelector('.loader-percent');

  if (msg) msg.textContent = 'Met DHAIN vooruit met verantwoorde AI';
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
  $('#year').textContent = new Date().getFullYear();

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


  // Scroll reveal
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('in-view');
        io.unobserve(e.target);
      }
    });
  },{threshold:0.12});
  $$('.observe').forEach(el=>io.observe(el));

  // Contactformulier via mailto, geen opslag
  const form = $('#contact-form');
  form.addEventListener('submit', (ev)=>{
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
