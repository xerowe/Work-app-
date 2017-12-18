const gulp = require('gulp');
const browserSync = require('browser-sync');
const nodemon = require('gulp-nodemon');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

// we'd need a slight delay to reload browsers
// connected to browser-sync after restarting nodemon
let BROWSER_SYNC_RELOAD_DELAY = 500;

gulp.task('nodemon', (cb) => {
  let called = false;
  return nodemon({

    // nodemon our expressjs server
    script: 'app.js',

    // watch core server file(s) that require server restart on change
    watch: ['app.js']
  })
    .on('start', function onStart() {
      // ensure start only got called once
      if (!called) { cb(); }
      called = true;
    })
    .on('restart', function onRestart() {
      // reload connected browsers after a slight delay
      setTimeout(function reload() {
        browserSync.reload({
          stream: false
        });
      }, BROWSER_SYNC_RELOAD_DELAY);
    });
});

gulp.task('browser-sync', ['nodemon'], function () {

  // for more browser-sync config options: http://www.browsersync.io/docs/options/
  browserSync({

    // informs browser-sync to proxy our expressjs app which would run at the following location
    proxy: 'http://localhost:3000',

    // informs browser-sync to use the following port for the proxied app
    // notice that the default port is 3000, which would clash with our expressjs
    port: 4000,

  });
});

gulp.task('js',  function () {
  return gulp.src('public/**/*.js')
    // do stuff to JavaScript files
    //.pipe(uglify())
    //.pipe(gulp.dest('...'));
});

gulp.task('sass', function(){
  return gulp.src('public/styles/sass/styles.scss')
    .pipe(sass()) // Converts scss to CSS with gulp-sass
    .pipe(autoprefixer({
           browsers: ['last 2 versions'],
           cascade: false
       }))
    .pipe(browserSync.reload({ stream: true }))
    .pipe(gulp.dest('public/styles/css'))
});


gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('default', ['sass', 'browser-sync'], function () {
  gulp.watch('public/**/*.js',   ['js', browserSync.reload]);
  gulp.watch('public/styles/sass/**/*.scss',  ['sass']);
  gulp.watch('views/**/*.ejs', ['bs-reload']);
});
