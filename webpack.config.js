const path = require("path")
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin")
const webpack = require("webpack")

module.exports = {
  // devtool: '#eval-source-map',
  devtool: "#source-map",
  entry: {
    HsunaJS: path.join(__dirname, "./src/HsunaJS")
  },
  output: {
	filename: "./dist/[name].js",
	library:'HsunaJS',
	libraryTarget:'umd'
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader"
          }
        ]
      },
      {
        test: /\.(css|scss)$/,
        use: ["css-loader", "sass-loader"]
      },
      {
        test: /\.less$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              plugins: [
                require("autoprefixer")({
                  browsers: ["last 50 versions"],
                  cascade: false
                })
              ]
            }
          },
          "less-loader"
        ]
      },
      { test: /\.(png|jpg)$/, use: "url-loader?limit=100000" }
    ]
  },
  plugins: [
    new FriendlyErrorsPlugin(),
    /* new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }) */
  ]
}
