const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const path = require('path');
const exphbs = require('express-handlebars');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/carts');
const viewsRoutes = require('./routes/views');

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Handlebars setup
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Routes
// app.use('/api/products', productRoutes);
app.use('/api/products', productRoutes(io));
app.use('/api/carts', cartRoutes);
app.use('/', viewsRoutes);

// Socket.IO setup

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = { app, server, io };
