require('dotenv').config();

const server = require('./api/server');

const port = process.env.PORT || 8000
server.listen(port, () => {
    console.log(`\n*** Server Running on http://localhost:${port} ***\n`);
});

/*
HENRY'S SOLUTION:

const express = require('express');
const postsRouter = require('./posts/postsRouter.js');

const server = express();
server.use(express.json());

server.use('/api/posts', postsRouter);

server.listen(4444, () => console.log("server on 4444"));
*/