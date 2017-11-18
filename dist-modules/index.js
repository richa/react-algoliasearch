'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _deepAssign = require('deep-assign');

var _deepAssign2 = _interopRequireDefault(_deepAssign);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AgAutocomplete = function (_Component) {
  _inherits(AgAutocomplete, _Component);

  function AgAutocomplete(props) {
    _classCallCheck(this, AgAutocomplete);

    var _this = _possibleConstructorReturn(this, (AgAutocomplete.__proto__ || Object.getPrototypeOf(AgAutocomplete)).call(this, props));

    _this.search = null;
    _this.state = {
      values: []
    };
    return _this;
  }

  _createClass(AgAutocomplete, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (this.search && this.props.defaultValue !== nextProps.defaultValue) {
        this.search.autocomplete.setVal(nextProps.defaultValue);
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      //this thing sucks but for now it must be like this or window will be undefined.
      var algoliasearch = require('algoliasearch');
      var autocomplete = require('autocomplete.js');

      var _props = this.props,
          appId = _props.appId,
          apiKey = _props.apiKey,
          hitsPerPage = _props.hitsPerPage,
          indices = _props.indices,
          displayKey = _props.displayKey,
          options = _props.options,
          inputId = _props.inputId,
          keyName = _props.keyName,
          currentLanguage = _props.currentLanguage,
          defaultValue = _props.defaultValue,
          filtersQuery = _props.filtersQuery,
          facetFilters = _props.facetFilters;


      var agClient = algoliasearch(appId, apiKey);
      var indicesOptions = [];

      indices.map(function (item) {
        var index = item.index,
            itemDisplayKey = item.displayKey,
            itemHitsPerPage = item.hitsPerPage,
            itemKeyName = item.keyName,
            itemOptions = item.options;

        var agIndex = agClient.initIndex(index);
        var hitsLimit = itemHitsPerPage ? itemHitsPerPage : hitsPerPage || 10;
        var indexOptions = {
          source: function source(query, cb) {
            agIndex.search(query, { hitsPerPage: hitsLimit, filters: filtersQuery || '', facetFilters: facetFilters || [] }).then(function (data) {
              return cb(data.hits, data);
            }).catch(function (error) {
              console.log(error);
              return cb([]);
            });
          },
          displayKey: itemDisplayKey ? itemDisplayKey : displayKey || 'value',
          templates: {
            suggestion: function suggestion(_suggestion) {
              var key = itemKeyName ? itemKeyName : keyName || 'name';

              if (currentLanguage) {
                return _suggestion._highlightResult[key][_this2.props.currentLanguage].value;
              }

              return _suggestion._highlightResult[key].value;
            }
          }
        };
        var agOptions = (0, _deepAssign2.default)(indexOptions, itemOptions);

        indicesOptions.push(agOptions);
      });

      this.search = autocomplete('#' + inputId, options, indicesOptions);

      this.search.on('autocomplete:opened', this.props.opened).on('autocomplete:shown', this.props.shown).on('autocomplete:closed', this.props.closed).on('autocomplete:updated', this.props.updated).on('autocomplete:cursorchanged', this.props.cursorchanged).on('autocomplete:selected', this.props.selected).on('autocomplete:autocompleted', this.props.autocompleted);

      defaultValue ? this.search.autocomplete.setVal(defaultValue) : false;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          otherProps = _props2.otherProps,
          placeholder = _props2.placeholder,
          inputId = _props2.inputId;


      return _react2.default.createElement('input', _extends({
        id: inputId,
        placeholder: placeholder || 'Enter a search term...'
      }, otherProps));
    }
  }]);

  return AgAutocomplete;
}(_react.Component);

exports.default = AgAutocomplete;


AgAutocomplete.defaultProps = {
  options: {},
  opened: function opened() {},
  shown: function shown() {},
  closed: function closed() {},
  updated: function updated() {},
  cursorchanged: function cursorchanged() {},
  selected: function selected() {},
  autocompleted: function autocompleted() {}
};

AgAutocomplete.propTypes = {
  apiKey: _propTypes2.default.string.isRequired,
  appId: _propTypes2.default.string.isRequired,
  currentLanguage: _propTypes2.default.string,
  hitsPerPage: _propTypes2.default.number,
  indices: _propTypes2.default.array.isRequired,
  inputId: _propTypes2.default.string.isRequired,
  keyName: _propTypes2.default.string,
  filtersQuery: _propTypes2.default.string,
  facetFilters: _propTypes2.default.array,
  defaultValue: _propTypes2.default.string,
  name: _propTypes2.default.string,
  options: _propTypes2.default.object,
  otherProps: _propTypes2.default.object,
  opened: _propTypes2.default.func,
  shown: _propTypes2.default.func,
  closed: _propTypes2.default.func,
  updated: _propTypes2.default.func,
  cursorchanged: _propTypes2.default.func,
  selected: _propTypes2.default.func,
  autocompleted: _propTypes2.default.func,
  placeholder: _propTypes2.default.string,
  displayKey: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.func])
};