// cart.js - VERSÃO MELHORADA - EXPERIÊNCIA DO USUÁRIO OTIMIZADA
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
        const imagensFixas = {
            'travesseiro-zentech': '../assets/images/travesseiro_destaque.jpg',
            'colchao-confortfit': '../assets/images/colchao_destaque.jpg',
            'box-elegance': '../assets/images/box_destaque.jpg',
            'cabeceira-harmony': '../assets/images/cabeceira_principal.jpg'
        };

        this.cart.forEach(item => {
            if (!item.image || item.image === 'null' || item.image === 'undefined') {
                item.image = imagensFixas[item.id];
            }
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
        // Adiciona efeito visual antes de remover
        const itemElement = document.querySelector(`.cart-item[data-product-id="${id}"]`);
        if (itemElement) {
            itemElement.style.opacity = '0';
            itemElement.style.transform = 'translateX(30px)';
            
            setTimeout(() => {
                this.cart = this.cart.filter(item => item.id !== id);
                this.saveCart();
                if (window.location.pathname.includes('carrinho.html')) {
                    this.renderCartPage();
                }
            }, 300);
        } else {
            this.cart = this.cart.filter(item => item.id !== id);
            this.saveCart();
            if (window.location.pathname.includes('carrinho.html')) {
                this.renderCartPage();
            }
        }
    }

    updateQuantity(id, newQuantity) {
        if (newQuantity < 1) {
            this.showMessage("A quantidade mínima é 1");
            return;
        }
        
        const product = this.cart.find(item => item.id === id);
        if (product) {
            product.quantity = newQuantity;
            this.saveCart();
            
            // Atualiza visualmente a quantidade com animação
            const quantityElement = document.querySelector(`.cart-item[data-product-id="${id}"] .quantity`);
            if (quantityElement) {
                quantityElement.classList.add('updating');
                setTimeout(() => {
                    quantityElement.textContent = newQuantity;
                    quantityElement.classList.remove('updating');
                }, 150);
            }
            
            // Atualiza os totais
            this.updateTotals();
        }
    }

    // Novo método para atualizar apenas os totais sem rerenderizar toda a página
    updateTotals() {
        if (!window.location.pathname.includes('carrinho.html')) return;
        
        const subtotalElement = document.querySelector('.subtotal');
        const totalElement = document.querySelector('.total-price');
        
        const subtotal = this.getTotal();
        if (subtotalElement) subtotalElement.textContent = `R$ ${subtotal.toFixed(2)}`;
        if (totalElement) totalElement.textContent = `R$ ${subtotal.toFixed(2)}`;
        
        // Atualiza também os totais individuais dos itens
        this.cart.forEach(item => {
            const itemTotalElement = document.querySelector(`.cart-item[data-product-id="${item.id}"] .item-total p`);
            if (itemTotalElement) {
                itemTotalElement.textContent = `R$ ${(item.price * item.quantity).toFixed(2)}`;
            }
        });
    }

    saveCart() {
        localStorage.setItem("sleepPrimeCart", JSON.stringify(this.cart));
        this.updateCartIcon();
    }

    updateCartIcon() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelectorAll('.cart-count').forEach(el => {
            // Adiciona animação ao atualizar
            el.classList.add('updating');
            setTimeout(() => {
                el.textContent = totalItems;
                el.classList.remove('updating');
            }, 150);
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
        const existingNotification = document.querySelector('.cart-notification');
        if (existingNotification) existingNotification.remove();
        
        const isProductPage = window.location.pathname.includes('produtos/');
        const cartLink = isProductPage ? '../carrinho.html' : 'carrinho.html';
        
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `<span>${message}</span><a href="${cartLink}">Ver Carrinho</a>`;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Novo método para mostrar mensagens rápidas
    showMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'cart-message';
        messageElement.textContent = message;
        
        document.body.appendChild(messageElement);
        
        setTimeout(() => messageElement.classList.add('show'), 10);
        
        setTimeout(() => {
            messageElement.classList.remove('show');
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.parentNode.removeChild(messageElement);
                }
            }, 300);
        }, 2000);
    }

    setupQuantityButtons() {
        const cartItemsContainer = document.querySelector('.cart-items');
        if (!cartItemsContainer) return;
        
        // Botões de aumentar quantidade
        cartItemsContainer.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cartItem = e.target.closest('.cart-item');
                const productId = cartItem.getAttribute('data-product-id');
                const product = this.cart.find(item => item.id === productId);
                
                if (product) {
                    this.updateQuantity(productId, product.quantity + 1);
                    
                    // Efeito visual no botão
                    btn.classList.add('active');
                    setTimeout(() => btn.classList.remove('active'), 200);
                }
            });
        });
        
        // Botões de diminuir quantidade
        cartItemsContainer.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cartItem = e.target.closest('.cart-item');
                const productId = cartItem.getAttribute('data-product-id');
                const product = this.cart.find(item => item.id === productId);
                
                if (product) {
                    this.updateQuantity(productId, product.quantity - 1);
                    
                    // Efeito visual no botão
                    btn.classList.add('active');
                    setTimeout(() => btn.classList.remove('active'), 200);
                }
            });
        });
        
        // Botões de remover
        cartItemsContainer.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.closest('.remove-btn').getAttribute('data-id');
                this.removeProduct(productId);
            });
        });
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
            
            // Adiciona animação de entrada aos itens
            const items = cartItemsContainer.querySelectorAll('.cart-item');
            items.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 100);
            });
            
            // Configura os botões
            this.setupQuantityButtons();
        }
        
        // Atualiza totais
        const subtotal = this.getTotal();
        if (subtotalElement) subtotalElement.textContent = `R$ ${subtotal.toFixed(2)}`;
        if (totalElement) totalElement.textContent = `R$ ${subtotal.toFixed(2)}`;
    }

    setupCartPage() {
        if (!window.location.pathname.includes('carrinho.html')) return;
        
        this.renderCartPage();
        
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (this.cart.length === 0) {
                    this.showMessage('Seu carrinho está vazio!');
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