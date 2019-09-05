const knex = require('knex');

// get an object with the development key: {development: {}}
const environment = process.env.NODE_ENV || 'development';
// config.devlopment === config('development')
const config = require('../knexfile.js')[environment];

module.exports = knex(config);
