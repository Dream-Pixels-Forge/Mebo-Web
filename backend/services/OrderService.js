// Service pour la gestion des commandes

const { createClient } = require('@supabase/supabase-js');
const stripe = require('stripe')(require('../stripe/config.js').STRIPE_SECRET_KEY);

// Charger la configuration
const { SUPABASE_URL, SUPABASE_ANON_KEY } = require('../supabase/config.js');

// Initialiser Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

class OrderService {
  // Créer une commande
  static async createOrder(userId, items, shippingAddress, billingAddress, customerNotes) {
    try {
      // Calculer le montant total
      let totalAmount = 0;
      
      // Récupérer les détails des produits pour calculer le total
      const productIds = items.map(item => item.productId);
      const { data: products, error: productError } = await supabase
        .from('products')
        .select('id, price')
        .in('id', productIds);
      
      if (productError) {
        throw new Error(`Erreur lors de la récupération des produits: ${productError.message}`);
      }

      // Calculer le total basé sur les produits et quantités
      items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          totalAmount += parseFloat(product.price) * item.quantity;
        }
      });

      // Créer la commande dans la base de données
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
          user_id: userId,
          total_amount: totalAmount,
          shipping_address: shippingAddress,
          billing_address: billingAddress,
          customer_notes: customerNotes
        }])
        .select()
        .single();

      if (orderError) {
        throw new Error(`Erreur lors de la création de la commande: ${orderError.message}`);
      }

      // Créer les articles de commande
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        unit_price: products.find(p => p.id === item.productId).price,
        total_price: parseFloat(products.find(p => p.id === item.productId).price) * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        // Annuler la commande si les articles n'ont pas été créés
        await supabase
          .from('orders')
          .delete()
          .match({ id: order.id });
        
        throw new Error(`Erreur lors de la création des articles de commande: ${itemsError.message}`);
      }

      // Créer une intention de paiement Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalAmount * 100), // Montant en centimes
        currency: 'eur',
        metadata: {
          orderId: order.id
        }
      });

      // Mettre à jour la commande avec l'ID de l'intention de paiement
      const { error: updateError } = await supabase
        .from('orders')
        .update({ stripe_payment_intent_id: paymentIntent.id })
        .match({ id: order.id });

      if (updateError) {
        throw new Error(`Erreur lors de la mise à jour de la commande: ${updateError.message}`);
      }

      return { 
        success: true, 
        orderId: order.id, 
        clientSecret: paymentIntent.client_secret 
      };
    } catch (error) {
      console.error('Erreur dans OrderService.createOrder:', error);
      throw error;
    }
  }

  // Récupérer une commande par ID
  static async getOrderById(orderId, userId) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (name, image_url)
          )
        `)
        .match({ id: orderId, user_id: userId })
        .single();

      if (error) {
        throw new Error(`Erreur lors de la récupération de la commande: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Erreur dans OrderService.getOrderById:', error);
      throw error;
    }
  }

  // Récupérer toutes les commandes d'un utilisateur
  static async getOrdersByUser(userId) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (name, image_url)
          )
        `)
        .match({ user_id: userId })
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Erreur lors de la récupération des commandes: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Erreur dans OrderService.getOrdersByUser:', error);
      throw error;
    }
  }

  // Mettre à jour le statut d'une commande
  static async updateOrderStatus(orderId, status) {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: status,
          updated_at: new Date().toISOString()
        })
        .match({ id: orderId });

      if (error) {
        throw new Error(`Erreur lors de la mise à jour du statut de la commande: ${error.message}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Erreur dans OrderService.updateOrderStatus:', error);
      throw error;
    }
  }

  // Confirmer le paiement d'une commande
  static async confirmPayment(paymentIntentId) {
    try {
      // Récupérer l'intention de paiement depuis Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status === 'succeeded') {
        // Mettre à jour le statut de la commande
        const { error: updateError } = await supabase
          .from('orders')
          .update({ 
            status: 'confirmed',
            updated_at: new Date().toISOString()
          })
          .match({ stripe_payment_intent_id: paymentIntentId });

        if (updateError) {
          throw new Error(`Erreur lors de la mise à jour du statut de la commande: ${updateError.message}`);
        }

        return { success: true, status: 'confirmed' };
      } else {
        throw new Error('Le paiement n\'a pas réussi');
      }
    } catch (error) {
      console.error('Erreur dans OrderService.confirmPayment:', error);
      throw error;
    }
  }
}

module.exports = OrderService;