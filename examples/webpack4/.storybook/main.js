const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

module.exports = {
  stories: [
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-essentials',
    '@storybook/addon-links',
    {
      name: 'storybook-addon-swc',
      options: {
        enable: process.env.BUILD_TOOL === 'swc',
      },
    },
  ],
  webpackFinal(config) {
    config.plugins.push(new SpeedMeasurePlugin());
    return config;
  },
};
