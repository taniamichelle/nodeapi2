const express = require('express');
const helmet = require('helmet');

console.log('environment', process.env.NODE_ENV);

const postRouter = require('../api/post-router');

const server = express();

server.use(helmet());
server.use('/api/posts', postRouter);

server.get('/', (req, res) => {
    res.send(`<h1>Test</h1>`);
});

module.exports = server;

