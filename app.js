var base62 = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
              'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
              'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

//var num = getRandomInt(999999, 9999999);
//console.log("num = ", num);
var base = 62;

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//var dbURI = 'mongodb://localhost/url';
var dbURI = 'mongodb://test:pwd@ds121171.mlab.com:21171/url';
mongoose.connect(dbURI);
var express = require('express');
var app = new express();

var Schema = mongoose.Schema;
var shortenSchema = new Schema({
    longUrl: String,
    hash: {type: Number, "default": 0}
});

var shortenUrl = mongoose.model('shorten', shortenSchema);

app.get('/', function(req, res, next){
    console.log('Home Page');
    next();
});

app.get('/new/*', function (req, res) {
    var longUrl = req.params[0];
    var num = getRandomInt(999999, 9999999);
    var validUrl = validateUrl(longUrl);
    if(!validUrl){
        res.send({'error': 'Invalid url'});
        return;
    }
    shortenUrl.find({longUrl: longUrl}, function (err, docs) {
         if(err) { 
             console.log(err);
         } else {
             if (docs.length === 0){
                  docs = shortenUrl({
                    'longUrl': longUrl,
                    'hash': num
                });
                docs.save(function(err, newdoc){
                    if(err) {
                        console.log('save error', err);
                    } else {
                        console.log('insert success');
                        console.log('num = ', num);
                    }
                });
             } else {
                 num = docs[0]['hash'];
             }
             
             var prefix = '';
             if (longUrl.substring(0, 5) === 'https') {
                prefix = 'https://intense-badlands-87447.herokuapp.com/short/https://'
                //prefix = 'https://expressapp-parthasastry.c9users.io/short/https://';
             } else  if (longUrl.substring(0, 4) === 'http') {
                //prefix = 'https://expressapp-parthasastry.c9users.io/short/http://';
                prefix = 'https://intense-badlands-87447.herokuapp.com/short/http://'
             }
             var shortUrl = prefix + convertToBase62(num).join('') + '.com';
             res.json({longUrl: longUrl, shortUrl: shortUrl});
         }
    });
    
});

app.get('/short/*', function(req, res){
    console.log('Short URL Page');
    var longUrl = '';
    var short = extractShortFromUrl(req.params[0]);
    var base = 62;
    var hash = convertToDecimal(short, base);
    
    shortenUrl.find({hash: hash}, function (err, docs) {
         if(err) { 
             console.log(err);
             return;
         } else {
             longUrl = docs[0]['longUrl'];
         }
        // res.json({longUrl: longUrl});
         res.redirect(longUrl);
    });
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Short url microservice has started!");
});


function convertToBase62(num){
    var base62UrlArr = [];
    var remainder, quotient;
    remainder = num;

    while (num >= base){
        quotient = Math.floor(num/base);
        remainder = num - quotient * base;
        base62UrlArr.unshift(base62[remainder]);
        num = quotient;
    }
    base62UrlArr.unshift(base62[num]);
    return base62UrlArr;
}

function convertToDecimal(num, base){
    var arr = num.split('');
    var result = 0;
    var pow = arr.length - 1;
    for (var p = 0; p < arr.length; p++){
        var x = base62.indexOf(arr[p]);
        result += x * Math.pow(base, pow);
        pow--;
    }
    return result;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function validateUrl(url){
    if (url.substring(0, 4) !== 'http') {
        console.log('Not a http request');
        return false;
    };

    var posDecimal = Number(url.indexOf('.'));
    var count = 0;
    
    while (posDecimal !== -1){
        count++;
        posDecimal = Number(url.indexOf('.', posDecimal + 1));
    };
    
    if (count <= 1){
        console.log('has less than 2 decimals, Invalid url');
        return false;
    };
    console.log('valid url');
    return true;
}

function extractShortFromUrl(url){
    var short = url;
    var decimal;
    if (short.substring(0, 8) === 'https://') {
        decimal = short.indexOf('.'); 
        short = short.substring(8, decimal);
    } else if(short.substring(0, 7) === 'http://'){
        decimal = short.indexOf('.'); 
        short = short.substring(7, decimal);
    }
    return short;
}






