'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var axios = require('axios').default;
var nodeify = require('./utils/nodeify');

var _require = require('./utils/razorpay-utils'),
    isNonNullObject = _require.isNonNullObject;

var allowedHeaders = {
  "X-Razorpay-Account": "",
  "Content-Type": "application/json"
};

function getValidHeaders(headers) {

  var result = {};

  if (!isNonNullObject(headers)) {

    return result;
  }

  return Object.keys(headers).reduce(function (result, headerName) {

    if (allowedHeaders.hasOwnProperty(headerName)) {

      result[headerName] = headers[headerName];
    }

    return result;
  }, result);
}

function normalizeError(err) {
  throw {
    statusCode: err.response.status,
    error: err.response.data.error
  };
}

var API = function () {
  function API(options) {
    _classCallCheck(this, API);

    this.version = 'v1';

    this.rq = axios.create(this._createConfig(options));
  }

  _createClass(API, [{
    key: '_createConfig',
    value: function _createConfig(options) {
      var config = {
        baseURL: options.hostUrl,
        headers: Object.assign({ 'User-Agent': options.ua }, getValidHeaders(options.headers))
      };

      if (options.key_id && options.key_secret) {
        config.auth = {
          username: options.key_id,
          password: options.key_secret
        };
      }

      if (options.oauthToken) {
        config.headers = _extends({
          'Authorization': 'Bearer ' + options.oauthToken
        }, config.headers);
      }
      return config;
    }
  }, {
    key: 'getEntityUrl',
    value: function getEntityUrl(params) {
      return params.hasOwnProperty('version') ? '/' + params.version + params.url : '/' + this.version + params.url;
    }
  }, {
    key: 'get',
    value: function get(params, cb) {
      return nodeify(this.rq.get(this.getEntityUrl(params), {
        params: params.data
      }).catch(normalizeError), cb);
    }
  }, {
    key: 'post',
    value: function post(params, cb) {
      return nodeify(this.rq.post(this.getEntityUrl(params), params.data).catch(normalizeError), cb);
    }

    // postFormData method for file uploads.

  }, {
    key: 'postFormData',
    value: function postFormData(params, cb) {
      return nodeify(this.rq.post(this.getEntityUrl(params), params.formData, {
        'headers': {
          'Content-Type': 'multipart/form-data'
        }
      }).catch(normalizeError), cb);
    }
  }, {
    key: 'put',
    value: function put(params, cb) {
      return nodeify(this.rq.put(this.getEntityUrl(params), params.data).catch(normalizeError), cb);
    }
  }, {
    key: 'patch',
    value: function patch(params, cb) {
      return nodeify(this.rq.patch(this.getEntityUrl(params), params.data).catch(normalizeError), cb);
    }
  }, {
    key: 'delete',
    value: function _delete(params, cb) {
      return nodeify(this.rq.delete(this.getEntityUrl(params)).catch(normalizeError), cb);
    }
  }]);

  return API;
}();

module.exports = API;