import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai from 'chai';
import { expect } from 'chai';
import app from '../../index';

chai.config.includeStack = true;

describe('## Donor APIs', () => {
  let donor = {
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

  describe('# POST /api/donors', () => {
    it('should create a new donor', (done) => {
      request(app)
        .post('/api/donors')
        .send(donor)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.firstName).to.equal(donor.firstName);
          expect(res.body.lastName).to.equal(donor.lastName);
          expect(res.body.mobileNumber).to.equal(donor.mobileNumber);
          expect(res.body.emailAddress).to.equal(donor.emailAddress);
          expect(res.body.bloodGroup).to.equal(donor.bloodGroup);
          expect(res.body.latitude).to.equal(donor.latitude);
          expect(res.body.longitude).to.equal(donor.longitude);
          //expect(res.body.ipAddress).to.equal(donor.ipAddress);
          expect(res.body.address).to.equal(donor.address);
          donor = res.body;
          done();
        });
    });
  });

  describe('# GET /api/donors/:donorId', () => {
    it('should get donor details', (done) => {
      request(app)
        .get(`/api/donors/${donor._id}`)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.firstName).to.equal(donor.firstName);
          expect(res.body.lastName).to.equal(donor.lastName);
          expect(res.body.mobileNumber).to.equal(donor.mobileNumber);
          expect(res.body.emailAddress).to.equal(donor.emailAddress);
          expect(res.body.bloodGroup).to.equal(donor.bloodGroup);
          expect(res.body.latitude).to.equal(donor.latitude);
          expect(res.body.longitude).to.equal(donor.longitude);
          //expect(res.body.ipAddress).to.equal(donor.ipAddress);
          expect(res.body.address).to.equal(donor.address);
          done();
        });
    });

    it('should report error with message - Not found, when donor does not exists', (done) => {
      request(app)
        .get('/api/donors/56c787ccc67fc16ccc1a5e92')
        .expect(httpStatus.NOT_FOUND)
        .then(res => {
          expect(res.body.message).to.equal('Not Found');
          done();
        });
    });
  });

  describe('# PUT /api/donors/:donorId', () => {
    it('should update donor details', (done) => {
      donor.firstName = 'John';
      request(app)
        .put(`/api/donors/${donor._id}`)
        .send(donor)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.firstName).to.equal('John');
          expect(res.body.lastName).to.equal(donor.lastName);
          expect(res.body.mobileNumber).to.equal(donor.mobileNumber);
          expect(res.body.emailAddress).to.equal(donor.emailAddress);
          expect(res.body.bloodGroup).to.equal(donor.bloodGroup);
          expect(res.body.latitude).to.equal(donor.latitude);
          expect(res.body.longitude).to.equal(donor.longitude);
          //expect(res.body.ipAddress).to.equal(donor.ipAddress);
          expect(res.body.address).to.equal(donor.address);
          done();
        });
    });
  });

  describe('# GET /api/donors/', () => {
    it('should get all donors', (done) => {
      request(app)
        .get('/api/donors')
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });

  describe('# DELETE /api/donors/', () => {
    it('should delete donor', (done) => {
      request(app)
        .delete(`/api/donors/${donor._id}`)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.firstName).to.equal('John');
          expect(res.body.lastName).to.equal(donor.lastName);
          expect(res.body.mobileNumber).to.equal(donor.mobileNumber);
          expect(res.body.emailAddress).to.equal(donor.emailAddress);
          expect(res.body.bloodGroup).to.equal(donor.bloodGroup);
          expect(res.body.latitude).to.equal(donor.latitude);
          expect(res.body.longitude).to.equal(donor.longitude);
          //expect(res.body.ipAddress).to.equal(donor.ipAddress);
          expect(res.body.address).to.equal(donor.address);
          done();
        });
    });
  });
});
