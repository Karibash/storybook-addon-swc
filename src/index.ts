import { Configuration } from 'webpack';
import { JsMinifyOptions } from '@swc/core';

import { replaceMinimizer } from './transformers';

export interface StoryBookAddonSwcOptions {
  enable: boolean;
  enableSwcMinify: boolean;
  swcMinifyOptions: JsMinifyOptions;
}

const defaultOptions: StoryBookAddonSwcOptions = {
  enable: true,
  enableSwcMinify: true,
  swcMinifyOptions: {},
};

const includeSwcConfig = (config: Configuration, options: StoryBookAddonSwcOptions): Configuration => {
  if (!options.enable) return config;

  const transformers = [];
  if (options.enableSwcMinify) transformers.push(replaceMinimizer(options.swcMinifyOptions));

  return transformers.reduce((previous, current) => {
    return current(previous);
  }, config);
};

export const webpack = (config: Configuration, options: Partial<StoryBookAddonSwcOptions>): Configuration => {
  const mergedOptions: StoryBookAddonSwcOptions = { ...defaultOptions, ...options };
  return includeSwcConfig(config, mergedOptions);
};

export const managerWebpack = (config: Configuration, options: Partial<StoryBookAddonSwcOptions>): Configuration => {
  const mergedOptions: StoryBookAddonSwcOptions = { ...defaultOptions, ...options };
  return includeSwcConfig(config, mergedOptions);
};
