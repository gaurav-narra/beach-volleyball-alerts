const IncomingWebhook = require('@slack/client').IncomingWebhook;
const config = require('./../config');

const slack = (alerts) => {
  const webhook = new IncomingWebhook(config.slack.url, {
    username: config.slack.username,
    channel: config.slack.channel
  });
  return new Promise((resolve, reject) => {
    webhook.send({attachments: slackPayload(alerts)}, (err) => {
      if(err) return reject();
      return resolve();
    });
  });
}

const slackPayload = (alerts) => {
  const payload = []
  alerts.newSlots.forEach((slot) => {
    payload.push({
      fallback: 'new squads have been added',
      color: '#1A7645',
      title: 'New squads',
      text: `<!here> ${slot}`
    })
  })

  alerts.withdrawnSlots.forEach((slot) => {
    payload.push({
      fallback: 'spot in full squad available',
      color: '#DBD329',
      title: 'withdrawn from full Squad',
      text: `<!here> spot in ${slot} is available`
    })
  })

  return payload
}

module.exports = {slack}