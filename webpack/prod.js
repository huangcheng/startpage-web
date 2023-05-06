const rxjs = require('rxjs');
const { resolve } = require('node:path');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackTemplatePlugin = require('../plugins/html-webpack-template-plugin');

module.exports = {
  devtool: false,
  entry: './src/index.tsx',
  mode: 'production',
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: {
          loader: 'swc-loader',
        },
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        parallel: true,
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
          },
        },
      }),
    ],
    splitChunks: {
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
        defaultVendors: {
          priority: -10,
          reuseExistingChunk: true,
          test: /[\\/]node_modules[\\/]/,
        },
      },
      chunks: 'all',
      maxSize: 250_000,
      minChunks: 1,
      minSize: 10_000,
    },
  },
  output: {
    filename: 'static/js/[name].[contenthash].js',
    path: resolve(__dirname, '..', 'dist'),
    publicPath: '/',
  },
  performance: {
    hints: false,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
    }),
    new HtmlWebpackTemplatePlugin({
      func: (data) =>
        new Promise((resolve) => {
          rxjs
            .from(fetch(`${process.env.API_URI}/categories`).then((response) => response.json()))
            .pipe(
              rxjs.switchMap((categories) =>
                rxjs
                  .forkJoin(
                    (categories || []).map((category) =>
                      fetch(`${process.env.API_URI}/category/${category.id}/sites`).then((response) => response.json()),
                    ),
                  )
                  .pipe(
                    rxjs.map((sites) => sites.map((site, index) => ({ ...categories[index], sites: site }))),
                    rxjs.map((sites) => [categories, sites]),
                  ),
              ),
            )
            .subscribe(([categories, sections]) => {
              data.plugin.options.templateParameters.categories = categories;
              data.plugin.options.templateParameters.sections = sections;

              resolve(data);
            });
        }),
    }),
  ],
};
