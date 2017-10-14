import _ from 'lodash';
import pluralize from 'pluralize';
import prettyBytes from 'pretty-bytes';

export default function summarizeFileList(list) {
  let size = _.sumBy(list, e => e.size);
  let count = list.length;
  let formattedSize = prettyBytes(size);
  let formattedCount = `${count} ${pluralize("file", count)}`;

  return `${formattedCount}, ${formattedSize} total`;
}
