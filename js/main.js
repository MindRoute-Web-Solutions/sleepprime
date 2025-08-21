// main.js - Funções globais e interações - VERSÃO SIMPLIFICADA E CORRIGIDA
document.addEventListener("DOMContentLoaded", () => {
    // Menu Hamburguer
    const burger = document.querySelector(".burger");
    const nav = document.querySelector(".nav-links");
    const navLinks = document.querySelectorAll(".nav-links li");

    if (burger && nav) {
        burger.addEventListener("click", (e) => {
            e.stopPropagation(); // Impede propagação para o documento
            
            // Alternar menu
            nav.classList.toggle("nav-active");
            burger.classList.toggle("toggle");
            
            // Animar links
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = "";
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
        });
    }

    // Dropdown Menu - VERSÃO SIMPLIFICADA
    function setupDropdownMenu() {
        const dropdowns = document.querySelectorAll('.dropdown');
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        
        // Desktop - hover
        dropdowns.forEach(dropdown => {
            dropdown.addEventListener('mouseenter', () => {
                if (window.innerWidth > 768) {
                    dropdown.classList.add('active');
                }
            });
            
            dropdown.addEventListener('mouseleave', () => {
                if (window.innerWidth > 768) {
                    dropdown.classList.remove('active');
                }
            });
        });
        
        // Mobile - click
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const dropdown = toggle.closest('.dropdown');
                    dropdown.classList.toggle('active');
                    
                    // Fechar outros dropdowns
                    dropdowns.forEach(otherDropdown => {
                        if (otherDropdown !== dropdown) {
                            otherDropdown.classList.remove('active');
                        }
                    });
                }
            });
        });
        
        // Fechar dropdowns ao clicar fora
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown') && !e.target.closest('.burger')) {
                dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });
        
        // Fechar dropdowns ao redimensionar
        window.addEventListener('resize', () => {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        });
    }

    setupDropdownMenu();

    // Carousel
    const slides = document.querySelectorAll(".carousel-slide");
    const dots = document.querySelectorAll(".dot");
    
    if (slides.length > 0 && dots.length > 0) {
        let currentSlide = 0;
        let carouselInterval;

        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove("active"));
            dots.forEach(dot => dot.classList.remove("active"));
            
            slides[index].classList.add("active");
            dots[index].classList.add("active");
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        function startCarousel() {
            carouselInterval = setInterval(nextSlide, 5000);
        }
        
        startCarousel();

        dots.forEach((dot, index) => {
            dot.addEventListener("click", () => {
                clearInterval(carouselInterval);
                currentSlide = index;
                showSlide(currentSlide);
                startCarousel();
            });
        });

        const heroBanner = document.querySelector('.hero-banner');
        if (heroBanner) {
            heroBanner.addEventListener('mouseenter', () => clearInterval(carouselInterval));
            heroBanner.addEventListener('mouseleave', startCarousel);
        }
    }

    // Smooth Scroll
    document.querySelectorAll("a[href^='#']").forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            const href = this.getAttribute("href");
            if (href !== "#") {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }
        });
    });

    // Back to Top
    const backToTopButton = document.querySelector(".back-to-top");
    if (backToTopButton) {
        window.addEventListener("scroll", () => {
            backToTopButton.style.display = window.pageYOffset > 300 ? "flex" : "none";
        });

        backToTopButton.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // Fade-in animation
    const sections = document.querySelectorAll("section");
    if (sections.length > 0) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = "translateY(0)";
                }
            });
        }, { threshold: 0.1 });

        sections.forEach(section => {
            section.style.opacity = 0;
            section.style.transform = "translateY(20px)";
            section.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
            sectionObserver.observe(section);
        });
    }

    // Fechar menu ao clicar em links (mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768 && nav.classList.contains("nav-active")) {
                nav.classList.remove("nav-active");
                burger.classList.remove("toggle");
                navLinks.forEach(link => link.style.animation = "");
                
                // Fechar dropdowns também
                document.querySelectorAll('.dropdown').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });
    });
});