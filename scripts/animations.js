const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReduced && window.gsap) {
  const { gsap } = window;
  gsap.registerPlugin(window.ScrollTrigger);

  const heroLetters = document.querySelectorAll('.hero__letter');
  if (heroLetters.length) {
    gsap.set(heroLetters, { yPercent: 110, opacity: 0 });
    gsap.to(heroLetters, {
      yPercent: 0,
      opacity: 1,
      stagger: 0.045,
      duration: 0.95,
      ease: 'power3.out',
      delay: 0.25,
    });
  }

  const heroFadeIn = document.querySelectorAll('[data-hero-fade]');
  if (heroFadeIn.length) {
    gsap.from(heroFadeIn, {
      y: 24,
      opacity: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: 'power2.out',
      delay: 0.6,
    });
  }

  const heroPhoto = document.querySelector('.hero__photo img');
  if (heroPhoto) {
    gsap.to(heroPhoto, {
      yPercent: 14,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  const decorFloat = document.querySelectorAll('[data-float]');
  decorFloat.forEach((el, i) => {
    gsap.to(el, {
      y: i % 2 === 0 ? 18 : -22,
      rotation: i % 2 === 0 ? 4 : -3,
      duration: 6 + (i % 3),
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  });

  window.ScrollTrigger.batch('.reveal', {
    start: 'top 88%',
    onEnter: (els) =>
      gsap.to(els, {
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        overwrite: true,
      }),
    once: true,
  });
  gsap.set('.reveal', { y: 28, opacity: 0 });
} else {
  document.querySelectorAll('.reveal').forEach((el) => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
}
