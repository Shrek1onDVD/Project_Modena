// Theme management: default to light on main load; allow toggle
// Set skipLoader flag as early as possible to avoid race conditions
if (sessionStorage.getItem('skipLoader') === '1') {
  document.documentElement.dataset.skipLoader = '1';
}


// Always start in light mode on first page load, then allow toggle
try {
  // Check if this is truly a first visit (no theme preference stored)
  let theme = localStorage.getItem('theme');
  let isFirstVisit = theme === null;
  
  if (isFirstVisit) {
    // First visit: always start in light mode
    localStorage.setItem('theme', 'light');
    theme = 'light';
    document.documentElement.classList.remove('dark');
  } else {
    // Return visitor: respect their saved preference
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
} catch {}

(function initThemeAndScroll(){
  // Read navigation flags before clearing to allow animations to run
  let hadSkip = false;
  let slideDir = null;
  try {
    hadSkip = sessionStorage.getItem('skipLoader') === '1';
    slideDir = sessionStorage.getItem('slideDir');
    // Clear any stale session flags afterwards
    sessionStorage.removeItem('skipLoader');
    sessionStorage.removeItem('slideDir');
  } catch {}
  
  // Always start at top on main page
  if (location.pathname === '/' || location.pathname.endsWith('index.html')){
    // Always force scroll to top immediately and repeatedly, even after slide-link return
    function forceScrollTop() {
      window.scrollTo(0,0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
    forceScrollTop();
    setTimeout(forceScrollTop, 10);
    setTimeout(forceScrollTop, 100);
    // Re-enable smooth scrolling after forcing position
    setTimeout(()=> {
      document.body.classList.remove('main-page');
      // Ensure scrolling is re-enabled after loader
      if (!document.getElementById('loader')) {
        document.body.style.overflow = '';
        document.body.style.height = '';
      }
    }, 120);

    // Theme is already handled at the top of the file
    // No need to override it here for the main page

    // Skip loader if returning via .slide-link (including from legal pages)
    const fromSlide = hadSkip;
    if (fromSlide) {
      document.documentElement.dataset.skipLoader = '1';
      const wrapper = document.getElementById('page-wrapper');
      if (wrapper) {
        // Enter direction can be controlled via slideDir; default from right
        const dir = (slideDir === 'left' || slideDir === 'right') ? slideDir : 'right';
        wrapper.style.transform = dir === 'right' ? 'translateX(100vw)' : 'translateX(-100vw)';
        wrapper.style.transition = 'none';
        wrapper.style.opacity = '1';
        wrapper.offsetHeight;
        requestAnimationFrame(()=> {
          wrapper.style.transition = 'transform 0.6s cubic-bezier(0.65, 0, 0.35, 1)';
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
      // flags have already been cleared above; nothing else to do
    }
  } else {
    // For all non-main pages, always apply theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    
    // Handle slide-in animation for legal pages
    const fromSlide = hadSkip;
    if (fromSlide) {
      const wrapper = document.getElementById('page-wrapper');
      if (wrapper) {
        // For legal pages, start with slide position but visible
        const dir = (slideDir === 'left' || slideDir === 'right') ? slideDir : 'right';
        wrapper.style.transform = dir === 'right' ? 'translateX(100vw)' : 'translateX(-100vw)';
        wrapper.style.transition = 'none';
        wrapper.style.opacity = '1';
        wrapper.offsetHeight;
        requestAnimationFrame(()=> {
          wrapper.style.transition = 'transform 0.6s cubic-bezier(0.65, 0, 0.35, 1)';
          wrapper.style.transform = 'translateX(0)';
        });
        const cleanup = ()=>{
          wrapper.style.transition = '';
          wrapper.style.transform = '';
          wrapper.style.opacity = '';
          wrapper.removeEventListener('transitionend', cleanup);
          // After slide completes, trigger the legal page fade-in if needed
          if (wrapper.classList.contains('legal-no-scroll') || document.body.classList.contains('legal-no-scroll')) {
            wrapper.classList.add('in-view');
          }
        };
        wrapper.addEventListener('transitionend', cleanup);
      }
    } else {
      // If not from slide, trigger legal page animation directly
      const wrapper = document.getElementById('page-wrapper');
      if (wrapper && (wrapper.classList.contains('legal-no-scroll') || document.body.classList.contains('legal-no-scroll'))) {
        setTimeout(() => {
          wrapper.classList.add('in-view');
        }, 100);
      }
    }
  }
})();

// Loader: staged animation inspired by reference timing (fast -> medium -> slow tail)
(function loaderStaged(){
  const root = document.getElementById('loader');
  if (!root) return;
  // Skip loader if navigating back from legal pages via slide transition
    // Disable scrolling immediately when loader starts
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    const shouldSkip = document.documentElement.dataset.skipLoader === '1';
    if (shouldSkip) {
      document.body.style.overflow = '';
      document.body.style.height = '';
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
        // Re-enable scrolling and pointer events after loader is gone
        setTimeout(()=> {
          root.remove();
          document.body.style.overflow = '';
          document.body.style.height = '';
        }, 700);
      });
    });
  });

  // Safety: force-complete after 12s
  setTimeout(()=>{
    updateVisuals(100);
    if (!root.classList.contains('hidden')){
      root.classList.add('hidden');
      setTimeout(()=> {
        root.remove();
        document.body.style.overflow = '';
        document.body.style.height = '';
      }, 700);
    }
  }, 12000);

})();

// ...existing code...
(function(){
  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);

  // Fix: Always scroll to top when clicking #intro links
  document.querySelectorAll("a[href='#intro']").forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({top: 0, behavior: 'smooth'});
      // Optionally update hash for accessibility/history
      history.replaceState(null, '', '#intro');
    });
  });

  // Jaar in footer
  const yearEl = $('#year'); if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Thema-toggle
  const root = document.documentElement;
  const btnTheme = $('#theme-toggle');
  const applyTheme = (isDark) => {
    if (isDark) {
      root.classList.add('dark');
      if (btnTheme) {
        btnTheme.setAttribute('aria-label', 'lichte modus');
        // Update icon to sun for light mode toggle
        const svg = btnTheme.querySelector('svg');
        if (svg) {
          svg.innerHTML = '<circle cx="12" cy="12" r="5" fill="currentColor"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>';
        }
      }
    } else {
      root.classList.remove('dark');
      if (btnTheme) {
        btnTheme.setAttribute('aria-label', 'donkere modus');
        // Update icon to moon for dark mode toggle
        const svg = btnTheme.querySelector('svg');
        if (svg) {
          svg.innerHTML = '<path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" fill="currentColor"/>';
        }
      }
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };
  // initialize button state from saved theme
  if (btnTheme) {
    const initialDark = localStorage.getItem('theme') === 'dark';
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
      
      const href = link.getAttribute('href') || '';
      const isMain = href === '/' || href.endsWith('index.html');
      const isCurrentLegal = document.body.classList.contains('legal-no-scroll');
      const isTargetLegal = href.includes('privacy.html') || href.includes('disclaimer.html');
      
      // Special case: Legal to Legal page transition (only animate content)
      if (isCurrentLegal && isTargetLegal) {
        const mainContent = document.querySelector('.legal-banner .container');
        if (mainContent) {
          // Fade out current content
          mainContent.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          mainContent.style.opacity = '0';
          mainContent.style.transform = 'translateY(20px)';
          
          // Load new content after fade out
          setTimeout(async () => {
            try {
              const response = await fetch(href);
              const html = await response.text();
              const parser = new DOMParser();
              const newDoc = parser.parseFromString(html, 'text/html');
              const newContent = newDoc.querySelector('.legal-banner .container');
              
              if (newContent) {
                // Update page title
                document.title = newDoc.title;
                
                // Replace content
                mainContent.innerHTML = newContent.innerHTML;
                
                // Update URL without reload
                history.pushState(null, '', href);
                
                // Fade in new content
                mainContent.style.opacity = '0';
                mainContent.style.transform = 'translateY(-20px)';
                
                requestAnimationFrame(() => {
                  mainContent.style.opacity = '1';
                  mainContent.style.transform = 'translateY(0)';
                });
              }
            } catch (error) {
              // Fallback to normal navigation if AJAX fails
              window.location.href = href;
            }
          }, 300);
        }
        return;
      }
      
      // Normal slide transition for all other cases
      // Set flag so destination can skip loader and play slide-in
      try {
        sessionStorage.setItem('skipLoader','1');
        // Allow explicit control via data-slide-dir on the link
        const explicit = (link.dataset && link.dataset.slideDir) ? link.dataset.slideDir : null;
        let dir = explicit;
        if (!dir){
          dir = isMain ? 'left' : 'right';
        }
        sessionStorage.setItem('slideDir', dir);
      } catch {}
      
      // Smooth slide-out animation
      // Slide LEFT (-100vw) when going to legal pages (right)
      // Slide RIGHT (100vw) when returning to main page (left)
      const slideOutTransform = isMain ? 'translateX(100vw)' : 'translateX(-100vw)';
      wrapper.style.transition = 'transform 0.6s cubic-bezier(0.65, 0, 0.35, 1)';
      wrapper.style.transform = slideOutTransform;
      
      // Navigate when slide-out is nearly complete
      setTimeout(()=> { window.location.href = href; }, 550);
    });
  });


  // Scroll reveal
  // Reveal .observe and all main sections
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('in-view');
        io.unobserve(e.target);
      }
    });
  },{threshold:0.12});
  $$('.observe, .section-intro, .section-wathoe, .section-over, .section-contact').forEach(el=>io.observe(el));

  // Hide sticky CTA when contact section is in view
  const cta = document.querySelector('.sticky-cta');
  const contactSection = document.querySelector('.section-contact');
  
  // Auto-hide functionality for sticky CTA (only when at contact section)
  let ctaHideTimeout;
  let isAtContactSection = false;
  
  function showStickyCTA() {
    console.log('showStickyCTA called, isAtContactSection:', isAtContactSection); // Debug
    if (cta) {
      cta.classList.remove('auto-hidden');
      console.log('Removed auto-hidden from CTA'); // Debug
    }
    // Clear any existing timeout
    if (ctaHideTimeout) {
      clearTimeout(ctaHideTimeout);
    }
    // Only set timeout if we're at the contact section
    if (isAtContactSection) {
      console.log('Setting auto-hide timeout for CTA'); // Debug
      ctaHideTimeout = setTimeout(() => {
        console.log('CTA timeout reached, hiding CTA'); // Debug
        if (cta && isAtContactSection) {
          cta.classList.add('auto-hidden');
          console.log('Added auto-hidden to CTA, classes:', cta.className); // Debug
        }
      }, 1000);
    }
  }
  
  if (cta && contactSection) {
    const hideCTAObserver = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          // When at contact section: don't hide permanently, just enable auto-hide
          isAtContactSection = true;
          console.log('Entered contact section - enabling auto-hide'); // Debug
          showStickyCTA(); // Start the auto-hide timer
        } else {
          // When leaving contact section: disable auto-hide
          isAtContactSection = false;
          console.log('Left contact section - disabling auto-hide'); // Debug
          if (cta) {
            cta.classList.remove('auto-hidden'); // Make sure it's visible when leaving
          }
          // Clear any pending timeout when leaving contact section
          if (ctaHideTimeout) {
            clearTimeout(ctaHideTimeout);
          }
        }
      });
    }, {threshold: 0.3});
    hideCTAObserver.observe(contactSection);
    
    // Add event listeners for sticky CTA auto-hide (only acts when at contact section)
    document.addEventListener('mousemove', showStickyCTA, {passive: true});
    document.addEventListener('scroll', showStickyCTA, {passive: true});
    document.addEventListener('touchstart', showStickyCTA, {passive: true});
    document.addEventListener('touchmove', showStickyCTA, {passive: true});
  }

  // Spring-back effect for overscroll at bottom (Android-like bounce)
  let isSnappingBack = false;
  let scrollTimeout = null;
  
  function checkOverscroll() {
    if (isSnappingBack) return;
    
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const maxScroll = documentHeight - windowHeight;
    
    // Check if scrolled past the bottom (with small threshold)
    if (scrollTop > maxScroll + 5) {
      isSnappingBack = true;
      
      // Smooth spring-back animation
      const startScroll = scrollTop;
      const targetScroll = maxScroll;
      const duration = 400; // ms
      const startTime = performance.now();
      
      function animateSpringBack(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease-out cubic for spring-like effect
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const newScroll = startScroll + (targetScroll - startScroll) * easeProgress;
        
        window.scrollTo(0, newScroll);
        
        if (progress < 1) {
          requestAnimationFrame(animateSpringBack);
        } else {
          isSnappingBack = false;
        }
      }
      
      requestAnimationFrame(animateSpringBack);
    }
  }
  
  // Check on scroll with debounce
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(checkOverscroll, 50);
  }, { passive: true });

  // Right-side scroll navigation (section-by-section)
  const sections = Array.from(document.querySelectorAll('section.section'));
  const btnUp = document.getElementById('scroll-up');
  const btnDown = document.getElementById('scroll-next');
  const scrollNav = document.querySelector('.scroll-nav');
  
  // Auto-hide functionality
  let hideTimeout;
  function showScrollButtons() {
    console.log('showScrollButtons called, scrollNav:', scrollNav); // Debug
    if (scrollNav) {
      scrollNav.classList.remove('auto-hidden');
      console.log('Removed auto-hidden from scrollNav'); // Debug
    }
    // Clear any existing timeout
    if (hideTimeout) {
      clearTimeout(hideTimeout);
    }
    // Set new timeout to hide after 1 second
    hideTimeout = setTimeout(() => {
      console.log('Timeout reached, adding auto-hidden'); // Debug
      if (scrollNav) {
        scrollNav.classList.add('auto-hidden');
        console.log('Added auto-hidden to scrollNav, classes:', scrollNav.className); // Debug
      }
    }, 1000);
  }
  
  function currentSectionIndex(){
    const fromTop = window.scrollY;
    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.offsetHeight : 0;
    
    // Find which section we're currently viewing
    for (let i = sections.length - 1; i >= 0; i--){
      const absTop = sections[i].offsetTop - headerHeight;
      if (fromTop >= absTop - 50) {
        return i;
      }
    }
    return 0;
  }
  function updateScrollButtons(){
    if (!btnUp || !btnDown || sections.length === 0) return;
    const idx = currentSectionIndex();
    btnUp.hidden = idx <= 0;
    btnDown.hidden = idx >= sections.length - 1;
  }
  function scrollToSection(i){
    if (i < 0 || i >= sections.length) return;
    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.offsetHeight : 0;
    const targetTop = sections[i].offsetTop - headerHeight;
    window.scrollTo({
      top: targetTop >= 0 ? targetTop : 0,
      behavior: 'smooth'
    });
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
    window.addEventListener('scroll', () => {
      updateScrollButtons();
      showScrollButtons(); // Show buttons on scroll
    }, {passive:true});
    window.addEventListener('resize', updateScrollButtons);
    window.addEventListener('load', updateScrollButtons);
    
    // Show buttons on mouse movement
    document.addEventListener('mousemove', showScrollButtons, {passive: true});
    
    // Show buttons on touch events for mobile
    document.addEventListener('touchstart', showScrollButtons, {passive: true});
    document.addEventListener('touchmove', showScrollButtons, {passive: true});
    
    // Initial setup
    setTimeout(() => {
      updateScrollButtons();
      showScrollButtons(); // Start the auto-hide timer
    }, 0);
  }

  // Contactformulier met mailto functionaliteit
  const form = $('#contact-form');
  if (form) {
    form.addEventListener('submit', (ev)=>{
      ev.preventDefault();
      
      const fd = new FormData(form);
      
      // Client-side honeypot check
      if ((fd.get('company')||'').trim() !== '') {
        return;
      }

      const name = (fd.get('name')||'').toString().trim();
      const email = (fd.get('email')||'').toString().trim();
      const message = (fd.get('message')||'').toString().trim();

      // Client-side validation
      if (!name || !email || !message) {
        alert('Vul alle velden in om door te gaan.');
        return;
      }

      // Email format validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        alert('Vul een geldig e-mailadres in (bijv. naam@voorbeeld.nl).');
        return;
      }

      // Construct mailto link
      const subject = encodeURIComponent('Kennismaking met DHAIN');
      const body = encodeURIComponent(`${message}

---
Naam: ${name}
E-mail: ${email}`);
      
      const mailtoLink = `mailto:info@dhain.nl?subject=${subject}&body=${body}`;
      
      // Open email client
      window.location.href = mailtoLink;
      
      // Optional: Reset form after opening email client
      setTimeout(() => {
        form.reset();
      }, 500);
    });
  }
  
  // Over DHAIN tabs: two tabs, sticky active state, click to switch
  (function initOverTabs(){
    const overSection = document.getElementById('overdhain');
    if (!overSection) return;
    const tabOver = overSection.querySelector('#tab-over');
    const tabMissieVisie = overSection.querySelector('#tab-missievisie');
    const panelOver = overSection.querySelector('#panel-over');
    const panelMissieVisie = overSection.querySelector('#panel-missievisie');
    if (!tabOver || !tabMissieVisie || !panelOver || !panelMissieVisie) return;

    function show(panelKey){
      if (panelKey === 'over') {
        panelOver.hidden = false;
        panelMissieVisie.hidden = true;
        panelOver.classList.add('active');
        panelMissieVisie.classList.remove('active');
        tabOver.setAttribute('aria-selected','true');
        tabMissieVisie.setAttribute('aria-selected','false');
      } else {
        panelOver.hidden = true;
        panelMissieVisie.hidden = false;
        panelOver.classList.remove('active');
        panelMissieVisie.classList.add('active');
        tabOver.setAttribute('aria-selected','false');
        tabMissieVisie.setAttribute('aria-selected','true');
      }
    }

    // Initial state: show Over DHAIN
    show('over');

    tabOver.addEventListener('click', ()=> show('over'));
    tabMissieVisie.addEventListener('click', ()=> show('missievisie'));
    tabOver.addEventListener('keydown', (e)=>{
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show('over'); }
    });
    tabMissieVisie.addEventListener('keydown', (e)=>{
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show('missievisie'); }
    });
  })();

  // Fix navigation links to account for sticky header
  function setupNavigationLinks() {
    // Handle all anchor links that point to sections on the same page
    const navLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
          const header = document.querySelector('.site-header');
          const headerHeight = header ? header.offsetHeight : 0;
          const targetTop = targetSection.offsetTop - headerHeight;
          
          // Temporarily enable smooth scrolling for this JS-triggered scroll
          document.documentElement.classList.add('js-smooth-scroll');
          
          window.scrollTo({
            top: targetTop >= 0 ? targetTop : 0,
            behavior: 'smooth'
          });
          
          // Remove smooth scroll class after scroll completes
          setTimeout(() => {
            document.documentElement.classList.remove('js-smooth-scroll');
          }, 1000);
        }
      });
    });
  }

  // Initialize navigation links
  setupNavigationLinks();

})();