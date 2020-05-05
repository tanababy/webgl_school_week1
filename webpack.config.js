const MODE = 'production';
// const VueLoaderPlugin = require('vue-loader/lib/plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  context: __dirname,
  cache: true,
  mode: MODE,
  // メインとなるJavaScriptファイル（エントリーポイント）
  entry: {
    script: './src/js/main.ts',
  },
  // ファイルの出力設定
  output: {
    //  出力ファイルのディレクトリ名
    path: `${__dirname}/dist/js`,
    // 出力ファイル名
    filename: '[name].js',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          // node_modules配下のモジュールをバンドル対象とする
          test: /node_modules/,
          name: 'vendor',
          chunks: 'initial',
          enforce: true,
        },
      },
    },
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.ts$/,
        exclude: /(node_modules)/,
        use: 'eslint-loader',
      },
      {
        test: /(?<!\.d)\.tsx?$/,
        use: ['babel-loader', 'ts-loader'],
        exclude: /(node_modules)/,
      },
      {
        test: /\.d\.ts$/,
        use: 'ignore-loader',
      },
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              prependData: `
              @import "./src/_sass/setting/_variables.scss";
              @import "./src/_sass/setting/_functions.scss";
              @import "./src/_sass/mixin/_mixin.scss";
              `,
            },
          },
        ],
      },
      {
        test: /\.pug$/,
        use: [
          {
            loader: 'pug-plain-loader',
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|webp)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              // limit: 8192,
              esModule: false,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.vue', '.ts'], // importするときに省略できる拡張子の設定
    // modules: [// モジュールを読み込むときに検索するディレクトリの設定
    //   'node_modules'
    // ],
    alias: {
      // 例えばmain.js内で `import Vue from 'vue';` と記述したときの`from vue`が表すファイルパスを指定
      vue$: 'vue/dist/vue.esm.js',
      // vuex$: 'vuex/dist/vuex.js'
    },
  },
  plugins: [
    // new webpack.ProvidePlugin({
    //   $: "jquery"
    // })
    // new VueLoaderPlugin(),
    // new BundleAnalyzerPlugin()
  ],
};
