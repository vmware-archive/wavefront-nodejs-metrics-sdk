import utils from './util';
const metrics = require('metrics');
const Report = metrics.Report;

/**
 * Tagged Metrics Registry.
 */
export default class TaggedRegistry extends Report {
  constructor() {
    super();
  }

  /**
   * Return metric if key exist, otherwise create a new one
   * @param metricName
   * @param tags
   * @param construct
   * @param supplier
   * @returns {any | metrics.Meter | metrics.Timer | metrics.Counter | metrics.Histogram | metrics.Gauge|metrics.Metric}
   */
  _getOrAddMetric(metricName, tags, construct, supplier = null) {
    let encodedName = utils.encodeKey(metricName, tags);
    let metric = this.getMetric(encodedName);
    if (metric) return metric;

    metric = supplier ? new construct(supplier) : new construct();
    this.addMetric(encodedName, metric);
    return metric;
  }

  /**
   * Get a counter based on a encoded key.
   * @param key
   * @param tags
   * @returns metrics.Counter
   */
  counter(key, tags = null) {
    return this._getOrAddMetric(key, tags, metrics.Counter);
  }

  /**
   * Get a gauge based on a encoded key.
   * @param key
   * @param supplier
   * @param tags
   * @returns metrics.Gauge
   */
  gauge(key, supplier, tags = null) {
    return this._getOrAddMetric(key, tags, metrics.Gauge, supplier);
  }

  /**
   * Get a histogram based on a encoded key.
   * @param key
   * @param tags
   * @returns metrics.Histogram
   */
  histogram(key, tags = null) {
    return this._getOrAddMetric(key, tags, metrics.Histogram);
  }

  /**
   * Get a meter based on a encoded key.
   * @param key
   * @param tags
   * @returns metrics.Meter
   */
  meter(key, tags = null) {
    return this._getOrAddMetric(key, tags, metrics.Meter);
  }

  /**
   * Get a timer based on a encoded key.
   * @param key
   * @param tags
   * @returns metrics.Timer
   */
  timer(key, tags = null) {
    return this._getOrAddMetric(key, tags, metrics.Timer);
  }

  /**
   * Return True if given key matches any counters.
   * @param key
   * @param tags
   * @returns {boolean}
   */
  hasCounter(key, tags = null) {
    return this.getMetrics().counters.indexOf(utils.encodeKey(key, tags)) >= 0;
  }

  /**
   * Return True if given key matches any histograms.
   * @param key
   * @param tags
   * @returns {boolean}
   */
  hasHistogram(key, tags = null) {
    return (
      this.getMetrics().histograms.indexOf(utils.encodeKey(key, tags)) >= 0
    );
  }

  /**
   * Return True if given key matches any gauges.
   * @param key
   * @param tags
   * @returns {boolean}
   */
  hasGauge(key, tags = null) {
    return this.getMetrics().gauges.indexOf(utils.encodeKey(key, tags)) >= 0;
  }

  /**
   * Return True if given key matches any meters.
   * @param key
   * @param tags
   * @returns {boolean}
   */
  hasMeter(key, tags = null) {
    return this.getMetrics().meters.indexOf(utils.encodeKey(key, tags)) >= 0;
  }

  /**
   * Return True if given key matches any timers.
   * @param key
   * @param tags
   * @returns {boolean}
   */
  hasTimer(key, tags = null) {
    return this.getMetrics().timers.indexOf(utils.encodeKey(key, tags)) >= 0;
  }
}
