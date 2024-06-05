const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const uploadToS3 = (fileName, content) => {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileName,
    Body: JSON.stringify(content),
    ContentType: 'application/json',
  };
  return s3.upload(params).promise();
};

module.exports = { uploadToS3 };
