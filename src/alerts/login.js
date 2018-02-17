'use strict';
const request = require('request-promise').defaults({ simple: false });;
const config = require('../config');
const ms = require('ms')

const login = () => {
  return getPhpSession()
    .then(phpSessionId => {
      return loginDetails(phpSessionId)
    })
}

const getPhpSession = () => {
  const indexRequestOptions = {
    url: `${config.baseUrl}${config.indexPage}`,
    timeout: ms(config.defaultTimeout),
    resolveWithFullResponse: true
  }

  const phpSessidRegex = /PHPSESSID=([\w-]*);.*$/

  return request(indexRequestOptions)
    .then(response => {
      return response.headers['set-cookie'][0].match(phpSessidRegex)[1];
    })
}

const loginDetails = (phpSessionId) => {
  const loginRequestOptions = {
    method: 'POST',
    url: `${config.baseUrl}${config.indexPage}`,
    timeout: ms(config.defaultTimeout),
    resolveWithFullResponse: true,
    form: {
      login_name: config.userName,
      login_password: config.password,
      form_submitted: 'yes'
    },
    headers: {
      'Cookie': `PHPSESSID=${phpSessionId}`,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

  const loginIdRegex = /^.*login_id=([\w-]*);.*$/

  return request(loginRequestOptions)
    .then(response => {
      return {
        uuid: phpSessionId,
        loginId: response.headers['set-cookie'][0].match(loginIdRegex)[1]
      }
    })
}

module.exports = {login};
