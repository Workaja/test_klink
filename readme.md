# Backend/API for K-LINK

fyi: this is test from these company so I made this to complete the task

---

# Documentation

## API

**Auth**

```jsx
POST /auth/register
`You can register new account, and will return JWT Token`
body:
{
    "email": "a@aaaas.com",
    "password": "12345671213"
}

POST /auth/login
`You can login with your account, and will return JWT Token`
body:
{
    "email": "a@aaaas.com",
    "password": "12345671213"
}

GET /auth/profile
`You can access profile and latest success transaction/order`
```

**Products (Master Products)**

```jsx
GET /rest/products
`You can get list of master products`

GET /rest/products/{id}
`You can return a detailed product information`

POST /rest/products
`You can store new entry of master product`
body:
{
    "sku": "DRK-JUS-0007",
    "name": "Minuman Segar Ale-Ale Rasa Air Putih",
    "price": 5000
}

PUT /rest/products
`You can update the entry of master product`
body:
{
    "id": 2,
    "sku": "DRK-JUS-0002",
    "name": "Minuman Segar Ale-Ale Rasa Banana",
    "price": 3000
}

DELETE /rest/products/{id}
`You can delete the master product entry`

```

**Products Item Stock**

On these one, I'm assuming the uses of stock on product, will working out with this situation, and item stock will be 0-99999999999999 (or 0~n)

```jsx
GET /rest/item-stock
`Get stock from company`

GET /rest/item-stock/12748
`Get detailed item stock return`

POST /rest/item-stock
`Generate a post way a such many entity of items stock`
body:
{
    "sku": "DRK-JUS-0004",
    "stock_count": 700
}

DELETE /rest/item-stock/12748
`Do delete item from stock, it will affect the count of stock item on master product`
```

**Orders**

This is multi ways of of orders, you can have the cart, add new item to cart, update the cart entity, remove item from cart, do check out all of cart, then you'll have to check the transaction order and receive the transaction callback from payment aggregator / gateway.

```jsx
GET /rest/cart
`Accessing the cart which is connected to redis`

PUT /rest/cart
`Add new item by sku to cart`
body:
{
    "sku": "DRK-JUS-0005",
    "total": 1
}

PATCH /rest/cart
`Update entitiy of cart by updating the items by sku`
body:
{
    "sku": "DRK-JUS-0004",
    "total": 0
}

DELETE /rest/cart
`Remove specific sku from cart`
body:
{
    "sku": "DRK-JUS-0005"
}

/** below here is only simulated */

POST /rest/cart/checkout
`You can finalize the transaction using current cart by choosing available`
`payment code: hawa/HawaPay, madtrains/MadTrains/joke of Midtrans, and`
`xendot/Xendot/joke of Xendit`
body:
{
    "payment_code": "hawa"
}
`it'll return this`
{
    "id": 13,
    "user_id": 6,
    "items": [
        {
            "sku": "DRK-JUS-0004",
            "total": 1,
            "price": "2000",
            "total_price": 2000
        }
    ],
    "is_paid": false,
    "payment_record": {
        "strategy": {
            "code": "hawa",
            "name": "HawaPay",
            "fee": 1000
        },
        "final_price": 3000,
        "tax10p": 300,
        "grand_total": 3300,
        "payment_id": "d082e160-0a18-4ea8-9140-5ef9699a962e"
    },
    "updatedAt": "2021-04-09T21:13:53.561Z",
    "createdAt": "2021-04-09T21:13:53.561Z"
}

GET /rest/order/6
`from above return, you can change the 6 with the id, and it will return the current`
`order with this id`

`While user is having payment process, and after it finished for payment, then for`
`example. Hawa Pay is returning a callback, it will sent via webhook url`

POST /rest/order/hook
`with this one, payment system can host to host return data to us, for example this one`
`returning only payment id from checkout return, whilst i type here you can check the`
`payment records, has strategy which is details about payment gateway name and fee`
`its also had prices and finally payment_id, usually payment id is recorded both place`
`so when payment is complete it return payment id to make sure it will be used on us`
body:
{
    "payment_id": "ec0eb888-bbfc-4ced-a1ca-7134285dbe5d",
    "status": "success"
}
```

After server API is receiving the hook, it will updating the orders which update is_paid to true and removing stock items, but whenever it had failed process. it will stopped. sometime its related to stock, which business development team that should check it first so it can processed later manually.

Successful transaction can be accessed on user profile.

---

## Requirements

This development is using Node.JS using Yarn to add packaging, then Express as framework for make server is available. and Nodemon to monitor the live update on codes.

So you need to run

```jsx
*yarn add* or possible to use *npm i*
```

then you need an instance of redis

you need to instance of postgres

by installing the requirement, it make the process would be progressed easily.

```jsx
To run the server you can use
*yarn start*
or *npm run start*
```

Since it using nodemon, it will restarting automatically whenever have update on the way

---

## Authentication

This development API is using simple JWT use jsonwebtoken package. It has simple 7d active token whenever its has authenticated.

You need to provide on headers, authorization header will had `Bearer <token>`

You can check the routing using the Postman export file here.

[Postman environment](https://drive.google.com/file/d/1zNXajEie6n0jn143vGU-NAWbnSIW4ige/view?usp=sharing) and [Postman](https://drive.google.com/file/d/1h2lNyfEzKTXzb-V3QoFAnBrM9TI6Pt2c/view?usp=sharing)