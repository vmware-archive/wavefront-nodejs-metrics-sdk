const tagSeparator = '-tags=';

function isEmpty(value) {
  return (
    (typeof value == 'string' && !value.trim()) ||
    typeof value == 'undefined' ||
    value === null
  );
}

function encodeKey(metricName, tags) {
  if (this.isEmpty(tags)) {
    return metricName;
  }
  if (typeof tags === 'object') {
    // Sort the tags based on their keys to avoid duplicate metrics
    let tagsArray = Object.keys(tags)
      .sort()
      .map(key => [key, tags[key]]);
    return `${metricName}${tagSeparator}${JSON.stringify(tagsArray)}`;
  }
  throw new Error(
    'Wrong Tags datatype sent to the API. Expected: Object. Actual: ' + tagsType
  );
}

function decodeKey(key) {
  let [metricName, tags] = [key, null];
  if (key.indexOf(tagSeparator) > -1) {
    [metricName, tags] = key.split(tagSeparator);
  }
  return [metricName, tags];
}

export default {
  isEmpty,
  encodeKey,
  decodeKey
};
