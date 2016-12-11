define(['exports', 'react', 'react-bootstrap'], function (exports, _react, _reactBootstrap) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _react2 = _interopRequireDefault(_react);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var FilterItem = function FilterItem(_ref) {
    var onClick = _ref.onClick,
        selected = _ref.selected,
        text = _ref.text;
    return _react2.default.createElement(
      _reactBootstrap.ListGroupItem,
      {
        onClick: onClick,
        style: {
          textDecoration: selected ? 'none' : 'line-through',
          textAlign: selected ? 'left' : 'right'
        }
      },
      text
    );
  };

  FilterItem.propTypes = {
    onClick: _react.PropTypes.func.isRequired,
    selected: _react.PropTypes.bool.isRequired,
    text: _react.PropTypes.string.isRequired
  };

  exports.default = FilterItem;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHNcXEZpbHRlckl0ZW0uanN4Il0sIm5hbWVzIjpbIkZpbHRlckl0ZW0iLCJvbkNsaWNrIiwic2VsZWN0ZWQiLCJ0ZXh0IiwidGV4dERlY29yYXRpb24iLCJ0ZXh0QWxpZ24iLCJwcm9wVHlwZXMiLCJmdW5jIiwiaXNSZXF1aXJlZCIsImJvb2wiLCJzdHJpbmciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUdBLE1BQU1BLGFBQWEsU0FBYkEsVUFBYTtBQUFBLFFBQUdDLE9BQUgsUUFBR0EsT0FBSDtBQUFBLFFBQVlDLFFBQVosUUFBWUEsUUFBWjtBQUFBLFFBQXNCQyxJQUF0QixRQUFzQkEsSUFBdEI7QUFBQSxXQUNqQjtBQUFBO0FBQUE7QUFDRSxpQkFBU0YsT0FEWDtBQUVFLGVBQU87QUFDTEcsMEJBQWdCRixXQUFXLE1BQVgsR0FBb0IsY0FEL0I7QUFFTEcscUJBQVdILFdBQVcsTUFBWCxHQUFvQjtBQUYxQjtBQUZUO0FBT0dDO0FBUEgsS0FEaUI7QUFBQSxHQUFuQjs7QUFZQUgsYUFBV00sU0FBWCxHQUF1QjtBQUNyQkwsYUFBUyxpQkFBVU0sSUFBVixDQUFlQyxVQURIO0FBRXJCTixjQUFVLGlCQUFVTyxJQUFWLENBQWVELFVBRko7QUFHckJMLFVBQU0saUJBQVVPLE1BQVYsQ0FBaUJGO0FBSEYsR0FBdkI7O29CQU1lUixVIiwiZmlsZSI6ImNvbXBvbmVudHNcXEZpbHRlckl0ZW0uanN4Iiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IFByb3BUeXBlcyB9IGZyb20gJ3JlYWN0J1xyXG5pbXBvcnQgeyBMaXN0R3JvdXAsIExpc3RHcm91cEl0ZW0gfSBmcm9tICdyZWFjdC1ib290c3RyYXAnXHJcblxyXG5jb25zdCBGaWx0ZXJJdGVtID0gKHsgb25DbGljaywgc2VsZWN0ZWQsIHRleHQgfSkgPT4gKFxyXG4gIDxMaXN0R3JvdXBJdGVtXHJcbiAgICBvbkNsaWNrPXtvbkNsaWNrfVxyXG4gICAgc3R5bGU9e3tcclxuICAgICAgdGV4dERlY29yYXRpb246IHNlbGVjdGVkID8gJ25vbmUnIDogJ2xpbmUtdGhyb3VnaCcsXHJcbiAgICAgIHRleHRBbGlnbjogc2VsZWN0ZWQgPyAnbGVmdCcgOiAncmlnaHQnXHJcbiAgICB9fVxyXG4gID5cclxuICAgIHt0ZXh0fVxyXG4gIDwvTGlzdEdyb3VwSXRlbT5cclxuKVxyXG5cclxuRmlsdGVySXRlbS5wcm9wVHlwZXMgPSB7XHJcbiAgb25DbGljazogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcclxuICBzZWxlY3RlZDogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcclxuICB0ZXh0OiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWRcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRmlsdGVySXRlbVxyXG4iXX0=