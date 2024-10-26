
    document.addEventListener('DOMContentLoaded', function() {
        const menuToggle = document.querySelector('.menu-toggle');
        const headerBottom = document.querySelector('.header-bottom');

        menuToggle.addEventListener('click', function() {
            headerBottom.style.display = headerBottom.style.display === 'flex' ? 'none' : 'flex';
        });
    });


