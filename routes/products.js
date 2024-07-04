const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { generateUUID } = require('../utils/UUIDGenerator');

const productFilePath = path.join(__dirname, '../data/products.json');
const readProducts = () => JSON.parse(fs.readFileSync(productFilePath, 'utf8'));
const writeProducts = (data) => fs.writeFileSync(productFilePath, JSON.stringify(data, null, 2));

router.get('/', (req, res) => {
    const products = readProducts();
    const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
    res.json(products.slice(0, limit));
})

router.post('/', (req, res) => {
    const products = readProducts();
    const {title, description, code, price, status = true, stock, category, thumbnails} = req.body;

    if(!title || !description || !code || !price || !stock || !category) return res.status(400).send({error: 'All fields are required except thumbnails'});

    const payload = {
        id: generateUUID(),
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails
    }

    products.push(payload);
    writeProducts(products);
    res.status(201).json(payload);

})

module.exports = router;