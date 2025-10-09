// mainresponsive.js - Ajustes específicos para mobile
document.addEventListener("DOMContentLoaded", () => {
    // Apenas para debugging - pode remover depois
    console.log("mainresponsive.js carregado - Dispositivo: ", 
                window.innerWidth <= 768 ? "Mobile" : "Desktop");
    
    // Ajustar altura do menu para compensar a barra de endereço mobile
    if (window.innerWidth <= 768) {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // Recalcular quando a orientação mudar
        window.addEventListener('resize', () => {
            const newVh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${newVh}px`);
        });
    }
    
    // Detectar se é mobile
    function detectMobile() {
        const isMobile = window.innerWidth <= 768;
        document.body.classList.toggle('is-mobile', isMobile);
        document.body.classList.toggle('is-desktop', !isMobile);
        
        // Re-inicializar footer accordion quando mudar para mobile
        if (isMobile && typeof setupFooterAccordion === 'function') {
            setTimeout(() => {
                setupFooterAccordion();
                console.log('Footer accordion re-inicializado no resize para mobile');
            }, 100);
        }
    }
    
    // Executar na carga e no redimensionamento
    detectMobile();
    window.addEventListener('resize', detectMobile);
    
    // Footer accordion para mobile - inicialização garantida
    function initFooterAccordion() {
        console.log("Inicializando footer accordion...");
        
        if (window.innerWidth <= 768) {
            console.log("Footer accordion ativado para mobile");
            
            // Garantir que a função seja chamada após um pequeno delay
            setTimeout(() => {
                if (typeof setupFooterAccordion === 'function') {
                    setupFooterAccordion();
                    console.log('Footer accordion inicializado com sucesso');
                } else {
                    console.log('Função setupFooterAccordion não encontrada, tentando novamente...');
                    // Tentar novamente após mais um delay
                    setTimeout(() => {
                        if (typeof setupFooterAccordion === 'function') {
                            setupFooterAccordion();
                        }
                    }, 500);
                }
            }, 200);
        } else {
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
        }
    }

    // Inicializar footer accordion após um delay para garantir que o DOM está pronto
    setTimeout(initFooterAccordion, 300);
    
    // Também inicializar quando a página estiver completamente carregada
    window.addEventListener('load', initFooterAccordion);
    
    // Prevenir zoom no campo de input em iOS
    if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                document.body.style.zoom = '1';
            });
        });
    }
    
    // Melhorar performance de scroll em mobile
    if ('scrollBehavior' in document.documentElement.style) {
        // Navegador suporta scroll suave nativo
    } else {
        // Adicionar polyfill se necessário
        console.log("Scroll suave não suportado nativamente");
    }

    // Função auxiliar para verificar se o footer está presente
    function checkFooterPresence() {
        const footer = document.querySelector('footer');
        const footerCols = document.querySelectorAll('.footer-col');
        
        if (!footer) {
            console.log('Footer não encontrado no DOM');
            return false;
        }
        
        if (footerCols.length === 0) {
            console.log('Nenhuma footer column encontrada');
            return false;
        }
        
        console.log(`Footer encontrado com ${footerCols.length} colunas`);
        return true;
    }

    // Verificar presença do footer periodicamente nas páginas de produto
    if (window.location.pathname.includes('produtos/')) {
        let checkCount = 0;
        const maxChecks = 10;
        
        const footerCheckInterval = setInterval(() => {
            if (checkFooterPresence()) {
                console.log('Footer verificado, inicializando accordion...');
                initFooterAccordion();
                clearInterval(footerCheckInterval);
            } else if (checkCount >= maxChecks) {
                console.log('Footer não encontrado após várias tentativas');
                clearInterval(footerCheckInterval);
            }
            checkCount++;
        }, 500);
    }
});