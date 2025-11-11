// Configuration pour l'intégration avec Supabase

// Pour utiliser ce fichier, vous devrez créer un projet Supabase
// et remplacer les valeurs avec vos identifiants réels

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://votre-projet.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'votre-cle-anon';

// Exporter la configuration
module.exports = {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  // Configuration pour le développement local
  LOCAL: {
    SUPABASE_URL: 'http://localhost:54321',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.62z9J1234567890AbCdEfGhIjKlMnOpQrStUvWxYz'
  }
};