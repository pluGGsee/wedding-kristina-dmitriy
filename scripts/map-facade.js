(function () {
  const facades = document.querySelectorAll('.map-facade');
  if (!facades.length) return;

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

  facades.forEach((facade) => {
    if (desktopMQ.matches) {
      activate(facade);
    } else {
      facade.addEventListener('click', () => activate(facade));
    }
  });
})();
