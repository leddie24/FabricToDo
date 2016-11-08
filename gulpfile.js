'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var debug = require('gulp-debug');
var server = require('gulp-express');
var del = require('del');


gulp.task('nuke', function(){
   return del.sync(['./dist']);
})
 
gulp.task('sass', function () {
  return gulp.src('./src/styles/**/*.scss')
      .pipe(debug())
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest('./dist/css'));
});
 
gulp.task('sass:watch', function () {
   gulp.watch('./src/styles/**/*.scss', ['sass']);
});

gulp.task('copyCoreCSS', function(){
   return gulp.src('./node_modules/office-ui-fabric-core/dist/css/*')
   .pipe(debug())
   .pipe(gulp.dest('./dist/css'));
});

gulp.task('copyComponentCSS', function(){
   return gulp.src('./node_modules/office-ui-fabric-js/dist/css/*')
   .pipe(debug())
   .pipe(gulp.dest('./dist/css'));
});

gulp.task('server', ['sass', 'copyCoreCSS', 'copyComponentCSS'], function () {
    // Start the server at the beginning of the task 
    server.run(['app.js']);
 
    // Restart the server when file changes 
    gulp.watch(['./index.html'], server.notify);
    gulp.watch(['app/styles/**/*.scss'], ['styles:scss']);
    //gulp.watch(['{.tmp,app}/styles/**/*.css'], ['styles:css', server.notify]); 
    //Event object won't pass down to gulp.watch's callback if there's more than one of them. 
    //So the correct way to use server.notify is as following: 
    gulp.watch(['{.tmp,app}/styles/**/*.css'], function(event){
        gulp.run('styles:css');
        server.notify(event);
        //pipe support is added for server.notify since v0.1.5, 
        //see https://github.com/gimm/gulp-express#servernotifyevent 
    });
 
    gulp.watch(['app/scripts/**/*.js'], ['jshint']);
    gulp.watch(['app/images/**/*'], server.notify);
    gulp.watch(['app.js', 'routes/**/*.js'], [server.run]);
});

gulp.task('watch', ['sass:watch', 'server']);