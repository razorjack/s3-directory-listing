import S3 from 'aws-sdk/clients/s3';
import path from 'path';
const s3 = new S3({ apiVersion: '2006-03-01' });

import template from './index.pug';
import getDirectoryList from './lib/getDirectoryList';
import getFileList from './lib/getFileList';
import summarizeFileList from './lib/summarizeFileList';

export const generateListing = function(event, context, callback) {
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
  s3.listObjectsV2({ Bucket: bucket, Prefix: dirname + "/", Delimiter: "/" }, (err, data) => {
    if (err) { console.log(err); throw err; }

    let directories = getDirectoryList(data.CommonPrefixes);
    let files = getFileList(data.Contents);
    let summary = summarizeFileList(files);
    var html = template({files, directories, summary});
    var params = {
      Body: html,
      Bucket: bucket,
      Key: dirname + "/index.html"
    };
    s3.putObject(params, function (err, data) {
      if (err) { console.log(err, err.stack); }
      else { }
    });
  });
};
