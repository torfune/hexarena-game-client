const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: './src/index.tsx',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, '/build'),
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new CopyPlugin([
      { from: './static', to: './static' },
      { from: './public', to: './' },
    ]),
  ],
  devServer: {
    historyApiFallback: true,
    inline: false,
    hot: false,
  },
}
