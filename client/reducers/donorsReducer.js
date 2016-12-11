import * as types from '../actions/actionTypes';
import _ from 'lodash';

const initialState = {
  donors : [],
  filters : [
             {id: 'A+', selected: true, text: 'A+'},
             {id: 'A-', selected: true, text: 'A-'},
             {id: 'B+', selected: true, text: 'B+'},
             {id: 'B-', selected: true, text: 'B-'},
             {id: 'AB+', selected: true, text: 'AB+'},
             {id: 'AB-', selected: true, text: 'AB-'},
             {id: 'O+', selected: true, text: 'O+'},
             {id: 'O-', selected: true, text: 'O-'}
            ],
  donorEditable : {}
};

export function copy(o) {
   var output, v, key;
   output = Array.isArray(o) ? [] : {};
   for (key in o) {
       v = o[key];
       output[key] = (typeof v === "object") ? copy(v) : v;
   }
   return output;
};

const donorsReducer = function(state = initialState, action) {
  let newDonors = [];
  switch(action.type) {

    case types.GET_DONORS_SUCCESS:
      return Object.assign({}, state, { donors: action.donors });

    case types.ADD_DONOR_SUCCESS:
      newDonors = state.donors.concat([action.donor]);
      return Object.assign({}, state, { donors: newDonors });

    case types.DELETE_DONOR_SUCCESS:
      // Using lodash to create a new donor array without the donor we want to remove
      newDonors = _.filter(state.donors, donor => donor._id != action.donor._id);
      return Object.assign({}, state, { donors: newDonors, donorEditable : {}});

    case types.UPDATE_DONOR_SUCCESS:
      // Using lodash to create a new donor array without the donor we want to update
      newDonors = _.filter(state.donors, donor => donor._id != action.donor._id);
      // add the donor to the array
      let updatedDonors = newDonors.concat([action.donor]);
      return Object.assign({}, state, { donors: updatedDonors, donorEditable : {}});

    case types.GET_DONOR_DETAILS_SUCCESS:
      return Object.assign({}, state, { donorEditable: action.donor });

    case types.ADD_DONOR_TO_LIST:
      newDonors = state.donors.concat([action.donor]);
      return Object.assign({}, state, { donors: newDonors });

    case types.DELETE_DONOR_FROM_LIST:
      // Using lodash to create a new donor array without the donor we want to remove
      newDonors = _.filter(state.donors, donor => donor._id != action.donorId);
      return Object.assign({}, state, { donors: newDonors });

    case types.UPDATE_DONOR_IN_LIST:
      // Using lodash to create a new donor array without the donor we want to update
      newDonors = _.filter(state.donors, donor => donor._id != action.donor._id);
      // add the donor to the array
      newDonors.push(action.donor);
      return Object.assign({}, state, { donors: newDonors });

    case types.TOGGLE_FILTER:

      const index = _.findIndex(state.filters, { id: action.filterItem.id });
      let newFilters = copy(state.filters);
      newFilters[index]['selected'] = !newFilters[index]['selected'];
      return Object.assign({}, state, { filters: newFilters });
  }

  return state;

}

export default donorsReducer;
