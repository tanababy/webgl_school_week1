// 必要プラグイン・パッケージの読み込み
const gulp = require('gulp');
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const browserSync = require('browser-sync');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const csscomb = require('gulp-csscomb');
const plumber = require('gulp-plumber');
const cleanCSS = require('gulp-clean-css');
const pug = require('gulp-pug');
const changed = require('gulp-changed');
const notify = require('gulp-notify');
const replace = require('gulp-replace');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const data = require('gulp-data');
const htmlhint = require('gulp-htmlhint');
const touch = require('gulp-touch-cmd');
const path = require('path');
const fs = require('fs');
const log = require('fancy-log');
const del = require('del');

// gulpfile.jsがあるディレクトリ名
const currentDir = __dirname.split(path.sep).pop();

// ディレクトリのパスは、gulpfile.jsからの相対パスで記述する
// gulpfile.jsと同じ階層にあるディレクトリのパスは、先頭に「./」をつけない
const baseDir = {
  src: 'src', // 監視対象ディレクトリのパス
  dist: 'dist', // 納品用出力先ディレクトリのパス
  img: 'img', // 画像を管理するディレクトリのパス
  js: 'js', // JavaScriptを管理するディレクトリのパス
  sass: '_sass', // SASSを管理するディレクトリのパス
  css: 'css', // CSSを出力するディレクトリのパス
  pug: 'pug', //Pugが格納されているディレクトリのパス
};

// 監視するファイル名のパターン
const filePattern = {
  html: [`${baseDir.dist}/**/*.html`, `${baseDir.dist}/**/*.htm`, `${baseDir.dist}/**/*.shtml`],
  img: [`${baseDir.src}/${baseDir.img}/**/*.{bmp,cur,gif,jpg,jpeg,png,svg,tiff,webp}`],
  css: [`${baseDir.dist}/${baseDir.css}/**/*.css`],
  sass: [`${baseDir.src}/${baseDir.sass}/**/*.scss`],
  pug1: [
    //task用 〜　_*.pugはコンパイルされる必要がないため
    `${baseDir.src}/${baseDir.pug}/**/*.pug`,
    `!${baseDir.src}/${baseDir.pug}/**/_*.pug`,
  ],
  pug2: [
    //gulp watch用 〜 _*.pugもwatchされる必要があるため
    `${baseDir.src}/${baseDir.pug}/**/*.pug`,
  ],
  js1: [`${baseDir.src}/${baseDir.js}/**/*.js`, `${baseDir.src}/${baseDir.js}/**/*.ts`],
  js2: [
    //トランスパイル後のjavascript
    `${baseDir.dist}/${baseDir.js}/**/*.js`,
  ],
};

// 画像フォルダ内の画像を一旦全て削除する
gulp.task('clean-img', function () {
  return del([`${baseDir.dist}/img/`]);
});

// staticフォルダに入ったファイル群をdistにコピーする
gulp.task('copy', function () {
  return gulp
    .src(`${baseDir.src}/static/**/*`)
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: 'Copy Compile Error',
          message: 'Error: <%= error.message %>',
        }),
      }),
    )
    .pipe(gulp.dest(`${baseDir.dist}`));
});

// browserSyncのリロード
gulp.task(
  'reload',
  gulp.series(function (done) {
    browserSync.reload();
    done();
  }),
);

// ローカルサーバーを立ち上げる
gulp.task('server', function () {
  return browserSync.init({
    server: {
      baseDir: baseDir.dist,
    },
  });
});

// webpackの実行
gulp.task('webpack', function () {
  return webpackStream(webpackConfig, webpack)
    .on('error', function (e) {
      this.emit('end');
    })
    .pipe(gulp.dest(`${baseDir.dist}/js/`));
});

// HTMLバリデーション
gulp.task('validation', function () {
  return gulp
    .src(filePattern.html)
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: 'HTML Validation Error',
          message: 'Error: <%= error.message %>',
        }),
      }),
    )
    .pipe(htmlhint())
    .pipe(htmlhint.failReporter());
});

// SASSのコンパイル
gulp.task('sass', function () {
  const sassArgs = {
    outputStyle: 'expanded',
    indentWidth: 4,
    indentType: 'space',
    sourceComments: true, // CSSにインラインでSASSの対応行を表示する場合はtrueにする
  };

  return gulp
    .src(filePattern.sass)
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: 'SASS Compile Error',
          message: 'Error: <%= error.message %>',
        }),
      }),
    )
    .pipe(sass(sassArgs).on('error', sass.logError))
    .pipe(
      autoprefixer({
        cascade: false,
        grid: true,
      }),
    )
    .pipe(csscomb())
    .pipe(cleanCSS({ compatibility: '*' }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest(`${baseDir.dist}/css/`))
    .pipe(browserSync.stream())
    .pipe(touch());
});

// pugのコンパイル
gulp.task('pug', function () {
  return gulp
    .src(filePattern.pug1)
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: 'Pug Compile Error',
          message: 'Error: <%= error.message %>',
        }),
      }),
    )
    .pipe(
      pug({
        pretty: true, //falseでhtml圧縮
        locals: {
          devMode: true,
        },
      }),
    )
    .pipe(gulp.dest(`${baseDir.dist}`))
    .pipe(browserSync.stream());
});

gulp.task('image', function () {
  //srcに入れた画像を、そのままdistに出力する
  return gulp.src(filePattern.img).pipe(gulp.dest(`${baseDir.dist}/img/`));
});

// ファイル監視タスク
// webpackが一番時間かかるので、それが終わったら他の処理するようにしておく
gulp.task(
  'default',
  gulp.series(
    'webpack',
    gulp.parallel('copy', 'pug', 'sass', 'image', 'server', function (done) {
      gulp.watch(`${baseDir.src}/static/**/*`, gulp.series(['copy']));
      gulp.watch(filePattern.sass, gulp.series(['sass']));
      gulp.watch(filePattern.pug2, gulp.series(['pug']));
      gulp.watch(filePattern.img, gulp.series(['clean-img', 'image']));
      gulp.watch(filePattern.js1, gulp.series('webpack', 'reload')); //webpackのトランスパイル完了を待ってから、リロードを実行
      done();
    }),
  ),
);
