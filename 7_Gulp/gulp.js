var gulp			= require('gulp');
var sass			= require('gulp-sass');
var autoprefixer 	= require('gulp-autoprefixer');
var csso			= require('gulp-csso');
var htmlmin			= require('gulp-htmlmin');
var imagemin 		= require('gulp-imagemin');
var pngquant 		= require('imagemin-pngquant');
var uglify 			= require('gulp-uglify');
var useref			= require('gulp-useref');

//Convert SASS files into CSS files
gulp.task('sass', function () {
	return gulp.src('./sass/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('./dist'));
});

//Auto-Prefix CSS styles
gulp.task('autoprefixer', function () {
	return gulp.src('./src/app.css')
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(gulp.dest('./dist'));
});

//Minify CSS Files
gulp.task('csso', function () {
	return gulp.src('./main.css')
		.pipe(csso())
		.pipe(gulp.dest('./dist'));
});

//Minify HTML files
gulp.task('htmlminify', function() {
	return gulp.src('./src/*.html')
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest('./dist'))
});

gulp.task('images', function() {
	return gulp.src('./src/images/*')
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest('./dist/images'));
});

//Minify JS files -Uglify
gulp.task('uglify', function() {
	return gulp.src('lib/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('./dist'));
});

gulp.task('useref', function () {
	return gulp.src('app/*.html')
		.pipe(useref())
		.pipe(gulp.dest('./dist'));
});



gulp.task('sass:watch', function () {
	gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('default', ['sass','autoprefixer','csso','htmlminify','images','uglify','useref']);