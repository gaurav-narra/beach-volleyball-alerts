const beachVolleyballAlerts = require('./index');

module.exports.lambdaHandler = (event, callback, context) => {
  console.log('Starting the task');
  return beachVolleyballAlerts();
}