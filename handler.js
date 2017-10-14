import S3 from 'aws-sdk/clients/s3';
import path from 'path';
const s3 = new S3({ apiVersion: '2006-03-01' });

import template from './index.pug';
import getDirectoryList from './lib/getDirectoryList';
import getFileList from './lib/getFileList';
import summarizeFileList from './lib/summarizeFileList';
import getBreadcrumbs from './lib/getBreadcrumbs';

function processDirectoryInBucket(directory, bucket) {
  s3.listObjectsV2({ Bucket: bucket, Prefix: directory + "/", Delimiter: "/" }, (err, data) => {
    if (err) { console.log(err); throw err; }

    let directories = getDirectoryList(data.CommonPrefixes);
    let files = getFileList(data.Contents);
    let summary = summarizeFileList(files);
    let breadcrumbs = getBreadcrumbs(directory);
    let pathToUp = breadcrumbs[breadcrumbs.length - 2] ? breadcrumbs[breadcrumbs.length - 2].path : false;
    let darkTheme = process.env.darkTheme == "true";
    var html = template({files, directories, summary, breadcrumbs, pathToUp, darkTheme});
    var params = {
      Body: html,
      Bucket: bucket,
      ContentType: "text/html",
      Key: directory + "/index.html"
    };

    if (files.length + directories.length === 0) {
      console.log("empty directory: skipping");
      return;
    }

    s3.putObject(params, function (err, data) {
      if (err) { console.log(err, err.stack); }
      else { }
    });
  });
}

export const generateListing = function(event, context, callback) {
  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
  if (key.endsWith("/index.html")) {
    console.log("index.html: skipping");
    return;
  }
  const bucket = event.Records[0].s3.bucket.name;
  const currentDirectory = path.dirname(key);
  const parentDirectory = path.normalize(currentDirectory + "/..")

  if (currentDirectory === ".") {
    console.log("root directory: skipping")
    return;
  }

  processDirectoryInBucket(currentDirectory, bucket);
  if (parentDirectory !== ".") {
    processDirectoryInBucket(parentDirectory, bucket);
  }

};
