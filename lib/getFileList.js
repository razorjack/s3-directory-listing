import _ from 'lodash';
import fileTypes from './fileTypes';

function createBaseProps(obj) {
  return {
    fileName: _.last(obj.Key.split("/")),
    size: obj.Size,
    date: obj.LastModified
  }
}

function attachFileTypes(obj) {
  return {
    ...obj,
    fileType: "test"
  }
}

export default function getFileList(list) {
  return list.filter(e => !e.Key.endsWith("/"))
             .filter(e => !e.Key.endsWith("/index.html"))
             .map(createBaseProps);
}
