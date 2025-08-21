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

    // Melhorar toque em botões (área de toque mínima de 44px)
    if (window.innerWidth <= 768) {
        const touchElements = document.querySelectorAll('.btn, .add-to-cart-btn, .quantity-btn, .dropdown-toggle');
        touchElements.forEach(el => {
            el.style.minHeight = '44px';
            el.style.minWidth = '44px';
        });
    }

    // Prevenir zoom em inputs em iOS
    if (navigator.platform.indexOf('iPhone') > -1 || 
        navigator.platform.indexOf('iPad') > -1 || 
        navigator.platform.indexOf('iPod') > -1) {
        
        document.addEventListener('touchstart', function (e) {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
    }
});