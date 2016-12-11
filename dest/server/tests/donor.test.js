'use strict';

var _supertestAsPromised = require('supertest-as-promised');

var _supertestAsPromised2 = _interopRequireDefault(_supertestAsPromised);

var _httpStatus = require('http-status');

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _index = require('../../index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.config.includeStack = true;

describe('## Donor APIs', function () {
  var donor = {
    firstName: 'Bruce',
    lastName: 'Lee',
    mobileNumber: '+919876543210',
    emailAddress: 'bruce.lee@jk.com',
    bloodGroup: 'A+',
    latitude: 72.0001,
    longitude: 87.1005,
    ipAddress: '192.168.0.1',
    address: '#1, 10 Downing street, Downtown, Hyderabad, India'
  };

  describe('# POST /api/donors', function () {
    it('should create a new donor', function (done) {
      (0, _supertestAsPromised2.default)(_index2.default).post('/api/donors').send(donor).expect(_httpStatus2.default.OK).then(function (res) {
        (0, _chai.expect)(res.body.firstName).to.equal(donor.firstName);
        (0, _chai.expect)(res.body.lastName).to.equal(donor.lastName);
        (0, _chai.expect)(res.body.mobileNumber).to.equal(donor.mobileNumber);
        (0, _chai.expect)(res.body.emailAddress).to.equal(donor.emailAddress);
        (0, _chai.expect)(res.body.bloodGroup).to.equal(donor.bloodGroup);
        (0, _chai.expect)(res.body.latitude).to.equal(donor.latitude);
        (0, _chai.expect)(res.body.longitude).to.equal(donor.longitude);
        (0, _chai.expect)(res.body.address).to.equal(donor.address);
        donor = res.body;
        done();
      });
    });
  });

  describe('# GET /api/donors/:donorId', function () {
    it('should get donor details', function (done) {
      (0, _supertestAsPromised2.default)(_index2.default).get('/api/donors/' + donor._id).expect(_httpStatus2.default.OK).then(function (res) {
        (0, _chai.expect)(res.body.firstName).to.equal(donor.firstName);
        (0, _chai.expect)(res.body.lastName).to.equal(donor.lastName);
        (0, _chai.expect)(res.body.mobileNumber).to.equal(donor.mobileNumber);
        (0, _chai.expect)(res.body.emailAddress).to.equal(donor.emailAddress);
        (0, _chai.expect)(res.body.bloodGroup).to.equal(donor.bloodGroup);
        (0, _chai.expect)(res.body.latitude).to.equal(donor.latitude);
        (0, _chai.expect)(res.body.longitude).to.equal(donor.longitude);
        (0, _chai.expect)(res.body.address).to.equal(donor.address);
        done();
      });
    });

    it('should report error with message - Not found, when donor does not exists', function (done) {
      (0, _supertestAsPromised2.default)(_index2.default).get('/api/donors/56c787ccc67fc16ccc1a5e92').expect(_httpStatus2.default.NOT_FOUND).then(function (res) {
        (0, _chai.expect)(res.body.message).to.equal('Not Found');
        done();
      });
    });
  });

  describe('# PUT /api/donors/:donorId', function () {
    it('should update donor details', function (done) {
      donor.firstName = 'John';
      (0, _supertestAsPromised2.default)(_index2.default).put('/api/donors/' + donor._id).send(donor).expect(_httpStatus2.default.OK).then(function (res) {
        (0, _chai.expect)(res.body.firstName).to.equal('John');
        (0, _chai.expect)(res.body.lastName).to.equal(donor.lastName);
        (0, _chai.expect)(res.body.mobileNumber).to.equal(donor.mobileNumber);
        (0, _chai.expect)(res.body.emailAddress).to.equal(donor.emailAddress);
        (0, _chai.expect)(res.body.bloodGroup).to.equal(donor.bloodGroup);
        (0, _chai.expect)(res.body.latitude).to.equal(donor.latitude);
        (0, _chai.expect)(res.body.longitude).to.equal(donor.longitude);
        //expect(res.body.ipAddress).to.equal(donor.ipAddress);
        (0, _chai.expect)(res.body.address).to.equal(donor.address);
        done();
      });
    });
  });

  describe('# GET /api/donors/', function () {
    it('should get all donors', function (done) {
      (0, _supertestAsPromised2.default)(_index2.default).get('/api/donors').expect(_httpStatus2.default.OK).then(function (res) {
        (0, _chai.expect)(res.body).to.be.an('array');
        done();
      });
    });
  });

  describe('# DELETE /api/donors/', function () {
    it('should delete donor', function (done) {
      (0, _supertestAsPromised2.default)(_index2.default).delete('/api/donors/' + donor._id).expect(_httpStatus2.default.OK).then(function (res) {
        (0, _chai.expect)(res.body.firstName).to.equal('John');
        (0, _chai.expect)(res.body.lastName).to.equal(donor.lastName);
        (0, _chai.expect)(res.body.mobileNumber).to.equal(donor.mobileNumber);
        (0, _chai.expect)(res.body.emailAddress).to.equal(donor.emailAddress);
        (0, _chai.expect)(res.body.bloodGroup).to.equal(donor.bloodGroup);
        (0, _chai.expect)(res.body.latitude).to.equal(donor.latitude);
        (0, _chai.expect)(res.body.longitude).to.equal(donor.longitude);
        (0, _chai.expect)(res.body.address).to.equal(donor.address);
        done();
      });
    });
  });
});
//# sourceMappingURL=donor.test.js.map
