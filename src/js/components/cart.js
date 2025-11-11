// Système de panier simple pour la démonstration
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('mebo-cart')) || [];
        this.createCartUI();
        this.updateCartDisplay();
    }

    createCartUI() {
        const cartHTML = `
            <div class="cart-widget">
                <button class="cart-toggle" id="cart-toggle">
                    <span class="cart-icon">🛒</span>
                    <span class="cart-count" id="cart-count">0</span>
                </button>
                <div class="cart-dropdown" id="cart-dropdown">
                    <h3>Votre panier</h3>
                    <div class="cart-items" id="cart-items">
                        <!-- Les items du panier apparaîtront ici -->
                    </div>
                    <div class="cart-footer">
                        <div class="cart-total">
                            Total: <span id="cart-total">0€</span>
                        </div>
                        <button class="btn btn-primary cart-checkout">
                            Demander un devis
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', cartHTML);
        this.bindCartEvents();
    }

    bindCartEvents() {
        const cartToggle = document.getElementById('cart-toggle');
        const cartDropdown = document.getElementById('cart-dropdown');

        cartToggle.addEventListener('click', () => {
            cartDropdown.classList.toggle('active');
        });

        // Fermer le panier en cliquant ailleurs
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.cart-widget')) {
                cartDropdown.classList.remove('active');
            }
        });

        // Bouton de checkout
        document.querySelector('.cart-checkout').addEventListener('click', () => {
            this.checkout();
        });
    }

    add(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
        
        this.saveCart();
        this.updateCartDisplay();
    }

    remove(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
    }

    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.remove(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartDisplay();
            }
        }
    }

    saveCart() {
        localStorage.setItem('mebo-cart', JSON.stringify(this.items));
    }

    updateCartDisplay() {
        const cartCount = document.getElementById('cart-count');
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');

        // Mettre à jour le compteur
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'block' : 'none';

        // Mettre à jour les items
        if (this.items.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Votre panier est vide</p>';
        } else {
            cartItems.innerHTML = this.items.map(item => `
                <div class="cart-item">
                    <img src="${item.image || './assets/images/products/default.jpg'}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <div class="cart-item-controls">
                            <button class="quantity-btn" onclick="window.cart.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn" onclick="window.cart.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        </div>
                        <p class="cart-item-price">${item.price ? item.price * item.quantity + '€' : 'Sur devis'}</p>
                    </div>
                    <button class="remove-item" onclick="window.cart.remove(${item.id})">×</button>
                </div>
            `).join('');
        }

        // Mettre à jour le total
        const total = this.items.reduce((sum, item) => {
            return sum + (item.price ? item.price * item.quantity : 0);
        }, 0);
        cartTotal.textContent = total > 0 ? `${total}€` : 'Sur devis';
    }

    checkout() {
        if (this.items.length === 0) {
            alert('Votre panier est vide');
            return;
        }

        // Créer un message de devis avec les produits
        const cartSummary = this.items.map(item => 
            `- ${item.name} (x${item.quantity}) - ${item.price ? item.price * item.quantity + '€' : 'Sur devis'}`
        ).join('\n');

        const message = `Bonjour, j'aimerais recevoir un devis pour les produits suivants:\n\n${cartSummary}`;
        
        // Rediriger vers le formulaire de contact avec le message pré-rempli
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        
        setTimeout(() => {
            const messageField = document.getElementById('message');
            if (messageField) {
                messageField.value = message;
                messageField.focus();
            }
        }, 1000);

        // Fermer le dropdown du panier
        document.getElementById('cart-dropdown').classList.remove('active');
    }
}

// Système de liste de souhaits
class Wishlist {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('mebo-wishlist')) || [];
    }

    add(product) {
        if (!this.items.find(item => item.id === product.id)) {
            this.items.push(product);
            this.save();
        }
    }

    remove(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.save();
    }

    save() {
        localStorage.setItem('mebo-wishlist', JSON.stringify(this.items));
    }
}

// Initialiser le panier et la wishlist
window.cart = new ShoppingCart();
window.wishlist = new Wishlist();