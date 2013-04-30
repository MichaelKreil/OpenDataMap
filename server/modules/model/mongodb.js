exports.DB = function (config) {
	var me = this;
	
	var mongojs = require('mongojs');
	var log = new (require('../log.js').Log)('MongoDB');
	
	var db = mongojs(config.dbname);

	log.debug('Starting');
/*
	db_connector.open(function (err, newDb) {
		log.error(err);
		log.debug('Started');
		db = newDb;
	});

	me.stop = function () {
		log.debug('Stopping');
		db.close();
		log.debug('Stopped');
	}

*/
	return me;
}