const rxjs = require('rxjs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

class RequestHtmlWebpackPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('RequestHtmlWebpackPlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeAssetTagGeneration.tapAsync(
        'RequestHtmlWebpackPlugin',
        (data, cb) => {
          rxjs
            .from(fetch('http://127.0.0.1:8080/api/categories').then((response) => response.json()))
            .pipe(
              rxjs.switchMap((categories) =>
                rxjs
                  .forkJoin(
                    (categories || []).map((category) =>
                      fetch(`http://127.0.0.1:8080/api/category/${category.id}/sites`).then((response) =>
                        response.json(),
                      ),
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

              cb(null, data);
            });
        },
      );
    });
  }
}

module.exports = RequestHtmlWebpackPlugin;
