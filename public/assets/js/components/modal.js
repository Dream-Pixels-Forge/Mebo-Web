// Modal component pour les détails des produits
class ProductModal {
    constructor() {
        this.modal = null;
        this.createModal();
        this.bindEvents();
    }

    createModal() {
        const modalHTML = `
            <div id="product-modal" class="modal">
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <div class="modal-body">
                        <div class="modal-image">
                            <img id="modal-product-image" src="" alt="">
                        </div>
                        <div class="modal-info">
                            <h2 id="modal-product-title"></h2>
                            <p id="modal-product-description"></p>
                            <div class="product-details">
                                <p class="product-materials">
                                    <strong>Matériaux:</strong> <span id="modal-product-materials"></span>
                                </p>
                                <p class="product-price">
                                    <span id="modal-product-price"></span>
                                </p>
                            </div>
                            <div class="modal-actions">
                                <button class="btn btn-primary add-to-cart">
                                    <span>🛒</span> Ajouter au panier
                                </button>
                                <button class="btn btn-secondary add-to-wishlist">
                                    <span>❤️</span> Ajouter aux favoris
                                </button>
                                <button class="btn btn-tertiary contact-for-quote">
                                    <span>📞</span> Demander un devis
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('product-modal');
    }

    bindEvents() {
        // Fermer le modal
        const closeBtn = document.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => this.close());
        
        // Fermer en cliquant à l'extérieur
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });
        
        // Échap pour fermer
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });
    }

    open(productId) {
        const product = window.allProducts?.find(p => p.id === productId);
        if (!product) return;

        // Remplir les informations
        document.getElementById('modal-product-image').src = product.image || './assets/images/products/default.jpg';
        document.getElementById('modal-product-title').textContent = product.name;
        document.getElementById('modal-product-description').textContent = product.description;
        document.getElementById('modal-product-materials').textContent = product.materials?.join(', ') || 'Non spécifié';
        document.getElementById('modal-product-price').textContent = product.price ? `${product.price}€` : 'Sur devis';

        // Ajouter les événements des boutons
        this.attachModalButtonEvents(product);

        // Afficher le modal
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    attachModalButtonEvents(product) {
        const cartBtn = this.modal.querySelector('.add-to-cart');
        const wishlistBtn = this.modal.querySelector('.add-to-wishlist');
        const quoteBtn = this.modal.querySelector('.contact-for-quote');

        // Nettoyer les anciens événements
        cartBtn.replaceWith(cartBtn.cloneNode(true));
        wishlistBtn.replaceWith(wishlistBtn.cloneNode(true));
        quoteBtn.replaceWith(quoteBtn.cloneNode(true));

        // Ajouter de nouveaux événements
        this.modal.querySelector('.add-to-cart').addEventListener('click', () => {
            window.cart.add(product);
            this.showNotification('Produit ajouté au panier!');
        });

        this.modal.querySelector('.add-to-wishlist').addEventListener('click', () => {
            window.wishlist.add(product);
            this.showNotification('Produit ajouté aux favoris!');
        });

        this.modal.querySelector('.contact-for-quote').addEventListener('click', () => {
            // Scroll vers le formulaire de contact
            this.close();
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        });
    }

    showNotification(message) {
        // Créer une notification temporaire
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialiser le modal
window.productModal = new ProductModal();