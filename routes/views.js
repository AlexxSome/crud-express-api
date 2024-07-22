const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const productsFilePath = path.join(__dirname, '../data/products.json');
const readProducts = () => {
    try {
        const data = fs.readFileSync(productsFilePath);
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
};

router.get('/', (req, res) => {
    const products = readProducts();
    res.render('home', { title: 'Home', products });
});

router.get('/realtimeproducts', (req, res) => {
    const products = readProducts();
    res.render('realTimeProducts', { title: 'Real-Time Products', products });
});

module.exports = router;
