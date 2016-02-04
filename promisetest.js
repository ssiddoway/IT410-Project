var expect = require('chai').expect;
var HW = require('./promise.js');

describe('promise', function(){

    describe('getPathType',function(){
        it('No file path',function(){
            expect(HW.getPathType('directory')).to.be.instanceof(Promise);
        });
        it('This is a file',function(){
            var x = HW.getPathType('/directory/file.rtf')
            x.then(function(resolution)
            {
                expect(resolution).to.be.equal('file');
            })
        });
        it('This is a Directory',function(){
            var x = HW.getPathType('/directory')
            x.then(function(resolution){
                expect(resolution).to.be.equal('directory');
            })
        });
        it('This is a Directory',function(){
            var x = HW.getPathType('/directory/')
            x.then(function(resolution){
                expect(resolution).to.be.equal('nothing');
            })
        });
        it('This is a Directory',function(){
            var x = HW.getPathType('/directory/empty/')
            x.then(function(resolution){
                expect(resolution).to.be.equal('nothing');
            })
        });


        /*


        it('Some Crazy Error',function(){

        });*/
    });


});

describe('function2', function(){
   it('promise returned', function(){
     var x = HW.getDirectoryTypes('/directory', 1, 3);
       x.then(function(resolution){
           expect(resolution).to.be.instanceof(Promise);
       })
   })
});


describe('File Exist?', function(){

    it('File is here', function(){
        var x = HW.exists('/directory/');
        x.then(function(resolution){
            expect(resolution).to.be.true;
        })
    })
    it('File is not here', function(){
        var x = HW.exists('/directory/empty');
        x.then(function(resolution){
            expect(resolution).to.be.false;
        })
    })
});


