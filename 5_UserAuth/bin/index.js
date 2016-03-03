var dbPromise;

var Promise = require('bluebird');
var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/it410';

exports.establishConnection = function(){
	if (!dbPromise) {
		dbPromise = new Promise(function(resolve, reject){
			MongoClient.connect(url, function(err,db){
				if (err) {
					return reject(err);
				}else{
					return resolve(db);
				}
			})
		});
	}
	return dbPromise;
};


//Create a user
exports.createUser = function(xusername, xpassword, xfirstname){
	return exports.establishConnection()
		.then(function(db) {
			
			var collection = db.collection('users');
			return collection.findOne({username: xusername})
				.then(function(result) {
					if (result) {
						return 'Username already exists, Sorry, please try again';
					} else {
						return collection.insert({
							username: xusername,
							password: xpassword,
							firstname: xfirstname,
							login: 1
						}).then(function (result) {
							if (result) {
								return 'Added';
							}else{
								return 'Unable to Add User';
							}
						});
					}
				})
			})
	};

//login:

exports.login = function(usernameIN, passwordIN){
	return exports.establishConnection()
		.then(function(db){
			var collection = db.collection('users');
			return collection.findOne({username: usernameIN, password: passwordIN})
				.then(function(result) {
					if (result) {
						return 'Logged in';
					} else {
						return 'Sorry Try again.';
					}
				})
			})
	};

//update info
exports.update = function(usernameIN, columnIN, dataIN) {
	return exports.establishConnection()
		.then(function(db){
		 var collection = db.collection('users');
			return collection.findAndModify({username:usernameIN}, [], {$set:{columnIN: dataIN}})
				.then(function(result){
					if (result){
						return 'Changed';
					}
			});

		})
	};