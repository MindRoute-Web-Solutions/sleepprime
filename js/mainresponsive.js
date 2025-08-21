// mainresponsive.js - Ajustes de interações para dispositivos móveis

// Este arquivo pode ser usado para adicionar interações específicas para mobile
// Por exemplo, se houver necessidade de carregar scripts diferentes ou
// ajustar comportamentos de elementos apenas em telas menores.

document.addEventListener("DOMContentLoaded", () => {
    // Exemplo: Detectar se é um dispositivo móvel e fazer algo específico
    const isMobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
        console.log("Dispositivo móvel detectado. Ajustes mobile-specifics podem ser aplicados aqui.");
        // Adicione aqui qualquer lógica JavaScript que seja exclusiva para dispositivos móveis.
        // Por exemplo, otimizações de performance para animações, ou comportamentos de toque.
    }

    // Exemplo de ajuste: fechar o menu hamburguer ao clicar em um link (para mobile)
    const navLinks = document.querySelectorAll(".nav-links li a");
    const nav = document.querySelector(".nav-links");
    const burger = document.querySelector(".burger");

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (nav.classList.contains("nav-active")) {
                nav.classList.remove("nav-active");
                burger.classList.remove("toggle");
                // Reset animation for nav links
                navLinks.forEach((link) => {
                    link.style.animation = "";
                });
            }
        });
    });
});


