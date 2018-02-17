const previousState = require(`${SRC}/alerts/previous-state`);
const sinon = require('sinon');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

describe('previous state', () => {
  it('should get the previous state from s3', (done) => {
    sinon.stub(s3, 'getObject');
    s3.getObject.returns({
      promise: () => {
        return Promise.resolve()
      }
    })
    previousState.get()
      .then(() => done())
  })

  it('should update current state object in s3', (done) => {
    sinon.stub(s3, 'putObject');
    s3.putObject.returns({
      promise: () => {
        return Promise.resolve()
      }
    })
    previousState.update({}).then(() => done())
  })
})