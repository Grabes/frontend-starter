'use strict';

module.exports = function(appData) {

  const gulp         = appData.gulp,
        changed      = require('gulp-changed'),
        merge        = require('merge-stream');


  appData.tasks.customDirs = {
    run: function(taskParams) {

      taskParams = taskParams || { isWatch: false, itemInfos: appData.config.customDirs.items };
      if (!taskParams.itemInfos) {
        taskParams.itemInfos = appData.config.customDirs.items;
      }

      var streams = [];

      var injector = new appData.Injector('customDirs', appData, taskParams);
      
      var itemInfos = injector.run('init', taskParams.itemInfos);
      if (injector.isTaskCanceled(itemInfos)) {
        return Promise.resolve();
      }

      itemInfos.forEach(function(itemInfo) {
        var injectorDir = new appData.Injector(itemInfo, appData, taskParams, { itemInfo: itemInfo });

        var stream = injectorDir.run('src', null);
        if (injectorDir.isTaskCanceled(stream)) {
          return;
        }

        if (itemInfo.dest !== null) {
          if (!injector.isCanceled) {
            stream = gulp.src(appData.app.taskUtils.sanitizeGlob(stream ? stream : itemInfo.src));
          }
          stream = injectorDir.run('limit', stream);
          if (!injector.isCanceled) {
            stream = stream.pipe(changed(itemInfo.dest));
          }
          stream = injectorDir.run('dest', stream);
          if (!injector.isCanceled) {
            stream = stream.pipe(gulp.dest(itemInfo.dest));
          }

          streams.push(stream);
        }
      });

      injector.run('finish', streams, itemInfos);

      var promise;
      if (streams.length) {
        promise = appData.app.taskUtils.streamToPromise(merge.apply(merge, streams));
      }
      else {
        promise = Promise.resolve();
      }

      promise.then(() => {
        injector.run('reload', itemInfos);
        if (!injector.isCanceled) {
          if (taskParams.isWatch) {
            appData.browserSync.reload();
          }
        }
      });

      return promise;
    }
  }
}