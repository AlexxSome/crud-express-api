const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const {generateUUID} = require("../utils/UUIDGenerator");

const cartsFilePath = path.join(__dirname, '../data/carts.json');
const readCarts = () => JSON.parse(fs.readFileSync(cartsFilePath, 'utf8'));
const writeCarts = (data) => fs.writeFileSync(cartsFilePath, JSON.stringify(data, null, 2));

router.get('/:cid', (req, res) => {
    const carts = readCarts();
    const cart = carts.find(c => c.id === req.params.cid);
    if (cart) {
        return res.status(200).json(cart);
    } else {
        res.status(404).send('Cart not found');
    }
});

router.post('/', (req, res) => {
    const carts = readCarts();
    const newCart = {
        id: generateUUID(),
        products: []
    };
    carts.push(newCart);
    writeCarts(carts);
    res.status(201).json(newCart);
});

router.post('/:cid/product/:pid', (req, res) => {
    const { pid, cid } = req.params;
    const carts = readCarts();
    const cart = carts.find(c => c.id === cid);
    if (!cart) {
        return res.status(404).send('Cart not found');
    }

    const productIndex = cart.products.findIndex(p => p.product === pid);
    if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
    } else {
        cart.products.push({ product: pid, quantity: 1 });
    }
    writeCarts(carts);
    res.status(201).json(cart);
});

module.exports = router;