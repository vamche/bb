define(['exports', 'react', 'app/containers/mapContainer'], function (exports, _react, _mapContainer) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _react2 = _interopRequireDefault(_react);

    var _mapContainer2 = _interopRequireDefault(_mapContainer);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    var AppMain = function (_Component) {
        _inherits(AppMain, _Component);

        function AppMain() {
            _classCallCheck(this, AppMain);

            return _possibleConstructorReturn(this, (AppMain.__proto__ || Object.getPrototypeOf(AppMain)).apply(this, arguments));
        }

        _createClass(AppMain, [{
            key: 'render',
            value: function render() {
                return _react2.default.createElement(
                    'div',
                    null,
                    _react2.default.createElement(_mapContainer2.default, null)
                );
            }
        }]);

        return AppMain;
    }(_react.Component);

    exports.default = AppMain;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHNcXGFwcE1haW4uanN4Il0sIm5hbWVzIjpbIkFwcE1haW4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1FBSU1BLE87Ozs7Ozs7Ozs7O3FDQUVPO0FBQ0wsdUJBQVE7QUFBQTtBQUFBO0FBQUs7QUFBTCxpQkFBUjtBQUNIOzs7Ozs7c0JBR1dBLE8iLCJmaWxlIjoiY29tcG9uZW50c1xcYXBwTWFpbi5qc3giLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgQ29tcG9uZW50IH0gZnJvbSAncmVhY3QnXHJcblxyXG5pbXBvcnQgTWFwVUkgZnJvbSAnYXBwL2NvbnRhaW5lcnMvbWFwQ29udGFpbmVyJ1xyXG5cclxuY2xhc3MgQXBwTWFpbiBleHRlbmRzIENvbXBvbmVudCB7XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiAoPGRpdj48TWFwVUkgLz48L2Rpdj4pXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IChBcHBNYWluKVxyXG4iXX0=