import TaggedRegistry from './registry';
import utils from './util';
const metrics = require('metrics');
const wavefrontSDK = require('wavefront-sdk-javascript');

/**
 * Register a Wavefront histogram with the given registry and returns the instance.
 * @param {TaggedRegistry} registry
 * @param name
 * @param tags
 * @return {WavefrontHistogram}
 */
function registerHistogram(registry, name, tags = null) {
  if (!name || !name.trim()) {
    throw 'invalid counter name';
  }

  const histogram = new WavefrontHistogram();
  if (registry instanceof TaggedRegistry) {
    name = utils.encodeKey(name, tags);
  }
  registry.addMetric(name, histogram);
  return histogram;
}

/**
 * Wavefront Histogram Meter.
 */
class WavefrontHistogram extends metrics.Histogram {
  /**
   * Construct a delegate Wavefront Histogram.
   * @param clockMillis -  A function which returns timestamp.
   */
  constructor(clockMillis = null) {
    super();
    this._delegate = new wavefrontSDK.WavefrontHistogramImpl(clockMillis);
  }

  update(value, timestamp = null) {
    this._delegate.update(value);
  }

  /**
   * Instantiate brand new WavefrontHistogramImpl().
   */
  clear() {
    this._delegate = new wavefrontSDK.WavefrontHistogramImpl();
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

  /**
   * Get Distribution w/o current minute bin.
   * @returns {wavefrontSDK.Distribution[]}
   */
  getDistribution() {
    return this._delegate.flushDistributions();
  }

  /**
   * Get Distribution for the current minute bin.
   * @returns {*}
   */
  getCurrentMinuteDistribution() {
    return this._delegate.getCurrentBin().toDistribution();
  }
}

export { registerHistogram, WavefrontHistogram };
