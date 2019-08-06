const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const { version } = require('./package.json')

const config = {
  entry: './src/index.tsx',
  output: {
    filename: `bundle.${version}.js`,
    path: path.join(__dirname, '/build'),
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.html'],
  },
  plugins: [
    new CopyPlugin([{ from: './static', to: './static' }]),
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html',
    }),
  ],
  devServer: {
    historyApiFallback: true,
    inline: false,
    hot: false,
  },
}

module.exports = (_, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'eval' // 'inline-sourcemap'
  }

  // if (argv.mode === 'production') {
  //   config.devtool = 'source-map'
  // }

  return config
}
