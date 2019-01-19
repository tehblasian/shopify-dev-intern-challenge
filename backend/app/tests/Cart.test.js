import path from 'path';
import { makeExecutableSchema } from 'graphql-tools';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import { graphql } from 'graphql';

import ProductTDG from '../mocks/ProductTDG';
import CartTDG from '../mocks/CartTDG';

const cartQueryTestCase = {
    id: 'A single cart',
    query: `
      query {
        cart(id: 1) {
           id 
           items {
               product {
                   id
                   title
                   price
                   inventory_count
               }
               quantity
           }
           total
        }
      }
    `,
    context: { CartTDG },
    expected: {
        data: {
            cart: {
                id: 1,
                items: [
                    {
                        product: {
                            id: 1,
                            title: 'Test Product 1',
                            price: 3.5,
                            inventory_count: 7,
                        },
                        quantity: 3,
                    },
                    {
                        product: {
                            id: 2,
                            title: 'Test Product 2',
                            price: 6,
                            inventory_count: 3,
                        },
                        quantity: 2,
                    },
                ],
                total: 22.5,
            },
        },
    },
};

const addToCartTestCase = {
    id: 'Adding a product to a cart',
    query: `
        mutation addToCart($cartId: Int!, $productId:Int!) {
            addToCart(cartId:$cartId, productId:$productId) {
                success
                cart {
                    id
                    items {
                        product {
                            id
                            title
                            price
                            inventory_count
                        }
                        quantity
                    }
                    total
                }
                errors {
                    message
                }
            }
        }
    `,
    variables: {
        cartId: 1,
        productId: 3,
    },
    context: {
        ProductTDG,
        CartTDG,
    },
    expected: {
        data: {
            addToCart: {
                success: true,
                cart: {
                    id: 1,
                    items: [
                        {
                            product: {
                                id: 1,
                                title: 'Test Product 1',
                                price: 3.5,
                                inventory_count: 7,
                            },
                            quantity: 3,
                        },
                        {
                            product: {
                                id: 2,
                                title: 'Test Product 2',
                                price: 6,
                                inventory_count: 3,
                            },
                            quantity: 2,
                        },
                        {
                            product: {
                                id: 3,
                                title: 'Test Product 3',
                                price: 9,
                                inventory_count: 0,
                            },
                            quantity: 1,
                        },
                    ],
                    total: 31.5,
                },
                errors: null,
            },
        },
    },
};

const addInvalidProductToCartTestCase = {
    id: 'Adding a product that does not exist to a cart',
    query: `
        mutation addToCart($cartId: Int!, $productId:Int!) {
            addToCart(cartId:$cartId, productId:$productId) {
                success
                cart {
                    id
                    items {
                        product {
                            id
                            title
                            price
                            inventory_count
                        }
                        quantity
                    }
                    total
                }
                errors {
                    message
                }
            }
        }
    `,
    variables: {
        cartId: 1,
        productId: 69,
    },
    context: {
        ProductTDG,
        CartTDG,
    },
    expected: {
        data: {
            addToCart: {
                success: false,
                cart: null,
                errors: [{
                    message: 'The product with id 69 does not exist',
                }],
            },
        },
    },
};

const deleteFromCartTestCase = {
    id: 'Deleting a product from a cart',
    query: `
        mutation deleteFromCart($cartId: Int!, $productId:Int!) {
            deleteFromCart(cartId:$cartId, productId:$productId) {
                success
                cart {
                    id
                    items {
                        product {
                            id
                            title
                            price
                            inventory_count
                        }
                        quantity
                    }
                    total
                }
                errors {
                    message
                }
            }
        }
    `,
    variables: {
        cartId: 1,
        productId: 1,
    },
    context: {
        ProductTDG,
        CartTDG,
    },
    expected: {
        data: {
            deleteFromCart: {
                success: true,
                cart: {
                    id: 1,
                    items: [
                        {
                            product: {
                                id: 1,
                                title: 'Test Product 1',
                                price: 3.5,
                                inventory_count: 7,
                            },
                            quantity: 2,
                        },
                        {
                            product: {
                                id: 2,
                                title: 'Test Product 2',
                                price: 6,
                                inventory_count: 3,
                            },
                            quantity: 2,
                        },
                    ],
                    total: 19,
                },
                errors: null,
            },
        },
    },
};

