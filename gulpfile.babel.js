var gulp = require('gulp');
var babel = require('gulp-babel');

import gulpLoadPlugins from 'gulp-load-plugins';
import path from 'path';
import del from 'del';
import runSequence from 'run-sequence';
import babelCompiler from 'babel-core/register';

const plugins = gulpLoadPlugins();

const paths = {
  js: ['./**/*.js','./**/*.js', '!public/**'  ,'!src/**' , '!dist/**', '!node_modules/**','!js/**'],
  nonJs: ['./index.html','./package.json', './.gitignore'],
  publicContent: ['./css/**','public/**'],
  tests: './server/tests/*.js'
};

gulp.task('react', function () {
  return gulp.src([
    'src/*.jsx', 'src/**/*.jsx', 'src/**/**/*.jsx',
    'src/*.js', 'src/**/*.js', 'src/**/**/*.js'
  ])
  .pipe(babel({
    sourceMaps: 'inline',
    presets: ['es2015', 'stage-0', 'react'],
    plugins: ['transform-es2015-modules-amd']
  }))
  .pipe(gulp.dest('dist/client'));
});

gulp.task('watch', function(){
  gulp.watch([
    'src/*.jsx', 'src/**/*.jsx', 'src/**/**/*.jsx',
    'src/*.js', 'src/**/*.js', 'src/**/**/*.js'
  ], ['react']);
});

///////////////////////////////////////////////////////////////////////////////////////////////

// Set env variables
gulp.task('set-env', () => {
  plugins.env({
    vars: {
      NODE_ENV: 'test'
    }
  });
});

// Clean up dist directory
gulp.task('clean', () =>
  del(['dist/**', '!dist'])
);

// triggers mocha tests for database opertaions
gulp.task('test', ['set-env'], () => {
  let reporters;
  let exitCode = 0;

  return gulp.src([paths.tests], { read: false })
    .pipe(plugins.plumber())
    .pipe(plugins.mocha({
      reporter: plugins.util.env['mocha-reporter'] || 'spec',
      ui: 'bdd',
      timeout: 6000,
      compilers: {
        js: babelCompiler
      }
    }))
    .once('error', (err) => {
      plugins.util.log(err);
      exitCode = 1;
    })
    .once('end', () => {
      plugins.util.log('completed !!');
      process.exit(exitCode);
    });
});

// Compile ES6 to ES5 and copy to dist
gulp.task('babel', () =>
  gulp.src([...paths.js, '!gulpfile.babel.js'], { base: '.' })
    .pipe(plugins.newer('dist'))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.babel())
    .pipe(plugins.sourcemaps.write('.', {
      includeContent: false,
      sourceRoot(file) {
        return path.relative(file.path, __dirname);
      }
    }))
    .pipe(gulp.dest('dist'))
);

// Copy non-js files to dist
gulp.task('copy', ['copyPublicContent'], () =>
  gulp.src(paths.nonJs)
    .pipe(plugins.newer('dist'))
    .pipe(gulp.dest('dist'))
);

gulp.task('copyPublicContent', () =>
  gulp.src(paths.publicContent)
    .pipe(plugins.newer('dist/public'))
    .pipe(gulp.dest('dist/public'))
);

// Start server with restart on file changes
gulp.task('nodemon', ['copy', 'babel','react'], () =>
  plugins.nodemon({
    script: path.join('dist', 'index.js'),
    ext: 'js',
    ignore: ['node_modules/**/*.js', 'dist/**/*.js'],
    tasks: ['copy', 'babel', 'react']
  })
);

// gulp serve for development
gulp.task('serve', ['clean'], () => runSequence('nodemon'));
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
gulp.task('default', ['react','serve']);
