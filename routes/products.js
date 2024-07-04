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

});

router.get('/:pid', (req, res) => {
    const products = readProducts();
    const data = products.find(p => p.id === req.params.pid);
    if (data) {
        res.json(data);
    } else {
        res.status(404).send('Product not found');
    }
});

router.put('/:pid', (req, res) => {
    const products = readProducts();
    const data = products.findIndex(p => p.id === req.params.pid);
    if (data !== -1) {
        const obj = products.find(p => p.id === req.params.pid);
        const updatedProduct = {
            id: obj.id,
            title: req.body?.title ? req.body.title : obj.title,
            description: req.body?.description ? req.body.description : obj.description,
            code: req.body?.code ? req.body.code : obj.code,
            price: req.body?.price ? req.body.price : obj.price,
            status: req.body?.status ? req.body.status : obj.status,
            stock: req.body?.stock ? req.body.stock : obj.stock,
            category: req.body?.category ? req.body.category : obj.category,
            thumbnails: req.body?.thumbnails ? req.body.thumbnails : obj.thumbnails,
        };
        products[data] = updatedProduct;
        writeProducts(products);
        res.status(200).json(updatedProduct);
    } else {
        res.status(404).send('Product not found');
    }
});

module.exports = router;