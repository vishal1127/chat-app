const AWS = require("aws-sdk");

exports.uploadToS3 = (data, fileName) => {
  const BUCKET_NAME = process.env.BUCKET_NAME;
  const IAM_USER_ACCESS_KEY = process.env.IAM_USER_ACCESS_KEY;
  const IAM_USER_ACCESS_SECRET = process.env.IAM_USER_ACCESS_SECRET;
  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_ACCESS_KEY,
    secretAccessKey: IAM_USER_ACCESS_SECRET,
  });
  console.log("data>>>>>>>>>>>>", data);
  let params = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    ContentType: data.type,
    Body: data,
    ACL: "public-read",
  };
  return new Promise((resolve, reject) => {
    s3bucket.upload(params, function (err, res) {
      if (err) {
        console.log("Error in uploading file on s3 due to " + err);
        reject(err);
      } else {
        console.log("File successfully uploaded.", res);
        resolve(res.Location);
      }
    });
  });
};
