define(['chai', '../actions/donorActions', '../actions/actionTypes'], function (_chai, _donorActions, _actionTypes) {
    'use strict';

    var actions = _interopRequireWildcard(_donorActions);

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

    var donors = [{
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
    }, {
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
    }];

    describe('## Donor Actions ', function () {

        it('# Validate getDonorsSuccess', function () {
            var action = {
                type: actionTypes.GET_DONORS_SUCCESS,
                donors: donors
            };
            (0, _chai.expect)(actions.getDonorsSuccess(donors)).to.deep.equal(action);
        });

        it('# Validate getDonorDetailsSuccess', function () {
            var action = {
                type: actionTypes.GET_DONOR_DETAILS_SUCCESS,
                donor: donors[0]
            };
            (0, _chai.expect)(actions.getDonorDetailsSuccess(donors[0])).to.deep.equal(action);
        });

        it('# Validate addDonorSuccess', function () {
            var action = {
                type: actionTypes.ADD_DONOR_SUCCESS,
                donor: donors[0]
            };
            (0, _chai.expect)(actions.addDonorSuccess(donors[0])).to.deep.equal(action);
        });

        it('# Validate updateDonorSuccess', function () {
            var action = {
                type: actionTypes.UPDATE_DONOR_SUCCESS,
                donor: donors[0]
            };
            (0, _chai.expect)(actions.updateDonorSuccess(donors[0])).to.deep.equal(action);
        });

        it('# Validate deleteDonorSuccess', function () {
            var action = {
                type: actionTypes.DELETE_DONOR_SUCCESS,
                donor: donors[0]['_id']
            };
            (0, _chai.expect)(actions.deleteDonorSuccess(donors[0]['_id'])).to.deep.equal(action);
        });
        it('# Validate addDonorToList', function () {
            var action = {
                type: actionTypes.ADD_DONOR_TO_LIST,
                donor: donors[0]
            };
            (0, _chai.expect)(actions.addDonorToList(donors[0])).to.deep.equal(action);
        });
        it('# Validate updateDonorInList', function () {
            var action = {
                type: actionTypes.UPDATE_DONOR_IN_LIST,
                donor: donors[0]
            };
            (0, _chai.expect)(actions.updateDonorInList(donors[0])).to.deep.equal(action);
        });

        it('# Validate deleteDonorFromList', function () {
            var action = {
                type: actionTypes.DELETE_DONOR_FROM_LIST,
                donorId: donors[0]['_id']
            };
            (0, _chai.expect)(actions.deleteDonorFromList(donors[0]['_id'])).to.deep.equal(action);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3RzXFxkb25vckFjdGlvbnNUZXN0LmpzIl0sIm5hbWVzIjpbImFjdGlvbnMiLCJhY3Rpb25UeXBlcyIsImRvbm9ycyIsIl9pZCIsImFkZHJlc3MiLCJibG9vZEdyb3VwIiwiY3JlYXRlZEF0IiwiZW1haWxBZGRyZXNzIiwiZmlyc3ROYW1lIiwiaXBBZGRyZXNzIiwibGFzdE5hbWUiLCJsYXRpdHVkZSIsImxvbmdpdHVkZSIsIm1vYmlsZU51bWJlciIsImRlc2NyaWJlIiwiaXQiLCJhY3Rpb24iLCJ0eXBlIiwiR0VUX0RPTk9SU19TVUNDRVNTIiwiZ2V0RG9ub3JzU3VjY2VzcyIsInRvIiwiZGVlcCIsImVxdWFsIiwiR0VUX0RPTk9SX0RFVEFJTFNfU1VDQ0VTUyIsImRvbm9yIiwiZ2V0RG9ub3JEZXRhaWxzU3VjY2VzcyIsIkFERF9ET05PUl9TVUNDRVNTIiwiYWRkRG9ub3JTdWNjZXNzIiwiVVBEQVRFX0RPTk9SX1NVQ0NFU1MiLCJ1cGRhdGVEb25vclN1Y2Nlc3MiLCJERUxFVEVfRE9OT1JfU1VDQ0VTUyIsImRlbGV0ZURvbm9yU3VjY2VzcyIsIkFERF9ET05PUl9UT19MSVNUIiwiYWRkRG9ub3JUb0xpc3QiLCJVUERBVEVfRE9OT1JfSU5fTElTVCIsInVwZGF0ZURvbm9ySW5MaXN0IiwiREVMRVRFX0RPTk9SX0ZST01fTElTVCIsImRvbm9ySWQiLCJkZWxldGVEb25vckZyb21MaXN0Il0sIm1hcHBpbmdzIjoiOzs7UUFDWUEsTzs7UUFDQUMsVzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUdaLFFBQU1DLFNBQVMsQ0FDWDtBQUNJQyxhQUFLLDBCQURUO0FBRUlDLGlCQUFTLCtDQUZiO0FBR0lDLG9CQUFZLEtBSGhCO0FBSUlDLG1CQUFXLDBCQUpmO0FBS0lDLHNCQUFjLGNBTGxCO0FBTUlDLG1CQUFXLFVBTmY7QUFPSUMsbUJBQVcsS0FQZjtBQVFJQyxrQkFBVSxNQVJkO0FBU0lDLGtCQUFVLGtCQVRkO0FBVUlDLG1CQUFXLGlCQVZmO0FBV0lDLHNCQUFj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TUFBM0Q7QUFDSCxTQU5DOztBQVFGRCxXQUFHLGdDQUFILEVBQXFDLFlBQVU7QUFDM0MsZ0JBQU1DLFNBQVM7QUFDWEMsc0JBQU9oQixZQUFZbUMsc0JBRFI7QUFFWEMseUJBQVNuQyxPQUFPLENBQVAsRUFBVSxLQUFWO0FBRkUsYUFBZjtBQUlBLDhCQUFPRixRQUFRc0MsbUJBQVIsQ0FBNEJwQyxPQUFPLENBQVAsRUFBVSxLQUFWLENBQTVCLENBQVAsRUFBc0RrQixFQUF0RCxDQUF5REMsSUFBekQsQ0FBOERDLEtBQTlELENBQW9FTixNQUFwRTtBQUNILFNBTkQ7QUFRSCxLQWpFRCIsImZpbGUiOiJ0ZXN0c1xcZG9ub3JBY3Rpb25zVGVzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGV4cGVjdCB9IGZyb20gJ2NoYWknO1xyXG5pbXBvcnQgKiBhcyBhY3Rpb25zIGZyb20gJy4uL2FjdGlvbnMvZG9ub3JBY3Rpb25zJztcclxuaW1wb3J0ICogYXMgYWN0aW9uVHlwZXMgZnJvbSAnLi4vYWN0aW9ucy9hY3Rpb25UeXBlcyc7XHJcblxyXG5cclxuY29uc3QgZG9ub3JzID0gW1xyXG4gICAge1xyXG4gICAgICAgIF9pZDogXCI1ODQ1OTA1NmRmMmMxYTA0NThlZDUwZWVcIixcclxuICAgICAgICBhZGRyZXNzOiBcIkhlbGxvIE1vYmlsZXMgLSBNYWRoYXB1ciBNYWluIFJvYWQsIEh5ZGVyYWJhZFwiLFxyXG4gICAgICAgIGJsb29kR3JvdXA6IFwiQUIrXCIsXHJcbiAgICAgICAgY3JlYXRlZEF0OiBcIjIwMTYtMTItMDVUMTY6MDU6NDIuNDY0WlwiLFxyXG4gICAgICAgIGVtYWlsQWRkcmVzczogXCJhYmNAbWFpbC5jb21cIixcclxuICAgICAgICBmaXJzdE5hbWU6IFwiY2hhbmdlZXNcIixcclxuICAgICAgICBpcEFkZHJlc3M6IFwiOjoxXCIsXHJcbiAgICAgICAgbGFzdE5hbWU6IFwia2hhblwiLFxyXG4gICAgICAgIGxhdGl0dWRlOiAxNy40NTg5Njk1MzAwMDA0MzQsXHJcbiAgICAgICAgbG9uZ2l0dWRlOiA3OC4zNjY1NTU4NTcwMDA0OSxcclxuICAgICAgICBtb2JpbGVOdW1iZXI6IFwiKzAwOTkxMTk5MTE5OVwiXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIF9pZDogXCI1ODQ1OTA1NmRmMmMxYTA0NThlZDUwZWVcIixcclxuICAgICAgICBhZGRyZXNzOiBcIkhlbGxvIE1vYmlsZXMgLSBNYWRoYXB1ciBNYWluIFJvYWQsIEh5ZGVyYWJhZFwiLFxyXG4gICAgICAgIGJsb29kR3JvdXA6IFwiQUIrXCIsXHJcbiAgICAgICAgY3JlYXRlZEF0OiBcIjIwMTYtMTItMDVUMTY6MDU6NDIuNDY0WlwiLFxyXG4gICAgICAgIGVtYWlsQWRkcmVzczogXCJhYmNAbWFpbC5jb21cIixcclxuICAgICAgICBmaXJzdE5hbWU6IFwiY2hhbmdlZXNcIixcclxuICAgICAgICBpcEFkZHJlc3M6IFwiOjoxXCIsXHJcbiAgICAgICAgbGFzdE5hbWU6IFwia2hhblwiLFxyXG4gICAgICAgIGxhdGl0dWRlOiAxNy40NTg5Njk1MzAwMDA0MzQsXHJcbiAgICAgICAgbG9uZ2l0dWRlOiA3OC4zNjY1NTU4NTcwMDA0OSxcclxuICAgICAgICBtb2JpbGVOdW1iZXI6IFwiKzAwOTkxMTk5MTE5OVwiXHJcbiAgICB9XHJcblxyXG5dO1xyXG5cclxuXHJcbmRlc2NyaWJlKCcjIyBEb25vciBBY3Rpb25zICcsIGZ1bmN0aW9uKCl7XHJcblxyXG4gICAgaXQoJyMgVmFsaWRhdGUgZ2V0RG9ub3JzU3VjY2VzcycsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgY29uc3QgYWN0aW9uID0ge1xyXG4gICAgICAgICAgICB0eXBlOiBhY3Rpb25UeXBlcy5HRVRfRE9OT1JTX1NVQ0NFU1MsXHJcbiAgICAgICAgICAgIGRvbm9yc1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgZXhwZWN0KGFjdGlvbnMuZ2V0RG9ub3JzU3VjY2Vzcyhkb25vcnMpKS50by5kZWVwLmVxdWFsKGFjdGlvbik7XHJcblxyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJyMgVmFsaWRhdGUgZ2V0RG9ub3JEZXRhaWxzU3VjY2VzcycsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgY29uc3QgYWN0aW9uID0ge1xyXG4gICAgICAgICAgICB0eXBlOiAgYWN0aW9uVHlwZXMuR0VUX0RPTk9SX0RFVEFJTFNfU1VDQ0VTUyxcclxuICAgICAgICAgICAgZG9ub3I6IGRvbm9yc1swXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgZXhwZWN0KGFjdGlvbnMuZ2V0RG9ub3JEZXRhaWxzU3VjY2Vzcyhkb25vcnNbMF0pKS50by5kZWVwLmVxdWFsKGFjdGlvbik7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpdCgnIyBWYWxpZGF0ZSBhZGREb25vclN1Y2Nlc3MnLCBmdW5jdGlvbigpe1xyXG4gICAgICAgIGNvbnN0IGFjdGlvbiA9IHtcclxuICAgICAgICAgICAgdHlwZTogIGFjdGlvblR5cGVzLkFERF9ET05PUl9TVUNDRVNTLFxyXG4gICAgICAgICAgICBkb25vcjogZG9ub3JzWzBdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBleHBlY3QoYWN0aW9ucy5hZGREb25vclN1Y2Nlc3MoZG9ub3JzWzBdKSkudG8uZGVlcC5lcXVhbChhY3Rpb24pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJyMgVmFsaWRhdGUgdXBkYXRlRG9ub3JTdWNjZXNzJywgZnVuY3Rpb24oKXtcclxuICAgICAgICBjb25zdCBhY3Rpb24gPSB7XHJcbiAgICAgICAgICAgIHR5cGU6ICBhY3Rpb25UeXBlcy5VUERBVEVfRE9OT1JfU1VDQ0VTUyxcclxuICAgICAgICAgICAgZG9ub3I6IGRvbm9yc1swXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgZXhwZWN0KGFjdGlvbnMudXBkYXRlRG9ub3JTdWNjZXNzKGRvbm9yc1swXSkpLnRvLmRlZXAuZXF1YWwoYWN0aW9uKTtcclxuICAgIH0pO1xyXG5cclxuICAgICBpdCgnIyBWYWxpZGF0ZSBkZWxldGVEb25vclN1Y2Nlc3MnLCBmdW5jdGlvbigpe1xyXG4gICAgICAgIGNvbnN0IGFjdGlvbiA9IHtcclxuICAgICAgICAgICAgdHlwZTogIGFjdGlvblR5cGVzLkRFTEVURV9ET05PUl9TVUNDRVNTLFxyXG4gICAgICAgICAgICBkb25vcjogZG9ub3JzWzBdWydfaWQnXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgZXhwZWN0KGFjdGlvbnMuZGVsZXRlRG9ub3JTdWNjZXNzKGRvbm9yc1swXVsnX2lkJ10pKS50by5kZWVwLmVxdWFsKGFjdGlvbik7XHJcbiAgICB9KTtcclxuICAgICAgaXQoJyMgVmFsaWRhdGUgYWRkRG9ub3JUb0xpc3QnLCBmdW5jdGlvbigpe1xyXG4gICAgICAgIGNvbnN0IGFjdGlvbiA9IHtcclxuICAgICAgICAgICAgdHlwZTogIGFjdGlvblR5cGVzLkFERF9ET05PUl9UT19MSVNULFxyXG4gICAgICAgICAgICBkb25vcjogZG9ub3JzWzBdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBleHBlY3QoYWN0aW9ucy5hZGREb25vclRvTGlzdChkb25vcnNbMF0pKS50by5kZWVwLmVxdWFsKGFjdGlvbik7XHJcbiAgICB9KTtcclxuICAgICAgaXQoJyMgVmFsaWRhdGUgdXBkYXRlRG9ub3JJbkxpc3QnLCBmdW5jdGlvbigpe1xyXG4gICAgICAgIGNvbnN0IGFjdGlvbiA9IHtcclxuICAgICAgICAgICAgdHlwZTogIGFjdGlvblR5cGVzLlVQREFURV9ET05PUl9JTl9MSVNULFxyXG4gICAgICAgICAgICBkb25vcjogZG9ub3JzWzBdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBleHBlY3QoYWN0aW9ucy51cGRhdGVEb25vckluTGlzdChkb25vcnNbMF0pKS50by5kZWVwLmVxdWFsKGFjdGlvbik7XHJcbiAgICB9KTtcclxuICAgIFxyXG4gICAgaXQoJyMgVmFsaWRhdGUgZGVsZXRlRG9ub3JGcm9tTGlzdCcsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgY29uc3QgYWN0aW9uID0ge1xyXG4gICAgICAgICAgICB0eXBlOiAgYWN0aW9uVHlwZXMuREVMRVRFX0RPTk9SX0ZST01fTElTVCxcclxuICAgICAgICAgICAgZG9ub3JJZDogZG9ub3JzWzBdWydfaWQnXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgZXhwZWN0KGFjdGlvbnMuZGVsZXRlRG9ub3JGcm9tTGlzdChkb25vcnNbMF1bJ19pZCddKSkudG8uZGVlcC5lcXVhbChhY3Rpb24pO1xyXG4gICAgfSk7XHJcblxyXG59KTsiXX0=