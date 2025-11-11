// Service pour la gestion des paiements

const stripe = require('stripe')(require('../stripe/config.js').STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

// Charger la configuration
const { SUPABASE_URL, SUPABASE_ANON_KEY } = require('../supabase/config.js');

// Initialiser Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

class PaymentService {
  // Créer une intention de paiement
  static async createPaymentIntent(amount, currency = 'eur', orderId) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Montant en centimes
        currency: currency.toLowerCase(),
        metadata: {
          orderId: orderId
        }
      });

      return {
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      };
    } catch (error) {
      console.error('Erreur dans PaymentService.createPaymentIntent:', error);
      throw error;
    }
  }

  // Récupérer une intention de paiement
  static async getPaymentIntent(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      return {
        success: true,
        paymentIntent: paymentIntent
      };
    } catch (error) {
      console.error('Erreur dans PaymentService.getPaymentIntent:', error);
      throw error;
    }
  }

  // Confirmer un paiement
  static async confirmPayment(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);

      // Si le paiement est réussi, on met à jour l'ordre dans la base de données
      if (paymentIntent.status === 'succeeded') {
        // Récupérer l'ID de la commande à partir des métadonnées
        const orderId = paymentIntent.metadata.orderId;

        // Mettre à jour le statut de la commande
        const { error: updateError } = await supabase
          .from('orders')
          .update({ 
            status: 'confirmed',
            updated_at: new Date().toISOString()
          })
          .match({ stripe_payment_intent_id: paymentIntentId });

        if (updateError) {
          console.error('Erreur lors de la mise à jour du statut de la commande:', updateError);
          // On ne lance pas d'erreur ici car le paiement est déjà confirmé chez Stripe
        }
      }

      return {
        success: true,
        paymentIntent: paymentIntent
      };
    } catch (error) {
      console.error('Erreur dans PaymentService.confirmPayment:', error);
      throw error;
    }
  }

  // Annuler un paiement
  static async cancelPayment(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);

      return {
        success: true,
        paymentIntent: paymentIntent
      };
    } catch (error) {
      console.error('Erreur dans PaymentService.cancelPayment:', error);
      throw error;
    }
  }

  // Rembourser un paiement
  static async refundPayment(paymentIntentId, amount = null) {
    try {
      const options = {
        payment_intent: paymentIntentId
      };

      // Si un montant est spécifié, on ne rembourse que ce montant
      if (amount) {
        options.amount = Math.round(amount * 100); // Montant en centimes
      }

      const refund = await stripe.refunds.create(options);

      return {
        success: true,
        refund: refund
      };
    } catch (error) {
      console.error('Erreur dans PaymentService.refundPayment:', error);
      throw error;
    }
  }
}

module.exports = PaymentService;