import axios from 'axios';
import store from 'app/store'
import {getDonorsSuccess, getDonorDetailsSuccess, addDonorSuccess, updateDonorSuccess, deleteDonorSuccess} from '../actions/donorActions';

const backendURL = 'api/donors';

/**
 * Get all the donors in the visible extent
 */
export function getDonors(extent){
   return axios.get(backendURL, {
                params: {
                  latMin: extent.ymin,
                  lonMin: extent.xmin,
                  latMax: extent.ymax,
                  lonMax: extent.xmax
                  }
                })
               .then(response => {
                  store.dispatch(getDonorsSuccess(response.data));
                  return response;
               });
}

/**
 * Add the donor
 */
export function addDonor(donor, callback){
  return axios.post(backendURL, donor).then(response => {
                   store.dispatch(addDonorSuccess(response.data));
                   callback(response.data);
                   return response;
                });

}

/**
 * Get the donor details
 */
export function getDonorDetails(donorId, callback){
  return axios.get(backendURL +'/'+ donorId).then(response => {
                   store.dispatch(getDonorDetailsSuccess(response.data));
                   //callback(response.data);
                   return response;
                });
}


/**
 * Delete the donor details
 */
export function deleteDonor(donorId, callback){
  return axios.delete(backendURL +'/'+ donorId).then(response => {
                   store.dispatch(deleteDonorSuccess(response.data));
                   callback(response.data);
                   return response;
                });
}

/**
 * Update the donor details
 */
export function updateDonor(donor, callback){
  return axios.put(backendURL +'/'+ donor._id, donor).then(response => {
                   store.dispatch(updateDonorSuccess(response.data));
                   callback(response.data);
                   return response;
                });
}
