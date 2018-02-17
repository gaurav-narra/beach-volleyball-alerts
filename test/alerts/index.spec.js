const sinon = require('sinon');
const previousState = require(`${SRC}/alerts/previous-state`);
const CurrentSlots = require(`${SRC}/alerts/current-slots`);
const Login = require(`${SRC}/alerts/login`);
const {alerts} = require(`${SRC}/alerts`);

describe('alerts', () => {
  let sandbox = sinon.sandbox.create();

  beforeEach(() => {
    sandbox.stub(previousState, 'get').returnsPromise();
    sandbox.stub(previousState, 'update').returnsPromise();
    sandbox.stub(CurrentSlots, 'currentSlots').returnsPromise();
    sandbox.stub(Login, 'login').returnsPromise();
  })

  afterEach(() => {
    sandbox.restore();
  })

  it('should get current slots using previous state login details', (done) => {
    previousState.get.resolves({ loginDetails: 'previous-login-details', slots: {a: {}} });
    CurrentSlots.currentSlots.resolves({a: {}});
    previousState.update.resolves();
    alerts()
      .then(() => {
        CurrentSlots.currentSlots.calledWith('previous-login-details').should.eql(true);
        done();
      });
  })

  it('should relogin when previous state login details expired', (done) => {
    previousState.get.resolves({ slots: {a: {}} });
    CurrentSlots.currentSlots.onCall(0).rejects();
    Login.login.resolves();
    CurrentSlots.currentSlots.onCall(1).resolves();
    previousState.update.resolves();

    alerts()
      .then(() => {
        Login.login.called.should.eql(true);
        done();
      })
  })

  it('should login and upload the current slots when running for the first time', (done) => {
    previousState.get.rejects();
    CurrentSlots.currentSlots.resolves();
    previousState.update.resolves();
    Login.login.resolves();

    alerts()
      .then(() => {
        Login.login.called.should.eql(true);
        CurrentSlots.currentSlots.called.should.eql(true);
        previousState.update.called.should.eql(true);
        done();
      })
  })

  it('should alert list of new slots added', (done) => {
    previousState.get.resolves({slots: {a: {}, b: {}, c: {}}});
    CurrentSlots.currentSlots.resolves({a: {}, b: {}, c: {}, d: {}, e: {}});
    previousState.update.resolves();

    alerts()
      .then((data) => {
        data.newSlots.should.eql(['d', 'e']);
        done()
      })

  })

  it('should alert if closed slot is reopened', (done) => {
    previousState.get.resolves({ slots: {a: {left: '0'}, b: {left: '0'}, c: {}} });
    CurrentSlots.currentSlots.resolves({a: {left: '1'}, b: {left: '1'}, c: {}});
    previousState.update.resolves();

    alerts()
      .then((data) => {
        data.withdrawnSlots.should.eql(['a', 'b']);
        done()
      })
  })

  it('should store current slots as previous for next run', () => {
    previousState.get.resolves({});
    CurrentSlots.currentSlots.resolves();
    previousState.update.resolves();
    alerts()
      .then(() => {
        previousState.update.called.should.eql(true)
        done();
      })
  })
})