
const path = require('path');

module.exports = {

  mode: "production",

  //entry: ['@babel/polyfill', './js/index.js'],
  entry: ['./js/index.js'],
  output: {

    path: path.resolve(__dirname, 'dist'),

    filename: '[name].bundle.js'

  },

  module: {

    rules: [{

      test: /\.js$/,
      use: {
        loader: 'babel-loader'
      },
      include: [

        path.resolve(__dirname, './js')

      ],

      exclude: /node_modules/

    }]

  }

}