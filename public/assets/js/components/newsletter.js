// Composant newsletter
class Newsletter {
    constructor() {
        this.createNewsletterSection();
        this.bindEvents();
    }

    createNewsletterSection() {
        const newsletterHTML = `
            <section class="newsletter-section">
                <div class="container">
                    <div class="newsletter-content">
                        <div class="newsletter-text">
                            <h2>Restez informé de nos créations</h2>
                            <p>Recevez en avant-première nos nouvelles créations, nos offres spéciales et nos conseils d'aménagement.</p>
                            <ul class="newsletter-benefits">
                                <li>✨ Nouvelles créations en exclusivité</li>
                                <li>🎯 Offres spéciales réservées aux abonnés</li>
                                <li>💡 Conseils d'aménagement et tendances</li>
                                <li>🔧 Astuces d'entretien pour vos meubles</li>
                            </ul>
                        </div>
                        <div class="newsletter-form">
                            <form id="newsletter-form" class="newsletter-signup">
                                <h3>S'abonner à la newsletter</h3>
                                <div class="form-group">
                                    <input type="email" id="newsletter-email" name="email" placeholder="Votre adresse email" required>
                                    <label for="newsletter-preferences">Vos centres d'intérêt :</label>
                                    <div class="preferences-grid">
                                        <label class="preference-item">
                                            <input type="checkbox" name="preferences" value="tables">
                                            <span>Tables</span>
                                        </label>
                                        <label class="preference-item">
                                            <input type="checkbox" name="preferences" value="chaises">
                                            <span>Chaises</span>
                                        </label>
                                        <label class="preference-item">
                                            <input type="checkbox" name="preferences" value="rangements">
                                            <span>Rangements</span>
                                        </label>
                                        <label class="preference-item">
                                            <input type="checkbox" name="preferences" value="bureaux">
                                            <span>Bureaux</span>
                                        </label>
                                        <label class="preference-item">
                                            <input type="checkbox" name="preferences" value="sur-mesure">
                                            <span>Sur mesure</span>
                                        </label>
                                        <label class="preference-item">
                                            <input type="checkbox" name="preferences" value="promotions">
                                            <span>Promotions</span>
                                        </label>
                                    </div>
                                </div>
                                <button type="submit" class="newsletter-btn">
                                    <span class="btn-text">S'abonner</span>
                                    <span class="btn-loading">Inscription...</span>
                                </button>
                                <p class="newsletter-privacy">
                                    <small>En vous inscrivant, vous acceptez de recevoir nos emails. 
                                    Vous pouvez vous désabonner à tout moment. 
                                    <a href="#" class="privacy-link">Politique de confidentialité</a></small>
                                </p>
                            </form>
                            <div class="newsletter-success" id="newsletter-success">
                                <div class="success-icon">✅</div>
                                <h3>Merci pour votre inscription!</h3>
                                <p>Vous recevrez bientôt nos dernières créations et offres exclusives.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;

        // Insérer avant le footer
        const footer = document.querySelector('footer');
        footer.insertAdjacentHTML('beforebegin', newsletterHTML);
    }

    bindEvents() {
        const form = document.getElementById('newsletter-form');
        const successDiv = document.getElementById('newsletter-success');
        const submitBtn = form.querySelector('.newsletter-btn');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Animation du bouton
            submitBtn.classList.add('loading');
            
            // Récupérer les données du formulaire
            const formData = new FormData(form);
            const email = formData.get('email');
            const preferences = formData.getAll('preferences');
            
            // Simuler un appel API
            await this.simulateSubscription(email, preferences);
            
            // Afficher le succès
            setTimeout(() => {
                form.style.display = 'none';
                successDiv.style.display = 'block';
                
                // Animation d'apparition
                setTimeout(() => {
                    successDiv.classList.add('show');
                }, 100);
            }, 1500);
        });
    }

    async simulateSubscription(email, preferences) {
        // Simuler un délai d'API
        return new Promise(resolve => {
            setTimeout(() => {
                // Sauvegarder dans localStorage pour la démo
                const subscription = {
                    email,
                    preferences,
                    date: new Date().toISOString()
                };
                
                localStorage.setItem('mebo-newsletter-subscription', JSON.stringify(subscription));
                console.log('Newsletter subscription:', subscription);
                resolve();
            }, 1500);
        });
    }
}

// Initialiser la newsletter
window.newsletter = new Newsletter();