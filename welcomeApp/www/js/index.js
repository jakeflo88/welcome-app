var express = require('express');
var bodyParser = require('body-parser');
var postgres = require('pg');

var pg = new postgres.Client('postgres://jacobflorian@localhost/jungle');

var app = express();

app.use(bodyParser.json({ type: 'application/json'}));

app.get('/', function(req, res) {});

app.post('/', function(req, res) {
	var sql = 'INSERT INTO users (email, password) VALUES ($1,$2) RETURNING id';

	//console.log("captured");
	var data = [
		req.body.email,
		req.body.password
	];
	pg.query(sql, data, function(err, result) {
		if (err) {
			console.error(err);
			res.statusCode = 500;
			return res.json({
				errors: ['Failed to post info']
			});
		}

		var newUser = result.rows[0].id;
		var sql = 'SELECT * FROM users WHERE id = $1';
		pg.query(sql, [ newUser], function(err, result) {
			if (err) {
				console.error(err);
				res.statusCode = 500;
				return res.json({
					errors: ['Could not retrieve info after create']
				});
			}

		res.statusCode = 201;

		res.json(result.rows[0]);
		});
	});

});

pg.connect(function(err) {
	if(err){
		throw err;
	}
	app.listen(3000, function() {
		console.log("Listening on 3000");
	});	
});