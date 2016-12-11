define(['chai', '../actions/actionTypes', '../reducers/donorsReducer'], function (_chai, _actionTypes, _donorsReducer) {
    'use strict';

    var actionTypes = _interopRequireWildcard(_actionTypes);

    var _donorsReducer2 = _interopRequireDefault(_donorsReducer);

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

    var initialState = {
        donors: [],
        filters: [{ id: 'A+', selected: true, text: 'A+' }, { id: 'A-', selected: true, text: 'A-' }, { id: 'B+', selected: true, text: 'B+' }, { id: 'B-', selected: true, text: 'B-' }, { id: 'AB+', selected: true, text: 'AB+' }, { id: 'AB-', selected: true, text: 'AB-' }, { id: 'O+', selected: true, text: 'O+' }, { id: 'O-', selected: true, text: 'O-' }],
        donorEditable: {}
    };

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

    describe('## Donor Reducer ', function () {

        it('# Should return initialState', function () {
            var action = { type: 'RANDOM_ACTION' };
            (0, _chai.expect)((0, _donorsReducer2.default)(undefined, action)).to.deep.equal(initialState);
        });

        it('# Should get list of donors', function () {
            var action = { type: actionTypes.GET_DONORS_SUCCESS, donors: donors };
            (0, _chai.expect)(initialState.donors.length).to.equal(0);
            var reducerOutput = (0, _donorsReducer2.default)(initialState, action);
            (0, _chai.expect)(reducerOutput.donors).to.deep.equal(donors);
        });

        it('# Should add donor', function () {
            var action = { type: actionTypes.ADD_DONOR_SUCCESS, donor: donors[0] };
            var reducerOutput = (0, _donorsReducer2.default)(initialState, action);
            (0, _chai.expect)(reducerOutput.donors.length).to.equal(1);
        });

        it('# Should delete donor', function () {
            var action = { type: actionTypes.ADD_DONOR_SUCCESS, donor: donors[0] };
            var reducerOutput = (0, _donorsReducer2.default)(initialState, action);
            (0, _chai.expect)(reducerOutput.donors.length).to.equal(1);

            action = { type: actionTypes.DELETE_DONOR_SUCCESS, donor: donors[0] };
            reducerOutput = (0, _donorsReducer2.default)(initialState, action);
            (0, _chai.expect)(reducerOutput.donors.length).to.equal(0);
        });

        it('# Should get donor details', function () {
            var action = { type: actionTypes.GET_DONOR_DETAILS_SUCCESS, donor: donors[0] };
            var reducerOutput = (0, _donorsReducer2.default)(initialState, action);
            (0, _chai.expect)(reducerOutput.donorEditable).to.deep.equal(donors[0]);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3RzXFxkb25vcnNSZWR1Y2VyVGVzdC5qcyJdLCJuYW1lcyI6WyJhY3Rpb25UeXBlcyIsImluaXRpYWxTdGF0ZSIsImRvbm9ycyIsImZpbHRlcnMiLCJpZCIsInNlbGVjdGVkIiwidGV4dCIsImRvbm9yRWRpdGFibGUiLCJfaWQiLCJhZGRyZXNzIiwiYmxvb2RHcm91cCIsImNyZWF0ZWRBdCIsImVtYWlsQWRkcmVzcyIsImZpcnN0TmFtZSIsImlwQWRkcmVzcyIsImxhc3ROYW1lIiwibGF0aXR1ZGUiLCJsb25naXR1ZGUiLCJtb2JpbGVOdW1iZXIiLCJkZXNjcmliZSIsIml0IiwiYWN0aW9uIiwidHlwZSIsInVuZGVmaW5lZCIsInRvIiwiZGVlcCIsImVxdWFsIiwiR0VUX0RPTk9SU19TVUNDRVNTIiwibGVuZ3RoIiwicmVkdWNlck91dHB1dCIsIkFERF9ET05PUl9TVUNDRVNTIiwiZG9ub3IiLCJERUxFVEVfRE9OT1JfU1VDQ0VTUyIsIkdFVF9ET05PUl9ERVRBSUxTX1NVQ0NFU1MiXSwibWFwcGluZ3MiOiI7OztRQUNZQSxXOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHWixRQUFNQyxlQUFlO0FBQ2pCQyxnQkFBUSxFQURTO0FBRWpCQyxpQkFBUyxDQUNMLEVBQUVDLElBQUksSUFBTixFQUFZQyxVQUFVLElBQXRCLEVBQTRCQyxNQUFNLElBQWxDLEVBREssRUFFTCxFQUFFRixJQUFJLElBQU4sRUFBWUMsVUFBVSxJQUF0QixFQUE0QkMsTUFBTSxJQUFsQyxFQUZLLEVBR0wsRUFBRUYsSUFBSSxJQUFOLEVBQVlDLFVBQVUsSUFBdEIsRUFBNEJDLE1BQU0sSUFBbEMsRUFISyxFQUlMLEVBQUVGLElBQUksSUFBTixFQUFZQyxVQUFVLElBQXRCLEVBQTRCQyxNQUFNLElBQWxDLEVBSkssRUFLTCxFQUFFRixJQUFJLEtBQU4sRUFBYUMsVUFBVSxJQUF2QixFQUE2QkMsTUFBTSxLQUFuQyxFQUxLLEVBTUwsRUFBRUYsSUFBSSxLQUFOLEVBQWFDLFVB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QUE2QyxDQUE3QztBQUNILFNBUkQ7O0FBVUFOLFdBQUcsNEJBQUgsRUFBaUMsWUFBWTtBQUN6QyxnQkFBSUMsU0FBUyxFQUFFQyxNQUFNdEIsWUFBWWlDLHlCQUFwQixFQUErQ0YsT0FBUTdCLE9BQU8sQ0FBUCxDQUF2RCxFQUFiO0FBQ0EsZ0JBQUkyQixnQkFBZ0IsNkJBQWM1QixZQUFkLEVBQTRCb0IsTUFBNUIsQ0FBcEI7QUFDQSw4QkFBT1EsY0FBY3RCLGFBQXJCLEVBQW9DaUIsRUFBcEMsQ0FBdUNDLElBQXZDLENBQTRDQyxLQUE1QyxDQUFrRHhCLE9BQU8sQ0FBUCxDQUFsRDtBQUNILFNBSkQ7QUFNSCxLQXBDRCIsImZpbGUiOiJ0ZXN0c1xcZG9ub3JzUmVkdWNlclRlc3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBleHBlY3QgfSBmcm9tICdjaGFpJztcclxuaW1wb3J0ICogYXMgYWN0aW9uVHlwZXMgZnJvbSAnLi4vYWN0aW9ucy9hY3Rpb25UeXBlcyc7XHJcbmltcG9ydCBkb25vcnNSZWR1Y2VyIGZyb20gJy4uL3JlZHVjZXJzL2Rvbm9yc1JlZHVjZXInO1xyXG5cclxuY29uc3QgaW5pdGlhbFN0YXRlID0ge1xyXG4gICAgZG9ub3JzOiBbXSxcclxuICAgIGZpbHRlcnM6IFtcclxuICAgICAgICB7IGlkOiAnQSsnLCBzZWxlY3RlZDogdHJ1ZSwgdGV4dDogJ0ErJyB9LFxyXG4gICAgICAgIHsgaWQ6ICdBLScsIHNlbGVjdGVkOiB0cnVlLCB0ZXh0OiAnQS0nIH0sXHJcbiAgICAgICAgeyBpZDogJ0IrJywgc2VsZWN0ZWQ6IHRydWUsIHRleHQ6ICdCKycgfSxcclxuICAgICAgICB7IGlkOiAnQi0nLCBzZWxlY3RlZDogdHJ1ZSwgdGV4dDogJ0ItJyB9LFxyXG4gICAgICAgIHsgaWQ6ICdBQisnLCBzZWxlY3RlZDogdHJ1ZSwgdGV4dDogJ0FCKycgfSxcclxuICAgICAgICB7IGlkOiAnQUItJywgc2VsZWN0ZWQ6IHRydWUsIHRleHQ6ICdBQi0nIH0sXHJcbiAgICAgICAgeyBpZDogJ08rJywgc2VsZWN0ZWQ6IHRydWUsIHRleHQ6ICdPKycgfSxcclxuICAgICAgICB7IGlkOiAnTy0nLCBzZWxlY3RlZDogdHJ1ZSwgdGV4dDogJ08tJyB9XHJcbiAgICBdLFxyXG4gICAgZG9ub3JFZGl0YWJsZToge31cclxufTtcclxuXHJcbmNvbnN0IGRvbm9ycyA9IFtcclxuICAgIHtcclxuICAgICAgICBfaWQ6IFwiNTg0NTkwNTZkZjJjMWEwNDU4ZWQ1MGVlXCIsXHJcbiAgICAgICAgYWRkcmVzczogXCJIZWxsbyBNb2JpbGVzIC0gTWFkaGFwdXIgTWFpbiBSb2FkLCBIeWRlcmFiYWRcIixcclxuICAgICAgICBibG9vZEdyb3VwOiBcIkFCK1wiLFxyXG4gICAgICAgIGNyZWF0ZWRBdDogXCIyMDE2LTEyLTA1VDE2OjA1OjQyLjQ2NFpcIixcclxuICAgICAgICBlbWFpbEFkZHJlc3M6IFwiYWJjQG1haWwuY29tXCIsXHJcbiAgICAgICAgZmlyc3ROYW1lOiBcImNoYW5nZWVzXCIsXHJcbiAgICAgICAgaXBBZGRyZXNzOiBcIjo6MVwiLFxyXG4gICAgICAgIGxhc3ROYW1lOiBcImtoYW5cIixcclxuICAgICAgICBsYXRpdHVkZTogMTcuNDU4OTY5NTMwMDAwNDM0LFxyXG4gICAgICAgIGxvbmdpdHVkZTogNzguMzY2NTU1ODU3MDAwNDksXHJcbiAgICAgICAgbW9iaWxlTnVtYmVyOiBcIiswMDk5MTE5OTExOTlcIlxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBfaWQ6IFwiNTg0NTkwNTZkZjJjMWEwNDU4ZWQ1MGVlXCIsXHJcbiAgICAgICAgYWRkcmVzczogXCJIZWxsbyBNb2JpbGVzIC0gTWFkaGFwdXIgTWFpbiBSb2FkLCBIeWRlcmFiYWRcIixcclxuICAgICAgICBibG9vZEdyb3VwOiBcIkFCK1wiLFxyXG4gICAgICAgIGNyZWF0ZWRBdDogXCIyMDE2LTEyLTA1VDE2OjA1OjQyLjQ2NFpcIixcclxuICAgICAgICBlbWFpbEFkZHJlc3M6IFwiYWJjQG1haWwuY29tXCIsXHJcbiAgICAgICAgZmlyc3ROYW1lOiBcImNoYW5nZWVzXCIsXHJcbiAgICAgICAgaXBBZGRyZXNzOiBcIjo6MVwiLFxyXG4gICAgICAgIGxhc3ROYW1lOiBcImtoYW5cIixcclxuICAgICAgICBsYXRpdHVkZTogMTcuNDU4OTY5NTMwMDAwNDM0LFxyXG4gICAgICAgIGxvbmdpdHVkZTogNzguMzY2NTU1ODU3MDAwNDksXHJcbiAgICAgICAgbW9iaWxlTnVtYmVyOiBcIiswMDk5MTE5OTExOTlcIlxyXG4gICAgfVxyXG5cclxuXTtcclxuXHJcblxyXG5kZXNjcmliZSgnIyMgRG9ub3IgUmVkdWNlciAnLCBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgaXQoJyMgU2hvdWxkIHJldHVybiBpbml0aWFsU3RhdGUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY29uc3QgYWN0aW9uID0geyB0eXBlOiAnUkFORE9NX0FDVElPTicgfTtcclxuICAgICAgICBleHBlY3QoZG9ub3JzUmVkdWNlcih1bmRlZmluZWQsIGFjdGlvbikpLnRvLmRlZXAuZXF1YWwoaW5pdGlhbFN0YXRlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCcjIFNob3VsZCBnZXQgbGlzdCBvZiBkb25vcnMnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY29uc3QgYWN0aW9uID0geyB0eXBlOiBhY3Rpb25UeXBlcy5HRVRfRE9OT1JTX1NVQ0NFU1MsIGRvbm9ycyB9O1xyXG4gICAgICAgIGV4cGVjdChpbml0aWFsU3RhdGUuZG9ub3JzLmxlbmd0aCkudG8uZXF1YWwoMCk7XHJcbiAgICAgICAgY29uc3QgcmVkdWNlck91dHB1dCA9IGRvbm9yc1JlZHVjZXIoaW5pdGlhbFN0YXRlLCBhY3Rpb24pO1xyXG4gICAgICAgIGV4cGVjdChyZWR1Y2VyT3V0cHV0LmRvbm9ycykudG8uZGVlcC5lcXVhbChkb25vcnMpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgIGl0KCcjIFNob3VsZCBhZGQgZG9ub3InLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY29uc3QgYWN0aW9uID0geyB0eXBlOiBhY3Rpb25UeXBlcy5BRERfRE9OT1JfU1VDQ0VTUywgZG9ub3IgOiBkb25vcnNbMF0gfTsgICAgICAgIFxyXG4gICAgICAgIGNvbnN0IHJlZHVjZXJPdXRwdXQgPSBkb25vcnNSZWR1Y2VyKGluaXRpYWxTdGF0ZSwgYWN0aW9uKTtcclxuICAgICAgICBleHBlY3QocmVkdWNlck91dHB1dC5kb25vcnMubGVuZ3RoKS50by5lcXVhbCgxKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGl0KCcjIFNob3VsZCBkZWxldGUgZG9ub3InLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgbGV0IGFjdGlvbiA9IHsgdHlwZTogYWN0aW9uVHlwZXMuQUREX0RPTk9SX1NVQ0NFU1MsIGRvbm9yIDogZG9ub3JzWzBdIH07ICAgICAgICBcclxuICAgICAgICBsZXQgcmVkdWNlck91dHB1dCA9IGRvbm9yc1JlZHVjZXIoaW5pdGlhbFN0YXRlLCBhY3Rpb24pO1xyXG4gICAgICAgIGV4cGVjdChyZWR1Y2VyT3V0cHV0LmRvbm9ycy5sZW5ndGgpLnRvLmVxdWFsKDEpO1xyXG5cclxuICAgICAgICBhY3Rpb24gPSB7IHR5cGU6IGFjdGlvblR5cGVzLkRFTEVURV9ET05PUl9TVUNDRVNTLCBkb25vciA6IGRvbm9yc1swXSB9OyAgICAgICAgXHJcbiAgICAgICAgcmVkdWNlck91dHB1dCA9IGRvbm9yc1JlZHVjZXIoaW5pdGlhbFN0YXRlLCBhY3Rpb24pO1xyXG4gICAgICAgIGV4cGVjdChyZWR1Y2VyT3V0cHV0LmRvbm9ycy5sZW5ndGgpLnRvLmVxdWFsKDApO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaXQoJyMgU2hvdWxkIGdldCBkb25vciBkZXRhaWxzJywgZnVuY3Rpb24gKCkgeyAgICAgXHJcbiAgICAgICAgbGV0IGFjdGlvbiA9IHsgdHlwZTogYWN0aW9uVHlwZXMuR0VUX0RPTk9SX0RFVEFJTFNfU1VDQ0VTUywgZG9ub3IgOiBkb25vcnNbMF0gfTsgICAgICAgIFxyXG4gICAgICAgIGxldCByZWR1Y2VyT3V0cHV0ID0gZG9ub3JzUmVkdWNlcihpbml0aWFsU3RhdGUsIGFjdGlvbik7XHJcbiAgICAgICAgZXhwZWN0KHJlZHVjZXJPdXRwdXQuZG9ub3JFZGl0YWJsZSkudG8uZGVlcC5lcXVhbChkb25vcnNbMF0pO1xyXG4gICAgfSk7XHJcblxyXG59KTtcclxuXHJcblxyXG5cclxuXHJcbiJdfQ==