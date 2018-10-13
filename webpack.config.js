const path = require('path')

module.exports = {
  entry: './src/script/main.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'theme/source')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
}
