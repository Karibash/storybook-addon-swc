import { Configuration } from 'webpack';
import { Config, JsMinifyOptions } from '@swc/core';
import { Options } from '@storybook/core-common';
import merge from 'deepmerge';

import { replaceLoader, replaceMinimizer, disableSourceMap } from './transformers';

export interface StoryBookAddonSwcOptions {
  enable: boolean;
  enableSwcLoader: boolean;
  enableSwcMinify: boolean;
  swcLoaderOptions: Config;
  swcMinifyOptions: JsMinifyOptions;
}

const isProduction = process.env.NODE_ENV === 'production';
const defaultOptions: StoryBookAddonSwcOptions = {
  enable: true,
  enableSwcLoader: true,
  enableSwcMinify: true,
  swcLoaderOptions: {
    sourceMaps: !isProduction,
    jsc: {
      parser: {
        syntax: 'typescript',
        tsx: true,
      },
      transform: {
        react: {
          runtime: 'automatic',
        },
      },
    },
  },
  swcMinifyOptions: {
    compress: {
      inline: 0,
    },
  },
};

const includeSwcConfig = (config: Configuration, options: StoryBookAddonSwcOptions): Configuration => {
  if (!options.enable) return config;

  const transformers = [];
  if (options.enableSwcLoader) transformers.push(replaceLoader(options.swcLoaderOptions));
  if (options.enableSwcMinify) transformers.push(replaceMinimizer(options.swcMinifyOptions));
  if (!options.swcLoaderOptions.sourceMaps) transformers.push(disableSourceMap);

  return transformers.reduce((previous, current) => {
    return current(previous);
  }, config);
};

const addonFilePattern = /storybook-addon-swc(.(cjs|esm))?.js/;
const getAddonOptions = (options: Options): StoryBookAddonSwcOptions => {
  const addonOptions = options.presetsList?.find(preset => addonFilePattern.test(preset.name)).options ?? {};
  return merge(defaultOptions, addonOptions);
};

export const webpack = (config: Configuration, options: Options): Configuration => {
  return includeSwcConfig(config, getAddonOptions(options));
};

export const managerWebpack = (config: Configuration, options: Options): Configuration => {
  return includeSwcConfig(config, getAddonOptions(options));
};
