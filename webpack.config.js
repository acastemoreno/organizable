const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const glob = require("glob");
const path = require("path");
const fs = require("fs");

let pages = ["index", "holi"];

function toObject(paths) {
  var ret = {};

  paths.forEach(function (path) {
    // you can define entry names mapped to [name] here
    ret[path.split(/\/|\./).slice(-2)[0]] = path;
  });

  return ret;
}

function generateHtmlPlugins(templateDir) {
  // Read files in template directory
  const templateFiles = fs
    .readdirSync(path.resolve(__dirname, templateDir))
    .filter((file) => file.slice(-4) === "html");

  return templateFiles.map((item) => {
    // Split names and extension
    const parts = item.split(".");
    const name = parts[0];
    const extension = parts[1];

    // Create new HTMLWebpackPlugin with options
    return new HtmlWebPackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      chunks: [name],
    });
  });
}

const htmlPlugins = generateHtmlPlugins("./src/");

module.exports = (env, options) => {
  return {
    entry: toObject(glob.sync("./src/js/*.js")),
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
          test: /\.[s]?css$/,
          use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
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
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        template: `./src/styles/[name].scss`,
        filename: "./styles/[name].css",
      }),
    ].concat(htmlPlugins),
  };
};
