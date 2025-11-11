// Service pour la gestion des produits

const { createClient } = require('@supabase/supabase-js');

// Charger la configuration
const { SUPABASE_URL, SUPABASE_ANON_KEY } = require('../supabase/config.js');

// Initialiser Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

class ProductService {
  // Récupérer tous les produits
  static async getAllProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Erreur lors de la récupération des produits: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Erreur dans ProductService.getAllProducts:', error);
      throw error;
    }
  }

  // Récupérer un produit par ID
  static async getProductById(productId) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .match({ id: productId })
        .single();

      if (error) {
        throw new Error(`Erreur lors de la récupération du produit: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Erreur dans ProductService.getProductById:', error);
      throw error;
    }
  }

  // Créer un nouveau produit
  static async createProduct(productData) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: productData.name,
          description: productData.description,
          price: productData.price,
          category: productData.category,
          materials: productData.materials || [],
          image_url: productData.image_url
        }])
        .select()
        .single();

      if (error) {
        throw new Error(`Erreur lors de la création du produit: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Erreur dans ProductService.createProduct:', error);
      throw error;
    }
  }

  // Mettre à jour un produit
  static async updateProduct(productId, productData) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          name: productData.name,
          description: productData.description,
          price: productData.price,
          category: productData.category,
          materials: productData.materials || [],
          image_url: productData.image_url,
          updated_at: new Date().toISOString()
        })
        .match({ id: productId })
        .select()
        .single();

      if (error) {
        throw new Error(`Erreur lors de la mise à jour du produit: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Erreur dans ProductService.updateProduct:', error);
      throw error;
    }
  }

  // Supprimer un produit
  static async deleteProduct(productId) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .match({ id: productId });

      if (error) {
        throw new Error(`Erreur lors de la suppression du produit: ${error.message}`);
      }

      return { success: true };
    } catch (error) {
      console.error('Erreur dans ProductService.deleteProduct:', error);
      throw error;
    }
  }
}

module.exports = ProductService;