(function () {
  if (!document.querySelector('.map-facade')) return;

  const desktopMQ = window.matchMedia('(min-width: 1024px)');

  function activate(facade) {
    if (facade.dataset.activated) return;
    facade.dataset.activated = '1';

    const src = facade.dataset.mapSrc;
    const title = facade.dataset.mapTitle || 'Карта';
    if (!src) return;

    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.title = title;
    iframe.loading = 'lazy';
    iframe.setAttribute('allowfullscreen', '');

    facade.replaceWith(iframe);
  }

  function onClick(e) {
    activate(e.currentTarget);
  }

  function syncToViewport() {
    const facades = document.querySelectorAll('.map-facade');
    if (desktopMQ.matches) {
      facades.forEach((facade) => {
        facade.removeEventListener('click', onClick);
        activate(facade);
      });
    } else {
      facades.forEach((facade) => {
        facade.removeEventListener('click', onClick);
        facade.addEventListener('click', onClick);
      });
    }
  }

  syncToViewport();
  desktopMQ.addEventListener('change', syncToViewport);
})();
