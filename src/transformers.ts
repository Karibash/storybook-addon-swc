import { Configuration } from 'webpack';
import { JsMinifyOptions } from '@swc/core';
import TerserPlugin from 'terser-webpack-plugin';

export const replaceMinimizer = (options: JsMinifyOptions): (config: Configuration) => Configuration => {
  return (config: Configuration) => ({
    ...config,
    optimization: {
      minimizer: [
        new TerserPlugin({
          minify: TerserPlugin.swcMinify,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          terserOptions: options as any,
        }),
      ],
    },
  });
};
