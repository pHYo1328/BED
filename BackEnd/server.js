var express = require('express');
var serveStatic = require('serve-static');
var app = require('./controller/app');

var port = 8081;

const path = require('path')
app.use('/static', express.static('images'));
var server = app.listen(port, function(){
    // console.log('Web App Hosted at http://localhost:%s', port);
    console.log('BackEnd server at http://localhost:%s', port);
});