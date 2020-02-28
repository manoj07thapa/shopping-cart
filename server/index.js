const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { User } = require('./models/user');
const config = require('./config/key');
const { auth } = require('./middleware/auth');

mongoose
	.connect(config.mongoURI, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true
	})
	.then(() => console.log('db connected'))
	.catch((err) => console.log(err));
app.use(express.json());
app.use(cookieParser());

app.get('/api/user/auth', auth, (req, res) => {
	res.status(200).json({
		_id: req.user._id,
		name: req.user.name,
		email: req.user.email,
		isAuth: true,
		lastname: req.user.lastname,
		role: req.user.role
	});
});

app.post('/api/users/register', (req, res) => {
	const user = new User(req.body);
	user.save((err, userData) => {
		if (err) {
			return res.json({ success: false, err });
		}
		return res.status(200).json({ success: true, userData });
	});
});

app.post('/api/user/login', (req, res) => {
	User.findOne({ email: req.body.email }, (err, user) => {
		if (!user)
			return res.jason({
				loginSuccess: false,
				message: 'Auth failed, user not found'
			});
		user.comparePassword(req.body.password, (err, isMatch) => {
			if (!isMatch)
				return res.json({
					loginSuccess: false,
					message: 'Wrong password'
				});
		});
		user.generateToken((err, user) => {
			if (err) return res.status(400).send(err);
			res.cookie('x_auth', user.token).status(200).json({
				loginSuccess: true
			});
		});
	});
});

app.get('/api/user/logout', auth, (req, res) => {
	User.findOneAndUpdate({ _id: req.user._id }, { token: '' }, (err, doc) => {
		if (err) return res.json({ success: false, err });
		return res.status(200).json({ success: true });
	});
});

app.get('/', (req, res) => {
	res.send('Hello from node');
});
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
