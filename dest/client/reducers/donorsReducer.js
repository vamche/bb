define(['exports', '../actions/actionTypes', 'lodash'], function (exports, _actionTypes, _lodash) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.copy = copy;

  var types = _interopRequireWildcard(_actionTypes);

  var _lodash2 = _interopRequireDefault(_lodash);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};

      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
        }
      }

      newObj.default = obj;
      return newObj;
    }
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var initialState = {
    donors: [],
    filters: [{ id: 'A+', selected: true, text: 'A+' }, { id: 'A-', selected: true, text: 'A-' }, { id: 'B+', selected: true, text: 'B+' }, { id: 'B-', selected: true, text: 'B-' }, { id: 'AB+', selected: true, text: 'AB+' }, { id: 'AB-', selected: true, text: 'AB-' }, { id: 'O+', selected: true, text: 'O+' }, { id: 'O-', selected: true, text: 'O-' }],
    donorEditable: {}
  };

  function copy(o) {
    var output, v, key;
    output = Array.isArray(o) ? [] : {};
    for (key in o) {
      v = o[key];
      output[key] = (typeof v === 'undefined' ? 'undefined' : _typeof(v)) === "object" ? copy(v) : v;
    }
    return output;
  };

  var donorsReducer = function donorsReducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments[1];

    var newDonors = [];
    switch (action.type) {

      case types.GET_DONORS_SUCCESS:
        return Object.assign({}, state, { donors: action.donors });

      case types.ADD_DONOR_SUCCESS:
        newDonors = state.donors.concat([action.donor]);
        return Object.assign({}, state, { donors: newDonors });

      case types.DELETE_DONOR_SUCCESS:
        // Using lodash to create a new donor array without the donor we want to remove
        newDonors = _lodash2.default.filter(state.donors, function (donor) {
          return donor._id != action.donor._id;
        });
        return Object.assign({}, state, { donors: newDonors, donorEditable: {} });

      case types.UPDATE_DONOR_SUCCESS:
        // Using lodash to create a new donor array without the donor we want to update
        newDonors = _lodash2.default.filter(state.donors, function (donor) {
          return donor._id != action.donor._id;
        });
        // add the donor to the array
        var updatedDonors = newDonors.concat([action.donor]);
        return Object.assign({}, state, { donors: updatedDonors, donorEditable: {} });

      case types.GET_DONOR_DETAILS_SUCCESS:
        return Object.assign({}, state, { donorEditable: action.donor });

      case types.ADD_DONOR_TO_LIST:
        newDonors = state.donors.concat([action.donor]);
        return Object.assign({}, state, { donors: newDonors });

      case types.DELETE_DONOR_FROM_LIST:
        // Using lodash to create a new donor array without the donor we want to remove
        newDonors = _lodash2.default.filter(state.donors, function (donor) {
          return donor._id != action.donorId;
        });
        return Object.assign({}, state, { donors: newDonors });

      case types.UPDATE_DONOR_IN_LIST:
        // Using lodash to create a new donor array without the donor we want to update
        newDonors = _lodash2.default.filter(state.donors, function (donor) {
          return donor._id != action.donor._id;
        });
        // add the donor to the array
        newDonors.push(action.donor);
        return Object.assign({}, state, { donors: newDonors });

      case types.TOGGLE_FILTER:

        var index = _lodash2.default.findIndex(state.filters, { id: action.filterItem.id });
        var newFilters = copy(state.filters);
        newFilters[index]['selected'] = !newFilters[index]['selected'];
        return Object.assign({}, state, { filters: newFilters });
    }

    return state;
  };

  exports.default = donorsReducer;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlZHVjZXJzXFxkb25vcnNSZWR1Y2VyLmpzIl0sIm5hbWVzIjpbImNvcHkiLCJ0eXBlcyIsImluaXRpYWxTdGF0ZSIsImRvbm9ycyIsImZpbHRlcnMiLCJpZCIsInNlbGVjdGVkIiwidGV4dCIsImRvbm9yRWRpdGFibGUiLCJvIiwib3V0cHV0IiwidiIsImtleSIsIkFycmF5IiwiaXNBcnJheSIsImRvbm9yc1JlZHVjZXIiLCJzdGF0ZSIsImFjdGlvbiIsIm5ld0Rvbm9ycyIsInR5cGUiLCJHRVRfRE9OT1JTX1NVQ0NFU1MiLCJPYmplY3QiLCJhc3NpZ24iLCJBRERfRE9OT1JfU1VDQ0VTUyIsImNvbmNhdCIsImRvbm9yIiwiREVMRVRFX0RPTk9SX1NVQ0NFU1MiLCJmaWx0ZXIiLCJfaWQiLCJVUERBVEVfRE9OT1JfU1VDQ0VTUyIsInVwZGF0ZWREb25vcnMiLCJHRVRfRE9OT1JfREVUQUlMU19TVUNDRVNTIiwiQUREX0RPTk9SX1RPX0xJU1QiLCJERUxFVEVfRE9OT1JfRlJPTV9MSVNUIiwiZG9ub3JJZCIsIlVQREFURV9ET05PUl9JTl9MSVNUIiwicHVzaCIsIlRPR0dMRV9GSUxURVIiLCJpbmRleCIsImZpbmRJbmRleCIsImZpbHRlckl0ZW0iLCJuZXdGaWx0ZXJzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7VUFrQmdCQSxJLEdBQUFBLEk7O01BbEJKQyxLOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHWixNQUFNQyxlQUFlO0FBQ25CQyxZQUFTLEVBRFU7QUFFbkJDLGFBQVUsQ0FDQyxFQUFDQyxJQUFJLElBQUwsRUFBV0MsVUFBVSxJQUFyQixFQUEyQkMsTUFBTSxJQUFqQyxFQURELEVBRUMsRUFBQ0YsSUFBSSxJQUFMLEVBQVdDLFVBQVUsSUFBckIsRUFBMkJDLE1BQU0sSUFBakMsRUFGRCxFQUdDLEVBQUNGLElBQUksSUFBTCxFQUFXQyxVQUFVLElBQXJCLEVBQTJCQyxNQUFNLElBQWpDLEVBSEQsRUFJQyxFQUFDRixJQUFJLElBQUws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N0NKOztBQWdEQSxXQUFPekIsS0FBUDtBQUVELEdBcEREOztvQkFzRGVELGEiLCJmaWxlIjoicmVkdWNlcnNcXGRvbm9yc1JlZHVjZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB0eXBlcyBmcm9tICcuLi9hY3Rpb25zL2FjdGlvblR5cGVzJztcclxuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuXHJcbmNvbnN0IGluaXRpYWxTdGF0ZSA9IHtcclxuICBkb25vcnMgOiBbXSxcclxuICBmaWx0ZXJzIDogW1xyXG4gICAgICAgICAgICAge2lkOiAnQSsnLCBzZWxlY3RlZDogdHJ1ZSwgdGV4dDogJ0ErJ30sXHJcbiAgICAgICAgICAgICB7aWQ6ICdBLScsIHNlbGVjdGVkOiB0cnVlLCB0ZXh0OiAnQS0nfSxcclxuICAgICAgICAgICAgIHtpZDogJ0IrJywgc2VsZWN0ZWQ6IHRydWUsIHRleHQ6ICdCKyd9LFxyXG4gICAgICAgICAgICAge2lkOiAnQi0nLCBzZWxlY3RlZDogdHJ1ZSwgdGV4dDogJ0ItJ30sXHJcbiAgICAgICAgICAgICB7aWQ6ICdBQisnLCBzZWxlY3RlZDogdHJ1ZSwgdGV4dDogJ0FCKyd9LFxyXG4gICAgICAgICAgICAge2lkOiAnQUItJywgc2VsZWN0ZWQ6IHRydWUsIHRleHQ6ICdBQi0nfSxcclxuICAgICAgICAgICAgIHtpZDogJ08rJywgc2VsZWN0ZWQ6IHRydWUsIHRleHQ6ICdPKyd9LFxyXG4gICAgICAgICAgICAge2lkOiAnTy0nLCBzZWxlY3RlZDogdHJ1ZSwgdGV4dDogJ08tJ31cclxuICAgICAgICAgICAgXSxcclxuICBkb25vckVkaXRhYmxlIDoge31cclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjb3B5KG8pIHtcclxuICAgdmFyIG91dHB1dCwgdiwga2V5O1xyXG4gICBvdXRwdXQgPSBBcnJheS5pc0FycmF5KG8pID8gW10gOiB7fTtcclxuICAgZm9yIChrZXkgaW4gbykge1xyXG4gICAgICAgdiA9IG9ba2V5XTtcclxuICAgICAgIG91dHB1dFtrZXldID0gKHR5cGVvZiB2ID09PSBcIm9iamVjdFwiKSA/IGNvcHkodikgOiB2O1xyXG4gICB9XHJcbiAgIHJldHVybiBvdXRwdXQ7XHJcbn07XHJcblxyXG5jb25zdCBkb25vcnNSZWR1Y2VyID0gZnVuY3Rpb24oc3RhdGUgPSBpbml0aWFsU3RhdGUsIGFjdGlvbikge1xyXG4gIGxldCBuZXdEb25vcnMgPSBbXTtcclxuICBzd2l0Y2goYWN0aW9uLnR5cGUpIHtcclxuXHJcbiAgICBjYXNlIHR5cGVzLkdFVF9ET05PUlNfU1VDQ0VTUzpcclxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7IGRvbm9yczogYWN0aW9uLmRvbm9ycyB9KTtcclxuXHJcbiAgICBjYXNlIHR5cGVzLkFERF9ET05PUl9TVUNDRVNTOlxyXG4gICAgICBuZXdEb25vcnMgPSBzdGF0ZS5kb25vcnMuY29uY2F0KFthY3Rpb24uZG9ub3JdKTtcclxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7IGRvbm9yczogbmV3RG9ub3JzIH0pO1xyXG5cclxuICAgIGNhc2UgdHlwZXMuREVMRVRFX0RPTk9SX1NVQ0NFU1M6XHJcbiAgICAgIC8vIFVzaW5nIGxvZGFzaCB0byBjcmVhdGUgYSBuZXcgZG9ub3IgYXJyYXkgd2l0aG91dCB0aGUgZG9ub3Igd2Ugd2FudCB0byByZW1vdmVcclxuICAgICAgbmV3RG9ub3JzID0gXy5maWx0ZXIoc3RhdGUuZG9ub3JzLCBkb25vciA9PiBkb25vci5faWQgIT0gYWN0aW9uLmRvbm9yLl9pZCk7XHJcbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwgeyBkb25vcnM6IG5ld0Rvbm9ycywgZG9ub3JFZGl0YWJsZSA6IHt9fSk7XHJcblxyXG4gICAgY2FzZSB0eXBlcy5VUERBVEVfRE9OT1JfU1VDQ0VTUzpcclxuICAgICAgLy8gVXNpbmcgbG9kYXNoIHRvIGNyZWF0ZSBhIG5ldyBkb25vciBhcnJheSB3aXRob3V0IHRoZSBkb25vciB3ZSB3YW50IHRvIHVwZGF0ZVxyXG4gICAgICBuZXdEb25vcnMgPSBfLmZpbHRlcihzdGF0ZS5kb25vcnMsIGRvbm9yID0+IGRvbm9yLl9pZCAhPSBhY3Rpb24uZG9ub3IuX2lkKTtcclxuICAgICAgLy8gYWRkIHRoZSBkb25vciB0byB0aGUgYXJyYXlcclxuICAgICAgbGV0IHVwZGF0ZWREb25vcnMgPSBuZXdEb25vcnMuY29uY2F0KFthY3Rpb24uZG9ub3JdKTtcclxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7IGRvbm9yczogdXBkYXRlZERvbm9ycywgZG9ub3JFZGl0YWJsZSA6IHt9fSk7XHJcblxyXG4gICAgY2FzZSB0eXBlcy5HRVRfRE9OT1JfREVUQUlMU19TVUNDRVNTOlxyXG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHsgZG9ub3JFZGl0YWJsZTogYWN0aW9uLmRvbm9yIH0pO1xyXG5cclxuICAgIGNhc2UgdHlwZXMuQUREX0RPTk9SX1RPX0xJU1Q6XHJcbiAgICAgIG5ld0Rvbm9ycyA9IHN0YXRlLmRvbm9ycy5jb25jYXQoW2FjdGlvbi5kb25vcl0pO1xyXG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHsgZG9ub3JzOiBuZXdEb25vcnMgfSk7XHJcblxyXG4gICAgY2FzZSB0eXBlcy5ERUxFVEVfRE9OT1JfRlJPTV9MSVNUOlxyXG4gICAgICAvLyBVc2luZyBsb2Rhc2ggdG8gY3JlYXRlIGEgbmV3IGRvbm9yIGFycmF5IHdpdGhvdXQgdGhlIGRvbm9yIHdlIHdhbnQgdG8gcmVtb3ZlXHJcbiAgICAgIG5ld0Rvbm9ycyA9IF8uZmlsdGVyKHN0YXRlLmRvbm9ycywgZG9ub3IgPT4gZG9ub3IuX2lkICE9IGFjdGlvbi5kb25vcklkKTtcclxuICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7IGRvbm9yczogbmV3RG9ub3JzIH0pO1xyXG5cclxuICAgIGNhc2UgdHlwZXMuVVBEQVRFX0RPTk9SX0lOX0xJU1Q6XHJcbiAgICAgIC8vIFVzaW5nIGxvZGFzaCB0byBjcmVhdGUgYSBuZXcgZG9ub3IgYXJyYXkgd2l0aG91dCB0aGUgZG9ub3Igd2Ugd2FudCB0byB1cGRhdGVcclxuICAgICAgbmV3RG9ub3JzID0gXy5maWx0ZXIoc3RhdGUuZG9ub3JzLCBkb25vciA9PiBkb25vci5faWQgIT0gYWN0aW9uLmRvbm9yLl9pZCk7XHJcbiAgICAgIC8vIGFkZCB0aGUgZG9ub3IgdG8gdGhlIGFycmF5XHJcbiAgICAgIG5ld0Rvbm9ycy5wdXNoKGFjdGlvbi5kb25vcik7XHJcbiAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwgeyBkb25vcnM6IG5ld0Rvbm9ycyB9KTtcclxuXHJcbiAgICBjYXNlIHR5cGVzLlRPR0dMRV9GSUxURVI6XHJcblxyXG4gICAgICBjb25zdCBpbmRleCA9IF8uZmluZEluZGV4KHN0YXRlLmZpbHRlcnMsIHsgaWQ6IGFjdGlvbi5maWx0ZXJJdGVtLmlkIH0pO1xyXG4gICAgICBsZXQgbmV3RmlsdGVycyA9IGNvcHkoc3RhdGUuZmlsdGVycyk7XHJcbiAgICAgIG5ld0ZpbHRlcnNbaW5kZXhdWydzZWxlY3RlZCddID0gIW5ld0ZpbHRlcnNbaW5kZXhdWydzZWxlY3RlZCddO1xyXG4gICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHsgZmlsdGVyczogbmV3RmlsdGVycyB9KTtcclxuICB9XHJcblxyXG4gIHJldHVybiBzdGF0ZTtcclxuXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRvbm9yc1JlZHVjZXI7XHJcbiJdfQ==