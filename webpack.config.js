const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require("path");

let pages = ["index", "holi"];

module.exports = pages.map((page) => {
  return {
    entry: {
      [page]: `./src/js/${page}.js`,
    },
    output: {
      filename: "js/[name].js",
      path: path.resolve(__dirname, "dist"),
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
          },
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: "html-loader",
              options: { minimize: true },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: `./src/${page}.html`,
        filename: `./${page}.html`,
      }),
    ],
  };
});
