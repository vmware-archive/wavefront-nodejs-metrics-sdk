import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';

export default {
  input: 'src/index.js',
  output: [
    {
      name: 'WavefrontMetricSDK',
      file: 'dist/index.js',
      format: 'umd'
    }
  ],
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    babel(),
    uglify()
  ]
};
