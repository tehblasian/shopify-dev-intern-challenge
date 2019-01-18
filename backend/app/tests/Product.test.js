import path from 'path';
import { makeExecutableSchema } from 'graphql-tools';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import { graphql } from 'graphql';

import ProductTDG from '../mocks/ProductTDG';

// Based off of the Medium article:
// "Effectively Testing a GraphQL Server... With Jest and Apollo"
// By Nicola Zaghini

const allProductsQueryTestCase = {
    id: 'All products',
    query: `
      query {
        products(options: { available: false }) {
           id 
           title
           price
           inventory_count
        }
      }
    `,
    context: { ProductTDG },
    expected: {
        data: {
            products: [
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
            ],
        },
    },
};

const availableProductsQueryTestCase = {
    id: 'Only available products',
    query: `
      query {
        products(options: { available: true }) {
           id 
           title
           price
           inventory_count
        }
      }
    `,
    context: { ProductTDG },
    expected: {
        data: {
            products: [
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
            ],
        },
    },
};

const productQueryTestCase = {
    id: 'A single product',
    query: `
      query {
        product(id: 1) {
           id 
           title
           price
           inventory_count
        }
      }
    `,
    context: { ProductTDG },
    expected: {
        data: {
            product: {
                id: 1,
                title: 'Test Product 1',
                price: 3.5,
                inventory_count: 7,
            },
        },
    },
};

const purchaseProductTestCase = {
    id: 'Purchasing a product',
    query: `
        mutation purchase($id:Int!) {
            purchase(id: $id) {
                success
                product {
                    id
                    title
                    price
                    inventory_count
                }
                errors {
                    message
                }
            }
        }
    `,
    variables: { id: 1 },
    context: { ProductTDG },
    expected: {
        data: {
            purchase: {
                success: true,
                product: {
                    id: 1,
                    title: 'Test Product 1',
                    price: 3.5,
                    inventory_count: 6,
                },
                errors: null,
            },
        },
    },
};

const purchaseUnavailableProductTestCase = {
    id: 'Trying to purchase an unavailable product',
    query: `
        mutation purchase($id:Int!) {
            purchase(id: $id) {
                success
                product {
                    id
                    title
                    price
                    inventory_count
                }
                errors {
                    message
                }
            }
        }
    `,
    variables: { id: 3 },
    context: { ProductTDG },
    expected: {
        data: {
            purchase: {
                success: false,
                product: null,
                errors: [{
                    message: 'The product is out of stock',
                }],
            },
        },
    },
};


describe('Product Queries & Mutations', () => {
    const cases = [
        allProductsQueryTestCase,
        availableProductsQueryTestCase,
        productQueryTestCase,
        purchaseProductTestCase,
        purchaseUnavailableProductTestCase,
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
