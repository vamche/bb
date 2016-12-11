define(['exports', 'axios', 'app/store', '../actions/donorActions'], function (exports, _axios, _store, _donorActions) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.getDonors = getDonors;
  exports.addDonor = addDonor;
  exports.getDonorDetails = getDonorDetails;
  exports.deleteDonor = deleteDonor;
  exports.updateDonor = updateDonor;

  var _axios2 = _interopRequireDefault(_axios);

  var _store2 = _interopRequireDefault(_store);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var backendURL = 'api/donors';

  /**
   * Get all the donors in the visible extent
   */
  function getDonors(extent) {
    return _axios2.default.get(backendURL, {
      params: {
        latMin: extent.ymin,
        lonMin: extent.xmin,
        latMax: extent.ymax,
        lonMax: extent.xmax
      }
    }).then(function (response) {
      _store2.default.dispatch((0, _donorActions.getDonorsSuccess)(response.data));
      return response;
    });
  }

  /**
   * Add the donor
   */
  function addDonor(donor, callback) {
    return _axios2.default.post(backendURL, donor).then(function (response) {
      _store2.default.dispatch((0, _donorActions.addDonorSuccess)(response.data));
      callback(response.data);
      return response;
    });
  }

  /**
   * Get the donor details
   */
  function getDonorDetails(donorId, callback) {
    return _axios2.default.get(backendURL + '/' + donorId).then(function (response) {
      _store2.default.dispatch((0, _donorActions.getDonorDetailsSuccess)(response.data));
      //callback(response.data);
      return response;
    });
  }

  /**
   * Delete the donor details
   */
  function deleteDonor(donorId, callback) {
    return _axios2.default.delete(backendURL + '/' + donorId).then(function (response) {
      _store2.default.dispatch((0, _donorActions.deleteDonorSuccess)(response.data));
      callback(response.data);
      return response;
    });
  }

  /**
   * Update the donor details
   */
  function updateDonor(donor, callback) {
    return _axios2.default.put(backendURL + '/' + donor._id, donor).then(function (response) {
      _store2.default.dispatch((0, _donorActions.updateDonorSuccess)(response.data));
      callback(response.data);
      return response;
    });
  }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwaVxcZG9ub3JzQVBJLmpzIl0sIm5hbWVzIjpbImdldERvbm9ycyIsImFkZERvbm9yIiwiZ2V0RG9ub3JEZXRhaWxzIiwiZGVsZXRlRG9ub3IiLCJ1cGRhdGVEb25vciIsImJhY2tlbmRVUkwiLCJleHRlbnQiLCJnZXQiLCJwYXJhbXMiLCJsYXRNaW4iLCJ5bWluIiwibG9uTWluIiwieG1pbiIsImxhdE1heCIsInltYXgiLCJsb25NYXgiLCJ4bWF4IiwidGhlbiIsImRpc3BhdGNoIiwicmVzcG9uc2UiLCJkYXRhIiwiZG9ub3IiLCJjYWxsYmFjayIsInBvc3QiLCJkb25vcklkIiwiZGVsZXRlIiwicHV0IiwiX2lkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7VUFTZ0JBLFMsR0FBQUEsUztVQWtCQUMsUSxHQUFBQSxRO1VBWUFDLGUsR0FBQUEsZTtVQVlBQyxXLEdBQUFBLFc7VUFXQUMsVyxHQUFBQSxXOzs7Ozs7Ozs7Ozs7QUExRGhCLE1BQU1DLGFBQWEsWUFBbkI7O0FBRUE7OztBQUdPLFdBQVNMLFNBQVQsQ0FBbUJNLE1BQW5CLEVBQTBCO0FBQzlCLFdBQU8sZ0JBQU1DLEdBQU4sQ0FBVUYsVUFBVixFQUFzQjtBQUNoQkcsY0FBUTtBQUNOQyxnQkFBUUgsT0FBT0ksSUFEVDtBQUVOQyxnQkFBUUwsT0FBT00sSUFGVDtBQUdOQyxnQkFBUVAsT0FBT1EsSUFIVDtBQUlOQyxnQkFBUVQsT0FBT1U7QUFKVDtBQURRLEtBQXRCLEVBUU1DLElBUk4sQ0FRVyxvQkFBWTtBQUNmLHNCQUFNQyxRQUFOLENBQWUsb0NBQWlCQyxTQUFTQyxJQUExQixDQUFmO0FBQ0EsYUFBT0QsUUFBUDtBQUNGLEtBWE4sQ0FBUDtBQVlGOztBQUVEOzs7QUFHTyxXQUFTbEIsUUFBVCxDQUFrQm9CLEtBQWxCLEVBQXlCQyxRQUF6QixFQUFrQztBQUN2QyxXQUFPLGdCQUFNQyxJQUFOLENBQVdsQixVQUFYLEVBQXVCZ0IsS0FBdkIsRUFBOEJKLElBQTlCLENBQW1DLG9CQUFZO0FBQ3JDLHNCQUFNQyxRQUFOLENBQWUsbUNBQWdCQyxTQUFTQyxJQUF6QixDQUFmO0FBQ0FFLGVBQVNILFNBQVNDLElBQWxCO0FBQ0EsYUFBT0QsUUFBUDtBQUNGLEtBSlIsQ0FBUDtBQU1EOztBQUVEOzs7QUFHTyxXQUFTakIsZUFBVCxDQUF5QnNCLE9BQXpCLEVBQWtDRixRQUFsQyxFQUEyQztBQUNoRCxXQUFPLGdCQUFNZixHQUFOLENBQVVGLGFBQVksR0FBWixHQUFpQm1CLE9BQTNCLEVBQW9DUCxJQUFwQyxDQUF5QyxvQkFBWTtBQUMzQyxzQkFBTUMsUUFBTixDQUFlLDBDQUF1QkMsU0FBU0MsSUFBaEMsQ0FBZjtBQUNBO0FBQ0EsYUFBT0QsUUFBUDtBQUNGLEtBSlIsQ0FBUDtBQUtEOztBQUdEOzs7QUFHTyxXQUFTaEIsV0FBVCxDQUFxQnFCLE9BQXJCLEVBQThCRixRQUE5QixFQUF1QztBQUM1QyxXQUFPLGdCQUFNRyxNQUFOLENBQWFwQixhQUFZLEdBQVosR0FBaUJtQixPQUE5QixFQUF1Q1AsSUFBdkMsQ0FBNEMsb0JBQVk7QUFDOUMsc0JBQU1DLFFBQU4sQ0FBZSxzQ0FBbUJDLFNBQVNDLElBQTVCLENBQWY7QUFDQUUsZUFBU0gsU0FBU0MsSUFBbEI7QUFDQSxhQUFPRCxRQUFQO0FBQ0YsS0FKUixDQUFQO0FBS0Q7O0FBRUQ7OztBQUdPLFdBQVNmLFdBQVQsQ0FBcUJpQixLQUFyQixFQUE0QkMsUUFBNUIsRUFBcUM7QUFDMUMsV0FBTyxnQkFBTUksR0FBTixDQUFVckIsYUFBWSxHQUFaLEdBQWlCZ0IsTUFBTU0sR0FBakMsRUFBc0NOLEtBQXRDLEVBQTZDSixJQUE3QyxDQUFrRCxvQkFBWTtBQUNwRCxzQkFBTUMsUUFBTixDQUFlLHNDQUFtQkMsU0FBU0MsSUFBNUIsQ0FBZjtBQUNBRSxlQUFTSCxTQUFTQyxJQUFsQjtBQUNBLGFBQU9ELFFBQVA7QUFDRixLQUpSLENBQVA7QUFLRCIsImZpbGUiOiJhcGlcXGRvbm9yc0FQSS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBheGlvcyBmcm9tICdheGlvcyc7XHJcbmltcG9ydCBzdG9yZSBmcm9tICdhcHAvc3RvcmUnXHJcbmltcG9ydCB7Z2V0RG9ub3JzU3VjY2VzcywgZ2V0RG9ub3JEZXRhaWxzU3VjY2VzcywgYWRkRG9ub3JTdWNjZXNzLCB1cGRhdGVEb25vclN1Y2Nlc3MsIGRlbGV0ZURvbm9yU3VjY2Vzc30gZnJvbSAnLi4vYWN0aW9ucy9kb25vckFjdGlvbnMnO1xyXG5cclxuY29uc3QgYmFja2VuZFVSTCA9ICdhcGkvZG9ub3JzJztcclxuXHJcbi8qKlxyXG4gKiBHZXQgYWxsIHRoZSBkb25vcnMgaW4gdGhlIHZpc2libGUgZXh0ZW50XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZ2V0RG9ub3JzKGV4dGVudCl7XHJcbiAgIHJldHVybiBheGlvcy5nZXQoYmFja2VuZFVSTCwge1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgICAgICAgICAgIGxhdE1pbjogZXh0ZW50LnltaW4sXHJcbiAgICAgICAgICAgICAgICAgIGxvbk1pbjogZXh0ZW50LnhtaW4sXHJcbiAgICAgICAgICAgICAgICAgIGxhdE1heDogZXh0ZW50LnltYXgsXHJcbiAgICAgICAgICAgICAgICAgIGxvbk1heDogZXh0ZW50LnhtYXhcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgICBzdG9yZS5kaXNwYXRjaChnZXREb25vcnNTdWNjZXNzKHJlc3BvbnNlLmRhdGEpKTtcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xyXG4gICAgICAgICAgICAgICB9KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEFkZCB0aGUgZG9ub3JcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBhZGREb25vcihkb25vciwgY2FsbGJhY2spe1xyXG4gIHJldHVybiBheGlvcy5wb3N0KGJhY2tlbmRVUkwsIGRvbm9yKS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKGFkZERvbm9yU3VjY2VzcyhyZXNwb25zZS5kYXRhKSk7XHJcbiAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhyZXNwb25zZS5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxufVxyXG5cclxuLyoqXHJcbiAqIEdldCB0aGUgZG9ub3IgZGV0YWlsc1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGdldERvbm9yRGV0YWlscyhkb25vcklkLCBjYWxsYmFjayl7XHJcbiAgcmV0dXJuIGF4aW9zLmdldChiYWNrZW5kVVJMICsnLycrIGRvbm9ySWQpLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goZ2V0RG9ub3JEZXRhaWxzU3VjY2VzcyhyZXNwb25zZS5kYXRhKSk7XHJcbiAgICAgICAgICAgICAgICAgICAvL2NhbGxiYWNrKHJlc3BvbnNlLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbn1cclxuXHJcblxyXG4vKipcclxuICogRGVsZXRlIHRoZSBkb25vciBkZXRhaWxzXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZGVsZXRlRG9ub3IoZG9ub3JJZCwgY2FsbGJhY2spe1xyXG4gIHJldHVybiBheGlvcy5kZWxldGUoYmFja2VuZFVSTCArJy8nKyBkb25vcklkKS50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKGRlbGV0ZURvbm9yU3VjY2VzcyhyZXNwb25zZS5kYXRhKSk7XHJcbiAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhyZXNwb25zZS5kYXRhKTtcclxuICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG59XHJcblxyXG4vKipcclxuICogVXBkYXRlIHRoZSBkb25vciBkZXRhaWxzXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gdXBkYXRlRG9ub3IoZG9ub3IsIGNhbGxiYWNrKXtcclxuICByZXR1cm4gYXhpb3MucHV0KGJhY2tlbmRVUkwgKycvJysgZG9ub3IuX2lkLCBkb25vcikudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICBzdG9yZS5kaXNwYXRjaCh1cGRhdGVEb25vclN1Y2Nlc3MocmVzcG9uc2UuZGF0YSkpO1xyXG4gICAgICAgICAgICAgICAgICAgY2FsbGJhY2socmVzcG9uc2UuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxufVxyXG4iXX0=