import _ from 'lodash';
import fileTypes from './fileTypes';
import prettyBytes from 'pretty-bytes';
import moment from 'moment';

function createBaseProps(obj) {
  return {
    fileName: _.last(obj.Key.split("/")),
    size: obj.Size,
    date: obj.LastModified,
  }
}

function attachFileTypes(obj) {
  let extension = _.last(obj.fileName.split("."));
  return {
    ...obj,
    fileType: _.findKey(fileTypes, val => val.includes(extension)) || 'fa-file-o'
  }
}

function attachHumanDate(obj) {
  return {
    ...obj,
    humanDate: moment(obj.date).format('MMMM Do YYYY')
  }
}

function attachHumanSize(obj) {
  return {
    ...obj,
    humanSize: prettyBytes(obj.size)
  }
}

export default function getFileList(list) {
  return list.filter(e => !e.Key.endsWith("/"))
             .filter(e => !e.Key.endsWith("/index.html"))
             .map(createBaseProps)
             .map(attachHumanSize)
             .map(attachHumanDate)
             .map(attachFileTypes);
}
