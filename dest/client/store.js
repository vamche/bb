define(['exports', 'redux', 'redux-thunk', 'app/reducers/appReducers'], function (exports, _redux, _reduxThunk, _appReducers) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

    var _appReducers2 = _interopRequireDefault(_appReducers);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var store = (0, _redux.createStore)(_appReducers2.default, (0, _redux.applyMiddleware)(_reduxThunk2.default));

    exports.default = store;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0b3JlLmpzIl0sIm5hbWVzIjpbInN0b3JlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUtBLFFBQU1BLFFBQVEsK0NBRVYsaURBRlUsQ0FBZDs7c0JBS2VBLEsiLCJmaWxlIjoic3RvcmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVTdG9yZSwgYXBwbHlNaWRkbGV3YXJlICB9IGZyb20gJ3JlZHV4J1xyXG5pbXBvcnQgdGh1bmsgZnJvbSAncmVkdXgtdGh1bmsnXHJcblxyXG5pbXBvcnQgQXBwUmVkdWNlcnMgZnJvbSAnYXBwL3JlZHVjZXJzL2FwcFJlZHVjZXJzJ1xyXG5cclxuY29uc3Qgc3RvcmUgPSBjcmVhdGVTdG9yZShcclxuICAgIEFwcFJlZHVjZXJzLFxyXG4gICAgYXBwbHlNaWRkbGV3YXJlKHRodW5rKVxyXG4pXHJcblxyXG5leHBvcnQgZGVmYXVsdCBzdG9yZTtcclxuIl19