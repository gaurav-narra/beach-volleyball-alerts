'use strict';
const should = require('should');
const {currentSlots} = require(`${SRC}/alerts/current-slots`);
const nock = require('nock');
const config = require(`${SRC}/config`);

describe('current slots', () => {
  const loginDetails = {
    uuid: 'uuid',
    loginId: 'login-id'
  };

  it('should get squads page html', (done) => {
    nock(config.baseUrl)
      .get(config.squadPage)
      .reply(200, sampleHtml)
    currentSlots(loginDetails)
      .then((slots) => {
        slots.should.eql({
          'r1c1-r1c2-r1c3': {
            squad: 'r1c1',
            date: 'r1c2',
            coach: 'r1c3',
            sold: 'r1c4',
            left: 'r1c5'
          }
        })
        done()
      })
  })

  const sampleHtml = `
  <div id='text-container'>
    <table></table>
    <table>
      <tr></tr>
      <tr>
        <td>r1c1</td>
        <td>r1c2</td>
        <td>r1c3</td>
        <td>r1c4</td>
        <td>r1c5</td>
      </tr>
    </table>
  </div>
  `
})