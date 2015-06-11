var server = require(__dirname + '/index');

var port = process.env.PORT || 8666;
server.listen(port);
console.log('Listening on localhost:'+ port);
