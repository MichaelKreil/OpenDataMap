exports.Server = function (config, model) {
	var me = this;
	
	var log = new (require('./log.js').Log)('HTTP Server');
	var http = new require('http');
	var api = new (require('./api.js').Api)(model);

	log.debug('Starting');

	var server = http.createServer(function (req, res) {
		log.debug('request: '+req.url);
		var path = req.url.split('/').slice(1);
		log.debug(path);

		if (path[0] == 'api') {
			res.writeHead(200, {'Content-Type': 'application/json'});
		} else {
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end();
		}
	}).listen(config.port);

	log.debug('Started');

	me.stop = function () {
		log.debug('Stopping');
		server.close();
		log.debug('Stopped');		
	}


	return me;
}