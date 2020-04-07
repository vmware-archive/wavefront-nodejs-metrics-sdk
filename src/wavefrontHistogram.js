const metrics = require('metrics');
const histogramImpl = require('../../wavefront-sdk-javascript/src/index')
  .histogramImpl;
const Distribution = require('../../wavefront-sdk-javascript/src/index')
  .histogramImpl.Distribution;
const TaggedRegistry = require('./registry');

/**
 *
 * @param {TaggedRegistry} registry
 * @param name
 * @param tags
 * @return {WavefrontHistogram}
 */
function wavefrontHistogram(registry, name, tags = null) {
  // TODO: not tagged registry
  if (!name) {
    throw 'invalid counter name';
  }
  let histogram = new WavefrontHistogram();
  registry.addMetric(name, histogram);
  return histogram;
}

/**
 * Get Wavefront Histogram with the given name is in registry.
 * Return null if the given name doesn't exist
 */
function get(name, registry) {
  // TODO: delete function
  // TODO: not tagged registry
  if (registry.hasHistogram(name)) {
    return registry.histogram(name);
  }
  return null;
}

class WavefrontHistogram extends metrics.Histogram {
  constructor(clockMillis = null) {
    super();
    this._delegate = new histogramImpl.WavefrontHistogramImpl(clockMillis);
    this.update = value => this._delegate.update(value);
  }

  clear() {
    this._delegate = histogramImpl.WavefrontHistogramImpl();
  }

  getCount() {
    return this._delegate.getCount();
  }

  getSum() {
    return this._delegate.getSum();
  }

  getMax() {
    return this._delegate.getMax();
  }

  getMin() {
    return this._delegate.getMin();
  }

  getMean() {
    return this._delegate.getMean();
  }

  getStddev() {
    return this._delegate.stdDev();
  }

  // TODO
  getVar() {}
  getSnapshot() {}

  /**
   *
   * @returns {Distribution[]}
   */
  getDistribution() {
    return this._delegate.flushDistributions();
  }

  getCurrentMinuteDistribution() {
    return this._delegate.getCurrentBin().toDistribution();
  }
}

module.exports = {
  wavefrontHistogram,
  get,
  WavefrontHistogram
};
