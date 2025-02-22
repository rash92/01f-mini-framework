const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "src", "app.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "app.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            targets: "defaults",
            presets: [["@babel/preset-env"]],
          },
        },
        resolve: {
          fullySpecified: false
        }
      },
    ],
  },
};
