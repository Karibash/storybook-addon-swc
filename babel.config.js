module.exports = {
  presets: [
    ['@babel/preset-env', { loose: true }],
    '@babel/preset-typescript',
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', { version: require('@babel/runtime/package.json').version }],
  ],
};
