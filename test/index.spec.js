const sinon = require('sinon');
const Alerts = require(`${SRC}/alerts`);
const notify = require(`${SRC}/notify`);
const beachVolleyBallAlerts = require(`${SRC}`);

describe('beach-volleyball-alerts', () => {
  let sandbox = sinon.sandbox.create();

  beforeEach(() => {
    sandbox.stub(Alerts, 'alerts');
    sandbox.stub(notify, 'slack');
  })

  afterEach(() => {
    sandbox.restore();
  })

  it('should get the list of alerts', (done) => {
    Alerts.alerts.resolves({});
    beachVolleyBallAlerts()
      .then(() => {
        Alerts.alerts.called.should.eql(true);
        done()
      })
  })

  it('should notify alerts', (done) => {
    Alerts.alerts.resolves('alerts');
    beachVolleyBallAlerts()
      .then(() => {
        notify.slack.calledWith('alerts').should.eql(true);
        done()
      })
  })
})