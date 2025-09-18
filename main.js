// ForgeFit interactions and animations

// Utils
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Magnetic buttons
function setupMagneticButtons() {
  const buttons = document.querySelectorAll('.btn--magnetic');
  buttons.forEach((button) => {
    const inner = button.querySelector('.btn__inner');
    if (!inner) return;

    const strength = 12; // px

    button.addEventListener('mousemove', (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const dx = (x - rect.width / 2) / (rect.width / 2);
      const dy = (y - rect.height / 2) / (rect.height / 2);
      inner.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
    });
    button.addEventListener('mouseleave', () => {
      inner.style.transform = 'translate(0, 0)';
    });
  });
}

// Mobile nav toggle
function setupMobileNav() {
  const burger = document.querySelector('.hamburger');
  const mobile = document.getElementById('mobile-nav');
  if (!burger || !mobile) return;

  const toggle = () => {
    const isOpen = burger.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(isOpen));
    mobile.classList.toggle('is-open', isOpen);
  };
  burger.addEventListener('click', toggle);
  mobile.querySelectorAll('a').forEach((link) => link.addEventListener('click', toggle));
}

// Particles background via tsParticles
async function setupParticles() {
  const containerId = 'tsparticles';
  const holder = document.getElementById(containerId);
  if (!holder || typeof tsParticles === 'undefined') return;

  const options = {
    fpsLimit: 60,
    detectRetina: true,
    background: { color: 'transparent' },
    particles: {
      number: { value: 60, density: { enable: true, area: 900 } },
      color: { value: [ '#39ff88', '#7c5cff', '#8ee2b6' ] },
      links: { enable: true, distance: 130, color: '#556', opacity: 0.35, width: 1 },
      move: { enable: true, speed: 0.6, direction: 'none', outModes: { default: 'out' } },
      size: { value: { min: 1, max: 3 } },
      opacity: { value: { min: 0.35, max: 0.8 } },
      shadow: { enable: false },
      wobble: { enable: false }
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: prefersReducedMotion ? [] : 'repulse' },
        onClick: { enable: false },
        resize: true
      },
      modes: { repulse: { distance: 80 } }
    }
  };

  await tsParticles.load(containerId, options);
}

// Parallax on hero decorative elements
function setupParallax() {
  const area = document.querySelector('.hero__visual');
  if (!area) return;
  const items = Array.from(area.querySelectorAll('[data-parallax]'));
  if (items.length === 0) return;

  const onMove = (event) => {
    const rect = area.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (event.clientX - cx) / rect.width;
    const dy = (event.clientY - cy) / rect.height;

    items.forEach((el) => {
      const strength = Number(el.getAttribute('data-parallax') || 10);
      const x = dx * strength;
      const y = dy * strength;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
  };

  const onLeave = () => {
    items.forEach((el) => {
      el.style.transform = 'translate3d(0,0,0)';
    });
  };

  area.addEventListener('mousemove', onMove);
  area.addEventListener('mouseleave', onLeave);
}

// Text reveal + shutter animations with GSAP
function setupRevealAnimations() {
  if (prefersReducedMotion || typeof gsap === 'undefined') {
    document.querySelector('.shutter')?.remove();
    return;
  }

  // Split words
  let words;
  try {
    const splitter = new SplitType('.hero__title', { types: 'words' });
    words = splitter.words;
  } catch (e) {
    // Fallback if SplitType not available
    words = Array.from(document.querySelectorAll('.hero__title'));
  }

  gsap.set('body', { overflow: 'hidden' });

  const tl = gsap.timeline({ defaults: { ease: 'expo.inOut' } });

  tl.to('.shutter__panel', {
    yPercent: -100,
    duration: 1.1,
    stagger: 0.08
  })
    .to('.shutter', { autoAlpha: 0, duration: 0.35 }, '-=0.3')
    .set('.shutter', { display: 'none' })
    .addLabel('reveal')
    .from('.site-header', { y: -24, autoAlpha: 0, duration: 0.6 }, 'reveal-=0.1')
    .from(words, { yPercent: 120, duration: 0.9, stagger: 0.03, ease: 'expo.out' }, 'reveal')
    .from(['.hero__subtitle', '.hero__ctas', '.hero__stats'], {
      y: 20,
      autoAlpha: 0,
      duration: 0.6,
      stagger: 0.08
    }, '-=0.2')
    .add(() => { gsap.set('body', { clearProps: 'overflow' }); });
}

// Init
window.addEventListener('DOMContentLoaded', () => {
  setupMagneticButtons();
  setupMobileNav();
  setupParallax();
  setupParticles();
  setupRevealAnimations();
});

