/**
 * Off-Canvas Mobile Menu
 * Handles sidebar drawer with proper focus trapping and accessibility
 */

(function(){
  const qs = s => document.querySelector(s);
  const sidebar = qs('#sidebar');
  const toggle  = qs('#navToggle');
  const backdrop = qs('#backdrop');
  if(!sidebar || !toggle || !backdrop) return;

  const focusable = () => sidebar.querySelectorAll(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  let lastFocused = null;

  function openMenu(){
    lastFocused = document.activeElement;
    document.body.classList.add('no-scroll');
    sidebar.classList.add('is-open');
    backdrop.hidden = false;
    // force reflow to animate opacity
    void backdrop.offsetWidth;
    backdrop.classList.add('is-open');
    toggle.classList.add('is-open');
    toggle.setAttribute('aria-expanded','true');
    // focus trap: focus first focusable or sidebar itself
    const f = focusable()[0] || sidebar;
    f.focus({preventScroll:true});
    document.addEventListener('keydown', onKeydown);
    document.addEventListener('focus', trapFocus, true);
  }

  function closeMenu(){
    document.body.classList.remove('no-scroll');
    sidebar.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded','false');
    setTimeout(()=>{ backdrop.hidden = true; }, 180);
    document.removeEventListener('keydown', onKeydown);
    document.removeEventListener('focus', trapFocus, true);
    if (lastFocused) lastFocused.focus({preventScroll:true});
  }

  function onKeydown(e){
    if(e.key === 'Escape') closeMenu();
    if(e.key === 'Tab'){
      // Circular tabbing inside sidebar
      const nodes = Array.from(focusable());
      if(nodes.length === 0) return;
      const first = nodes[0], last = nodes[nodes.length - 1];
      if(e.shiftKey && document.activeElement === first){ last.focus(); e.preventDefault(); }
      else if(!e.shiftKey && document.activeElement === last){ first.focus(); e.preventDefault(); }
    }
  }

  function trapFocus(e){
    if(!sidebar.classList.contains('is-open')) return;
    if(!sidebar.contains(e.target)) {
      const f = focusable()[0] || sidebar;
      f.focus();
    }
  }

  toggle.addEventListener('click', () => {
    const open = sidebar.classList.contains('is-open');
    open ? closeMenu() : openMenu();
  });
  
  backdrop.addEventListener('click', closeMenu);
  
  // Close when a nav link is clicked
  sidebar.addEventListener('click', (e)=>{
    const el = e.target.closest('a,button');
    if(el) closeMenu();
  });

  // Avoid "page slides to the side" during animation on iOS
  window.addEventListener('touchmove', (e)=>{
    if(sidebar.classList.contains('is-open') && !sidebar.contains(e.target)) e.preventDefault();
  }, {passive:false});

  // Handle window resize - close menu if switching to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1023 && sidebar.classList.contains('is-open')) {
      closeMenu();
    }
  });
})();