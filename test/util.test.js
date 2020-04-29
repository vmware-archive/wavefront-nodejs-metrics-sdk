import { expect } from 'chai';
import { describe } from 'mocha';
import { it } from 'mocha';

import util from '../src/util';

describe('encodeKey', function() {
  it('Test encode function on valid tag format', function() {
    let key11 = util.encodeKey('http.request', { key1: 'val1' });
    expect(key11).to.equal('http.request-tags=[["key1","val1"]]');

    let key12 = util.encodeKey('http.request', { key1: 'val2' });
    expect(key12).to.equal('http.request-tags=[["key1","val2"]]');

    let key = util.encodeKey('http.request');
    expect(key).to.equal('http.request');
  });

  it('Test encode function on invalid tag format', function() {
    expect(function() {
      util.encodeKey('http.request', '{"key1":"val1"}');
    }).throw(
      'Wrong Tags datatype sent to the API. Expected: Object. Actual: String'
    );
  });
});

describe('decodeKey', function() {
  it('Test Decode function', function() {
    let key11 = 'http.request-tags={"key1":"val1","key2":"val2"}';
    let decodedKey = util.decodeKey(key11);
    expect(decodedKey[0]).to.equal('http.request');
    expect(decodedKey[1]).to.equal('{"key1":"val1","key2":"val2"}');

    let key = 'http.request';
    decodedKey = util.decodeKey(key);
    expect(decodedKey[0]).to.equal('http.request');
    expect(decodedKey[1]).to.equal(null);
  });
});
