var request = require('request-promise');
var await = require('asyncawait/await');

var Post = (uri, qs) => await(request({method: 'POST', uri: uri, form: qs}));
Post.json = (uri, qs) => await(request({method: 'POST', uri: uri, body: qs, json: true}));
Post.ws = (uri, xml) => await(request({method: 'POST', uri: uri, body: xml, json: false}));

module.exports = Post;
