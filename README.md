# Summer 2019 Developer Intern Challenge for Shopify

This project constitutes the barebones of an online marketplace.

## Running the application locally

1. Clone this repo
2. In the root of the project, run the following command: 
```
docker-compose up --build
```
3. Once the app is running, run the following command to initialize the database: 
```
docker exec shopify-db ./db_setup.sh
```
4. Navigate to ```localhost/api/graphiql``` to interact with the GraphQL server.


## Testing and CI

Tests for the GraphQL server are located in ```/backend/app/tests```

To run the tests, simply run ```npm test```. 
On every commit, these tests are run with ```TravisCI```.

## API Usage

Navigate to ```localhost/api/graphiql``` to interact with the GraphQL server.

## Products API

### Querying a single product

Execute the following query to fetch information about a single product:
```
query {
  product(id: Int!) {
    id
    title
    price
    inventory_count
  }
}
```

### Querying for all products

Execute the following query to fetch all products:
```
query {
  products(options: { available: Boolean! }) {
    id
    title
    price
    inventory_count
  }
}
```

If the parameter ```available``` is set to ```true```, only products with an ```inventory_count``` greater than ```0``` will be returned.

### Purchasing a product

Execute the following mutation to purchase a single product:
```
mutation {
  purchase(id: Int!) {
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
```

The ```inventory_count``` of the given product will be reduced by ```1```.

## Carts API

### Querying a single cart

Execute the following query to view a single cart:
```
query {
  cart(id: Int!){
    total
    items {
      product {
        id
        title
        price
        inventory_count
      }
    }
  }
}
```

Querying for a cart that does not exist will return a ```null``` cart value.

### Adding a product to a cart

Execute the following mutation to add a single product to a cart:
```
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
```

with query variables 
```
{
  "cartId": Int!,
  "productId": Int!,
}
```

This will increment the quantity of the given product in the cart by one.

### Deleting a product from a cart

Execute the following mutation to delete a product from a cart:
```
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
```
with query variables
```
{
  "cartId": Int!,
  "productId": Int!,
}
```

This will decrement the quantity of the given product in the cart by one. If the quantity is reduced the ```0```, the product will disappear from the cart.

### Checking out a cart

Execute the following mutation to checkout the contents of a cart:
```
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
```
with query variables 
```
{
  "id": Int!
}
```

This will reduce the ```inventory_count``` of all products in the cart by their respective quantities. 

The cart checkout will fail if the quantity of a single product in the cart exceeds its ```inventory_count```.