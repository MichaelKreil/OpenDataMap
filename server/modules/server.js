exports.Server = function (config, model) {
	var me = this;
	
	var log = new (require('./log.js').Log)('HTTP Server');
	var http = new require('http');
	var api = new (require('./api.js').Api)(model);

	log.debug('Starting');

	var server = http.createServer(function (req, res) {
		log.debug('request: '+req.url);
		var path = req.url.split('/').slice(1);

		var header = {
			'Access-Control-Allow-Origin': '*',
			'Content-Type': 'text/plain'
		};
		
		if (path[0] == 'api') {
			log.debug('api request');
			header['Content-Type'] = 'application/json';
			res.writeHead(200, header);
			api.get(path.slice(1), function (data) {
				res.end(data);
			})
		} else {
			log.debug('frontend request');
			res.writeHead(200, header);
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