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

    // Fechar menu ao clicar em links (mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768 && nav.classList.contains("nav-active")) {
                nav.classList.remove("nav-active");
                burger.classList.remove("toggle");
                navLinks.forEach(link => link.style.animation = "");
            }
        });
    });

    // Carousel Hero
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

    // Carousel de Destaques - NOVA IMPLEMENTAÇÃO
    function setupProductCarousel() {
        const carousel = document.querySelector('.product-carousel');
        const prevBtn = document.querySelector('.carousel-arrow-prev');
        const nextBtn = document.querySelector('.carousel-arrow-next');
        
        if (!carousel || !prevBtn || !nextBtn) return;
        
        const productItems = document.querySelectorAll('.product-item');
        let currentPosition = 0;
        let autoScrollInterval;
        
        // Função para calcular a largura dos itens com gap
        function getItemWidth() {
            if (productItems.length === 0) return 0;
            
            const itemStyle = window.getComputedStyle(productItems[0]);
            const itemWidth = productItems[0].offsetWidth;
            const gap = parseInt(itemStyle.marginRight) || 0;
            
            return itemWidth + gap;
        }
        
        // Função para mover o carrossel
        function moveCarousel(direction) {
            const itemWidth = getItemWidth();
            const maxScroll = carousel.scrollWidth - carousel.clientWidth;
            
            if (direction === 'next') {
                currentPosition = Math.min(currentPosition + itemWidth, maxScroll);
            } else {
                currentPosition = Math.max(currentPosition - itemWidth, 0);
            }
            
            carousel.scrollTo({ left: currentPosition, behavior: 'smooth' });
        }
        
        // Desktop - navegação por setas
        if (window.innerWidth > 768) {
            nextBtn.addEventListener('click', () => moveCarousel('next'));
            prevBtn.addEventListener('click', () => moveCarousel('prev'));
            
            // Esconder setas se não houver itens para rolar
            function checkArrowVisibility() {
                const maxScroll = carousel.scrollWidth - carousel.clientWidth;
                prevBtn.style.display = currentPosition > 0 ? 'flex' : 'none';
                nextBtn.style.display = currentPosition < maxScroll - 10 ? 'flex' : 'none';
            }
            
            carousel.addEventListener('scroll', () => {
                currentPosition = carousel.scrollLeft;
                checkArrowVisibility();
            });
            
            checkArrowVisibility();
            
            // Iniciar scroll automático apenas no desktop
            function startAutoScroll() {
                clearInterval(autoScrollInterval);
                autoScrollInterval = setInterval(() => {
                    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
                    const currentScroll = carousel.scrollLeft;
                    
                    if (currentScroll >= maxScroll - 10) {
                        // Voltar ao início suavemente
                        carousel.scrollTo({ left: 0, behavior: 'smooth' });
                        currentPosition = 0;
                    } else {
                        // Mover para o próximo item
                        const itemWidth = getItemWidth();
                        moveCarousel('next');
                    }
                }, 5000);
            }
            
            // Pausar carousel quando o mouse estiver sobre ele
            carousel.addEventListener('mouseenter', () => {
                clearInterval(autoScrollInterval);
            });
            
            carousel.addEventListener('mouseleave', () => {
                startAutoScroll();
            });
            
            // Iniciar scroll automático
            startAutoScroll();
        }
        
        // Mobile - scroll manual com touch/swipe 
        if (window.innerWidth <= 768) {
            // Esconder setas no mobile
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
            
            // Configurar scroll suave
            carousel.style.overflowX = 'auto';
            carousel.style.scrollSnapType = 'x mandatory';
            carousel.style.scrollBehavior = 'smooth';
            
            // Aplicar snap a cada item
            productItems.forEach(item => {
                item.style.scrollSnapAlign = 'center';
                item.style.flex = '0 0 auto';
            });
        }
        
        // Reconfigurar ao redimensionar
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 768) {
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
            } else {
                prevBtn.style.display = 'flex';
                nextBtn.style.display = 'flex';
            }
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

    // Carousel automático de Benefícios (mobile)
    function setupBenefitsCarousel() {
        const benefitsCarousel = document.querySelector('.benefit-carousel');
        if (!benefitsCarousel) return;
        
        // Apenas para mobile
        if (window.innerWidth > 768) {
            benefitsCarousel.style.display = 'grid';
            return;
        }
        
        benefitsCarousel.style.display = 'flex';
        benefitsCarousel.style.overflowX = 'auto';
        benefitsCarousel.style.scrollSnapType = 'x mandatory';
        benefitsCarousel.style.scrollBehavior = 'smooth';
        benefitsCarousel.style.gap = '20px';
        
        const benefitItems = document.querySelectorAll('.benefit-item');
        benefitItems.forEach(item => {
            item.style.scrollSnapAlign = 'center';
            item.style.flex = '0 0 auto';
            item.style.minWidth = 'calc(100% - 10px)';
        });
        
        let scrollInterval = setInterval(() => {
            const maxScroll = benefitsCarousel.scrollWidth - benefitsCarousel.clientWidth;
            const currentScroll = benefitsCarousel.scrollLeft;
            
            if (currentScroll >= maxScroll - 10) {
                benefitsCarousel.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                const itemWidth = benefitItems[0].offsetWidth + 20;
                benefitsCarousel.scrollBy({ left: itemWidth, behavior: 'smooth' });
            }
        }, 5000);
        
        // Pausar carousel quando o mouse estiver sobre ele
        benefitsCarousel.addEventListener('mouseenter', () => {
            clearInterval(scrollInterval);
        });
        
        benefitsCarousel.addEventListener('mouseleave', () => {
            scrollInterval = setInterval(() => {
                const maxScroll = benefitsCarousel.scrollWidth - benefitsCarousel.clientWidth;
                const currentScroll = benefitsCarousel.scrollLeft;
                
                if (currentScroll >= maxScroll - 10) {
                    benefitsCarousel.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    const itemWidth = benefitItems[0].offsetWidth + 20;
                    benefitsCarousel.scrollBy({ left: itemWidth, behavior: 'smooth' });
                }
            }, 5000);
        });
    }

    // Galeria de Produtos
    function setupProductGallery() {
        const thumbnails = document.querySelectorAll('.thumbnail');
        const mainImage = document.getElementById('zoomed-image');
        
        if (!thumbnails.length || !mainImage) return;
        
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                // Remover classe ativa de todas as miniaturas
                thumbnails.forEach(t => t.classList.remove('active'));
                
                // Adicionar classe ativa à miniatura clicada
                this.classList.add('active');
                
                // Trocar imagem principal
                const newImageSrc = this.getAttribute('data-image');
                mainImage.src = newImageSrc;
                mainImage.alt = this.querySelector('img').alt;
            });
            
            // Hover para desktop
            if (window.innerWidth > 768) {
                thumb.addEventListener('mouseenter', function() {
                    const newImageSrc = this.getAttribute('data-image');
                    mainImage.src = newImageSrc;
                    mainImage.alt = this.querySelector('img').alt;
                });
            }
        });
    }

    // Carrossel automático para Qualidade Sleep Prime (mobile)
    function setupQualityCarousel() {
        const qualityFeatures = document.querySelector('.quality-features');
        if (!qualityFeatures || window.innerWidth > 768) return;
        
        // SOLUÇÃO NOVA: Garantir que a primeira imagem aparece completa
        const ensureFirstImageVisible = () => {
            setTimeout(() => {
                // Força o scroll para o início imediatamente
                qualityFeatures.scrollLeft = 0;
                
                // Confirma após um pequeno delay
                setTimeout(() => {
                    if (qualityFeatures.scrollLeft !== 0) {
                        qualityFeatures.scrollTo({ left: 0, behavior: 'auto' });
                    }
                    
                    // Verifica se o primeiro item está visível
                    const firstItem = document.querySelector('.quality-item');
                    if (firstItem) {
                        const firstItemRect = firstItem.getBoundingClientRect();
                        const containerRect = qualityFeatures.getBoundingClientRect();
                        
                        // Se o primeiro item não estiver completamente visível à esquerda
                        if (firstItemRect.left < containerRect.left) {
                            firstItem.scrollIntoView({ 
                                behavior: 'auto', 
                                inline: 'start',
                                block: 'nearest'
                            });
                        }
                    }
                }, 50);
            }, 100);
        };
        
        // Executar assim que o carrossel estiver pronto
        ensureFirstImageVisible();
        
        // Também executar quando a janela for redimensionada
        window.addEventListener('resize', ensureFirstImageVisible);
        
        // Seu código original para o carrossel automático
        let scrollInterval = setInterval(() => {
            const itemWidth = document.querySelector('.quality-item').offsetWidth + 15;
            const maxScroll = qualityFeatures.scrollWidth - qualityFeatures.clientWidth;
            const currentScroll = qualityFeatures.scrollLeft;
            
            if (currentScroll >= maxScroll - 10) {
                qualityFeatures.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                qualityFeatures.scrollBy({ left: itemWidth, behavior: 'smooth' });
            }
        }, 5000);

        // Pausar carousel quando o usuário interagir
        qualityFeatures.addEventListener('touchstart', () => {
            clearInterval(scrollInterval);
        });
        
        qualityFeatures.addEventListener('touchend', () => {
            // Recriar o intervalo
            scrollInterval = setInterval(() => {
                const itemWidth = document.querySelector('.quality-item').offsetWidth + 15;
                const maxScroll = qualityFeatures.scrollWidth - qualityFeatures.clientWidth;
                const currentScroll = qualityFeatures.scrollLeft;
                
                if (currentScroll >= maxScroll - 10) {
                    qualityFeatures.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    qualityFeatures.scrollBy({ left: itemWidth, behavior: 'smooth' });
                }
            }, 5000);
        });
        
        // Adicionar também para o evento de scroll manual
        qualityFeatures.addEventListener('scroll', () => {
            clearInterval(scrollInterval);
        });
    }

    // Carousel automático de Depoimentos (mobile)
    function setupTestimonialsCarousel() {
        if (window.innerWidth > 768) return;
        
        const testimonialsContainer = document.querySelector('.testimonials-container');
        if (!testimonialsContainer) return;
        
        let scrollInterval = setInterval(() => {
            const testimonialItems = document.querySelectorAll('.testimonial-item');
            const itemWidth = testimonialItems[0].offsetWidth + 20;
            const maxScroll = testimonialsContainer.scrollWidth - testimonialsContainer.clientWidth;
            const currentScroll = testimonialsContainer.scrollLeft;
            
            if (currentScroll >= maxScroll - 10) {
                testimonialsContainer.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                testimonialsContainer.scrollBy({ left: itemWidth, behavior: 'smooth' });
            }
        }, 5000); // segundos
        
        // Pausar carousel quando o mouse estiver sobre ele
        testimonialsContainer.addEventListener('mouseenter', () => {
            clearInterval(scrollInterval);
        });
        
        testimonialsContainer.addEventListener('mouseleave', () => {
            scrollInterval = setInterval(() => {
                const testimonialItems = document.querySelectorAll('.testimonial-item');
                const itemWidth = testimonialItems[0].offsetWidth + 20;
                const maxScroll = testimonialsContainer.scrollWidth - testimonialsContainer.clientWidth;
                const currentScroll = testimonialsContainer.scrollLeft;
                
                if (currentScroll >= maxScroll - 10) {
                    testimonialsContainer.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    testimonialsContainer.scrollBy({ left: itemWidth, behavior: 'smooth' });
                }
            }, 10000);
        });
    }

    // Slider Mobile para Galeria
    function setupMobileSlider() {
        if (window.innerWidth > 768) return;
        
        const gallery = document.querySelector('.product-gallery');
        if (!gallery) return;
        
        // Criar estrutura do slider
        const mainImageContainer = document.querySelector('.main-image');
        const thumbnails = document.querySelectorAll('.thumbnail');
        
        if (!mainImageContainer || !thumbnails.length) return;
        
        // Esconder miniaturas originais
        document.querySelector('.thumbnails').style.display = 'none';
        
        // Criar slider mobile
        const sliderHTML = `
            <div class="mobile-slider">
                <div class="mobile-slider-track">
                    ${Array.from(thumbnails).map((thumb, index) => `
                        <div class="mobile-slide" data-index="${index}">
                            <img src="${thumb.getAttribute('data-image')}" alt="${thumb.querySelector('img').alt}">
                        </div>
                    `).join('')}
                </div>
                <div class="mobile-slider-nav">
                    ${Array.from(thumbnails).map((_, index) => `
                        <div class="mobile-slider-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></div>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Substituir a galeria pelo slider
        mainImageContainer.innerHTML = sliderHTML;
        
        // Configurar funcionalidade do slider
        const track = document.querySelector('.mobile-slider-track');
        const dots = document.querySelectorAll('.mobile-slider-dot');
        const slides = document.querySelectorAll('.mobile-slide');
        let currentIndex = 0;
        
        function goToSlide(index) {
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;
            
            track.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
            currentIndex = index;
        }
        
        // Eventos para os dots
        dots.forEach(dot => {
            dot.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                goToSlide(index);
            });
        });
        
        // Swipe para mobile
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        
        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });
        
        track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        });
        
        track.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            
            const diff = startX - currentX;
            if (Math.abs(diff) > 50) { // Limite mínimo para considerar como swipe
                if (diff > 0) {
                    goToSlide(currentIndex + 1); // Swipe para esquerda
                } else {
                    goToSlide(currentIndex - 1); // Swipe para direita
                }
            }
        });
        
        // Auto-play para o slider
        let sliderInterval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 4000);
        
        // Pausar auto-play ao interagir
        track.addEventListener('touchstart', () => {
            clearInterval(sliderInterval);
        });
        
        track.addEventListener('touchend', () => {
            sliderInterval = setInterval(() => {
                goToSlide(currentIndex + 1);
            }, 4000);
        });
    }

    // Formulário de contato
    function setupContactForm() {
    const contactForm = document.querySelector('.contact-form-container');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Coletar dados do formulário
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        
        // Botão de enviar
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Feedback visual
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        
        try {
            // Enviar para o endpoint do FormSubmit
            const response = await fetch('https://formsubmit.co/ajax/magdielsilva2@hotmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                alert('Obrigado por entrar em contato! Retornaremos em breve.');
                contactForm.reset();
            } else {
                throw new Error('Falha no envio');
            }
        } catch (error) {
            alert('Houve um erro ao enviar sua mensagem. Por favor, tente novamente mais tarde.');
            console.error('Erro:', error);
        } finally {
            // Restaurar botão
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            }
        });
    }

    // Botão Comprar Agora - CORRIGIDO
    function setupBuyNowButtons() {
        const buyNowButtons = document.querySelectorAll('.buy-now-btn');
        
        buyNowButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                const productId = button.getAttribute('data-product-id');
                const productName = button.getAttribute('data-product-name');
                const productPrice = parseFloat(button.getAttribute('data-product-price'));
                const productImage = button.getAttribute('data-product-image') || '';
                
                // Adicionar ao carrinho
                if (typeof sleepPrimeCart !== 'undefined') {
                    sleepPrimeCart.addProduct(productId, productName, productPrice, productImage);
                    
                    // Redirecionar para o carrinho com caminho correto
                    const isProductPage = window.location.pathname.includes('produtos/');
                    const cartPath = isProductPage ? '../carrinho.html' : 'carrinho.html';
                    
                    setTimeout(() => {
                        window.location.href = cartPath;
                    }, 100);
                } else {
                    // Fallback caso o carrinho não esteja carregado
                    alert(`${productName} adicionado ao carrinho!`);
                    const isProductPage = window.location.pathname.includes('produtos/');
                    const cartPath = isProductPage ? '../carrinho.html' : 'carrinho.html';
                    window.location.href = cartPath;
                }
            });
        });
    }

    // Footer Accordion para Mobile - VERSÃO MELHORADA
    function setupFooterAccordion() {
        console.log('Inicializando footer accordion...');
        
        if (window.innerWidth > 768) {
            // Desktop - garantir que tudo está visível
            const footerCols = document.querySelectorAll('.footer-col');
            footerCols.forEach(col => {
                col.classList.remove('active');
                const content = col.querySelector('.footer-links, .footer-contact');
                if (content) {
                    content.style.maxHeight = '';
                    content.style.overflow = '';
                }
            });
            return;
        }
        
        const footerCols = document.querySelectorAll('.footer-col:not(:first-child)');
        console.log('Footer columns encontradas:', footerCols.length);
        
        // Remover todos os event listeners existentes primeiro
        footerCols.forEach(col => {
            const heading = col.querySelector('h3');
            if (heading) {
                heading.replaceWith(heading.cloneNode(true));
            }
        });
        
        // Re-selecionar os elementos após o clone
        const refreshedFooterCols = document.querySelectorAll('.footer-col:not(:first-child)');
        
        refreshedFooterCols.forEach(col => {
            const heading = col.querySelector('h3');
            const content = col.querySelector('.footer-links, .footer-contact');
            
            if (heading && content) {
                // Fechar todos inicialmente (exceto o primeiro)
                if (!col.classList.contains('active')) {
                    content.style.maxHeight = '0';
                } else {
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
                
                // Adicionar event listener
                heading.addEventListener('click', function() {
                    console.log('Footer accordion clicado');
                    
                    // Fechar outras colunas abertas
                    refreshedFooterCols.forEach(otherCol => {
                        if (otherCol !== col && otherCol.classList.contains('active')) {
                            otherCol.classList.remove('active');
                            const otherContent = otherCol.querySelector('.footer-links, .footer-contact');
                            if (otherContent) {
                                otherContent.style.maxHeight = '0';
                            }
                        }
                    });
                    
                    // Alternar coluna atual
                    col.classList.toggle('active');
                    if (col.classList.contains('active')) {
                        content.style.maxHeight = content.scrollHeight + 'px';
                    } else {
                        content.style.maxHeight = '0';
                    }
                });
            }
        });
    }

    // Expor a função globalmente para acesso externo
    window.setupFooterAccordion = setupFooterAccordion;

    // Inicializar todas as funcionalidades
    setupProductCarousel();
    setupBenefitsCarousel();
    setupTestimonialsCarousel();
    setupProductGallery();
    setupMobileSlider();
    setupContactForm();
    setupBuyNowButtons();
    setupQualityCarousel();
    setupFooterAccordion();
    
    // Reconfigurar ao redimensionar a janela
    window.addEventListener('resize', () => {
        setupProductGallery();
        setupMobileSlider();
        setupProductCarousel();
        setupBenefitsCarousel();
        setupTestimonialsCarousel();
        setupQualityCarousel();
        
        // Footer accordion no resize
        const footerCols = document.querySelectorAll('.footer-col');
        
        if (window.innerWidth > 768) {
            // Desktop - remover accordion
            footerCols.forEach(col => {
                col.classList.remove('active');
                const content = col.querySelector('.footer-links, .footer-contact');
                if (content) {
                    content.style.maxHeight = '';
                    content.style.overflow = '';
                }
            });
        } else {
            // Mobile - aplicar accordion
            setupFooterAccordion();
        }
    });
});

// Funcionalidade para o accordion de dúvidas frequentes
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Fecha todas as outras FAQs abertas
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Alterna a FAQ clicada
            item.classList.toggle('active');
        });
    });
});