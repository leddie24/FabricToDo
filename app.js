var express = require('express');
var app = module.exports.app = exports.app = express();

var path = require('path');

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.use('/css', express.static(__dirname + '/dist/css'));
app.use('/scripts', express.static(__dirname + '/node_modules/office-ui-fabric-js/dist/js'));
app.use('/scripts', express.static(__dirname + '/node_modules/mustache'));

app.listen(8080);