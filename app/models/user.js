var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = mongoose.Schema({
	
	google: {
		id: String,
		token: String,
		email: String,
		name: String,
		imageurl: String
	},
	email:{
       email : String,
       subject: String,
       text: String

	}


});


userSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}

userSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password, this.local.password);
}

module.exports = mongoose.model('User', userSchema);




// And then, to read it...


