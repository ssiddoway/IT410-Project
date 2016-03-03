var express = require('express');
var app = express();
var path = require('path');

app.listen(17240, function() {
	console.log('ready on port 17240');
});

var argument = process.argv;

if (argument[2]){
	var finalPath = path.resolve(process.cwd(), argument[2]);
	app.use(express.static(finalPath));
	//console.log(finalPath);
} else {
	app.use(express.static('bin/'));
}