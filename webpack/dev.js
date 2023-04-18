module.exports = {
  cache: {
    type: 'memory',
  },
  devServer: {
    compress: true,
    historyApiFallback: true,
    open: false,
    port: 8081,
    static: ['./dist'],
  },
  devtool: 'inline-source-map',
  entry: ['react-hot-loader/patch', './src/index.tsx'],
  mode: 'development',
  output: {
    publicPath: '/',
  },
};
