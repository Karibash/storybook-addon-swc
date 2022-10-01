import { Configuration, ModuleOptions, RuleSetRule } from 'webpack';
import { Options as SWCLoaderOptions, JsMinifyOptions } from '@swc/core';

const babelLoaderPattern = /babel-loader/;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createSwcLoader = (options: SWCLoaderOptions): Record<string, any> => {
  return {
    loader: require.resolve('swc-loader'),
    options: {
      parseMap: !!options.sourceMaps,
      ...options,
    },
  };
};

export const replaceRuleSetRule = (rule: ModuleOptions['rules'][0], options: SWCLoaderOptions): RuleSetRule => {
  if (!('test' in rule && rule.test instanceof RegExp)) return rule;
  if (!rule.test.test('dummy.js') && !rule.test.test('dummy.ts')) return rule;

  if (rule.oneOf) {
    return {
      ...rule,
      oneOf: rule.oneOf.map(rule => replaceRuleSetRule(rule, options)),
    };
  }

  if (rule.loader) {
    if (!babelLoaderPattern.test(rule.loader)) return rule;
    return { ...rule, loader: undefined, use: [createSwcLoader(options)] };
  }

  if (typeof rule.use === 'string') {
    if (!babelLoaderPattern.test(rule.use)) return rule;
    return { ...rule, use: [createSwcLoader(options)] };
  }

  if (Array.isArray(rule.use)) {
    return {
      ...rule,
      use: rule.use.map(item => {
        if (typeof item === 'string' && item.includes('babel-loader')) {
          return createSwcLoader(options);
        }
        if (typeof item.loader === 'string' && babelLoaderPattern.test(item.loader)) {
          return createSwcLoader(options);
        }
        return item;
      }),
    };
  }

  return rule;
};

export const replaceLoader = (options: SWCLoaderOptions): (config: Configuration) => Configuration => {
  return (config: Configuration) => ({
    ...config,
    module: {
      ...config.module,
      rules: config.module?.rules?.map(rule => replaceRuleSetRule(rule, options)),
    },
  });
};

export const replaceMinimizer = (options: JsMinifyOptions): (config: Configuration) => Configuration => {
  const TerserPlugin = require('terser-webpack-plugin');
  return (config: Configuration) => ({
    ...config,
    optimization: {
      ...config.optimization,
      minimizer: 0 < config.optimization?.minimizer?.length
        ? [new TerserPlugin({
            minify: TerserPlugin.swcMinify,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            terserOptions: options as any,
          })]
        : [],
    },
  });
};

export const disableSourceMap = (config: Configuration): Configuration => {
  return {
    ...config,
    devtool: false,
  };
};
