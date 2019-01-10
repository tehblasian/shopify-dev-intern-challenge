export default `
    type Product {
        id: Int!
        title: String!
        price: String!
        inventory_count: Int!
    }

    input ProductOptions {
        available: Boolean!
    }

    type PurchaseProductResponse {
        success: Boolean!
        product: Product
        errors: [Error!]
    }

    type Mutation {
        purchase(id: Int!): PurchaseProductResponse!
    }

    type Query {
        product(id: Int!): Product!
        products(options: ProductOptions): [Product!]!
    }
`;
