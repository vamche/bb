define(['exports', 'redux', '../reducers/donorsReducer'], function (exports, _redux, _donorsReducer) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _donorsReducer2 = _interopRequireDefault(_donorsReducer);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var AppReducers = (0, _redux.combineReducers)({
        donorsReducer: _donorsReducer2.default
    });

    exports.default = AppReducers;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlZHVjZXJzXFxhcHBSZWR1Y2Vycy5qcyJdLCJuYW1lcyI6WyJBcHBSZWR1Y2VycyIsImRvbm9yc1JlZHVjZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUdBLFFBQU1BLGNBQWMsNEJBQWdCO0FBQ2hDQztBQURnQyxLQUFoQixDQUFwQjs7c0JBSWVELFciLCJmaWxlIjoicmVkdWNlcnNcXGFwcFJlZHVjZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY29tYmluZVJlZHVjZXJzIH0gZnJvbSAncmVkdXgnXHJcbmltcG9ydCBkb25vcnNSZWR1Y2VyIGZyb20gJy4uL3JlZHVjZXJzL2Rvbm9yc1JlZHVjZXInXHJcblxyXG5jb25zdCBBcHBSZWR1Y2VycyA9IGNvbWJpbmVSZWR1Y2Vycyh7XHJcbiAgICBkb25vcnNSZWR1Y2VyXHJcbn0pXHJcblxyXG5leHBvcnQgZGVmYXVsdCBBcHBSZWR1Y2Vyc1xyXG4iXX0=