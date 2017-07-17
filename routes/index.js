// Create app
var api = require('../api')('/');
var Mongo = require('../utils/Mongo');
var Post = require('../utils/Post');

function dict(arr, key = '_id') {
  var o = {};
  for (var i in arr) o[arr[i][key]] = arr[i];
  return o;
}

// Include models

// BleuBook 前台

api.get('/t', (req, res) => {
  res.ok(Post.ws('http://104.199.147.199/fribooker/queryOrders.aspx', ''));
});

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

api.get('/admin_author', (req, res) => {
  res.render({authors: Mongo('author', {}, {}, {_id: 1})}, 'public/admin_author.html');
});

api.get('/admin_author_edit', (req, res) => {
  var _id = parseInt(req.query._id);
  var author = Mongo.one('author', {_id});
  res.render(author, 'public/admin_author_edit.html');
});

//Kaede test
api.post('/query', (req, res) => {
  res.ok(Mongo('order', {tel: req.body.tel}, {}, {_id: -1}));
});

//Example
api.get('/admin_trader2', (req, res) => {
  res.render({traders: Mongo('trader2', {}, {_id: 0}, {id: 1})}, 'public/admin_trader2.html');
});

api.get('/admin_shop', (req, res) => {
  res.render({shop: Mongo.one('shop', {id: 0}, {_id: 0})}, 'public/admin_shop.html');
});

api.post('/admin_shop_upload', (req, res) => {
  var file = req.files.file;
  var src = randomstring.generate(6) + file.name.match(/(\.[^.]+)$/)[1];
  if (/^video/.test(file.type))
    Exec(config.ffmpeg + ' -i ' + file.path + ' -ss 00:00:01.000 -vframes 1 ' + config.images + '/' + src + '.png');
  FS.rename(file.path, config.images + '/' + src);
  res.ok({src, type: file.type, name: file.name, intro: ''});
});

api.post('/admin_shop_save', (req, res) => {
  res.ok(Mongo.update('shop', {id: req.body.id}, req.body));
});

module.exports = api;
