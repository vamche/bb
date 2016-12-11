define(['react', 'react-dom', 'react-redux', 'app/store', 'app/components/appMain'], function (_react, _reactDom, _reactRedux, _store, _appMain) {
    'use strict';

    var _react2 = _interopRequireDefault(_react);

    var _reactDom2 = _interopRequireDefault(_reactDom);

    var _store2 = _interopRequireDefault(_store);

    var _appMain2 = _interopRequireDefault(_appMain);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var contentElement = document.getElementById('app-container');
    var loadingDiv = document.getElementById('loading');
    loadingDiv.style.display = 'none';

    _reactDom2.default.render(_react2.default.createElement(
        _reactRedux.Provider,
        { store: _store2.default },
        _react2.default.createElement(_appMain2.default, null)
    ), contentElement);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4uanN4Il0sIm5hbWVzIjpbImNvbnRlbnRFbGVtZW50IiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsImxvYWRpbmdEaXYiLCJzdHlsZSIsImRpc3BsYXkiLCJyZW5kZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBTUEsUUFBTUEsaUJBQWlCQyxTQUFTQyxjQUFULENBQXdCLGVBQXhCLENBQXZCO0FBQ0EsUUFBTUMsYUFBYUYsU0FBU0MsY0FBVCxDQUF3QixTQUF4QixDQUFuQjtBQUNBQyxlQUFXQyxLQUFYLENBQWlCQyxPQUFqQixHQUEyQixNQUEzQjs7QUFFQSx1QkFBU0MsTUFBVCxDQUNJO0FBQUE7QUFBQSxVQUFVLHNCQUFWO0FBQ0k7QUFESixLQURKLEVBSUlOLGNBSkoiLCJmaWxlIjoibWFpbi5qc3giLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXHJcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nXHJcbmltcG9ydCB7IFByb3ZpZGVyIH0gZnJvbSAncmVhY3QtcmVkdXgnXHJcbmltcG9ydCBzdG9yZSBmcm9tICdhcHAvc3RvcmUnXHJcbmltcG9ydCBBcHBNYWluIGZyb20gJ2FwcC9jb21wb25lbnRzL2FwcE1haW4nXHJcblxyXG5jb25zdCBjb250ZW50RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHAtY29udGFpbmVyJyk7XHJcbmNvbnN0IGxvYWRpbmdEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9hZGluZycpO1xyXG5sb2FkaW5nRGl2LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcblxyXG5SZWFjdERPTS5yZW5kZXIoXHJcbiAgICA8UHJvdmlkZXIgc3RvcmU9e3N0b3JlfT5cclxuICAgICAgICA8QXBwTWFpbiAvPlxyXG4gICAgPC9Qcm92aWRlcj4sXHJcbiAgICBjb250ZW50RWxlbWVudFxyXG4pXHJcbiJdfQ==