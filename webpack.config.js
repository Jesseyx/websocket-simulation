var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: {
    client: './src/client',
    server: './src/server',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './build'),
  },
  module:  {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        options: {
          formatter: require("eslint-friendly-formatter"),
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        drop_console: true,
      },
    }),
  ],
};
