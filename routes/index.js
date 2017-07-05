// Create app
var api = require('../api')('/');
var Mongo = require('../utils/Mongo');

function dict(arr, key = '_id') {
  var o = {};
  for (var i in arr) o[arr[i][key]] = arr[i];
  return o;
}

// Include models

// BleuBook 前台

api.get('/', (req, res) => {
  res.redirect('index.html');
});

api.get('/index.html', (req, res) => {
  var events = Mongo('event');
  var book = dict(Mongo('book'));
  var author = dict(Mongo('author'));
  res.render({events, book, author}, 'public/index.html');
});

api.get('/event.html', (req, res) => {
  var event = Mongo.get('event', req.query.event_id);
  //var prev = Mongo.get('event', req.query.prev_event_id);
  //var next = Mongo.get('event', req.query.next_event_id);
  var book = dict(Mongo('book'));
  var author = dict(Mongo('author'));
  res.render({event, book, author}, 'public/event.html');
});

api.get('/cart.html', (req, res) => {
  var book = dict(Mongo('book'));
  var author = dict(Mongo('author'));
  res.render({book, author}, 'public/cart.html');
});

api.post('/order', (req, res) => {
  var book = dict(Mongo('book'));
  var total = 0;
  var books = [];
  for (var i in req.body.cart) {
    var c = req.body.cart[i];
    var b = book[c._id];
    var price = b.discount? b.discount: b.price;
    total += price * c.quantity;
    books.push({_id: b._id, name: b.name, price: price, quantity: c.quantity});
  }
  var order = {name: req.body.name, tel: req.body.tel, date: new Date(), books: books, total: total, status: '待處理'};
  res.ok(Mongo.add('order', order));
});

api.post('/query', (req, res) => {
  res.ok(Mongo('order', {tel: req.body.tel}, {}, {_id: -1}));
});

module.exports = api;
