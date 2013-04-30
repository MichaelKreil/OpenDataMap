var fs = require('fs');

var config = JSON.parse(fs.readFileSync('../config/config.json'));

var server   = new require('./modules/server.js').Server(config.server);
var model    = new require('./modules/model/model.js').Model(config);
var template = new require('./modules/view/template.js').Template(config.template);
//var tree = new require('./modules')

template.generateFrontpage();

var rl = require('readline').createInterface({input: process.stdin, output: process.stdout});
rl.on('line', function (cmd) {
	switch (cmd) {
		default:
			server.stop();
			model.destroy();
			rl.close();
			process.exit();
	}
})

