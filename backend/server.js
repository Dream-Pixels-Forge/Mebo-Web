// Serveur backend pour le système de commande et de paiement de MeBo

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');
const stripe = require('stripe')(require('./stripe/config.js').STRIPE_SECRET_KEY);

// Charger la configuration
const { SUPABASE_URL, SUPABASE_ANON_KEY } = require('./supabase/config.js');

// Initialiser les services
const OrderService = require('./services/OrderService');
const ProductService = require('./services/ProductService');
const PaymentService = require('./services/PaymentService');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Endpoint pour récupérer les produits
app.get('/api/products', async (req, res) => {
  try {
    const products = await ProductService.getAllProducts();
    res.json(products);
  } catch (error) {
    console.error('Erreur serveur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Endpoint pour créer une commande
app.post('/api/orders', async (req, res) => {
  const { userId, items, shippingAddress, billingAddress, customerNotes } = req.body;

  try {
    const result = await OrderService.createOrder(
      userId, 
      items, 
      shippingAddress, 
      billingAddress, 
      customerNotes
    );
    
    res.json(result);
  } catch (error) {
    console.error('Erreur serveur:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint pour confirmer le paiement
app.post('/api/confirm-payment', async (req, res) => {
  const { paymentIntentId } = req.body;

  try {
    const result = await PaymentService.confirmPayment(paymentIntentId);
    res.json(result);
  } catch (error) {
    console.error('Erreur serveur:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint pour récupérer les commandes d'un utilisateur
app.get('/api/orders/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const orders = await OrderService.getOrdersByUser(userId);
    res.json(orders);
  } catch (error) {
    console.error('Erreur serveur:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint pour récupérer une commande spécifique
app.get('/api/orders/:orderId/:userId', async (req, res) => {
  const { orderId, userId } = req.params;

  try {
    const order = await OrderService.getOrderById(orderId, userId);
    res.json(order);
  } catch (error) {
    console.error('Erreur serveur:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint Webhook pour Stripe
app.post('/webhook/stripe', bodyParser.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = require('./stripe/config.js').STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Erreur lors de la vérification du webhook:', err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Gérer l'événement
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Paiement réussi!', paymentIntent.id);
      // Mettre à jour la base de données pour marquer le paiement comme réussi
      break;
    case 'payment_intent.payment_failed':
      const paymentFailedIntent = event.data.object;
      console.log('Échec du paiement!', paymentFailedIntent.id);
      // Mettre à jour la base de données pour marquer le paiement comme échoué
      break;
    default:
      console.log(`Événement non géré: ${event.type}`);
  }

  res.json({ received: true });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur backend MeBo démarré sur le port ${PORT}`);
  console.log(`Supabase URL: ${SUPABASE_URL}`);
});