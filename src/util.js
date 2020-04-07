const tagSeparator = '-tags=';

class Util {
  /**
   * Validate URL of server.
   * @param server
   */
  static validateUrl(server) {
    // TODO
  }

  static isEmpty(value) {
    return (
      (typeof value == 'string' && !value.trim()) ||
      typeof value == 'undefined' ||
      value === null
    );
  }

  static encodeKey(metricName, tags) {
    if (this.isEmpty(tags)) {
      return metricName;
    }
    let tagsType = Object.prototype.toString.call(tags).slice(8, -1);
    if (tagsType === 'Object') {
      // Sort the tags based on their keys to avoid duplicate metrics
      let tagsArray = Object.keys(tags)
        .sort()
        .map(key => [key, tags[key]]);
      return metricName + tagSeparator + JSON.stringify(tagsArray);
    }
    throw new Error(
      'Wrong Tags datatype sent to the API. Expected: Object. Actual: ' +
        tagsType
    );
  }

  static decodeKey(key) {
    let [metricName, tags] = [key, null];
    if (key.indexOf(tagSeparator) > -1) {
      [metricName, tags] = key.split(tagSeparator);
    }
    return [metricName, tags];
  }
}

module.exports = Util;
