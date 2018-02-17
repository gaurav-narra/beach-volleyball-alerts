'use strict';
const should = require('should');
const {login} = require(`${SRC}/alerts/login`);
const nock = require('nock');
const config = require(`${SRC}/config`);

describe('login', () => {
  beforeEach(() => {
    nock(config.baseUrl)
      .get(config.indexPage)
      .reply(200, 'any-response', {
        'set-cookie': ['PHPSESSID=1234uuid1234; path=/; HttpOnly']
      })

    nock(config.baseUrl)
      .post(config.indexPage)
      .reply(200, 'any-response', {
        'set-cookie': ['login_id=1234loginid1234; PHPSESSID=1234abcd1234; path=/; HttpOnly']
      })
  })

  it('should get php session', (done) => {
    login()
      .then((loginDetails) => {
        loginDetails.uuid.should.eql('1234uuid1234')
        done()
      })
  })

  it('should read user name and password from env variables', () => {

  })

  it('should login and return login id', (done) => {
    login()
      .then((loginDetails) => {
        loginDetails.loginId.should.eql('1234loginid1234')
        done()
      })
  })
})