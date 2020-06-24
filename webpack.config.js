const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

let pages = ["index", "holi"];

module.exports = (env, options) => {
  return pages.map((page) => {
    return {
      entry: {
        [page]: `./src/js/${page}.js`,
      },
      output: {
        filename: "js/[name].js",
        path: path.resolve(__dirname, "dist"),
      },
      mode: options.mode,
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
          {
            test: /\.(png|svg|jpg|gif)$/,
            use: [
              {
                loader: "file-loader",
                options: {
                  outputPath: "images",
                },
              },
            ],
          },
          {
            test: /\.[s]?css$/,
            use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
          },
        ],
      },
      plugins: [
        new HtmlWebPackPlugin({
          template: `./src/${page}.html`,
          filename: `./${page}.html`,
        }),
        new MiniCssExtractPlugin({
          template: `./src/styles/${page}.html`,
          filename: "./styles/[name].css",
        }),
      ],
    };
  });
};
