// Point d'entrée de l'application MeBo - Version premium

// Fonction d'initialisation
function initApp() {
    console.log('Application MeBo - Version premium initialisée');
    
    // Charger les produits et témoignages
    Promise.all([
        loadProducts(),
        loadTestimonials()
    ]).then(() => {
        // Activer les fonctionnalités après le chargement des données
        initializeEvents();
        initializeFilters();
        animateOnScroll();
        
        // Activer les fonctionnalités de galerie
        initializeGallery();
    });
    
    // Activer le défilement fluide
    smoothScroll();
    
    // Activer le menu mobile
    initializeMobileMenu();
    
    // Activer le gestionnaire de formulaire de contact
    initializeContactForm();
    
    // Activer les animations d'apparition
    initializeAppearAnimations();
}

// Charger les produits depuis le fichier JSON
async function loadProducts() {
    try {
        const response = await fetch('../src/data/products.json');
        const products = await response.json();
        
        // Afficher les produits
        displayProducts(products);
        
        // Stocker les produits pour le filtrage
        window.allProducts = products;
    } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
    }
}

// Afficher les produits sur la page
function displayProducts(products) {
    const productGrid = document.getElementById('product-grid');
    
    if (products && products.length > 0) {
        let productHTML = '';
        
        products.forEach((product, index) => {
            productHTML += `
                <div class="product-card appear" data-category="${product.category}" style="transition-delay: ${index * 0.1}s;">
                    <img src="${product.image || './assets/images/products/default.jpg'}" alt="${product.name}" class="product-image">
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <p class="price">${product.price ? product.price + '€' : 'Sur devis'}</p>
                        <button class="btn product-details" data-id="${product.id}">Détails</button>
                    </div>
                </div>
            `;
        });
        
        productGrid.innerHTML = productHTML;
        
        // Ajouter les événements pour les boutons de détails
        attachProductDetailsEvents();
        
        // Activer les animations d'apparition
        setTimeout(() => {
            document.querySelectorAll('.product-card.appear').forEach(el => {
                el.classList.add('visible');
            });
        }, 100);
    } else {
        productGrid.innerHTML = '<p class="no-products">Aucun produit disponible actuellement.</p>';
    }
}

// Filtrer les produits
function filterProducts(category) {
    const allProducts = window.allProducts || [];
    
    if (category === 'all') {
        displayProducts(allProducts);
    } else {
        const filteredProducts = allProducts.filter(product => product.category === category);
        displayProducts(filteredProducts);
    }
}

// Charger les témoignages
async function loadTestimonials() {
    try {
        const response = await fetch('../src/data/testimonials.json');
        const testimonials = await response.json();
        
        // Afficher les témoignages
        displayTestimonials(testimonials);
    } catch (error) {
        console.error('Erreur lors du chargement des témoignages:', error);
    }
}

// Afficher les témoignages sur la page
function displayTestimonials(testimonials) {
    const testimonialsContainer = document.getElementById('testimonials-container');
    
    if (testimonials && testimonials.length > 0) {
        let testimonialsHTML = '<div class="testimonial-slider">';
        
        testimonials.forEach(testimonial => {
            testimonialsHTML += `
                <div class="testimonial appear">
                    <div class="testimonial-content">"${testimonial.content}"</div>
                    <div class="testimonial-author">
                        <strong>${testimonial.author}</strong>, ${testimonial.location}
                        <div class="rating">
                            ${'★'.repeat(testimonial.rating)}${'☆'.repeat(5 - testimonial.rating)}
                        </div>
                    </div>
                </div>
            `;
        });
        
        testimonialsHTML += '</div>';
        testimonialsContainer.innerHTML = testimonialsHTML;
        
        // Activer les animations d'apparition
        setTimeout(() => {
            document.querySelectorAll('.testimonial.appear').forEach(el => {
                el.classList.add('visible');
            });
        }, 100);
    } else {
        testimonialsContainer.innerHTML = '<p>Aucun témoignage disponible actuellement.</p>';
    }
}

