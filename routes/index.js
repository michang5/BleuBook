// Create app
var api = require('../api')('/');
var Mongo = require('../utils/Mongo');

// Include models

// BleuBook 前台

api.get('/', (req, res) => {
  res.redirect('index.html');
});

api.get('/index.html', (req, res) => {
  var events = Mongo('event');
  var books = Mongo('book');
  var authors = Mongo('author');
  res.render({events, books, authors}, 'public/index.html');
});

api.get('/cart.html', (req, res) => {
  var books = Mongo('book');
  var authors = Mongo('author');
  res.render({books, authors}, 'public/cart.html');
});

module.exports = api;
