define(['exports', 'react', 'react-dom', 'react-redux', 'esri/Map', 'esri/views/MapView', 'esri/core/watchUtils', 'app/api/donorsAPI', 'app/actions/donorActions', 'app/components/FiltersList'], function (exports, _react, _reactDom, _reactRedux, _Map, _MapView, _watchUtils, _donorsAPI, _donorActions, _FiltersList) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _react2 = _interopRequireDefault(_react);

    var _reactDom2 = _interopRequireDefault(_reactDom);

    var _Map2 = _interopRequireDefault(_Map);

    var _MapView2 = _interopRequireDefault(_MapView);

    var _watchUtils2 = _interopRequireDefault(_watchUtils);

    var _FiltersList2 = _interopRequireDefault(_FiltersList);

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

    var mapStateToProps = function mapStateToProps(state) {
        return {
            filters: state.donorsReducer.filters
        };
    };

    var mapDispatchToProps = function mapDispatchToProps(dispatch) {
        return {
            toggleFilter: function toggleFilter(filterItem) {
                dispatch((0, _donorActions.toggleFilter)(filterItem));
            }
        };
    };

    var Info = function (_Component) {
        _inherits(Info, _Component);

        function Info(props) {
            _classCallCheck(this, Info);

            var _this = _possibleConstructorReturn(this, (Info.__proto__ || Object.getPrototypeOf(Info)).call(this, props));

            _this.onClickFilterButton = _this.onClickFilterButton.bind(_this);
            return _this;
        }

        _createClass(Info, [{
            key: 'onClickFilterButton',
            value: function onClickFilterButton() {
                var filtersDiv = this.refs.filterByBloodGroup;
                filtersDiv.style.display = filtersDiv.style.display == '' ? 'block' : filtersDiv.style.display == 'block' ? 'none' : 'block';
            }
        }, {
            key: 'render',
            value: function render() {
                return _react2.default.createElement(
                    'div',
                    { id: 'info' },
                    _react2.default.createElement(
                        'h1',
                        { className: 'logo' },
                        'Blood  ',
                        _react2.default.createElement('br', null),
                        'Bank'
                    ),
                    _react2.default.createElement(
                        'div',
                        { ref: 'filterByBloodGroup', className: 'bloodGroupFilters' },
                        _react2.default.createElement(_FiltersList2.default, { filters: this.props.filters, onFilterClick: this.props.toggleFilter })
                    ),
                    _react2.default.createElement(
                        'button',
                        { className: 'btnFilter', onClick: this.onClickFilterButton },
                        _react2.default.createElement('i', { className: 'fa fa-filter', 'aria-hidden': 'true' })
                    )
                );
            }
        }]);

        return Info;
    }(_react.Component);

    exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Info);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRhaW5lcnNcXGluZm9Db250YWluZXIuanN4Il0sIm5hbWVzIjpbIm1hcFN0YXRlVG9Qcm9wcyIsInN0YXRlIiwiZmlsdGVycyIsImRvbm9yc1JlZHVjZXIiLCJtYXBEaXNwYXRjaFRvUHJvcHMiLCJkaXNwYXRjaCIsInRvZ2dsZUZpbHRlciIsImZpbHRlckl0ZW0iLCJJbmZvIiwicHJvcHMiLCJvbkNsaWNrRmlsdGVyQnV0dG9uIiwiYmluZCIsImZpbHRlcnNEaXYiLCJyZWZzIiwiZmlsdGVyQnlCbG9vZEdyb3VwIiwic3R5bGUiLCJkaXNwbGF5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBWUEsUUFBTUEsa0JBQWtCLFNBQWxCQSxlQUFrQixDQUFDQyxLQUFELEVBQVc7QUFDL0IsZUFBTztBQUNIQyxxQkFBVUQsTUFBTUUsYUFBTixDQUFvQkQ7QUFEM0IsU0FBUDtBQUdILEtBSkQ7O0FBTUEsUUFBTUUscUJBQXFCLFNBQXJCQSxrQkFBcUIsQ0FBQ0MsUUFBRCxFQUFjO0FBQ3JDLGVBQU87QUFDSEMsMEJBQWMsc0JBQUNDLFVBQUQsRUFBZ0I7QUFDMUJGLHlCQUFTLGdDQUFhRSxVQUFiLENBQVQ7QUFDSDtBQUhFLFNBQVA7QUFLSCxLQU5EOztRQVFNQyxJOzs7QUFFSCxzQkFBWUMsS0FBWixFQUFrQjtBQUFBOztBQUFBLG9IQUNUQSxLQURTOztBQUVmLGtCQUFLQyxtQkFBTCxHQUEyQixNQUFLQSxtQkFBTCxDQUF5QkMsSUFBekIsT0FBM0I7QUFGZTtBQUdqQjs7OztrREFFb0I7QUFDbEIsb0JBQUlDLGFBQWEsS0FBS0MsSUFBTCxDQUFVQyxrQkFBM0I7QUFDQUYsMkJBQVdHLEtBQVgsQ0FBaUJDLE9BQWpCLEdBQTJCSixXQUFXRyxLQUFYLENBQWlCQyxPQUFqQixJQUE0QixFQUE1QixHQUFpQyxPQUFqQyxHQUNnQ0osV0FBV0csS0FBWCxDQUFpQkMsT0FBakIsSUFBNEIsT0FBNUIsR0FBc0MsTUFBdEMsR0FBK0MsT0FEMUc7QUFFRjs7O3FDQUVTO0FBQ0wsdUJBQ0k7QUFBQTtBQUFBLHNCQUFLLElBQUcsTUFBUjtBQUNNO0FBQUE7QUFBQSwwQkFBSSxXQUFVLE1BQWQ7QUFBQTtBQUE0QixpRUFBNUI7QUFBQTtBQUFBLHFCQUROO0FBSU07QUFBQTtBQUFBLDBCQUFLLEtBQUksb0JBQVQsRUFBOEIsV0FBVSxtQkFBeEM7QUFDRSwrRUFBYSxTQUFTLEtBQUtQLEtBQUwsQ0FBV1AsT0FBakMsRUFBMEMsZUFBZSxLQUFLTyxLQUFMLENBQVdILFlBQXBFO0FBREYscUJBSk47QUFPTTtBQUFBO0FBQUEsMEJBQVEsV0FBVSxXQUFsQixFQUE4QixTQUFTLEtBQUtJLG1CQUE1QztBQUNFLDZEQUFHLFdBQVUsY0FBYixFQUE0QixlQUFZLE1BQXhDO0FBREY7QUFQTixpQkFESjtBQWFIOzs7Ozs7c0JBR1UseUJBQVFWLGVBQVIsRUFBeUJJLGtCQUF6QixFQUE2Q0ksSUFBN0MsQyIsImZpbGUiOiJjb250YWluZXJzXFxpbmZvQ29udGFpbmVyLmpzeCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyBDb21wb25lbnQgfSBmcm9tICdyZWFjdCdcclxuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSdcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4J1xyXG5pbXBvcnQgTWFwIGZyb20gXCJlc3JpL01hcFwiXHJcbmltcG9ydCBNYXBWaWV3IGZyb20gXCJlc3JpL3ZpZXdzL01hcFZpZXdcIlxyXG5pbXBvcnQgd2F0Y2hVdGlscyBmcm9tICdlc3JpL2NvcmUvd2F0Y2hVdGlscydcclxuXHJcbmltcG9ydCB7IGdldERvbm9ycyB9IGZyb20gJ2FwcC9hcGkvZG9ub3JzQVBJJ1xyXG5pbXBvcnQgeyAgdG9nZ2xlRmlsdGVyIH0gZnJvbSAnYXBwL2FjdGlvbnMvZG9ub3JBY3Rpb25zJ1xyXG5cclxuaW1wb3J0IEZpbHRlcnNMaXN0IGZyb20gJ2FwcC9jb21wb25lbnRzL0ZpbHRlcnNMaXN0J1xyXG5cclxuY29uc3QgbWFwU3RhdGVUb1Byb3BzID0gKHN0YXRlKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGZpbHRlcnMgOiBzdGF0ZS5kb25vcnNSZWR1Y2VyLmZpbHRlcnNcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgbWFwRGlzcGF0Y2hUb1Byb3BzID0gKGRpc3BhdGNoKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHRvZ2dsZUZpbHRlcjogKGZpbHRlckl0ZW0pID0+IHtcclxuICAgICAgICAgICAgZGlzcGF0Y2godG9nZ2xlRmlsdGVyKGZpbHRlckl0ZW0pKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgSW5mbyBleHRlbmRzIENvbXBvbmVudCB7XHJcblxyXG4gICBjb25zdHJ1Y3Rvcihwcm9wcyl7XHJcbiAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgdGhpcy5vbkNsaWNrRmlsdGVyQnV0dG9uID0gdGhpcy5vbkNsaWNrRmlsdGVyQnV0dG9uLmJpbmQodGhpcyk7XHJcbiAgIH1cclxuXHJcbiAgIG9uQ2xpY2tGaWx0ZXJCdXR0b24oKXtcclxuICAgICAgbGV0IGZpbHRlcnNEaXYgPSB0aGlzLnJlZnMuZmlsdGVyQnlCbG9vZEdyb3VwO1xyXG4gICAgICBmaWx0ZXJzRGl2LnN0eWxlLmRpc3BsYXkgPSBmaWx0ZXJzRGl2LnN0eWxlLmRpc3BsYXkgPT0gJycgPyAnYmxvY2snIDogXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZmlsdGVyc0Rpdi5zdHlsZS5kaXNwbGF5ID09ICdibG9jaycgPyAnbm9uZScgOiAnYmxvY2snKSA7XHJcbiAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBpZD0naW5mbyc+XHJcbiAgICAgICAgICAgICAgICAgIDxoMSBjbGFzc05hbWU9XCJsb2dvXCI+Qmxvb2QgIDxici8+XHJcbiAgICAgICAgICAgICAgICAgICAgQmFua1xyXG4gICAgICAgICAgICAgICAgICA8L2gxPlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IHJlZj1cImZpbHRlckJ5Qmxvb2RHcm91cFwiIGNsYXNzTmFtZT1cImJsb29kR3JvdXBGaWx0ZXJzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPEZpbHRlcnNMaXN0IGZpbHRlcnM9e3RoaXMucHJvcHMuZmlsdGVyc30gb25GaWx0ZXJDbGljaz17dGhpcy5wcm9wcy50b2dnbGVGaWx0ZXJ9Lz5cclxuICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuRmlsdGVyXCIgb25DbGljaz17dGhpcy5vbkNsaWNrRmlsdGVyQnV0dG9ufT5cclxuICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJmYSBmYS1maWx0ZXJcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzLCBtYXBEaXNwYXRjaFRvUHJvcHMpKEluZm8pXHJcbiJdfQ==