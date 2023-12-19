const webpack = require('webpack');
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackBar = require('webpackbar');
const CopyPlugin = require('copy-webpack-plugin');
const dotenv = require('dotenv');

const rootDir = resolve(__dirname, '..');
const srcDir = resolve(rootDir, 'src');

const package_ = require(resolve(rootDir, 'package.json'));

const SERVICE = process.env.SERVICE || '';

dotenv.config({ path: resolve(rootDir, '.env') });

module.exports = {
  module: {
    rules: [
      {
        generator: {
          filename: 'static/images/[name].[hash][ext]',
        },
        test: /\.(jpe?g|png|gif|svg)$/,
        type: 'asset/resource',
      },
      {
        generator: {
          filename: 'static/font/[name].[hash][ext]',
        },
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve(rootDir, 'public', 'index.ejs'),
      templateParameters: {
        favicon_uri: '/static/images/',
        title: 'StartPage',
        turnstile_script_url: process.env.TURNSTILE_SCRIPT_URL,
        use_turnstile: JSON.parse(process.env.USE_TURNSTILE),
      },
    }),
    new CopyPlugin({
      patterns: [
        {
          context: rootDir,
          from: 'public/assets/images/*',
          to: 'static/images/[name][ext]',
        },
      ],
    }),
    new webpack.DefinePlugin({
      API_URI: JSON.stringify(process.env.API_URI),
      ENV: JSON.stringify(process.env.NODE_ENV),
      PRODUCTION: JSON.stringify(process.env.NODE_ENV === 'production'),
      PROJECT: JSON.stringify(package_.name),
      SERVICE: JSON.stringify(SERVICE),
      TURNSTILE_SITE_KEY: JSON.stringify(process.env.TURNSTILE_SITE_KEY),
      USE_TURNSTILE: JSON.parse(process.env.USE_TURNSTILE),
      VERSION: JSON.stringify(package_.version),
    }),
    new WebpackBar({}),
  ],
  resolve: {
    alias: {
      actions: resolve(srcDir, 'actions'),
      apis: resolve(srcDir, 'apis'),
      assets: resolve(srcDir, 'assets'),
      components: resolve(srcDir, 'components'),
      configs: resolve(srcDir, 'configs'),
      constant: resolve(srcDir, 'constant'),
      hooks: resolve(srcDir, 'hooks'),
      layouts: resolve(srcDir, 'layouts'),
      locales: resolve(srcDir, 'locales'),
      reducers: resolve(srcDir, 'reducers'),
      styles: resolve(srcDir, 'styles'),
      themes: resolve(srcDir, 'themes'),
      types: resolve(srcDir, 'types'),
      utils: resolve(srcDir, 'utils'),
    },
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
};
