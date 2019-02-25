import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

export const aws = new AWS.S3({
  apiVersion: process.env.AWS_VERSION,
  region: process.env.AWS_REGION
});

export default aws;
