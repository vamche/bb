define(['exports', '../actions/actionTypes'], function (exports, _actionTypes) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.getDonorsSuccess = getDonorsSuccess;
  exports.getDonorDetailsSuccess = getDonorDetailsSuccess;
  exports.addDonorSuccess = addDonorSuccess;
  exports.updateDonorSuccess = updateDonorSuccess;
  exports.deleteDonorSuccess = deleteDonorSuccess;
  exports.toggleFilter = toggleFilter;
  exports.addDonorToList = addDonorToList;
  exports.updateDonorInList = updateDonorInList;
  exports.deleteDonorFromList = deleteDonorFromList;

  var actionTypes = _interopRequireWildcard(_actionTypes);

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

  function getDonorsSuccess(donors) {
    return {
      type: actionTypes.GET_DONORS_SUCCESS,
      donors: donors
    };
  }

  function getDonorDetailsSuccess(donor) {
    return {
      type: actionTypes.GET_DONOR_DETAILS_SUCCESS,
      donor: donor
    };
  }

  function addDonorSuccess(donor) {
    return {
      type: actionTypes.ADD_DONOR_SUCCESS,
      donor: donor
    };
  }

  function updateDonorSuccess(donor) {
    return {
      type: actionTypes.UPDATE_DONOR_SUCCESS,
      donor: donor
    };
  }

  function deleteDonorSuccess(donor) {
    return {
      type: actionTypes.DELETE_DONOR_SUCCESS,
      donor: donor
    };
  }

  function toggleFilter(filterItem) {
    return {
      type: actionTypes.TOGGLE_FILTER,
      filterItem: filterItem
    };
  }

  function addDonorToList(donor) {
    return {
      type: actionTypes.ADD_DONOR_TO_LIST,
      donor: donor
    };
  }

  function updateDonorInList(donor) {
    return {
      type: actionTypes.UPDATE_DONOR_IN_LIST,
      donor: donor
    };
  }

  function deleteDonorFromList(donorId) {
    return {
      type: actionTypes.DELETE_DONOR_FROM_LIST,
      donorId: donorId
    };
  }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFjdGlvbnNcXGRvbm9yQWN0aW9ucy5qcyJdLCJuYW1lcyI6WyJnZXREb25vcnNTdWNjZXNzIiwiZ2V0RG9ub3JEZXRhaWxzU3VjY2VzcyIsImFkZERvbm9yU3VjY2VzcyIsInVwZGF0ZURvbm9yU3VjY2VzcyIsImRlbGV0ZURvbm9yU3VjY2VzcyIsInRvZ2dsZUZpbHRlciIsImFkZERvbm9yVG9MaXN0IiwidXBkYXRlRG9ub3JJbkxpc3QiLCJkZWxldGVEb25vckZyb21MaXN0IiwiYWN0aW9uVHlwZXMiLCJkb25vcnMiLCJ0eXBlIiwiR0VUX0RPTk9SU19TVUNDRVNTIiwiZG9ub3IiLCJHRVRfRE9OT1JfREVUQUlMU19TVUNDRVNTIiwiQUREX0RPTk9SX1NVQ0NFU1MiLCJVUERBVEVfRE9OT1JfU1VDQ0VTUyIsIkRFTEVURV9ET05PUl9TVUNDRVNTIiwiZmlsdGVySXRlbSIsIlRPR0dMRV9GSUxURVIiLCJBRERfRE9OT1JfVE9fTElTVCIsIlVQREFURV9ET05PUl9JTl9MSVNUIiwiZG9ub3JJZCIsIkRFTEVURV9ET05PUl9GUk9NX0xJU1QiXSwibWFwcGluZ3MiOiI7Ozs7OztVQUVnQkEsZ0IsR0FBQUEsZ0I7VUFPQUMsc0IsR0FBQUEsc0I7VUFPQUMsZSxHQUFBQSxlO1VBT0FDLGtCLEdBQUFBLGtCO1VBT0FDLGtCLEdBQUFBLGtCO1VBT0FDLFksR0FBQUEsWTtVQVFBQyxjLEdBQUFBLGM7VUFPQUMsaUIsR0FBQUEsaUI7VUFPQUMsbUIsR0FBQUEsbUI7O01BM0RKQyxXOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUwsV0FBU1QsZ0JBQVQsQ0FBMEJVLE1BQTFCLEVBQWlDO0FBQ3BDLFdBQU07QUFDSkMsWUFBT0YsWUFBWUcsa0JBRGY7QUFFSkY7QUFGSSxLQUFOO0FBSUg7O0FBRU0sV0FBU1Qsc0JBQVQsQ0FBZ0NZLEtBQWhDLEVBQXNDO0FBQ3pDLFdBQU07QUFDSkYsWUFBT0YsWUFBWUsseUJBRGY7QUFFSkQ7QUFGSSxLQUFOO0FBSUg7O0FBRU0sV0FBU1gsZUFBVCxDQUF5QlcsS0FBekIsRUFBK0I7QUFDbEMsV0FBTTtBQUNKRixZQUFPRixZQUFZTSxpQkFEZjtBQUVKRjtBQUZJLEtBQU47QUFJSDs7QUFFTSxXQUFTVixrQkFBVCxDQUE0QlUsS0FBNUIsRUFBa0M7QUFDckMsV0FBTTtBQUNKRixZQUFPRixZQUFZTyxvQkFEZjtBQUVKSDtBQUZJLEtBQU47QUFJSDs7QUFFTSxXQUFTVCxrQkFBVCxDQUE0QlMsS0FBNUIsRUFBa0M7QUFDckMsV0FBTTtBQUNKRixZQUFPRixZQUFZUSxvQkFEZjtBQUVKSjtBQUZJLEtBQU47QUFJSDs7QUFFTSxXQUFTUixZQUFULENBQXNCYSxVQUF0QixFQUFpQztBQUNwQyxXQUFNO0FBQ0pQLFlBQU9GLFlBQVlVLGFBRGY7QUFFSkQ7QUFGSSxLQUFOO0FBSUg7O0FBR00sV0FBU1osY0FBVCxDQUF3Qk8sS0FBeEIsRUFBOEI7QUFDakMsV0FBTTtBQUNKRixZQUFPRixZQUFZVyxpQkFEZjtBQUVKUDtBQUZJLEtBQU47QUFJSDs7QUFFTSxXQUFTTixpQkFBVCxDQUEyQk0sS0FBM0IsRUFBaUM7QUFDcEMsV0FBTTtBQUNKRixZQUFPRixZQUFZWSxvQkFEZjtBQUVKUjtBQUZJLEtBQU47QUFJSDs7QUFFTSxXQUFTTCxtQkFBVCxDQUE2QmMsT0FBN0IsRUFBcUM7QUFDeEMsV0FBTTtBQUNKWCxZQUFPRixZQUFZYyxzQkFEZjtBQUVKRDtBQUZJLEtBQU47QUFJSCIsImZpbGUiOiJhY3Rpb25zXFxkb25vckFjdGlvbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBhY3Rpb25UeXBlcyBmcm9tICcuLi9hY3Rpb25zL2FjdGlvblR5cGVzJztcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXREb25vcnNTdWNjZXNzKGRvbm9ycyl7XHJcbiAgICByZXR1cm57XHJcbiAgICAgIHR5cGU6ICBhY3Rpb25UeXBlcy5HRVRfRE9OT1JTX1NVQ0NFU1MsXHJcbiAgICAgIGRvbm9yc1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0RG9ub3JEZXRhaWxzU3VjY2Vzcyhkb25vcil7XHJcbiAgICByZXR1cm57XHJcbiAgICAgIHR5cGU6ICBhY3Rpb25UeXBlcy5HRVRfRE9OT1JfREVUQUlMU19TVUNDRVNTLFxyXG4gICAgICBkb25vclxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYWRkRG9ub3JTdWNjZXNzKGRvbm9yKXtcclxuICAgIHJldHVybntcclxuICAgICAgdHlwZTogIGFjdGlvblR5cGVzLkFERF9ET05PUl9TVUNDRVNTLFxyXG4gICAgICBkb25vclxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlRG9ub3JTdWNjZXNzKGRvbm9yKXtcclxuICAgIHJldHVybntcclxuICAgICAgdHlwZTogIGFjdGlvblR5cGVzLlVQREFURV9ET05PUl9TVUNDRVNTLFxyXG4gICAgICBkb25vclxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZGVsZXRlRG9ub3JTdWNjZXNzKGRvbm9yKXtcclxuICAgIHJldHVybntcclxuICAgICAgdHlwZTogIGFjdGlvblR5cGVzLkRFTEVURV9ET05PUl9TVUNDRVNTLFxyXG4gICAgICBkb25vclxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdG9nZ2xlRmlsdGVyKGZpbHRlckl0ZW0pe1xyXG4gICAgcmV0dXJue1xyXG4gICAgICB0eXBlOiAgYWN0aW9uVHlwZXMuVE9HR0xFX0ZJTFRFUixcclxuICAgICAgZmlsdGVySXRlbVxyXG4gICAgfVxyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFkZERvbm9yVG9MaXN0KGRvbm9yKXtcclxuICAgIHJldHVybntcclxuICAgICAgdHlwZTogIGFjdGlvblR5cGVzLkFERF9ET05PUl9UT19MSVNULFxyXG4gICAgICBkb25vclxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlRG9ub3JJbkxpc3QoZG9ub3Ipe1xyXG4gICAgcmV0dXJue1xyXG4gICAgICB0eXBlOiAgYWN0aW9uVHlwZXMuVVBEQVRFX0RPTk9SX0lOX0xJU1QsXHJcbiAgICAgIGRvbm9yXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkZWxldGVEb25vckZyb21MaXN0KGRvbm9ySWQpe1xyXG4gICAgcmV0dXJue1xyXG4gICAgICB0eXBlOiAgYWN0aW9uVHlwZXMuREVMRVRFX0RPTk9SX0ZST01fTElTVCxcclxuICAgICAgZG9ub3JJZFxyXG4gICAgfVxyXG59XHJcbiJdfQ==