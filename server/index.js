const express = require('express');
const app = express();

const mongoose = require('mongoose');

mongoose
	.connect('mongodb://manoj:12oclock_007@ds239157.mlab.com:39157/shopping-cart', {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true
	})
	.then(() => console.log('db connected'))
	.catch((err) => console.log(err));

app.get('/', (req, res) => {
	res.send('Hello from node');
});

app.listen(5000, () => console.log('Server started on port 5000'));
