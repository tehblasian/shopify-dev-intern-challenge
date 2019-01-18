import Product from '../models/Product';

export default {
    Query: {
        product: async (parent, { id }, { ProductTDG }) => ProductTDG.find(id),
        // eslint-disable-next-line max-len
        products: async (parent, { options: { available } }, { ProductTDG }) => ProductTDG.findAll({ available }),
    },
    Mutation: {
        purchase: async (parent, { id }, { ProductTDG }) => {
            try {
                const product = await ProductTDG.find(id);
                if (product.inventory_count === 0) {
                    return {
                        success: false,
                        product: null,
                        errors: [{
                            message: 'The product is out of stock',
                        }],
                    };
                }

                return {
                    success: true,
                    product: await ProductTDG.update(new Product(
                        product.id,
                        product.title,
                        product.price,
                        product.inventory_count - 1,
                    )),
                    errors: null,
                };
            } catch (error) {
                throw error;
            }
        },
    },
};
