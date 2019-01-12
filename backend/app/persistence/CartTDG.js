import DatabaseUtil from '../util/DatabaseUtil';
import Cart from '../models/Cart';
import Product from '../models/Product';
import CartItem from '../models/CartItem';

export default class CartTDG {
    static async find(id) {
        try {
            const query = `
                SELECT
                    CART_ID, PRODUCT_ID, TITLE, PRICE, INVENTORY_COUNT
                FROM 
                    CART_ENTRY
                JOIN
                    PRODUCTS
                ON
                    CART_ENTRY.PRODUCT_ID = PRODUCTS.ID 
                WHERE CART_ID = ?
            `;

            const data = await DatabaseUtil.sendQuery(query, [id]);
            if (!data.rows.length) {
                return null;
            }

            const products = data.rows.map(row => new Product(
                row.PRODUCT_ID,
                row.TITLE,
                row.PRICE,
                row.INVENTORY_COUNT,
            ));

            // Get quantity for each product
            const quantities = new Map();
            products.forEach((product) => {
                const productId = product.id;
                const count = quantities.get(productId);
                if (count) {
                    quantities.set(productId, count + 1);
                } else {
                    quantities.set(productId, 1);
                }
            });

            // Convert list of Products to list of CartItems
            let items = [];
            products.forEach((product) => {
                const productId = product.id;
                if (quantities.has(productId)) {
                    items = items.concat(new CartItem(
                        product,
                        quantities.get(productId),
                    ));

                    quantities.delete(productId);
                }
            });

            const total = items
                .reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
            return new Cart(id, items, total);
        } catch (error) {
            throw error;
        }
    }

    static async insert(cartId, productId) {
        try {
            const query = `
                INSERT INTO 
                    CART_ENTRY
                        (CART_ID, PRODUCT_ID)
                VALUES
                    (?, ?)
            `;

            await DatabaseUtil.sendQuery(query, [
                cartId,
                productId,
            ]);

            return;
        } catch (error) {
            throw error;
        }
    }
}
