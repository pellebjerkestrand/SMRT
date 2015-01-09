var project = 'smrt';

var concat = require('gulp-concat'),
    del = require('del'),
    gulp = require('gulp'),
    minify = require('gulp-minify-css'),
    prefix = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    swig = require('gulp-swig'),
    uglify = require('gulp-uglify');

var paths = {
    dist: {
        pages: 'dist/pages/',
        root: 'dist/',
        scripts: 'dist/scripts/',
        styles: 'dist/styles/'
    },
    source: {
        scripts: [
            'source/scripts/vendor/*.js',
            'source/scripts/plugins/*.js',
            'source/scripts/modules/*.js'
        ],
        styles: {
            app: 'source/styles/smrt.scss',
            oldie: 'source/styles/smrt.oldie.scss'
        },
        templates: {
            pages: 'source/templates/pages/*.html',
            root: 'source/templates/root/*.html'
        }
    }
};

var settings = {
    del: {
        force: true
    },
    minify: {
        keepSpecialComments: 0,
        processImport: false,
        noRebase: true
    },
    prefix: {
        app: {
            browsers: ['last 2 versions', '> 1%', 'ie 9'],
            cascade: false
        },
        oldie: {
            browsers: ['last 2 versions', '> 1%', 'ff 17', 'opera 12.1', 'ie 8'],
            cascade: false
        }
    },
    swig: {
        defaults: {
            cache: false
        }
    }
};

gulp.task('clean-scripts', function(){
    del.sync(paths.dist.scripts, settings.del);
});

gulp.task('clean-styles', function(){
    del.sync(paths.dist.styles, settings.del);
});

gulp.task('clean-templates', function(){
    del.sync(paths.dist.pages, settings.del);
});

gulp.task('build-scripts', ['clean-scripts'], function(){
    gulp.src(paths.source.scripts)
        .pipe(concat(project + '.js'))
        .pipe(gulp.dest(paths.dist.scripts));

    gulp.src(paths.source.scripts)
        .pipe(concat(project + '.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.dist.scripts));
});

gulp.task('build-styles', ['clean-styles'], function(){
    gulp.src(paths.source.styles.app)
        .pipe(sass())
        .pipe(prefix(settings.prefix.app))
        .pipe(minify(settings.minify))
        .pipe(gulp.dest(paths.dist.styles));

    gulp.src(paths.source.styles.oldie)
        .pipe(sass())
        .pipe(prefix(settings.prefix.oldie))
        .pipe(minify(settings.minify))
        .pipe(gulp.dest(paths.dist.styles));
});

gulp.task('build-templates', ['clean-templates'], function(){
    gulp.src(paths.source.templates.pages)
        .pipe(swig(settings.swig))
        .pipe(gulp.dest(paths.dist.pages));

    gulp.src(paths.source.templates.root)
        .pipe(swig(settings.swig))
        .pipe(gulp.dest(paths.dist.root));
});

gulp.task('build', ['build-scripts', 'build-styles', 'build-templates']);

gulp.task('default', ['build']);