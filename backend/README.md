# Backend MeBo - Système de Commande et de Paiement

Ce backend gère les commandes et les paiements pour l'entreprise MeBo spécialisée dans les meubles en métal et bois.

## Technologies utilisées

- **Node.js** - Environnement d'exécution JavaScript
- **Express** - Framework web minimaliste
- **Supabase** - Backend as a Service avec base de données PostgreSQL
- **Stripe** - Service de traitement des paiements

## Installation

1. Assurez-vous d'avoir Node.js installé sur votre système
2. Installez les dépendances :
```bash
cd backend
npm install
```

## Configuration

1. Créez un compte [Supabase](https://supabase.com)
2. Créez un projet Supabase et récupérez vos clés d'API
3. Créez un compte [Stripe](https://stripe.com)
4. Récupérez vos clés d'API Stripe
5. Mettez à jour les fichiers de configuration dans `supabase/config.js` et `stripe/config.js`

## Base de données

1. Connectez-vous à votre projet Supabase
2. Exécutez le schéma SQL contenu dans `supabase/schema.sql`

## Démarrage

### Développement
```bash
npm run dev
```

### Production
```bash
npm start
```

## Endpoints API

### GET /api/products
Récupère tous les produits disponibles

### POST /api/orders
Crée une nouvelle commande
- **Body**: 
  ```json
  {
    "userId": "id_utilisateur",
    "items": [
      {
        "productId": "id_produit",
        "quantity": 1
      }
    ],
    "shippingAddress": {
      "line1": "123 Avenue des Champs-Élysées",
      "city": "Paris",
      "postal_code": "75008",
      "country": "FR"
    },
    "billingAddress": {
      "line1": "123 Avenue des Champs-Élysées",
      "city": "Paris",
      "postal_code": "75008",
      "country": "FR"
    },
    "customerNotes": "Instructions spéciales"
  }
  ```

### POST /api/confirm-payment
Confirme le paiement d'une commande
- **Body**:
  ```json
  {
    "paymentIntentId": "id_intention_paiement_stripe"
  }
  ```

### GET /api/orders/:userId
Récupère toutes les commandes d'un utilisateur

### GET /api/orders/:orderId/:userId
Récupère une commande spécifique d'un utilisateur

## Webhooks

### Stripe Webhook
- **Endpoint**: `/webhook/stripe`
- Nécessite de configurer un webhook dans le dashboard Stripe

## Services

Le backend est organisé en services modulaires :

- `OrderService.js` - Gestion des commandes
- `ProductService.js` - Gestion des produits
- `PaymentService.js` - Gestion des paiements

## Sécurité

- Utilisation de RLS (Row Level Security) dans Supabase pour contrôler l'accès aux données
- Validation des entrées côté serveur
- Les données sensibles de paiement sont gérées directement par Stripe

## Déploiement

Le backend peut être déployé sur n'importe quel service d'hébergement Node.js tel que:
- Heroku
- Vercel
- DigitalOcean
- AWS

Assurez-vous de définir les variables d'environnement appropriées sur votre plateforme d'hébergement.