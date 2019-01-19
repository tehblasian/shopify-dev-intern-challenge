const products = [
    {
        id: 1,
        title: 'Test Product 1',
        price: 3.5,
        inventory_count: 7,
    },
    {
        id: 2,
        title: 'Test Product 2',
        price: 6,
        inventory_count: 3,
    },
    {
        id: 3,
        title: 'Test Product 3',
        price: 9,
        inventory_count: 0,
    },
];

export default class ProductTDG {
    static async find(id) {
        const product = products.find(p => p.id === id);
        return product;
    }

    static async findAll({ available }) {
        if (available) {
            return products.filter(product => product.inventory_count > 0);
        }

        return products;
    }

    static async insert(product) {
        products.push(product);
    }

    static async update(product) {
        let found = false;
        for (let i = 0; i < products.length; i++) {
            if (product.id === products[i].id) {
                products[i] = product;
                found = true;
                break;
            }
        }

        if (!found) {
            throw Error;
        }

        return product;
    }
}
