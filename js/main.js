// main.js - Funções globais e interações - VERSÃO CORRIGIDA

document.addEventListener("DOMContentLoaded", () => {
    // Menu Hamburguer - COM VERIFICAÇÃO DE SEGURANÇA
    const burger = document.querySelector(".burger");
    const nav = document.querySelector(".nav-links");
    const navLinks = document.querySelectorAll(".nav-links li");

    // Verifica se os elementos existem antes de adicionar event listeners
    if (burger && nav) {
        burger.addEventListener("click", () => {
            // Toggle Nav - com verificação de segurança
            if (nav && nav.classList) {
                nav.classList.toggle("nav-active");
            }

            // Animate Links - com verificação de segurança
            if (navLinks && navLinks.length > 0) {
                navLinks.forEach((link, index) => {
                    if (link && link.style) {
                        if (link.style.animation) {
                            link.style.animation = "";
                        } else {
                            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                        }
                    }
                });
            }

            // Burger Animation - com verificação de segurança
            if (burger && burger.classList) {
                burger.classList.toggle("toggle");
            }
        });
    }

    // Carousel functionality - com verificação de segurança
    const slides = document.querySelectorAll(".carousel-slide");
    const dots = document.querySelectorAll(".dot");
    
    if (slides.length > 0 && dots.length > 0) {
        let currentSlide = 0;

        function showSlide(index) {
            // Hide all slides
            slides.forEach(slide => {
                if (slide && slide.classList) {
                    slide.classList.remove("active");
                }
            });

            // Remove active class from all dots
            dots.forEach(dot => {
                if (dot && dot.classList) {
                    dot.classList.remove("active");
                }
            });

            // Show current slide and activate corresponding dot
            if (slides[index] && slides[index].classList) {
                slides[index].classList.add("active");
            }
            if (dots[index] && dots[index].classList) {
                dots[index].classList.add("active");
            }
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        // Auto-advance carousel every 5 seconds
        setInterval(nextSlide, 5000);

        // Dot navigation
        dots.forEach((dot, index) => {
            if (dot) {
                dot.addEventListener("click", () => {
                    currentSlide = index;
                    showSlide(currentSlide);
                });
            }
        });
    }

    // Smooth Scroll for internal links - com verificação de segurança
    const internalLinks = document.querySelectorAll("a[href^=\"#\"]");
    if (internalLinks.length > 0) {
        internalLinks.forEach(anchor => {
            if (anchor) {
                anchor.addEventListener("click", function (e) {
                    e.preventDefault();

                    const targetElement = document.querySelector(this.getAttribute("href"));
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: "smooth"
                        });
                    }
                });
            }
        });
    }

    // Back to Top Button functionality - com verificação de segurança
    const backToTopButton = document.querySelector(".back-to-top");
    if (backToTopButton) {
        window.addEventListener("scroll", () => {
            if (backToTopButton && backToTopButton.style) {
                if (window.pageYOffset > 300) {
                    backToTopButton.style.display = "flex";
                } else {
                    backToTopButton.style.display = "none";
                }
            }
        });

        backToTopButton.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // Simple fade-in animation for sections on scroll - com verificação de segurança
    const sections = document.querySelectorAll("section");
    if (sections.length > 0) {
        const fadeIn = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.target && entry.target.style) {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = "translateY(0)";
                    observer.unobserve(entry.target);
                }
            });
        };

        const sectionObserver = new IntersectionObserver(fadeIn, {
            threshold: 0.1,
        });

        sections.forEach(section => {
            if (section && section.style) {
                section.style.opacity = 0;
                section.style.transform = "translateY(20px)";
                section.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
                sectionObserver.observe(section);
            }
        });
    }
});