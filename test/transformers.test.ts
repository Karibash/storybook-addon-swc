import { ModuleOptions } from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';

import { createSwcLoader, replaceRuleSetRule, replaceLoader, replaceMinimizer } from '../src/transformers';

const swcLoaderPattern = /swc-loader/;
const babelLoaderPattern = /babel-loader/;

const curriedReplaceRuleSetRule = (rule: ModuleOptions['rules'][0]): ModuleOptions['rules'][0] => {
  return replaceRuleSetRule(rule, {});
};

const containsLoader = (pattern: RegExp, rule: ModuleOptions['rules'][0]): ModuleOptions['rules'][0] => {
  if (rule.oneOf) return rule.oneOf.some(rule => containsLoader(pattern, rule));
  if (pattern.test(rule.loader)) return true;
  if (typeof rule.use === 'string') {
    if (pattern.test(rule.use)) return true;
  }
  if (Array.isArray(rule.use)) {
    return rule.use.some(use => {
      if (typeof use === 'string') return pattern.test(use);
      if (typeof use === 'object') return pattern.test(use.loader);
      return false;
    });
  }
  return false;
};

describe('createSwcLoader', () => {
  it('Pass empty options', () => {
    const rule = createSwcLoader({});
    expect(rule.loader).toMatch(swcLoaderPattern);
    expect(rule.options).toEqual({ parseMap: false });
  });

  it('Pass options', () => {
    const options = { jsc: { parser: { syntax: 'typescript' } } } as const;
    const rule = createSwcLoader(options);
    expect(rule.loader).toMatch(swcLoaderPattern);
    expect(rule.options).toEqual({ parseMap: false, ...options });
  });

  it('Pass options with sourceMaps set to false', () => {
    const options = { sourceMaps: false } as const;
    const rule = createSwcLoader(options);
    expect(rule.loader).toMatch(swcLoaderPattern);
    expect(rule.options).toEqual({ parseMap: false, ...options });
  });

  it('Pass options with sourceMaps set to true', () => {
    const options = { sourceMaps: true } as const;
    const rule = createSwcLoader(options);
    expect(rule.loader).toMatch(swcLoaderPattern);
    expect(rule.options).toEqual({ parseMap: true, ...options });
  });
});

