import * as wavefrontSDK from '../../wavefront-sdk-javascript/src/index';
import utils from './util';
import { WavefrontHistogram } from './wavefrontHistogram';
const metrics = require('metrics');
const ScheduledReporter = metrics.ScheduledReporter;

const metricsFunctionMap = {
  counter: [counter => ['', counter.count]],
  gauge: [gauge => ['', gauge.value()]],
  meter: [
    meter => ['.count', meter.count],
    meter => ['.mean_rate', meter.meanRate()],
    meter => ['.m1_rate', meter.oneMinuteRate()],
    meter => ['.m5_rate', meter.fiveMinuteRate()],
    meter => ['.m15_rate', meter.fifteenMinuteRate()]
  ],
  timer: [
    timer => ['.count', timer.count()],
    timer => ['.mean_rate', timer.meanRate()],
    timer => ['.m1_rate', timer.oneMinuteRate()],
    timer => ['.m5_rate', timer.fiveMinuteRate()],
    timer => ['.m15_rate', timer.fifteenMinuteRate()]
  ],
  histogram: [
    h => ['.count', h.count],
    h => ['.min', h.min],
    h => ['.mean', h.mean()],
    h => ['.max', h.max],
    h => ['.stddev', h.stdDev()],
    h => ['.p50', h.percentiles([0.5])[0.5]],
    h => ['.p75', h.percentiles([0.75])[0.75]],
    h => ['.p95', h.percentiles([0.95])[0.95]],
    h => ['.p98', h.percentiles([0.98])[0.98]],
    h => ['.p99', h.percentiles([0.99])[0.99]],
    h => ['.p999', h.percentiles([0.999])[0.999]]
  ]
};

export default class WavefrontReporter extends ScheduledReporter {
  constructor({
    server,
    token,
    source = 'wavefront-javascript-metrics',
    registry = null,
    reportingInterval = 1,
    tags = null,
    enableRuntimeMetrics = false
  }) {
    super(registry);
    this.server = server;
    this.source = source;
    this.batchSize = 10000;
    this.wavefrontClient = new wavefrontSDK.WavefrontDirectClient({
      server: utils.validateUrl(server),
      token: token,
      batchSize: this.batchSize,
      flushIntervalSeconds: reportingInterval
    });
    this.histogramGranularity = new Set();
    this.enableRuntimeMetrics = enableRuntimeMetrics;

    this.flushCurrentHist = true;
    this.tags = !utils.isEmpty(tags) ? tags : {};
  }

  /**
   * Collect metrics from registry and report them to Wavefront.
   * TODO: With option to include current minute bin of histogram.
   */
  report() {
    // Get all the metrics
    let allMetrics = this.getMetrics();
    for (let metrics of [
      allMetrics.counters,
      allMetrics.gauges,
      allMetrics.meters,
      allMetrics.timers,
      allMetrics.histograms
    ]) {
      if (metrics.length > 0) {
        for (let m of metrics) {
          let [metricName, tags] = this._decodeMetric(m);
          // If Wavefront histogram, client send_distribution
          if (m instanceof WavefrontHistogram) {
            let distributions = m.getDistribution();
            if (this.flushCurrentHist) {
              distributions.push(m.getCurrentMinuteDistribution());
            }
            for (let dist of distributions) {
              this.wavefrontClient.sendDistribution(
                metricName,
                dist.centroids,
                this.histogramGranularity,
                dist.timestamp,
                this.source,
                tags
              );
            }
            continue;
          }
          // If metric, client send_metric
          for (let f of metricsFunctionMap[m.type]) {
            const [suffix, value] = f(m);
            console.log(metricName + suffix + ': ' + value);
            this.wavefrontClient.sendMetric(
              metricName + suffix,
              value,
              Date.now(),
              this.source,
              tags
            );
          }
        }
      }
    }
  }

  _decodeMetric(metric) {
    const [metricName, metricTagsArray] = utils.decodeKey(metric.name);
    const tagsArray = JSON.parse(metricTagsArray);
    let metricTags = {};
    if (tagsArray && tagsArray.length) {
      tagsArray.forEach(([key, value]) => (metricTags[key] = value));
    }
    const tags = Object.assign({}, metricTags, this.tags);
    return [metricName, tags];
  }

  /**
   * Flush the data and close the wavefront client
   */
  stop() {
    this.report();
    this.wavefrontClient.close();
  }

  reportMinuteDistribution() {
    this.histogramGranularity.add(wavefrontSDK.histogramGranularity.MINUTE);
    return this;
  }

  reportHourDistribution() {
    this.histogramGranularity.add(wavefrontSDK.histogramGranularity.HOUR);
    return this;
  }

  reportDayDistribution() {
    this.histogramGranularity.add(wavefrontSDK.histogramGranularity.DAY);
    return this;
  }
}
