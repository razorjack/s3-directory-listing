'use strict';

// var S3 = require('aws-sdk/clients/s3');
import S3 from 'aws-sdk/clients/s3';
import path from 'path';
const s3 = new S3({ apiVersion: '2006-03-01' });

export const generateListing = function(event, context, callback) {
  console.log("New version!");
  // Get the object from the event and show its content type
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
  const dirname = path.dirname(key);
  const params = {
    Bucket: bucket,
    Key: key,
  };
  if (key.endsWith("/index.html")) {
    console.log("index.html: skipping");
    return;
  }
  s3.listObjectsV2({ Bucket: bucket, Prefix: dirname + "/" }, (err, data) => {
    if (err) { console.log(err); throw err; }
    var newList = [];
    for (var val of data.Contents) {
      if (!val.Key) { continue }
      let filename = val.Key.replace(dirname + "/", "");
      if (filename) {
        newList.push({ name: filename, size: val.Size, date: val.LastModified });
      }
    }

    console.log(newList);
    var params = {
      Body: JSON.stringify(newList),
      Bucket: bucket,
      Key: dirname + "/index.html"
    };
    console.log(params);
    s3.putObject(params, function (err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else console.log(data);           // successful response
    });
  });
};
