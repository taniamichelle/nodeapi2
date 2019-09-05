const express = require('express');
const helmet = require('helmet');

console.log('environment', process.env.NODE_ENV);

const server = express();

const postRouter = require('./data/routing/post-router');

server.use(express.json());
server.use(helmet());
server.use('/api/posts', postRouter);

server.get('/', (req, res) => {
    res.send(`<h1>Test</h1>`);
});

module.exports = server;

