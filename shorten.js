var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var shortenSchema = new Schema({
    longUrl: String,
    hash: {type: Number, "default": 0}
});

module.exports = mongoose.model('shorten', shortenSchema);