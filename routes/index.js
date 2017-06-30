// Create app
var api = require('../api')('/');
var Mongo = require('../utils/Mongo');

// Include models

// BleuBook 前台

api.get('/', (req, res) => {
  var events = Mongo('event');
  var books = Mongo('book');
  var authors = Mongo('author');
  res.render({events, books, authors}, 'public/index.html');
});

module.exports = api;
