import * as actionTypes from 'app/actions/actionTypes';

export function getDonorsSuccess(donors){
    return{
      type:  actionTypes.GET_DONORS_SUCCESS,
      donors
    }
}

export function getDonorDetailsSuccess(donor){
    return{
      type:  actionTypes.GET_DONOR_DETAILS_SUCCESS,
      donor
    }
}

export function addDonorSuccess(donor){
    return{
      type:  actionTypes.ADD_DONOR_SUCCESS,
      donor
    }
}

export function updateDonorSuccess(donor){
    return{
      type:  actionTypes.UPDATE_DONOR_SUCCESS,
      donor
    }
}

export function deleteDonorSuccess(donor){
    return{
      type:  actionTypes.DELETE_DONOR_SUCCESS,
      donor
    }
}

export function toggleFilter(filterItem){
    return{
      type:  actionTypes.TOGGLE_FILTER,
      filterItem
    }
}

export function setInitialView(view){
  return{
    type:  actionTypes.SET_INITIAL_VIEW,
    view
  }
}

export function setInitialGraphicsLayer(graphicsLayer){
  return{
    type:  actionTypes.SET_INITIAL_GRAPHICS_LAYER,
    graphicsLayer
  }
}

export function addDonorToList(donor){
    return{
      type:  actionTypes.ADD_DONOR_TO_LIST,
      donor
    }
}

export function updateDonorInList(donor){
    return{
      type:  actionTypes.UPDATE_DONOR_IN_LIST,
      donor
    }
}

export function deleteDonorFromList(donorId){
    return{
      type:  actionTypes.DELETE_DONOR_FROM_LIST,
      donorId
    }
}
