const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
	name: {
		type: String,
		maxlength: 50
	},
	email: {
		type: String,
		trim: true,
		unique: 1
	},
	password: {
		type: String,
		minlength: 5
	},
	lastname: {
		type: String,
		maxlength: 50
	},
	role: {
		type: Number,
		default: 0
	},
	token: {
		type: String
	},
	tokenExp: {
		type: Number
	}
});
/** this function takes the password as a input and hashes it before saving in the data base 
 * during registration
*/
userSchema.pre('save', function(next) {
	var user = this;
	if (user.isModified('password')) {
		bcrypt.genSalt(10, function(err, salt) {
			if (err) return next(err);
			bcrypt.hash(user.password, salt, function(err, hash) {
				if (err) return next(err);
				user.password = hash;
				next();
			});
		});
	} else {
		next();
	}
});

/**this function matches the password provided by user during login and password in database given during resistering
 * It is being called it index.js file in login route
 */
userSchema.methods.comparePassword = function(plainPassword, cb) {
	bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
		if (!isMatch) return cb(err);
		cb(null, isMatch);
	});
};

/**Genetating token for loggedin user to be used in the frontend */
userSchema.methods.generateToken = function(cb) {
	var user = this;
	var token = jwt.sign(user._id.toHexString(), 'secret');
	user.token = token;
	user.save(function(err, user) {
		if (err) return cb(err);
		cb(null, user);
	});
};

/**verifying if the id and token from client side matches to the ones in database */

userSchema.statics.findByToken = function(token, cb) {
	var user = this;

	jwt.verify(token, 'secret', function(err, decode) {
		user.findOne(
			{
				_id: decode,
				token: token
			},
			function(err, user) {
				if (err) return cb(err);
				cb(null, user);
			}
		);
	});
};

const User = mongoose.model('User', userSchema);
module.exports = {
	User
};
