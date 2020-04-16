import TaggedRegistry from './src/registry';
import WavefrontReporter from './src/wavefront-reporter';
import { wavefrontHistogram } from './src/wavefrontHistogram';

// Metrics Reporting Function Example.
function reportMetrics(server, token) {
  // Create tagged registry and reporter
  let reg = new TaggedRegistry();
  let wfReporter = new WavefrontReporter({
    server: server,
    token: token,
    source: 'wavefront-javascript-metrics',
    registry: reg,
    tags: { key1: 'val1', key2: 'val2' }
  }).reportMinuteDistribution();
  wfReporter.start(5000);

  // counter
  let c = reg.counter('request.counter', { key1: 'val1' });
  c.inc();

  // gauge
  let g = reg.gauge('request.gauge', () => 2 + Math.random(), {
    key1: 'val1'
  });

  // histogram
  let h = reg.histogram('request.duration.foo', { key1: 'val1' });
  h.update(50);

  // wavefront histogram
  let wf_h = wavefrontHistogram(reg, 'request.duration.wf', {
    key1: 'val1'
  });
  wf_h.update(1.0);
  wf_h.update(1.0);

  // meter
  let m = reg.meter('request.meter', { key1: 'val1' });
  m.mark(1);

  // timer
  let t = reg.timer('request.timer', { key1: 'val1' });
  t.update(50);

  // stop the reporter
  wfReporter.stop();
}

if (process.argv.length !== 4) {
  throw new Error(`Usage: node example.js <server> <token>`);
}
reportMetrics(process.argv[2], process.argv[3]);
