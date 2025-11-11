// Composant galerie avec lightbox
class ImageGallery {
    constructor() {
        this.currentImageIndex = 0;
        this.images = [];
        this.createLightbox();
        this.bindEvents();
        this.initializeGallery();
    }

    createLightbox() {
        const lightboxHTML = `
            <div id="lightbox" class="lightbox">
                <div class="lightbox-content">
                    <span class="lightbox-close">&times;</span>
                    <button class="lightbox-prev">❮</button>
                    <img id="lightbox-image" src="" alt="">
                    <button class="lightbox-next">❯</button>
                    <div class="lightbox-info">
                        <h3 id="lightbox-title"></h3>
                        <p id="lightbox-description"></p>
                    </div>
                    <div class="lightbox-counter">
                        <span id="lightbox-counter"></span>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
        this.lightbox = document.getElementById('lightbox');
    }

    bindEvents() {
        // Fermer la lightbox
        document.querySelector('.lightbox-close').addEventListener('click', () => this.close());
        document.querySelector('.lightbox-prev').addEventListener('click', () => this.previousImage());
        document.querySelector('.lightbox-next').addEventListener('click', () => this.nextImage());

        // Fermer avec Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.close();
            if (e.key === 'ArrowLeft') this.previousImage();
            if (e.key === 'ArrowRight') this.nextImage();
        });

        // Fermer en cliquant sur l'arrière-plan
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) this.close();
        });
    }

    initializeGallery() {
        // Créer une galerie d'images pour MeBo
        const galleryImages = [
            {
                src: './assets/images/gallery/notre-atelier-principal.jpg',
                title: 'Notre Atelier Principal',
                description: 'Vue d\'ensemble de notre espace de création où naissent nos meubles uniques.'
            },
            {
                src: './assets/images/gallery/savoir-faire-artisanal.jpg',
                title: 'Savoir-faire Artisanal',
                description: 'Nos artisans travaillent chaque pièce avec passion et précision.'
            },
            {
                src: './assets/images/gallery/fusion-métal-et-bois.jpg',
                title: 'Fusion Métal et Bois',
                description: 'L\'harmonie parfaite entre la robustesse du métal et la chaleur du bois.'
            },
            {
                src: './assets/images/gallery/créations-terminées.jpg',
                title: 'Créations Terminées',
                description: 'Nos meubles finis, prêts à embellir votre intérieur.'
            },
            {
                src: './assets/images/gallery/travail-sur-mesure.jpg',
                title: 'Travail Sur Mesure',
                description: 'Chaque pièce peut être adaptée selon vos besoins et votre espace.'
            },
            {
                src: './assets/images/gallery/attention-aux-détails.jpg',
                title: 'Attention aux Détails',
                description: 'Chaque finition est soignée pour garantir la qualité MeBo.'
            }
        ];

        this.images = galleryImages;
        this.createGallerySection();
    }

    createGallerySection() {
        // Vérifier si la galerie existe déjà dans le HTML
        const existingGallery = document.getElementById('galerie');
        
        if (existingGallery) {
            // Si la galerie existe déjà, on la remplit avec les images
            const container = existingGallery.querySelector('.container');
            if (container && container.querySelector('.gallery-grid')) {
                // Remplir la galerie existante
                const galleryGrid = container.querySelector('.gallery-grid');
                galleryGrid.innerHTML = this.images.map((image, index) => `
                    <div class="gallery-item" data-index="${index}">
                        <img src="${image.src}" alt="${image.title}" loading="lazy">
                        <div class="gallery-overlay">
                            <h3>${image.title}</h3>
                            <p>${image.description}</p>
                            <button class="gallery-view-btn">Voir en grand</button>
                        </div>
                    </div>
                `).join('');
            } else {
                // Si la structure n'existe pas complètement, on la crée à l'intérieur
                container.innerHTML = `
                    <div class="section-header">
                        <h2>Notre Galerie</h2>
                        <p class="section-subtitle">Plongez dans l'univers unique de notre atelier et de nos créations exceptionnelles</p>
                    </div>
                    <div class="gallery-grid">
                        ${this.images.map((image, index) => `
                            <div class="gallery-item" data-index="${index}">
                                <img src="${image.src}" alt="${image.title}" loading="lazy">
                                <div class="gallery-overlay">
                                    <h3>${image.title}</h3>
                                    <p>${image.description}</p>
                                    <button class="gallery-view-btn">Voir en grand</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
            }
        } else {
            // Sinon, trouver la section des produits et ajouter la galerie après
            const productsSection = document.getElementById('produits');
            if (!productsSection) return;

            const galleryHTML = `
                <section id="galerie" class="gallery-section">
                    <div class="container">
                        <div class="section-header">
                            <h2>Notre Galerie</h2>
                            <p class="section-subtitle">Plongez dans l'univers unique de notre atelier et de nos créations exceptionnelles</p>
                        </div>
                        <div class="gallery-grid">
                            ${this.images.map((image, index) => `
                                <div class="gallery-item" data-index="${index}">
                                    <img src="${image.src}" alt="${image.title}" loading="lazy">
                                    <div class="gallery-overlay">
                                        <h3>${image.title}</h3>
                                        <p>${image.description}</p>
                                        <button class="gallery-view-btn">Voir en grand</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </section>
            `;

            productsSection.insertAdjacentHTML('afterend', galleryHTML);
        }

        // Ajouter les événements pour ouvrir la lightbox
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.index);
                this.open(index);
            });
        });
    }

    open(index) {
        this.currentImageIndex = index;
        this.updateLightboxContent();
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    nextImage() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
        this.updateLightboxContent();
    }

    previousImage() {
        this.currentImageIndex = this.currentImageIndex === 0 ?
            this.images.length - 1 : this.currentImageIndex - 1;
        this.updateLightboxContent();
    }

    updateLightboxContent() {
        const currentImage = this.images[this.currentImageIndex];

        document.getElementById('lightbox-image').src = currentImage.src;
        document.getElementById('lightbox-title').textContent = currentImage.title;
        document.getElementById('lightbox-description').textContent = currentImage.description;
        document.getElementById('lightbox-counter').textContent =
            `${this.currentImageIndex + 1} / ${this.images.length}`;
    }
}

// Initialiser la galerie
window.imageGallery = new ImageGallery();