define(['exports', 'react', 'app/components/FilterItem', 'react-bootstrap'], function (exports, _react, _FilterItem, _reactBootstrap) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  var _FilterItem2 = _interopRequireDefault(_FilterItem);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  var FiltersList = function FiltersList(_ref) {
    var filters = _ref.filters,
        onFilterClick = _ref.onFilterClick;
    return _react2.default.createElement(
      _reactBootstrap.ListGroup,
      null,
      filters.map(function (filterItem) {
        return _react2.default.createElement(_FilterItem2.default, _extends({
          key: filterItem.id
        }, filterItem, {
          onClick: function onClick() {
            return onFilterClick(filterItem);
          }
        }));
      })
    );
  };

  FiltersList.propTypes = {
    filters: _react.PropTypes.arrayOf(_react.PropTypes.shape({
      id: _react.PropTypes.number.isRequired,
      selected: _react.PropTypes.bool.isRequired,
      text: _react.PropTypes.string.isRequired
    }).isRequired).isRequired,
    onFilterClick: _react.PropTypes.func.isRequired
  };

  exports.default = FiltersList;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHNcXEZpbHRlcnNMaXN0LmpzeCJdLCJuYW1lcyI6WyJGaWx0ZXJzTGlzdCIsImZpbHRlcnMiLCJvbkZpbHRlckNsaWNrIiwibWFwIiwiZmlsdGVySXRlbSIsImlkIiwicHJvcFR5cGVzIiwiYXJyYXlPZiIsInNoYXBlIiwibnVtYmVyIiwiaXNSZXF1aXJlZCIsInNlbGVjdGVkIiwiYm9vbCIsInRleHQiLCJzdHJpbmciLCJmdW5jIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBS0EsTUFBTUEsY0FBYyxTQUFkQSxXQUFjO0FBQUEsUUFBR0MsT0FBSCxRQUFHQSxPQUFIO0FBQUEsUUFBWUMsYUFBWixRQUFZQSxhQUFaO0FBQUEsV0FDbEI7QUFBQTtBQUFBO0FBQ0dELGNBQVFFLEdBQVIsQ0FBWTtBQUFBLGVBQ1g7QUFDRSxlQUFLQyxXQUFXQztBQURsQixXQUVNRCxVQUZOO0FBR0UsbUJBQVM7QUFBQSxtQkFBTUYsY0FBY0UsVUFBZCxDQUFOO0FBQUE7QUFIWCxXQURXO0FBQUEsT0FBWjtBQURILEtBRGtCO0FBQUEsR0FBcEI7O0FBWUFKLGNBQVlNLFNBQVosR0FBd0I7QUFDcEJMLGFBQVMsaUJBQVVNLE9BQVYsQ0FBa0IsaUJBQVVDLEtBQVYsQ0FBZ0I7QUFDM0NILFVBQUksaUJBQVVJLE1BQVYsQ0FBaUJDLFVBRHNCO0FBRTNDQyxnQkFBVSxpQkFBVUMsSUFBVixDQUFlRixVQUZrQjtBQUczQ0csWUFBTSxpQkFBVUMsTUFBVixDQUFpQko7QUFIb0IsS0FBaEIsRUFJMUJBLFVBSlEsRUFJSUEsVUFMTztBQU10QlIsbUJBQWUsaUJBQVVhLElBQVYsQ0FBZUw7QUFOUixHQUF4Qjs7b0JBU2VWLFciLCJmaWxlIjoiY29tcG9uZW50c1xcRmlsdGVyc0xpc3QuanN4Iiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgRmlsdGVySXRlbSBmcm9tICdhcHAvY29tcG9uZW50cy9GaWx0ZXJJdGVtJ1xyXG5pbXBvcnQgeyBMaXN0R3JvdXAsIExpc3RHcm91cEl0ZW0gfSBmcm9tICdyZWFjdC1ib290c3RyYXAnXHJcblxyXG5cclxuY29uc3QgRmlsdGVyc0xpc3QgPSAoeyBmaWx0ZXJzLCBvbkZpbHRlckNsaWNrIH0pID0+IChcclxuICA8TGlzdEdyb3VwPlxyXG4gICAge2ZpbHRlcnMubWFwKGZpbHRlckl0ZW0gPT5cclxuICAgICAgPEZpbHRlckl0ZW1cclxuICAgICAgICBrZXk9e2ZpbHRlckl0ZW0uaWR9XHJcbiAgICAgICAgey4uLmZpbHRlckl0ZW19XHJcbiAgICAgICAgb25DbGljaz17KCkgPT4gb25GaWx0ZXJDbGljayhmaWx0ZXJJdGVtKX1cclxuICAgICAgLz5cclxuICAgICl9XHJcbiAgPC9MaXN0R3JvdXA+XHJcbilcclxuXHJcbkZpbHRlcnNMaXN0LnByb3BUeXBlcyA9IHtcclxuICAgIGZpbHRlcnM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zaGFwZSh7XHJcbiAgICBpZDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxyXG4gICAgc2VsZWN0ZWQ6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXHJcbiAgICB0ZXh0OiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWRcclxuICB9KS5pc1JlcXVpcmVkKS5pc1JlcXVpcmVkLFxyXG4gIG9uRmlsdGVyQ2xpY2s6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWRcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRmlsdGVyc0xpc3RcclxuIl19