describe('replaceRuleSetRule', () => {
  describe('loader property by string', () => {
    it('Pass rules without the test option', () => {
      const rule = { loader: 'babel-loader' };
      expect(curriedReplaceRuleSetRule(rule)).toEqual(rule);
    });

    it('Pass rules where the test option is a string', () => {
      const rule = { test: 'dummy', loader: 'babel-loader' };
      expect(curriedReplaceRuleSetRule(rule)).toEqual(rule);
    });

    it('Pass rules where the test option is a regex of the html file', () => {
      const rule = { test: /\.html$/, loader: 'babel-loader' };
      expect(curriedReplaceRuleSetRule(rule)).toEqual(rule);
    });

    it('Pass rules where the test option is a regex of the javascript file', () => {
      const rule = curriedReplaceRuleSetRule({ test: /\.jsx?$/, loader: 'babel-loader' });
      expect(containsLoader(swcLoaderPattern, rule)).toBeTruthy();
      expect(containsLoader(babelLoaderPattern, rule)).toBeFalsy();
    });

    it('Pass rules where the test option is a regex of the typescript file', () => {
      const rule = curriedReplaceRuleSetRule({ test: /\.tsx?$/, loader: 'babel-loader' });
      expect(containsLoader(swcLoaderPattern, rule)).toBeTruthy();
      expect(containsLoader(babelLoaderPattern, rule)).toBeFalsy();
    });

    it('Pass rules where the test option is a regex of the javascript or typescript file', () => {
      const rule = curriedReplaceRuleSetRule({ test: /\.(jsx?|tsx?)$/, loader: 'babel-loader' });
      expect(containsLoader(swcLoaderPattern, rule)).toBeTruthy();
      expect(containsLoader(babelLoaderPattern, rule)).toBeFalsy();
    });

    it('Pass a loader other than babel-loader', () => {
      const rule = { test: /\.(jsx?|tsx?)$/, loader: 'dummy-loader' };
      expect(curriedReplaceRuleSetRule(rule)).toEqual(rule);
    });
  });

  describe('use property by string', () => {
    it('Pass rules without the test option', () => {
      const rule = { use: 'babel-loader' };
      expect(curriedReplaceRuleSetRule(rule)).toEqual(rule);
    });

    it('Pass rules where the test option is a string', () => {
      const rule = { test: 'dummy', use: 'babel-loader' };
      expect(curriedReplaceRuleSetRule(rule)).toEqual(rule);
    });

    it('Pass rules where the test option is a regex of the html file', () => {
      const rule = { test: /\.html$/, use: 'babel-loader' };
      expect(curriedReplaceRuleSetRule(rule)).toEqual(rule);
    });

    it('Pass rules where the test option is a regex of the javascript file', () => {
      const rule = curriedReplaceRuleSetRule({ test: /\.jsx?$/, use: 'babel-loader' });
      expect(containsLoader(swcLoaderPattern, rule)).toBeTruthy();
      expect(containsLoader(babelLoaderPattern, rule)).toBeFalsy();
    });

    it('Pass rules where the test option is a regex of the typescript file', () => {
      const rule = curriedReplaceRuleSetRule({ test: /\.tsx?$/, use: 'babel-loader' });
      expect(containsLoader(swcLoaderPattern, rule)).toBeTruthy();
      expect(containsLoader(babelLoaderPattern, rule)).toBeFalsy();
    });

    it('Pass rules where the test option is a regex of the javascript or typescript file', () => {
      const rule = curriedReplaceRuleSetRule({ test: /\.(jsx?|tsx?)$/, use: 'babel-loader' });
      expect(containsLoader(swcLoaderPattern, rule)).toBeTruthy();
      expect(containsLoader(babelLoaderPattern, rule)).toBeFalsy();
    });

    it('Pass a loader other than babel-loader', () => {
      const rule = { test: /\.(jsx?|tsx?)$/, use: 'dummy-loader' };
      expect(curriedReplaceRuleSetRule(rule)).toEqual(rule);
    });
  });

  describe('use property by string array', () => {
    it('Pass rules without the test option', () => {
      const rule = { use: ['babel-loader'] };
      expect(curriedReplaceRuleSetRule(rule)).toEqual(rule);
    });

    it('Pass rules where the test option is a string', () => {
      const rule = { test: 'dummy', use: ['babel-loader'] };
      expect(curriedReplaceRuleSetRule(rule)).toEqual(rule);
    });

    it('Pass rules where the test option is a regex of the html file', () => {
      const rule = { test: /\.html$/, use: ['babel-loader'] };
      expect(curriedReplaceRuleSetRule(rule)).toEqual(rule);
    });

    it('Pass rules where the test option is a regex of the javascript file', () => {
      const rule = curriedReplaceRuleSetRule({ test: /\.jsx?$/, use: ['babel-loader'] });
      expect(containsLoader(swcLoaderPattern, rule)).toBeTruthy();
      expect(containsLoader(babelLoaderPattern, rule)).toBeFalsy();
    });

    it('Pass rules where the test option is a regex of the typescript file', () => {
      const rule = curriedReplaceRuleSetRule({ test: /\.tsx?$/, use: ['babel-loader'] });
      expect(containsLoader(swcLoaderPattern, rule)).toBeTruthy();
      expect(containsLoader(babelLoaderPattern, rule)).toBeFalsy();
    });

    it('Pass rules where the test option is a regex of the javascript or typescript file', () => {
      const rule = curriedReplaceRuleSetRule({ test: /\.(jsx?|tsx?)$/, use: ['babel-loader'] });
      expect(containsLoader(swcLoaderPattern, rule)).toBeTruthy();
      expect(containsLoader(babelLoaderPattern, rule)).toBeFalsy();
    });

    it('Pass a loader other than babel-loader', () => {
      const rule = { test: /\.(jsx?|tsx?)$/, use: ['dummy-loader'] };
      expect(curriedReplaceRuleSetRule(rule)).toEqual(rule);
    });
  });

  describe('use property by object array', () => {
    it('Pass rules without the test option', () => {
      const rule = { use: [{ loader: 'babel-loader' }] };
      expect(curriedReplaceRuleSetRule(rule)).toEqual(rule);
    });

    it('Pass rules where the test option is a string', () => {
      const rule = { test: 'dummy', use: [{ loader: 'babel-loader' }] };
      expect(curriedReplaceRuleSetRule(rule)).toEqual(rule);
    });

    it('Pass rules where the test option is a regex of the html file', () => {
      const rule = { test: /\.html$/, use: [{ loader: 'babel-loader' }] };
      expect(curriedReplaceRuleSetRule(rule)).toEqual(rule);
    });

    it('Pass rules where the test option is a regex of the javascript file', () => {
      const rule = curriedReplaceRuleSetRule({ test: /\.jsx?$/, use: [{ loader: 'babel-loader' }] });
      expect(containsLoader(swcLoaderPattern, rule)).toBeTruthy();
      expect(containsLoader(babelLoaderPattern, rule)).toBeFalsy();
    });

    it('Pass rules where the test option is a regex of the typescript file', () => {
      const rule = curriedReplaceRuleSetRule({ test: /\.tsx?$/, use: [{ loader: 'babel-loader' }] });
      expect(containsLoader(swcLoaderPattern, rule)).toBeTruthy();
      expect(containsLoader(babelLoaderPattern, rule)).toBeFalsy();
    });

    it('Pass rules where the test option is a regex of the javascript or typescript file', () => {
      const rule = curriedReplaceRuleSetRule({ test: /\.(jsx?|tsx?)$/, use: [{ loader: 'babel-loader' }] });
      expect(containsLoader(swcLoaderPattern, rule)).toBeTruthy();
      expect(containsLoader(babelLoaderPattern, rule)).toBeFalsy();
    });

    it('Pass a loader other than babel-loader', () => {
      const rule = { test: /\.(jsx?|tsx?)$/, use: [{ loader: 'dummy-loader' }] };
      expect(curriedReplaceRuleSetRule(rule)).toEqual(rule);
    });
  });

  describe('oneOf property', () => {
    it('Pass rules where the test option is a string', () => {
      const rule = { oneOf: [{ test: 'dummy', loader: '' }] };
      expect(curriedReplaceRuleSetRule(rule)).toEqual(rule);
    });

    it('Pass rules where the test option is a regex of the html file', () => {
      const rule = { oneOf: [{ test: /\.html$/, loader: 'babel-loader' }] };
      expect(curriedReplaceRuleSetRule(rule)).toEqual(rule);
    });

    it('Pass rules where the test option is a regex of the javascript file', () => {
      const rule = curriedReplaceRuleSetRule({ test: /\.(jsx?|tsx?)$/, oneOf: [{ test: /\.jsx?$/, loader: 'babel-loader' }] });
      expect(containsLoader(swcLoaderPattern, rule)).toBeTruthy();
      expect(containsLoader(babelLoaderPattern, rule)).toBeFalsy();
    });

    it('Pass rules where the test option is a regex of the typescript file', () => {
      const rule = curriedReplaceRuleSetRule({ test: /\.(jsx?|tsx?)$/, oneOf: [{ test: /\.tsx?$/, loader: 'babel-loader' }] });
      expect(containsLoader(swcLoaderPattern, rule)).toBeTruthy();
      expect(containsLoader(babelLoaderPattern, rule)).toBeFalsy();
    });

    it('Pass rules where the test option is a regex of the javascript or typescript file', () => {
      const rule = curriedReplaceRuleSetRule({ test: /\.(jsx?|tsx?)$/, oneOf: [{ test: /\.(jsx?|tsx?)$/, loader: 'babel-loader' }] });
      expect(containsLoader(swcLoaderPattern, rule)).toBeTruthy();
      expect(containsLoader(babelLoaderPattern, rule)).toBeFalsy();
    });

    it('Pass a loader other than babel-loader', () => {
      const rule = { oneOf: [{ test: /\.(jsx?|tsx?)$/, loader: 'dummy-loader' }] };
      expect(curriedReplaceRuleSetRule(rule)).toEqual(rule);
    });
  });

  describe('without loader', () => {
    it('Pass rules where the test option is a regex of the javascript file', () => {
      const rule = { test: /\.jsx?$/, type: 'asset/source' };
      expect(curriedReplaceRuleSetRule(rule)).toEqual(rule);
    });

    it('Pass rules where the test option is a regex of the typescript file', () => {
      const rule = { test: /\.tsx?$/, type: 'asset/source' };
      expect(curriedReplaceRuleSetRule(rule)).toEqual(rule);
    });

    it('Pass rules where the test option is a regex of the javascript or typescript file', () => {
      const rule = { test: /\.(jsx?|tsx?)$/, type: 'asset/source' };
      expect(curriedReplaceRuleSetRule(rule)).toEqual(rule);
    });
  });
});

