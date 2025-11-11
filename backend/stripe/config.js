// Configuration pour l'intégration avec Stripe

// Pour utiliser ce fichier, vous devrez créer un compte Stripe
// et remplacer les valeurs avec vos clés API réelles

const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_votre_cle_publishable';
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_votre_cle_secret';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_votre_webhook_secret';

// Exporter la configuration
module.exports = {
  STRIPE_PUBLISHABLE_KEY,
  STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET,
  // Configuration pour le développement local
  TEST: {
    STRIPE_PUBLISHABLE_KEY: 'pk_test_votre_cle_publishable_test',
    STRIPE_SECRET_KEY: 'sk_test_votre_cle_secret_test',
    STRIPE_WEBHOOK_SECRET: 'whsec_votre_webhook_secret_test'
  }
};