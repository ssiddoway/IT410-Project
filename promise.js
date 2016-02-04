//Write test using mocha
var fs = require('fs');
var Promise = require('bluebird');
var Path = require('path');


//
//  Problem 1
//

exports.getPathType = function(path){
    if(typeof path !== 'string'){
        return Promise.reject('other')
    }
    return new Promise(function(resolve,reject){
        fs.stat(path, function (err, stats) {
            if (err){                       //none
                return resolve('nothing')
            }
            else if(stats.isDirectory(path)) {  //Directory
                return resolve('directory');
            }
            else if(stats.isFile(path)) {       //File
                return resolve('file');
            }
        });
    })
};

//
//  Problem 2
//



//specifies a directory, if you then specify the limit and it will go as far as you let it and
//it will look for that file.
exports.readdir = function(path) {
    return exports.getPathType(path)
        .then(function(type) {
            if (type !== 'directory') throw Error('Not a directory');
            return new Promise(function(resolve, reject) {
                fs.readdir(path, function(err, files) {
                    if (err) return reject(err);
                    return resolve(files);
                });
            });
        });
};

exports.getDirectoryTypes = function(path, depth, filter) {
    var result = {};

    if(typeof depth !== 'number'){
        return Promise.reject('Error')
    }
    if (arguments.length < 2) depth = -1;
    if (arguments.length < 3) filter = function() { return true };

    return exports.readdir(path)
        .then(function(files) {
            var promises = [];
            files.forEach(function(file) {
                var fullPath = Path.resolve(path, file);
                var promise = exports.getPathType(fullPath)
                    .then(function(type) {
                        if (filter(fullPath, type)) result[fullPath] = type;
                        if (type === 'directory' && depth !== 0) {
                            return exports.getDirectoryTypes(fullPath, depth - 1, filter)
                                .then(function(map) {
                                    Object.assign(result, map);
                                });
                        }
                    });
                promises.push(promise);
            });
            return Promise.all(promises)
                .then(function() {
                    return result;
                });
        });
}

//
//  Problem 3
//


exports.exists = function(path){
    return exports.getPathType(path)
        .then(function(value){
            if (value == 'nothing'){
                return false;
            }else {
                return true;
            }
        })
};

////
////Problem 4
////


exports.getFilePaths = function(path, depth){
   // var result = [];
    return exports.getDirectoryTypes(path, depth, function(path,type){
        return type === 'file';
    }).then(function(resolution){
        return Object.keys(resolution);
    })

};




///
/// Problem 5
///

exports.readFile = function(path){
    return new Promise(function(resolve, reject){
        fs.readFile(path, 'utf8', function(err, data){
            if(err)
            {
                return reject (err);
            }
            else {
                return resolve(data);
            }
        })
    })
};

///
///Problem 6
///

exports.readFiles = function(paths){

    if(!Array.isArray(paths)){
        return Promise.reject('Error')
    }

    var promises = [];
    paths.forEach(function(value){
        promises.push(exports.readFile(value));
    });
    return Promise.all(promises).then(function(resolution){
        var map = {};
        paths.forEach(function(path, index){
            map[path]=resolution[index];
        });
        return map;
    })
};