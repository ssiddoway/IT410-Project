var expect = require('chai').expect;
var HW = require('../index.js');

describe('Create User', function(){
    var connection;

    // before, after, beforeEach, afterEach

    before(function() {
        return HW.establishConnection()
            .then(function(conn) {
                connection = conn;
            })
    });

    beforeEach(function() {
        // erase database
        var coll = connection.collection('users');
        return coll.deleteMany()
    });

    it('Add User', function(){
       return HW.createUser('ssiddoway','password','steven')
           .then(function(resolution){
                expect(resolution).to.be.equal('Added');
            })
    });
    it('Duplicate Usernames', function(){
        return HW.createUser('test','pass','joe')
            .then(function(){
                return HW.createUser('test','pass','steven');
            })
            .then(function(resolution){
                expect(resolution).to.be.equal('Username already exists, Sorry, please try again');
            });
    });
    //User can change password
    it('Change password', function(){
        return HW.createUser('BobbyBee', 'changeme', 'bob')
            .then(function(){
                return HW.update('BobbyBee', 'password', 'changeme')
            })
            .then(function(resolution){
                expect(resolution).to.be.equal("Changed");
            });
    });
    //Authenticate
    it('Authinticate User', function(){
        return HW.createUser('Whitney', 'password', 'WhitWhit')
            .then(function(){
                return HW.login('Whitney', 'password');
            })
            .then(function(resolution){
                expect(resolution).to.be.equal('Logged in')
            });
    });

    //Incorrect Authenticate
    it('Failed Authinticate User', function(){
        return HW.login('ssiddoway', 'wrong')
            .then(function(resolution){
                expect(resolution).to.be.equal('Sorry Try again.')
            });
    });
});