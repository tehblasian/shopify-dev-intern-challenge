import Cart from '../models/Cart';
import CartItem from '../models/CartItem';

export default class CartTDG {
    constructor() {
        this.entries = [];
        this.products = null;
    }

    static async find(id) {
        let items = [];
        const quantities = new Map();
        this.entries
            .filter(entry => entry.cartId === id)
            .forEach((entry) => {
                const { productId } = entry;
                const count = quantities.get(productId);
                if (count) {
                    quantities.set(productId, count + 1);
                } else {
                    quantities.set(productId, 1);
                }
            });

        this.entries
            .forEach((entry) => {
                const { productId } = entry;
                if (quantities.has(productId)) {
                    items = items.concat(new CartItem(
                        this.products.get(productId),
                        quantities.get(productId),
                    ));

                    quantities.delete(productId);
                }
            });

        if (items.length === 0) {
            return null;
        }

        const total = items
            .reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

        return new Cart(id, items, total);
    }

    static async insert(cartId, productId) {
        this.entries.push({
            cartId,
            productId,
        });
    }

    static async delete(cartId, productId) {
        const len = this.entries.length;
        for (let i = 0; i < this.entries.length; i++) {
            const entry = this.entries[i];
            if (entry.cartId === cartId && entry.productId === productId) {
                this.entries.splice(i, 1);
                break;
            }
        }

        if (this.entries.length === len) {
            throw Error(`No product with id ${productId} in the cart with id ${cartId}`);
        }
    }

    static async checkout(cart) {
        const productsCopy = new Map(this.products);

        cart.items.forEach((item) => {
            const prod = this.products.get(item.product.id);
            if (!prod) {
                throw Error;
            }

            const newInventoryCount = prod.inventory_count - item.quantity;
            if (newInventoryCount < 0) {
                this.products = productsCopy;
                throw Error;
            }

            this.products.set(item.product.id, { ...prod, inventory_count: newInventoryCount });
        });

        this.entries = this.entries.filter(entry => entry.cartId === cart.id);
    }
}
