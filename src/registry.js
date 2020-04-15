import utils from './util';
const metrics = require('metrics');
const Report = metrics.Report;

export default class TaggedRegistry extends Report {
  constructor() {
    super();
  }

  // return metric if key exist, otherwise create a new one
  _getOrAddMetric(metricName, tags, construct, supplier = null) {
    let encodedName = utils.encodeKey(metricName, tags);
    let metric = this.getMetric(encodedName);
    if (metric) return metric;

    metric = supplier ? new construct(supplier) : new construct();
    this.addMetric(encodedName, metric);
    return metric;
  }

  counter(key, tags = null) {
    return this._getOrAddMetric(key, tags, metrics.Counter);
  }

  gauge(key, supplier, tags = null) {
    return this._getOrAddMetric(key, tags, metrics.Gauge, supplier);
  }

  histogram(key, tags = null) {
    return this._getOrAddMetric(key, tags, metrics.Histogram);
  }

  meter(key, tags = null) {
    return this._getOrAddMetric(key, tags, metrics.Meter);
  }

  timer(key, tags = null) {
    return this._getOrAddMetric(key, tags, metrics.Timer);
  }

  hasHistogram(key, tags = null) {
    let encodedName = utils.encodeKey(key, tags);
    return this.getMetrics().histograms.indexOf(encodedName) >= 0;
  }
}
