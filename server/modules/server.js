exports.Server = function (config, model) {
	var me = this;
	
	var log = new (require('./log.js').Log)('HTTP Server');
	var http = new require('http');
	var api = new (require('./api.js').Api)(model);

	log.log('Starting');

	var server = http.createServer(function (req, res) {
		log.debug('request: '+req.url);
		var path = req.url.split('/').slice(1);

		var header = {
			'Access-Control-Allow-Origin': '*',
			'Content-Type': 'text/plain'
		};
		
		if (path[0] == 'api') {
			header['Content-Type'] = 'application/json';
			if (req.method == 'POST') {

				log.debug('api POST request');

				var body = '';
				req.on('data', function (data) { body += data;	});
				req.on('end', function () {
					try {
						body = JSON.parse(body);
					} catch (err) {
						log.error('POST request is invalid JSON');
						log.error('"'+body+'"');
						body = [];
					}
					var user = {name:'unknown', ip:req.connection.remoteAddress};
					api.set(path.slice(1), body, user, function (data) {
						res.writeHead(200, header);
						data = JSON.stringify(data);
						log.debug(data);
						res.end(data);
					})
				});
			} else {
				log.debug('api GET request');
				api.get(path.slice(1), function (data) {
					res.writeHead(200, header);
					data = JSON.stringify(data);
					log.debug(data);
					res.end(data);
				})
			}
		} else {
			log.debug('frontend request');
			res.writeHead(200, header);
			res.end();
		}
	}).listen(config.port);

	log.log('Started');

	me.stop = function () {
		log.debug('Stopping');
		server.close();
		log.debug('Stopped');		
	}


	return me;
}