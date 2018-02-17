const request = require('request-promise');
const config = require('../config');
const {JSDOM} = require('jsdom');

const currentSlots = (loginDetails) => {
  const soltsRequestOptions = {
    url: `${config.baseUrl}${config.squadPage}`,
    timeout: config.defaultTimeout,
    headers: {
      'Cookie': `login_id=${loginDetails.loginId}; PHPSESSID=${loginDetails.uuid}`,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

  return request(soltsRequestOptions)
    .then((body) => {
      const { document } = (new JSDOM(body)).window
      return parseHtml(body);
    })
}


const parseHtml = (html) => {
  const { document } = (new JSDOM(html)).window;
  const rows = document
    .getElementById('text-container')
    .getElementsByTagName('table')[1]
    .getElementsByTagName('tr');

  const headers = ['squad', 'date', 'coach', 'sold', 'left'];
  let slots = {};

  for(let i = 1; i < rows.length; i++){
    let columns = rows[i].getElementsByTagName('td');
    let slot = {};
    for(let j = 0; j < headers.length; j++) {
      slot[headers[j]] = columns[j].innerHTML;
    }
    let slotKey = `${slot.squad}-${slot.date}-${slot.coach}`
    slots[slotKey] = slot;
  }

  return slots;
}

module.exports = {currentSlots};