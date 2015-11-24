var express = require('express');
var app = express();
var router = express.Router();

app.use(express.static(__dirname + '/views'));
app.use('/api', router);

app.get('/', function (req, res) {
    res.render('index.html');
});

var server = app.listen(3000, function () {});
