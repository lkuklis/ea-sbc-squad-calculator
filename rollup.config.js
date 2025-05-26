const { nodeResolve } = require('@rollup/plugin-node-resolve');
const terser = require('@rollup/plugin-terser');

module.exports = [
  // ES Module build
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.esm.js',
      format: 'es',
      sourcemap: true
    },
    plugins: [
      nodeResolve()
    ]
  },
  // CommonJS build
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'auto'
    },
    plugins: [
      nodeResolve()
    ]
  },
  // UMD build for browsers
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'SBCRatingCalculator',
      sourcemap: true
    },
    plugins: [
      nodeResolve()
    ]
  },
  // Minified UMD build
  {
    input: 'src/index.js',
    output: {
      file: 'dist/index.umd.min.js',
      format: 'umd',
      name: 'SBCRatingCalculator',
      sourcemap: true
    },
    plugins: [
      nodeResolve(),
      terser()
    ]
  }
];