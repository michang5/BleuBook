var promise = require('bluebird')
var soap = promise.promisifyAll(require('soap'));
var await = require('asyncawait/await');

var url = 'https://oa.taitung.gov.tw/portal_server_org.php?wsdl';
var key = 'a18610ed4f252f7377ae8cf9a28d6fcf92b75a7785e7503116fffd76a5d814d5';

var OA = {};

OA.getCompany = () => {
  var client = await(soap.createClientAsync(url));
  var result = await(promise.promisify(client.getCompany)({key}));
  return JSON.parse(result[0].return.getCompanyResult.$value);
};

OA.getOrgUnit = (orgID) => {
  var client = await(soap.createClientAsync(url));
  var result = await(promise.promisify(client.getOrgUnit)({key, orgID}));
  console.log(result);
  return JSON.parse(result[0].return.getOrgUnitResult.$value);
};

OA.getOrgUsers = (orgID) => {
  var client = await(soap.createClientAsync(url));
  var result = await(promise.promisify(client.getOrgUsers)({key, orgID}));
  console.log(result);
  return JSON.parse(result[0].return.getOrgUsersResult.$value);
};

OA.getUserInfo = (orgID) => {
  var client = await(soap.createClientAsync(url));
  var result = await(promise.promisify(client.getUserInfo)({key, orgID}));
  console.log(result);
  return JSON.parse(result[0].return.getUserInfoResult.$value);
};

module.exports = OA;
