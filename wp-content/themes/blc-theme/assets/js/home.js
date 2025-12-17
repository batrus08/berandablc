(function () {
    const cards = document.querySelectorAll('.news-card[data-link]');
    cards.forEach((card) => {
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                const target = card.getAttribute('data-link');
                if (target) {
                    window.location.href = target;
                }
            }
        });
    });
})();
