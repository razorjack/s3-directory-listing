import 'babel-polyfill';

import { expect } from 'chai';

import { files, directories } from './fixtures';
import getDirectoryList from '../src/lib/getDirectoryList';
import getFileList from '../src/lib/getFileList';
import summarizeFileList from '../src/lib/summarizeFileList';
import getBreadcrumbs from '../src/lib/getBreadcrumbs';

describe('getDirectoryList', () => {
  it('returns directory list', () => {
    const expectedResult = ["demos", "images", "javascripts", "layouts", "stylesheets"];
    expect(getDirectoryList(directories)).to.eql(expectedResult);
  });
});

describe('getFileList', () => {
  it('returns processed file list', () => {
    let result = getFileList(files);
    expect(result.length).to.equal(2);
  });

  it('determines file type', () => {
    let result = getFileList(files);
    expect(result[0].fileType).to.equal("fa-file-code-o");
  });

  it('formats file size', () => {
    let result = getFileList(files);
    expect(result[0].humanSize).to.equal("12.2 kB");
  });

  it('formats date', () => {
    let result = getFileList(files);
    expect(result[0].humanDate).to.equal("July 30th 2017");
  });
});

describe('summarize', () => {
  it('provides a file list summary', () => {
    expect(summarizeFileList(getFileList(files))).to.eql("2 files, 16.2 kB total");
  });
});


describe('getBreadcrumbs', () => {
  it('provides a list of breadcrumb items for path with one component', () => {
    let expectedResults = [
      {
        active: true,
        name: "test",
        path: "/test"
      },
    ];
    expect(getBreadcrumbs("test")).to.eql(expectedResults);
  });

  it('provides a list of breadcrumb items for path with multiple components', () => {
    let expectedResults = [
      {
        active: false,
        name: "test",
        path: "/test"
      },
      {
        active: false,
        name: "quicksand-site",
        path: "/test/quicksand-site"
      },
      {
        active: true,
        name: "source",
        path: "/test/quicksand-site/source"
      }
    ];
    expect(getBreadcrumbs("test/quicksand-site/source")).to.eql(expectedResults);
  });
});
