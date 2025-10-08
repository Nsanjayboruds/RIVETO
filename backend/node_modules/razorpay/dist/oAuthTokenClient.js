'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var API = require('./api');
var pkg = require('../package.json');

var _require = require('./resources/oAuthTokenValidator'),
    validateInput = _require.validateInput,
    SCHEMAS = _require.SCHEMAS;

var OAuthTokenClient = function (_API) {
  _inherits(OAuthTokenClient, _API);

  function OAuthTokenClient() {
    _classCallCheck(this, OAuthTokenClient);

    return _possibleConstructorReturn(this, (OAuthTokenClient.__proto__ || Object.getPrototypeOf(OAuthTokenClient)).call(this, {
      hostUrl: 'https://auth.razorpay.com',
      ua: 'razorpay-node@' + pkg.version
    }));
  }

  _createClass(OAuthTokenClient, [{
    key: 'getEntityUrl',
    value: function getEntityUrl(params) {
      return params.url;
    }
  }, {
    key: 'generateAuthUrl',
    value: function generateAuthUrl(params) {
      var errors = validateInput(params, SCHEMAS.generateAuthUrl);
      if (Object.keys(errors).length > 0) return errors;
      var baseUrl = this.rq.defaults.baseURL + '/authorize';
      var queryString = Object.entries(params).flatMap(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];

        return Array.isArray(value) ? value.map(function (item) {
          return key + '[]=' + encodeURIComponent(item);
        }) : key === "redirect_uri" ? key + '=' + value : key + '=' + encodeURIComponent(value);
      }).join("&");
      return baseUrl + '?' + queryString;
    }
  }, {
    key: 'getAccessToken',
    value: function getAccessToken() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var callback = arguments[1];

      var errors = validateInput(params, SCHEMAS.getAccessToken);
      if (Object.keys(errors).length > 0) return Promise.reject(errors);
      return this.post({
        url: '/token',
        data: params
      }, callback);
    }
  }, {
    key: 'refreshToken',
    value: function refreshToken() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var callback = arguments[1];

      var errors = validateInput(params, SCHEMAS.refreshToken);
      if (Object.keys(errors).length > 0) return Promise.reject(errors);
      return this.post({
        url: '/token',
        data: params
      }, callback);
    }
  }, {
    key: 'revokeToken',
    value: function revokeToken() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var callback = arguments[1];

      var errors = validateInput(params, SCHEMAS.revokeToken);
      if (Object.keys(errors).length > 0) return Promise.reject(errors);
      return this.post({
        url: '/revoke',
        data: params
      }, callback);
    }
  }]);

  return OAuthTokenClient;
}(API);

module.exports = OAuthTokenClient;