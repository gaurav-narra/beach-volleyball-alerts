const Alerts = require('./alerts');
const notify = require('./notify');

const beachVolleyballAlerts = () => {
  return Alerts.alerts()
    .then((data) => {
      return notify.slack(data)
    })
}

module.exports = beachVolleyballAlerts;