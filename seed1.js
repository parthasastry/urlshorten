
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var dbURI = 'mongodb://localhost/url';
mongoose.connect(dbURI);

var Schema = mongoose.Schema;
var shortenSchema = new Schema({
    longUrl: String,
    hash: {type: Number, "default": 0}
});

var shortenUrl = mongoose.model('shorten', shortenSchema);

shortenUrl.find({}, function (err, docs) {
     if(err) { 
         console.log('error = ', err)
     } else {
         console.log(docs);
     }
});

// var newUrl = shortenUrl({
//     longUrl: 'www.google.com',
//     hash: 9999999
// });


// newUrl.save(function(err){
//     if(err) {
//         console.log('save error', err);
//     } else {
//         console.log('insert success');
//     }
// });