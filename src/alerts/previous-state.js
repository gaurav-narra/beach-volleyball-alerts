const AWS = require('aws-sdk');
const config = require('../config');

const get = (s3 = new AWS.S3()) => {

  return s3.getObject({
    Bucket: config.s3Bucket,
    Key: config.s3Key
  })
  .promise()
  .then((data) => {
    return JSON.parse(data.Body.toString());
  })
}


const update = (data, s3 = new AWS.S3()) => {
  const base64data = new Buffer(JSON.stringify(data), 'binary');
  return s3.putObject({
    Bucket: config.s3Bucket,
    Key: config.s3Key,
    Body: base64data
  }).promise()
}

module.exports = {get, update}