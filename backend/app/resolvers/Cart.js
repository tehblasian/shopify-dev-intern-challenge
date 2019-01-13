import ProductTDG from '../persistence/ProductTDG';
import CartTDG from '../persistence/CartTDG';

export default {
    Query: {
        cart: async (parent, { id }) => {
            try {
                const cart = await CartTDG.find(id);
                if (!cart) {
                    return null;
                }

                return cart;
            } catch (error) {
                return null;
            }
        },
    },
    Mutation: {
        addToCart: async (parent, { cartId, productId }) => {
            try {
                // Get product info
                const product = await ProductTDG.find(productId);

                // Error if product does not exist
                if (!product) {
                    return {
                        success: false,
                        cart: null,
                        errors: [{
                            message: `The product with id ${productId} does not exist`,
                        }],
                    };
                }

                // Create cart entry
                await CartTDG.insert(cartId, product.id);

                return {
                    success: true,
                    cart: await CartTDG.find(cartId),
                    errors: null,
                };
            } catch (error) {
                return {
                    success: false,
                    cart: null,
                    errors: [{
                        message: `There was an error adding the product with id ${productId} to the cart with id ${cartId}`,
                    }],
                };
            }
        },
        deleteFromCart: async (parent, { cartId, productId }) => {
            try {
                // Get product info
                const product = await ProductTDG.find(productId);

                // Error if product does not exist
                if (!product) {
                    return {
                        success: false,
                        cart: null,
                        errors: [{
                            message: `The product with id ${productId} does not exist`,
                        }],
                    };
                }

                // Delete cart entry
                await CartTDG.delete(cartId, product.id);

                return {
                    success: true,
                    cart: await CartTDG.find(cartId),
                    errors: null,
                };
            } catch (error) {
                return {
                    success: false,
                    cart: null,
                    errors: [{
                        message: error.message
                            ? error.message :
                            `There was an error deleting the product with id ${productId} with the cart with id ${cartId}`,
                    }],
                };
            }
        },
    },
};
