// Setup pour les tests Jest

// Configuration générale pour les tests
process.env.SUPABASE_URL = 'http://localhost:54321';
process.env.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.62z9J1234567890AbCdEfGhIjKlMnOpQrStUvWxYz';

process.env.STRIPE_PUBLISHABLE_KEY = 'pk_test_votre_cle_publishable_test';
process.env.STRIPE_SECRET_KEY = 'sk_test_votre_cle_secret_test';
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_votre_webhook_secret_test';

// Mock global pour certaines fonctionnalités
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
};