define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  // Donors
  var GET_DONORS_SUCCESS = exports.GET_DONORS_SUCCESS = 'GET_DONORS_SUCCESS';
  var GET_DONOR_DETAILS_SUCCESS = exports.GET_DONOR_DETAILS_SUCCESS = 'GET_DONOR_DETAILS_SUCCESS';
  var ADD_DONOR_SUCCESS = exports.ADD_DONOR_SUCCESS = 'ADD_DONOR_SUCCESS';
  var UPDATE_DONOR_SUCCESS = exports.UPDATE_DONOR_SUCCESS = 'UPDATE_DONOR_SUCCESS';
  var DELETE_DONOR_SUCCESS = exports.DELETE_DONOR_SUCCESS = 'DELETE_DONOR_SUCCESS';

  // Socket actions
  var ADD_DONOR_TO_LIST = exports.ADD_DONOR_TO_LIST = 'ADD_DONOR_TO_LIST';
  var DELETE_DONOR_FROM_LIST = exports.DELETE_DONOR_FROM_LIST = 'DELETE_DONOR_FROM_LIST';
  var UPDATE_DONOR_IN_LIST = exports.UPDATE_DONOR_IN_LIST = 'UPDATE_DONOR_IN_LIST';

  // Filters
  var TOGGLE_FILTER = exports.TOGGLE_FILTER = 'TOGGLE_FILTER';

  // Map View
  var SET_INITIAL_VIEW = exports.SET_INITIAL_VIEW = 'SET_INITIAL_VIEW';
  var SET_INITIAL_GRAPHICS_LAYER = exports.SET_INITIAL_GRAPHICS_LAYER = 'SET_INITIAL_GRAPHICS_LAYER';
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFjdGlvbnNcXGFjdGlvblR5cGVzLmpzIl0sIm5hbWVzIjpbIkdFVF9ET05PUlNfU1VDQ0VTUyIsIkdFVF9ET05PUl9ERVRBSUxTX1NVQ0NFU1MiLCJBRERfRE9OT1JfU1VDQ0VTUyIsIlVQREFURV9ET05PUl9TVUNDRVNTIiwiREVMRVRFX0RPTk9SX1NVQ0NFU1MiLCJBRERfRE9OT1JfVE9fTElTVCIsIkRFTEVURV9ET05PUl9GUk9NX0xJU1QiLCJVUERBVEVfRE9OT1JfSU5fTElTVCIsIlRPR0dMRV9GSUxURVIiLCJTRVRfSU5JVElBTF9WSUVXIiwiU0VUX0lOSVRJQUxfR1JBUEhJQ1NfTEFZRVIiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ08sTUFBTUEsa0RBQXFCLG9CQUEzQjtBQUNBLE1BQU1DLGdFQUE0QiwyQkFBbEM7QUFDQSxNQUFNQyxnREFBb0IsbUJBQTFCO0FBQ0EsTUFBTUMsc0RBQXVCLHNCQUE3QjtBQUNBLE1BQU1DLHNEQUF1QixzQkFBN0I7O0FBRVA7QUFDTyxNQUFNQyxnREFBb0IsbUJBQTFCO0FBQ0EsTUFBTUMsMERBQXlCLHdCQUEvQjtBQUNBLE1BQU1DLHNEQUF1QixzQkFBN0I7O0FBRVA7QUFDTyxNQUFNQyx3Q0FBZ0IsZUFBdEI7O0FBRVA7QUFDTyxNQUFNQyw4Q0FBbUIsa0JBQXpCO0FBQ0EsTUFBTUMsa0VBQTZCLDRCQUFuQyIsImZpbGUiOiJhY3Rpb25zXFxhY3Rpb25UeXBlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIERvbm9yc1xyXG5leHBvcnQgY29uc3QgR0VUX0RPTk9SU19TVUNDRVNTID0gJ0dFVF9ET05PUlNfU1VDQ0VTUyc7XHJcbmV4cG9ydCBjb25zdCBHRVRfRE9OT1JfREVUQUlMU19TVUNDRVNTID0gJ0dFVF9ET05PUl9ERVRBSUxTX1NVQ0NFU1MnO1xyXG5leHBvcnQgY29uc3QgQUREX0RPTk9SX1NVQ0NFU1MgPSAnQUREX0RPTk9SX1NVQ0NFU1MnO1xyXG5leHBvcnQgY29uc3QgVVBEQVRFX0RPTk9SX1NVQ0NFU1MgPSAnVVBEQVRFX0RPTk9SX1NVQ0NFU1MnO1xyXG5leHBvcnQgY29uc3QgREVMRVRFX0RPTk9SX1NVQ0NFU1MgPSAnREVMRVRFX0RPTk9SX1NVQ0NFU1MnO1xyXG5cclxuLy8gU29ja2V0IGFjdGlvbnNcclxuZXhwb3J0IGNvbnN0IEFERF9ET05PUl9UT19MSVNUID0gJ0FERF9ET05PUl9UT19MSVNUJztcclxuZXhwb3J0IGNvbnN0IERFTEVURV9ET05PUl9GUk9NX0xJU1QgPSAnREVMRVRFX0RPTk9SX0ZST01fTElTVCc7XHJcbmV4cG9ydCBjb25zdCBVUERBVEVfRE9OT1JfSU5fTElTVCA9ICdVUERBVEVfRE9OT1JfSU5fTElTVCc7XHJcblxyXG4vLyBGaWx0ZXJzXHJcbmV4cG9ydCBjb25zdCBUT0dHTEVfRklMVEVSID0gJ1RPR0dMRV9GSUxURVInO1xyXG5cclxuLy8gTWFwIFZpZXdcclxuZXhwb3J0IGNvbnN0IFNFVF9JTklUSUFMX1ZJRVcgPSAnU0VUX0lOSVRJQUxfVklFVyc7XHJcbmV4cG9ydCBjb25zdCBTRVRfSU5JVElBTF9HUkFQSElDU19MQVlFUiA9ICdTRVRfSU5JVElBTF9HUkFQSElDU19MQVlFUic7XHJcbiJdfQ==