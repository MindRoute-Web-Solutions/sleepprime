// cart.js - VERSÃO COMPLETA CORRIGIDA - LINKS FUNCIONANDO
class Cart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem("sleepPrimeCart")) || [];
        this.init();
    }

    init() {
        this.updateCartIcon();
        this.setupEventListeners();
        this.fixCartImageUrls();
    }

    fixCartImageUrls() {
        // MAPEAMENTO COM CAMINHOS RELATIVOS CORRETOS
        const imagensFixas = {
            'travesseiro-zentech': '../assets/images/travesseiro_destaque.jpg',
            'colchao-confortfit': '../assets/images/colchao_destaque.jpg',
            'box-elegance': '../assets/images/box_destaque.jpg',
            'cabeceira-harmony': '../assets/images/cabeceira_principal.jpg'
        };

        this.cart.forEach(item => {
            // Se a imagem está errada ou não existe, corrige
            if (!item.image || item.image === 'null' || item.image === 'undefined') {
                item.image = imagensFixas[item.id];
            }
            // Garante que é um caminho relativo
            else if (!item.image.startsWith('../') && !item.image.startsWith('http')) {
                item.image = '../' + item.image;
            }
        });
        
        this.saveCart();
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            const addButton = e.target.closest('.add-to-cart-btn');
            if (addButton) {
                this.addProduct(
                    addButton.getAttribute('data-product-id'),
                    addButton.getAttribute('data-product-name'),
                    parseFloat(addButton.getAttribute('data-product-price')),
                    addButton.getAttribute('data-product-image')
                );
            }
        });
    }

    addProduct(id, name, price, imageUrl) {
        // MAPEAMENTO COM CAMINHOS RELATIVOS CORRETOS
        const imagensFixas = {
            'travesseiro-zentech': '../assets/images/travesseiro_destaque.jpg',
            'colchao-confortfit': '../assets/images/colchao_destaque.jpg',
            'box-elegance': '../assets/images/box_destaque.jpg',
            'cabeceira-harmony': '../assets/images/cabeceira_principal.jpg'
        };

        const imageFinal = imagensFixas[id] || '../assets/images/produto_indisponivel.jpg';

        const existingProduct = this.cart.find(item => item.id === id);
        
        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            this.cart.push({
                id: id,
                name: name,
                price: price,
                quantity: 1,
                image: imageFinal
            });
        }
        
        this.saveCart();
        this.showNotification(`${name} adicionado ao carrinho!`);
    }

    removeProduct(id) {
        this.cart = this.cart.filter(item => item.id !== id);
        this.saveCart();
        if (window.location.pathname.includes('carrinho.html')) {
            this.renderCartPage();
        }
    }

    updateQuantity(id, newQuantity) {
        if (newQuantity < 1) return;
        
        const product = this.cart.find(item => item.id === id);
        if (product) {
            product.quantity = newQuantity;
            this.saveCart();
            if (window.location.pathname.includes('carrinho.html')) {
                this.renderCartPage();
            }
        }
    }

    saveCart() {
        localStorage.setItem("sleepPrimeCart", JSON.stringify(this.cart));
        this.updateCartIcon();
    }

    updateCartIcon() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = totalItems;
        });
    }

    getTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
    }

    showNotification(message) {
        // Remove notificação existente
        const existingNotification = document.querySelector('.cart-notification');
        if (existingNotification) existingNotification.remove();
        
        // 🔥 CORREÇÃO IMPLEMENTADA: Detecta automaticamente o caminho correto
        const isProductPage = window.location.pathname.includes('produtos/');
        const cartLink = isProductPage ? '../carrinho.html' : 'carrinho.html';
        
        // Cria nova notificação
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `<span>${message}</span><a href="${cartLink}">Ver Carrinho</a>`;
        
        document.body.appendChild(notification);
        
        // Mostra a notificação
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Esconde após 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    renderCartPage() {
        if (!window.location.pathname.includes('carrinho.html')) return;
        
        const cartItemsContainer = document.querySelector('.cart-items');
        const emptyCartElement = document.querySelector('.empty-cart');
        const subtotalElement = document.querySelector('.subtotal');
        const totalElement = document.querySelector('.total-price');
        
        if (this.cart.length === 0) {
            if (cartItemsContainer) cartItemsContainer.style.display = 'none';
            if (emptyCartElement) emptyCartElement.style.display = 'block';
            if (subtotalElement) subtotalElement.textContent = 'R$ 0,00';
            if (totalElement) totalElement.textContent = 'R$ 0,00';
            return;
        }
        
        if (emptyCartElement) emptyCartElement.style.display = 'none';
        if (cartItemsContainer) {
            cartItemsContainer.style.display = 'block';
            
            let html = '';
            this.cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                
                html += `
                    <div class="cart-item" data-product-id="${item.id}">
                        <img src="${item.image}" alt="${item.name}" 
                             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        <div class="img-placeholder" style="display: none;">
                            Imagem<br>Não Carregou
                        </div>
                        <div class="item-details">
                            <h3>${item.name}</h3>
                            <p class="price">R$ ${item.price.toFixed(2)}</p>
                            <div class="item-actions">
                                <div class="quantity-control">
                                    <button class="quantity-btn minus"><i class="fas fa-minus"></i></button>
                                    <span class="quantity">${item.quantity}</span>
                                    <button class="quantity-btn plus"><i class="fas fa-plus"></i></button>
                                </div>
                                <button class="remove-btn" data-id="${item.id}">
                                    <i class="fas fa-trash"></i> Remover
                                </button>
                            </div>
                        </div>
                        <div class="item-total">
                            <p>R$ ${itemTotal.toFixed(2)}</p>
                        </div>
                    </div>
                `;
            });
            
            cartItemsContainer.innerHTML = html;
            
            // Adiciona event listeners para os botões de remover
            cartItemsContainer.querySelectorAll('.remove-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const productId = e.target.closest('.remove-btn').getAttribute('data-id');
                    this.removeProduct(productId);
                });
            });
        }
        
        // Atualiza totais
        const subtotal = this.getTotal();
        if (subtotalElement) subtotalElement.textContent = `R$ ${subtotal.toFixed(2)}`;
        if (totalElement) totalElement.textContent = `R$ ${subtotal.toFixed(2)}`;
    }

    setupCartPage() {
        if (!window.location.pathname.includes('carrinho.html')) return;
        
        this.renderCartPage();
        
        // Event listener para o botão finalizar compra
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (this.cart.length === 0) {
                    alert('Seu carrinho está vazio!');
                    return;
                }
                
                alert('Compra finalizada com sucesso! Obrigado pela preferência.');
                this.clearCart();
                this.renderCartPage();
            });
        }
    }
}

// Inicializa o carrinho
const sleepPrimeCart = new Cart();

// Para a página do carrinho, chama a configuração específica
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        sleepPrimeCart.setupCartPage();
    });
} else {
    sleepPrimeCart.setupCartPage();
}