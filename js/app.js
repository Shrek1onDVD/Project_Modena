// Consolidated app script: staged loader, theme toggle, scroll reveal, contact form

// Theme initialization and toggle
(function themeInit(){
  const btn = document.getElementById('theme-toggle');
  const html = document.documentElement;
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') html.classList.add('dark');
  function apply(isDark){
    if (isDark) html.classList.add('dark'); else html.classList.remove('dark');
    if (btn) btn.textContent = isDark ? 'Lichte Modus' : 'Donkere Modus';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
  if (btn) {
    btn.addEventListener('click', ()=> apply(!html.classList.contains('dark')));
    // init label
    apply(html.classList.contains('dark'));
  }
})();

// Loader: staged animation (fast -> medium -> slow tail). Ensures only one loader runs.
(function loaderStaged(){
  const root = document.getElementById('loader');
  if (!root) return;

  // Ensure required elements exist
  const inner = root.querySelector('.loader-inner') || document.createElement('div');
  const bg = document.getElementById('loader-bg') || document.createElement('div');
  const big = document.getElementById('loader-big') || document.createElement('div');
  const msg = document.getElementById('loader-msg') || document.createElement('div');
  const progress = document.getElementById('loader-progress');
  const text = document.getElementById('loader-text');

  // Default text
  if (msg) msg.textContent = 'Met DHAIN vooruit met verantwoorde AI';
  if (text) text.style.display = 'none';

  const fitText = (el, container, opts={minSize:10, step:0.8, pad:40}) => {
    try{
      if (!el || !container) return;
      const pad = opts.pad || 40;
      const cs = window.getComputedStyle(el);
      const defaultSize = parseFloat(cs.fontSize) || 16;
      let size = defaultSize;
      for (let i=0;i<36;i++){
        if (el.scrollWidth <= (container.clientWidth - pad)) break;
        size = Math.max(opts.minSize, size - opts.step);
        el.style.fontSize = size + 'px';
      }
    }catch(e){/* ignore */}
  };

  setTimeout(()=> fitText(msg, inner), 40);
  setTimeout(()=> fitText(msg, inner), 260);
  window.addEventListener('resize', ()=> fitText(msg, inner));

  const stages = [
    {to:60, duration:600, ease: t => t*t},
    {to:95, duration:1400, ease: t => 1 - Math.pow(1 - t, 2.2)},
    {to:100, duration:1600, ease: t => 1 - Math.pow(1 - t, 3), hold: 380}
  ];

  const clamp = (v,min,max)=> Math.max(min, Math.min(max, v));

  function update(p){
    const pct = Math.round(p);
    if (progress) progress.style.width = p + '%';
    if (bg) bg.style.width = p + '%';
    if (big) big.textContent = pct + '%';
    if (msg){
      const visible = Math.min(1, Math.max(0, (p - 5) / 65));
      msg.style.opacity = String(visible);
      msg.style.transform = `translateY(${(1 - visible) * 6}px)`;
    }
  }

  function animateStage(index, from, cb){
    const s = stages[index];
    const start = performance.now();
    function frame(now){
      const t = clamp((now - start) / s.duration, 0, 1);
      const eased = s.ease(t);
      const val = from + (s.to - from) * eased;
      update(val);
      if (t < 1) requestAnimationFrame(frame);
      else {
        if (s.hold) setTimeout(()=> cb && cb(), s.hold);
        else cb && cb();
      }
    }
    requestAnimationFrame(frame);
  }

  animateStage(0, 0, ()=>{
    animateStage(1, 60, ()=>{
      animateStage(2, 95, ()=>{
        update(100);
        root.classList.add('hidden');
        setTimeout(()=> root.remove(), 700);
      });
    });
  });

  // safety
  setTimeout(()=>{
    update(100);
    if (!root.classList.contains('hidden')){
      root.classList.add('hidden'); setTimeout(()=> root.remove(), 700);
    }
  }, 12000);

})();

// Scroll reveal
(function scrollReveal(){
  const els = document.querySelectorAll('.observe');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if (e.isIntersecting){ e.target.classList.add('in-view'); io.unobserve(e.target); } });
  },{threshold:0.12});
  els.forEach(el=> io.observe(el));
})();

// Contact form -> mailto
(function contactForm(){
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', (ev)=>{
    ev.preventDefault();
    const fd = new FormData(form);
    if ((fd.get('company')||'').trim() !== '') return; // honeypot
    const name = (fd.get('name')||'').toString().trim();
    const email = (fd.get('email')||'').toString().trim();
    const message = (fd.get('message')||'').toString().trim();
    if(!name || !email || !message){ alert('vul alle velden in'); return; }
    const subject = encodeURIComponent('Kennismaking met DHAIN');
    const body = encodeURIComponent(`Naam: ${name}\nE-mail: ${email}\n\nBericht:\n${message}`);
    window.location.href = `mailto:info@dhain.nl?subject=${subject}&body=${body}`;
  });
})();
