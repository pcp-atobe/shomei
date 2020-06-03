const glob = require("glob");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const WriteFilePlugin = require("write-file-webpack-plugin");
const AutoPrefixer = require("autoprefixer");

const top_js_entries = glob.sync("./src/assets/ts/app.ts", {
  ignore: "./src/assets/**/_*.ts",
});
const SCSS_entries = glob.sync("./src/assets/scss/app.scss");

const app = {
  mode: "development",
  entry: {
    "assets/js/app": top_js_entries,
    main: SCSS_entries,
  },

  module: {
    rules: [{
        test: /\.scss/,
        use: [{
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: {
              url: false,
              sourceMap: true,
              importLoaders: 2,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: [AutoPrefixer()],
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            },
          },
          "import-glob-loader",
        ],
      },

      {
        test: /\.ts$/,
        use: {
          loader: "ts-loader",
        },
      },

      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: "file-loader",
      },

      {
        test: /.pug$/,
        use: [{
          loader: "pug-loader",
          options: {
            pretty: true,
            self: true,
            root: path.resolve(__dirname, "src/pug/page"),
          },
        }, ],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "./assets/css/[name].css",
    }),
    new CopyWebpackPlugin(
      [{
        from: "img",
        to: path.resolve(__dirname, "dist/assets/img"),
      }], {
        context: path.resolve(__dirname, "src/assets/"),
      }
    ),
    new WriteFilePlugin(),
  ],

  resolve: {
    modules: ["node_modules"],
    extensions: [".js", ".ts", ".pug", ".scss"],
  },
};

// pugのcompile設定
const PUG_entries = glob.sync("./src/pug/**/*.pug", {
  ignore: "./src/**/_*.pug",
});
PUG_entries.forEach((Item) => {
  const fileName = Item.replace("./src/pug/page/", "").replace(".pug", ".html");
  app.plugins.push(
    new HtmlWebpackPlugin({
      inject: false,
      filename: `${fileName}`,
      template: Item,
    })
  );
});

module.exports = app;
