const HtmlWebpackPlugin = require('html-webpack-plugin');

class HtmlWebpackTemplatePlugin {
  constructor(options) {
    this.options = options;
  }
  apply(compiler) {
    compiler.hooks.compilation.tap('HtmlWebpackTemplatePlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync('HtmlWebpackTemplatePlugin', (data, cb) => {
        this.options
          .func(data)
          .then((resp) => {
            cb(null, resp);
          })
          .catch(() => {
            cb(null, data);
          });
      });
    });
  }
}

module.exports = HtmlWebpackTemplatePlugin;
