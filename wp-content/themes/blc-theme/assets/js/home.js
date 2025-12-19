(function () {
  function enableCardInteractions() {
    document.querySelectorAll('[data-link]').forEach((card) => {
      const target = card.getAttribute('data-link');
      if (!target) return;

      const go = () => {
        window.location.href = target;
      };

      card.addEventListener('click', go);
      card.addEventListener('keydown', (evt) => {
        if (evt.key === 'Enter' || evt.key === ' ') {
          evt.preventDefault();
          go();
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enableCardInteractions);
  } else {
    enableCardInteractions();
  }
})();
