export default `
    type Cart {
        id: Int!
        items: [CartItem!]!
        total: Float!
    }

    type CartItem {
        product: Product!
        quantity: Int!
    }

    type CartResponse {
        success: Boolean!
        cart: Cart
        errors: [Error!]
    }

    type Mutation {
        addToCart(cartId: Int!, productId: Int!): CartResponse!
        deleteFromCart(cartId: Int!, productId: Int!): CartResponse!
        checkout(id: Int!): CartResponse! 
    }

    type Query {
        cart(id: Int!): Cart
    }
`;
