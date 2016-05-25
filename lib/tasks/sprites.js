module.exports = function(appData) {

  var 
      gulp         = require('gulp'),
      buffer       = require('vinyl-buffer'),
      imagemin     = require('gulp-imagemin'),
      merge        = require('merge-stream'),
      spritesmith  = require('gulp.spritesmith'),
      plumber      = require('gulp-plumber'),
      sourcemaps   = require('gulp-sourcemaps'),
      postcss      = require('gulp-postcss'),
      sass         = require('gulp-sass');


  appData.tasks.sprites = {
    run: function(taskData) {
      taskData = taskData || { isDev: true, itemInfo: {}, done: null };

      if (taskData.done)
        console.log('Starting \'sprites\'...');

      var injector = new appData.Injector('sprites', appData, taskData);
      if (injector.cancelTask)
        return injector.cancelTask;

      var spriteData = injector.run('init');

      if (!spriteData) {
        spriteData = gulp.src(taskData.itemInfo.imgSource + '**/*').pipe(spritesmith(taskData.itemInfo.options));
      }

      var imgStream = injector.run('imgSrc', spriteData.img);

      if (!injector.isCanceled('imgSrc')) {
        imgStream = spriteData.img
          .pipe(buffer());
      }

      imgStream = injector.run('imgOptimize', imgStream);
      if (!injector.isCanceled('imgOptimize')) {
        imgStream = imgStream
          .pipe(imagemin(appData.tasks.images.getOptimizeOpts(null, taskData.isDev)));
      }
      imgStream = injector.run('imgDest', imgStream);
      if (!injector.isCanceled('imgDest')) {
        imgStream = imgStream
          .pipe(gulp.dest(taskData.itemInfo.imgDest));
      }

      var cssStream = injector.run('cssSrc', spriteData.css);
      if (!injector.isCanceled('cssSrc')) {
        cssStream = spriteData.css;
      }

      cssStream = injector.run('cssDest', cssStream);
      if (!injector.isCanceled('cssDest')) {
        cssStream = cssStream
          .pipe(gulp.dest(appData.dirs.src.styles.sprites));
      }

      return merge(imgStream, cssStream).on('finish', function() {
        if (taskData.done) {
          taskData.done();
          console.log('Finished \'sprites\'');
        }
        appData.app.browserSync.reload();
      });
    }
  }
}