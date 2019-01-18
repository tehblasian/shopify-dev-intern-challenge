import DatabaseUtil from '../util/DatabaseUtil';
import Product from '../models/Product';

export default class ProductTDG {
    static async find(id) {
        let product;
        try {
            const query = `
                SELECT
                *
                FROM PRODUCTS
                WHERE ID = ?
            `;

            const data = await DatabaseUtil.sendQuery(query, [id]);
            if (!data.rows.length) {
                return null;
            }

            const prod = data.rows[0];
            product = new Product(
                prod.ID,
                prod.TITLE,
                prod.PRICE,
                prod.INVENTORY_COUNT,
            );
        } catch (error) {
            throw error;
        }

        return product;
    }

    static async findAll({ available }) {
        let products;
        try {
            let query = `
                SELECT 
                    *
                FROM 
                    PRODUCTS
            `;

            if (available) {
                query += `
                    WHERE INVENTORY_COUNT > 0
                `;
            }

            const data = await DatabaseUtil.sendQuery(query);
            if (!data.rows.length) {
                return [];
            }

            products = data.rows.map(prod => new Product(
                prod.ID,
                prod.TITLE,
                prod.PRICE,
                prod.INVENTORY_COUNT,
            ));
        } catch (error) {
            throw error;
        }

        return products;
    }

    static async insert(product) {
        try {
            const query = `
                INSERT INTO 
                    PRODUCTS
                        (TITLE, PRICE, INVENTORY_COUNT)
                VALUES
                    (?, ?, ?)
            `;

            const result = await DatabaseUtil.sendQuery(query, [
                product.title,
                product.price,
                product.inventory_count,
            ]);

            return new Product(
                result.rows.insertId,
                product.title,
                product.price,
                product.inventory_count,
            );
        } catch (error) {
            throw error;
        }
    }

    static async update(product) {
        try {
            const query = `
                UPDATE
                    PRODUCTS
                SET 
                    TITLE = ?, PRICE = ?, INVENTORY_COUNT = ?
                WHERE 
                    ID = ?
            `;

            await DatabaseUtil.sendQuery(query, [
                product.title,
                product.price,
                product.inventory_count,
                product.id,
            ]);

            return product;
        } catch (error) {
            throw error;
        }
    }
}
