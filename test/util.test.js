const expect = require('chai').expect;
const describe = require('mocha').describe;
const it = require('mocha').it;
const Util = require('../src/util');

describe('encodeKey', function() {
  it('Test encode function on valid tag format', function() {
    let key11 = Util.encodeKey('http.request', { key1: 'val1' });
    expect(key11).to.equal('http.request-tags=[["key1","val1"]]');

    let key12 = Util.encodeKey('http.request', { key1: 'val2' });
    expect(key12).to.equal('http.request-tags=[["key1","val2"]]');

    let key = Util.encodeKey('http.request');
    expect(key).to.equal('http.request');
  });

  it('Test encode function on invalid tag format', function() {
    expect(function() {
      Util.encodeKey('http.request', '{"key1":"val1"}');
    }).throw(
      'Wrong Tags datatype sent to the API. Expected: Object. Actual: String'
    );
  });
});

describe('decodeKey', function() {
  it('Test Decode function', function() {
    let key11 = 'http.request-tags={"key1":"val1","key2":"val2"}';
    let decodedKey = Util.decodeKey(key11);
    expect(decodedKey[0]).to.equal('http.request');
    expect(decodedKey[1]).to.equal('{"key1":"val1","key2":"val2"}');

    let key = 'http.request';
    decodedKey = Util.decodeKey(key);
    expect(decodedKey[0]).to.equal('http.request');
    expect(decodedKey[1]).to.equal(null);
  });
});
