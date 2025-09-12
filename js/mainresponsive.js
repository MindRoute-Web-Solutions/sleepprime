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
    }
    
    // Executar na carga e no redimensionamento
    detectMobile();
    window.addEventListener('resize', detectMobile);
    
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
});