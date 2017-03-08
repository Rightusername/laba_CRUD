var express = require('express');
var mysql = require('mysql');
var app = express();
var bodyParser = require('body-parser')



var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '135531',
	database: 'laba1'
});
connection.connect(function (error) {
	if(!!error){
		console.log(error);
	}else{
		console.log('Database connected');
	}
});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));



app.get('/', function (req, res) {
	res.sendFile( __dirname + "/public/" + "index.html" );
});

app.post("/delRow",function (req, res) {

	connection.query("DELETE FROM "+req.body.table+" WHERE `Name`='"+req.body.id +"'", function (error, rows, fields) {
		if(!!error){
			console.log("Error in the query");
			res.send("Error in the query");
		}else{
			console.log('Row added');
			res.send("succsesss");
		}
	});
});


app.post('/addRow',function (req, res) {
	var s = "INSERT INTO "+req.body.table +" (";
	var names = [];
	var values = [];
	for(var i in req.body){
		if(i!="table") {
			names.push(i);
			values.push('"' + req.body[i] + '"');
		}
	}

	for (var i = 0; i < names.length; i++) {
		s+=names[i];
		if(i!=names.length-1){
			s+=',';
		}

	}
	s+=") VALUES(";
	for (var i = 0; i < values.length; i++) {
		s+=values[i];
		if(i!=values.length-1){
			s+=',';
		}
	}
	s+=")";

	connection.query(s, function (error, rows, fields) {
		if(!!error){
			console.log("Error in the query");
			res.send("Error in the query");
		}else{
			console.log('Row added');
			res.send("succsesss");
		}
	});
});

app.post("/updateRow?",function (req, res) {
	updateRow(JSON.parse(req.body.json),req.body.id,req.body.table);
});

function updateRow(obj,id,table) {
	var s = "UPDATE "+table+" SET ";
	var count=0;
	var j=0;
	for(var i in obj){
		count++;
	}
	for(var i in obj){
		j++;
		s += i + "=";
		s += '"' + obj[i] + '"';
		if (j != count) {
			s += ', '
		}
	}
	s+=' WHERE Name="'+ id+'";';
	connection.query(s, function (error, rows, fields) {
		if(!!error){
			console.log("Error in the query");
		}else{
			console.log('row updated');
		}
	});
}

function getSchema(table) {
	var result = '';
	connection.query('SHOW COLUMNS FROM ' +table+ ' FROM laba1;', function (error, rows, fields) {
		if(error){
			console.log("Error in the query");
		}else{
			result = JSON.stringify(rows);

			//res.send(JSON.stringify(rows));
		}
	});

	return result;
}

app.get('/schema/planets',function (req, res) {
	connection.query('SHOW COLUMNS FROM planets FROM laba1;', function (error, rows, fields) {
		if(error){
			console.log("Error in the query");
		}else{
			res.send(JSON.stringify(rows));
		}
	});
});

app.get('/schema/satellites',function (req, res) {
	connection.query('SHOW COLUMNS FROM satellites FROM laba1;', function (error, rows, fields) {
		if(error){
			console.log("Error in the query");
		}else{
			res.send(JSON.stringify(rows));
		}
	});
});

app.get('/schema/stars',function (req, res) {
	connection.query('SHOW COLUMNS FROM stars FROM laba1;', function (error, rows, fields) {
		if(error){
			console.log("Error in the query");
		}else{
			res.send(JSON.stringify(rows));
		}
	});
});

app.get('/planets', function (req, res) {
	connection.query('SELECT * FROM planets', function (error, rows, fields) {
		if(!!error){
			console.log("Error in the query");
		}else{
			console.log(getSchema("planets"));
			res.send(JSON.stringify(rows));
		}
	});
});

app.get('/satellites', function (req, res) {

	connection.query('SELECT * FROM satellites', function (error, rows, fields) {
		if(!!error){
			console.log("Error in the query");
		}else{
			res.send(JSON.stringify(rows));
		}
	});
});

app.get('/stars', function (req, res) {

	connection.query('SELECT * FROM stars', function (error, rows, fields) {
		if(!!error){
			console.log("Error in the query");
		}else{
			console.log('table loaded');

			res.send(JSON.stringify(rows));
		}
	});
});

app.listen(3000, function () {
	console.log('listen on 3000');
});



