// script.js
let currentSlide = 0;
const slides = document.querySelectorAll('.testimonial');
const totalSlides = slides.length;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
}

// Funções de navegação
function showNextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  showSlide(currentSlide);
}

function showPreviousSlide() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  showSlide(currentSlide);
}

// Intervalo automático
setInterval(showNextSlide, 5000); // Alterna slide a cada 5 segundos

// Mostra o primeiro slide inicialmente
showSlide(currentSlide);
