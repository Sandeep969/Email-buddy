var mongoose = require('mongoose');
var schema = mongoose.Schema({

       email : String,
       subject: String,
       message: String

	

});
   

module.exports = mongoose.model('email', schema);