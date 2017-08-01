import _ from 'lodash';

export default function getDirectoryList(list) {
  return _.map(list, e => e.Prefix.split("/").slice(-2)[0]);
}
