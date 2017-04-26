require('./db');
var Shorten = require('./shorten');
console.log("in seed file", Shorten);

var newUrl = Shorten({
    longUrl: 'www.amazon.com',
    hash: 987654321
});

newUrl.save(function(err){
    if(err) {
        console.log('error = ', err);
    } else {
        console.log('success');
    }
});


Shorten.find({}, function(err, urls){
    if(err){
        console.log(err);
    } else {
        console.log("urls = ", urls);
    }
});