describe('replaceLoader', () => {
  const transformer = replaceLoader({});

  it('Pass babel-loader', () => {
    const config = transformer({ module: { rules: [{ test: /\.(jsx?|tsx?)$/, loader: 'babel-loader' }] } });
    const rules = config.module?.rules ?? [];
    expect(rules.some(rule => containsLoader(swcLoaderPattern, rule))).toBeTruthy();
    expect(rules.some(rule => containsLoader(babelLoaderPattern, rule))).toBeFalsy();
  });

  it('Pass other than babel-loader', () => {
    const config = transformer({ module: { rules: [{ test: /\.(jsx?|tsx?)$/, loader: 'dummy-loader' }] } });
    const rules = config.module?.rules ?? [];
    expect(rules.some(rule => containsLoader(swcLoaderPattern, rule))).toBeFalsy();
    expect(rules.some(rule => containsLoader(babelLoaderPattern, rule))).toBeFalsy();
  });
});

describe('replaceMinimizer', () => {
  const transformer = replaceMinimizer({});

  it('If no minimizer', () => {
    const config = transformer({ optimization: { minimizer: [] } });
    expect(config).toEqual({ optimization: { minimizer: [] } });
  });

  it('If there is a minimizer', () => {
    const config = transformer({ optimization: { minimizer: [new TerserPlugin()] } });
    const minimizer = config.optimization?.minimizer?.find(minimizer => minimizer instanceof TerserPlugin);
    expect(minimizer.options.minimizer.implementation.name).toEqual('swcMinify');
  });
});