// Initialiser les événements
function initializeEvents() {
    // Gestion du clic sur les liens du menu
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                e.preventDefault();
                
                // Retirer la classe active de tous les liens
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                
                // Ajouter la classe active au lien cliqué
                this.classList.add('active');
                
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Gestion du défilement pour les animations et mise à jour du menu actif
    let currentSection = null;
    window.addEventListener('scroll', function() {
        animateOnScroll();
        updateActiveMenu();
    });
    
    // Initialiser le menu actif
    updateActiveMenu();
}

// Mettre à jour le menu actif en fonction de la section visible
function updateActiveMenu() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 200;
    
    sections.forEach(section => {
        const offsetTop = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        
        if (scrollPos >= offsetTop && scrollPos < offsetTop + height) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            document.querySelector(`a[href="#${id}"]`).classList.add('active');
        }
    });
}

// Initialiser les filtres de produits
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Retirer la classe active de tous les boutons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');
            
            // Obtenir la catégorie du bouton
            const category = this.getAttribute('data-filter');
            
            // Filtrer les produits
            filterProducts(category);
        });
    });
}

// Activation du menu mobile
function initializeMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Changer l'icône du bouton
            this.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
        });
    }
}

// Animation au défilement
function animateOnScroll() {
    const elements = document.querySelectorAll('.appear:not(.visible)');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            element.classList.add('visible');
        }
    });
}

// Animations d'apparition
function initializeAppearAnimations() {
    // Activer les animations pour les éléments qui doivent apparaître
    document.querySelectorAll('.appear').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
}

// Défilement fluide
function smoothScroll() {
    // Activer le défilement fluide pour tous les liens internes
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Attacher les événements pour les détails des produits
function attachProductDetailsEvents() {
    document.querySelectorAll('.product-details').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            showProductDetails(productId);
        });
    });
}

// Afficher les détails d'un produit
function showProductDetails(productId) {
    const allProducts = window.allProducts || [];
    const product = allProducts.find(p => p.id == productId);
    
    if (product) {
        // Créer une modale avec les détails du produit
        const modal = document.createElement('div');
        modal.className = 'product-detail-modal active';
        modal.innerHTML = `
            <div class="product-detail-content">
                <button class="close-modal">×</button>
                <h2>${product.name}</h2>
                <img src="${product.image || './assets/images/products/default.jpg'}" alt="${product.name}" style="width:100%; border-radius:8px; margin:1rem 0;">
                <p>${product.description}</p>
                <p class="price"><strong>${product.price ? product.price + '€' : 'Sur devis'}</strong></p>
                <p><strong>Catégorie:</strong> ${product.category}</p>
                <p><strong>Matériaux:</strong> ${product.materials ? product.materials.join(', ') : 'Non spécifiés'}</p>
                <button class="btn contact-btn" onclick="showContactForProduct('${product.name}')">Nous contacter</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Ajouter l'événement pour fermer la modale
        modal.querySelector('.close-modal').addEventListener('click', function() {
            modal.remove();
        });
        
        // Fermer la modale en cliquant à l'extérieur
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
}

// Afficher le formulaire de contact pour un produit spécifique
function showContactForProduct(productName) {
    // Faire défiler jusqu'à la section de contact
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        
        // Pré-remplir le sujet avec le nom du produit
        const subjectField = document.querySelector('#subject');
        if (subjectField) {
            subjectField.value = `Intérêt pour le produit: ${productName}`;
        }
    }
}

// Initialiser la galerie
function initializeGallery() {
    // Pour une version future, on peut ajouter la fonctionnalité de galerie d'images
    console.log('Galerie initialisée');
}

// Initialiser le formulaire de contact
function initializeContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupérer les valeurs du formulaire
            const name = document.querySelector('#name').value;
            const email = document.querySelector('#email').value;
            const subject = document.querySelector('#subject').value;
            const message = document.querySelector('#message').value;
            
            // Valider les champs (simple validation)
            if (!name || !email || !message) {
                alert('Veuillez remplir tous les champs obligatoires.');
                return;
            }
            
            // Simulation d'envoi du formulaire
            console.log('Envoi du formulaire:', { name, email, subject, message });
            
            // Afficher un message de confirmation
            alert('Merci pour votre message ! Nous vous contacterons bientôt.');
            
            // Réinitialiser le formulaire
            contactForm.reset();
        });
    }
}

// Démarrer l'application quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});