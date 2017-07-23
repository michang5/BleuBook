// Create app
var api = require('../api')('/');
var config = require('../config');
var Mongo = require('../utils/Mongo');
var Post = require('../utils/Post');
var FS = require('../utils/FS');
var Exec = require('../utils/Exec');
var moment = require('moment');
var randomstring = require('randomstring');
var libxmljs = require("libxmljs");

function dict(arr, key = '_id') {
  var o = {};
  for (var i in arr) o[arr[i][key]] = arr[i];
  return o;
}

// Include models

// BleuBook 前台

// test: Friendly Book API
api.get('/t', (req, res) => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // ignore authorized SSL certificate

  var rs = Post('https://104.199.147.199/fribooker/creCusOrdWebService.asmx/AddCusOrdMultiItem', {
    wsId: '1',
    wsPw: '7167@wa359',
    //wisIsbnList: '9789863427667:9,9789865612870:1,9789866151965:4,9789869399456:1',
    //wsIsbnList: '9789869336574:3,9789866408885:2',
    wsIsbnList: '9789863427667:9,9789865612870:1',
    wsRemark: 'Test by Joe ' + moment(new Date()).add(8, 'hours').format("Y-M-D HH:mm:ss"),
  });
  var ok = rs.indexOf('<wsStatus>1</wsStatus>') !== -1;
  //var ok = rs == '<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<wsCusOrdInfo xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns=\"fribooker\">\r\n  <wsStatus>1</wsStatus>\r\n  <wsCusOrdId>com201707210013805</wsCusOrdId>\r\n  <wsErrorMsg> </wsErrorMsg>\r\n</wsCusOrdInfo>';
  res.ok({rs, ok});
});

// test: parse XML string
api.get('/tXML', (req, res) => {
  var rs = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<wsCusOrdInfo xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns=\"fribooker\">\r\n  <wsStatus>1</wsStatus>\r\n  <wsCusOrdId>com201707210013805</wsCusOrdId>\r\n  <wsErrorMsg> </wsErrorMsg>\r\n</wsCusOrdInfo>";
  rs = rs.replace(/xmlns\="fribooker"/, '');
  rs = rs.replace(/\r\n/g,'');
  var xmlDoc = libxmljs.parseXmlString(rs);
  var obj = {status: 0, orderId: '', errMsg: ''};
  if (rs.indexOf('<wsStatus>') !== -1) obj.status = Number(xmlDoc.get('//wsStatus').text());
  if (rs.indexOf('<wsCusOrdId>') !== -1) obj.orderId = xmlDoc.get('//wsCusOrdId').text().trim();
  if (rs.indexOf('<wsErrorMsg>') !== -1) obj.errMsg = xmlDoc.get('//wsErrorMsg').text().trim();
  res.ok({rs, xmlDoc, obj});
});

api.get('/', (req, res) => {
  res.redirect('index.html');
});

api.get('/bleu.html', (req, res) => {
  var events = Mongo('event');
  var book = dict(Mongo('book'));
  var author = dict(Mongo('author'));
  events = events.slice(0, 4); // for demo
  res.render({events, book, author}, 'public/bleu.html');
});

api.get('/index.html', (req, res) => {
  var events = Mongo('event');
  var book = dict(Mongo('book'));
  var author = dict(Mongo('author'));
  res.render({events, book, author}, 'public/index.html');
});

api.get('/event.html', (req, res) => {
  var events = Mongo('event');
  var event = Mongo.get('event', req.query.event_id);
  //var prev = Mongo.get('event', req.query.prev_event_id);
  //var next = Mongo.get('event', req.query.next_event_id);
  var book = dict(Mongo('book'));
  var author = dict(Mongo('author'));
  var index = (Number(req.query.event_id) + Object.keys(events).length - 1) % Object.keys(events).length;
  res.render({index, events, event, book, author}, 'public/event.html');
});

api.get('/books.html', (req, res) => {
  var book = dict(Mongo('book'));
  var author = dict(Mongo('author'));
  var chooseBook = Mongo('chooseBook')[0];
  var rec_book = chooseBook.rec_book;
  var bleu_book = chooseBook.bleu_book;
  res.render({book, author, rec_book, bleu_book}, 'public/books.html');
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
  var fribooker_string = '';
  for (var i in req.body.cart) {
    var c = req.body.cart[i];
    var b = book[c._id];
    var price = b.discount? b.discount: b.price;
    total += price * c.quantity;
    books.push({_id: b._id, name: b.name, price: price, quantity: c.quantity, ISBN: b.ISBN})
    if (fribooker_string !== '') fribooker_string += ',';
    fribooker_string += b.ISBN + ':' + c.quantity;
  }

  var order = {name: req.body.name, tel: req.body.tel, date: new Date(), books: books, total: total, status: '待處理'};

  if (fribooker_string !== '') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // ignore authorized SSL certificate
    var rs = Post('https://104.199.147.199/fribooker/creCusOrdWebService.asmx/AddCusOrdMultiItem', {
      wsId: '1',
      wsPw: '7167@wa359',
      wsIsbnList: fribooker_string,
      wsRemark: moment(new Date()).add(8, 'hours').format("Y-M-D HH:mm:ss") + ' name: ' + req.body.name + ' tel: ' + req.body.tel,
    });
    rs = rs.replace(/xmlns\="fribooker"/, '');
    rs = rs.replace(/\r\n/g,'');
    var xmlDoc = libxmljs.parseXmlString(rs);
    var obj = {status: 0, orderId: '', errMsg: ''};
    if (rs.indexOf('<wsStatus>') !== -1) obj.status = Number(xmlDoc.get('//wsStatus').text());
    if (rs.indexOf('<wsCusOrdId>') !== -1) obj.orderId = xmlDoc.get('//wsCusOrdId').text().trim();
    if (rs.indexOf('<wsErrorMsg>') !== -1) obj.errMsg = xmlDoc.get('//wsErrorMsg').text().trim();
    if (obj.status !== 1 || obj.errMsg !== '') return res.err(1, '未知錯誤: (' + obj.status + ') ' + obj.errMsg);
    return res.ok(Mongo.add('order', order));
  }

  res.err(2, '未知錯誤');
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

// admin pannel

api.get('/admin_event', (req, res) => {
  res.render({events: Mongo('event', {}, {}, {_id: 1})}, 'public/admin_event.html');
});

api.get('/admin_event_edit', (req, res) => {
  var _id = parseInt(req.query._id);
  var event = Mongo.one('event', {_id});
  var book = dict(Mongo('book'));
  var author = dict(Mongo('author'));
  res.render({event, book, author}, 'public/admin_event_edit.html');
});

api.post('/admin_event_slide_upload', (req, res) => {
  var file = req.files.file;
  var src = moment(new Date()).add(8, 'hours').format("YMD-HHmmss-") + randomstring.generate(6) + file.name.match(/(\.[^.]+)$/)[1];
  if (/^video/.test(file.type))
    Exec(config.ffmpeg + ' -i ' + file.path + ' -ss 00:00:01.000 -vframes 1 ' + config.images + '/' + src + '.png');
  FS.rename(file.path, config.images + '/' + src);
  res.ok({src, type: file.type, name: file.name, intro: ''});
});

api.get('/admin_author', (req, res) => {
  res.render({authors: Mongo('author', {}, {}, {_id: 1})}, 'public/admin_author.html');
});

api.get('/admin_author_edit', (req, res) => {
  var _id = parseInt(req.query._id);
  var author = Mongo.one('author', {_id});
  res.render(author, 'public/admin_author_edit.html');
});

module.exports = api;