const deleteInvalidProductFromCartTestCase = {
    id: 'Deleting a product that does not exist from a cart',
    query: `
        mutation deleteFromCart($cartId: Int!, $productId:Int!) {
            deleteFromCart(cartId:$cartId, productId:$productId) {
                success
                cart {
                    id
                    items {
                        product {
                            id
                            title
                            price
                            inventory_count
                        }
                        quantity
                    }
                    total
                }
                errors {
                    message
                }
            }
        }
    `,
    variables: {
        cartId: 1,
        productId: 69,
    },
    context: {
        ProductTDG,
        CartTDG,
    },
    expected: {
        data: {
            deleteFromCart: {
                success: false,
                cart: null,
                errors: [{
                    message: 'The product with id 69 does not exist',
                }],
            },
        },
    },
};

const deleteProductNotInCartFromCartTestCase = {
    id: 'Deleting from a cart a product that does not exist in the given cart',
    query: `
        mutation deleteFromCart($cartId: Int!, $productId:Int!) {
            deleteFromCart(cartId:$cartId, productId:$productId) {
                success
                cart {
                    id
                    items {
                        product {
                            id
                            title
                            price
                            inventory_count
                        }
                        quantity
                    }
                    total
                }
                errors {
                    message
                }
            }
        }
    `,
    variables: {
        cartId: 1,
        productId: 3,
    },
    context: {
        ProductTDG,
        CartTDG,
    },
    expected: {
        data: {
            deleteFromCart: {
                success: false,
                cart: null,
                errors: [{
                    message: 'No product with id 3 in the cart with id 1',
                }],
            },
        },
    },
};

const checkoutCartTestCase = {
    id: 'Checking out a cart',
    query: `
        mutation checkout($id: Int!) {
            checkout(id:$id) {
                success
                order {
                    id
                    items {
                        product {
                            id
                            title
                            price
                            inventory_count
                        }
                        quantity
                    }
                    total
                }
                errors {
                    message
                }
            }
        }
    `,
    variables: {
        id: 1,
    },
    context: { CartTDG },
    expected: {
        data: {
            checkout: {
                success: true,
                order: {
                    id: 1,
                    items: [
                        {
                            product: {
                                id: 1,
                                title: 'Test Product 1',
                                price: 3.5,
                                inventory_count: 7,
                            },
                            quantity: 3,
                        },
                        {
                            product: {
                                id: 2,
                                title: 'Test Product 2',
                                price: 6,
                                inventory_count: 3,
                            },
                            quantity: 2,
                        },
                    ],
                    total: 22.5,
                },
                errors: null,
            },
        },
    },
};

const checkoutInvalidCartTestCase = {
    id: 'Checking out a cart that does not exist',
    query: `
        mutation checkout($id: Int!) {
            checkout(id:$id) {
                success
                order {
                    id
                    items {
                        product {
                            id
                            title
                            price
                            inventory_count
                        }
                        quantity
                    }
                    total
                }
                errors {
                    message
                }
            }
        }
    `,
    variables: {
        id: 69,
    },
    context: { CartTDG },
    expected: {
        data: {
            checkout: {
                success: false,
                order: null,
                errors: [{
                    message: 'There is no cart with id 69',
                }],
            },
        },
    },
};

beforeEach(() => {
    CartTDG.products = new Map([
        [1, {
            id: 1,
            title: 'Test Product 1',
            price: 3.5,
            inventory_count: 7,
        }],
        [2, {
            id: 2,
            title: 'Test Product 2',
            price: 6,
            inventory_count: 3,
        }],
        [3, {
            id: 3,
            title: 'Test Product 3',
            price: 9,
            inventory_count: 0,
        }],
    ]);
    CartTDG.entries = [
        {
            cartId: 1,
            productId: 1,
        },
        {
            cartId: 1,
            productId: 1,
        },
        {
            cartId: 1,
            productId: 1,
        },
        {
            cartId: 1,
            productId: 2,
        },
        {
            cartId: 1,
            productId: 2,
        },
    ];
});

describe('Cart Queries & Mutations', () => {
    const cases = [
        cartQueryTestCase,
        addToCartTestCase,
        addInvalidProductToCartTestCase,
        deleteFromCartTestCase,
        deleteInvalidProductFromCartTestCase,
        deleteProductNotInCartFromCartTestCase,
        checkoutCartTestCase,
        checkoutInvalidCartTestCase,
    ];

    const typeDefs = mergeTypes(fileLoader(path.join(__dirname, '../schema/')));
    const resolvers = mergeResolvers(fileLoader(path.join(__dirname, '../resolvers')));
    const schema = makeExecutableSchema({ typeDefs, resolvers });

    // Run each test case
    cases.forEach((obj) => {
        const {
            id, query, variables, context, expected,
        } = obj;

        test(`query: ${id}`, async () => {
            const result = await graphql(schema, query, null, context, variables);
            return expect(result).toEqual(expected);
        });
    });
});
