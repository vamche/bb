import { expect } from 'chai';
import * as actionTypes from '../actions/actionTypes';
import donorsReducer from '../reducers/donorsReducer';

const initialState = {
    donors: [],
    filters: [
        { id: 'A+', selected: true, text: 'A+' },
        { id: 'A-', selected: true, text: 'A-' },
        { id: 'B+', selected: true, text: 'B+' },
        { id: 'B-', selected: true, text: 'B-' },
        { id: 'AB+', selected: true, text: 'AB+' },
        { id: 'AB-', selected: true, text: 'AB-' },
        { id: 'O+', selected: true, text: 'O+' },
        { id: 'O-', selected: true, text: 'O-' }
    ],
    donorEditable: {}
};

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


describe('## Donor Reducer ', function () {

    it('# Should return initialState', function () {
        const action = { type: 'RANDOM_ACTION' };
        expect(donorsReducer(undefined, action)).to.deep.equal(initialState);
    });

    it('# Should get list of donors', function () {
        const action = { type: actionTypes.GET_DONORS_SUCCESS, donors };
        expect(initialState.donors.length).to.equal(0);
        const reducerOutput = donorsReducer(initialState, action);
        expect(reducerOutput.donors).to.deep.equal(donors);
    });

     it('# Should add donor', function () {
        const action = { type: actionTypes.ADD_DONOR_SUCCESS, donor : donors[0] };        
        const reducerOutput = donorsReducer(initialState, action);
        expect(reducerOutput.donors.length).to.equal(1);
    });

    it('# Should delete donor', function () {
        let action = { type: actionTypes.ADD_DONOR_SUCCESS, donor : donors[0] };        
        let reducerOutput = donorsReducer(initialState, action);
        expect(reducerOutput.donors.length).to.equal(1);

        action = { type: actionTypes.DELETE_DONOR_SUCCESS, donor : donors[0] };        
        reducerOutput = donorsReducer(initialState, action);
        expect(reducerOutput.donors.length).to.equal(0);
    });

    it('# Should get donor details', function () {     
        let action = { type: actionTypes.GET_DONOR_DETAILS_SUCCESS, donor : donors[0] };        
        let reducerOutput = donorsReducer(initialState, action);
        expect(reducerOutput.donorEditable).to.deep.equal(donors[0]);
    });

});




