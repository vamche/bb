import { expect } from 'chai';
import * as actions from '../actions/donorActions';
import * as actionTypes from '../actions/actionTypes';


const donors = [
    {
        _id: "58459056df2c1a0458ed50ee",
        address: "Hello Mobiles - Madhapur Main Road, Hyderabad",
        bloodGroup: "AB+",
        createdAt: "2016-12-05T16:05:42.464Z",
        emailAddress: "abc@mail.com",
        firstName: "changees",
        ipAddress: "::1",
        lastName: "khan",
        latitude: 17.458969530000434,
        longitude: 78.36655585700049,
        mobileNumber: "+009911991199"
    },
    {
        _id: "58459056df2c1a0458ed50ee",
        address: "Hello Mobiles - Madhapur Main Road, Hyderabad",
        bloodGroup: "AB+",
        createdAt: "2016-12-05T16:05:42.464Z",
        emailAddress: "abc@mail.com",
        firstName: "changees",
        ipAddress: "::1",
        lastName: "khan",
        latitude: 17.458969530000434,
        longitude: 78.36655585700049,
        mobileNumber: "+009911991199"
    }

];


describe('## Donor Actions \n \n', function(){

    it('# Validate getDonorsSuccess', function(){
        const action = {
            type: actionTypes.GET_DONORS_SUCCESS,
            donors
        };
        expect(actions.getDonorsSuccess(donors)).to.deep.equal(action);

    });

    it('# Validate getDonorDetailsSuccess', function(){
        const action = {
            type:  actionTypes.GET_DONOR_DETAILS_SUCCESS,
            donor: donors[0]
            }
        expect(actions.getDonorDetailsSuccess(donors[0])).to.deep.equal(action);
    });

    it('# Validate addDonorSuccess', function(){
        const action = {
            type:  actionTypes.ADD_DONOR_SUCCESS,
            donor: donors[0]
            }
        expect(actions.addDonorSuccess(donors[0])).to.deep.equal(action);
    });

    it('# Validate updateDonorSuccess', function(){
        const action = {
            type:  actionTypes.UPDATE_DONOR_SUCCESS,
            donor: donors[0]
            }
        expect(actions.updateDonorSuccess(donors[0])).to.deep.equal(action);
    });

     it('# Validate deleteDonorSuccess', function(){
        const action = {
            type:  actionTypes.DELETE_DONOR_SUCCESS,
            donor: donors[0]['_id']
            }
        expect(actions.deleteDonorSuccess(donors[0]['_id'])).to.deep.equal(action);
    });
      it('# Validate addDonorToList', function(){
        const action = {
            type:  actionTypes.ADD_DONOR_TO_LIST,
            donor: donors[0]
            }
        expect(actions.addDonorToList(donors[0])).to.deep.equal(action);
    });
      it('# Validate updateDonorInList', function(){
        const action = {
            type:  actionTypes.UPDATE_DONOR_IN_LIST,
            donor: donors[0]
            }
        expect(actions.updateDonorInList(donors[0])).to.deep.equal(action);
    });
    
    it('# Validate deleteDonorFromList', function(){
        const action = {
            type:  actionTypes.DELETE_DONOR_FROM_LIST,
            donorId: donors[0]['_id']
            }
        expect(actions.deleteDonorFromList(donors[0]['_id'])).to.deep.equal(action);
    });

});