exports.DB = function (config) {
	var me = this;
	
	var mongojs = require('mongojs');
	var log = new (require('../log.js').Log)('MongoDB');
	
	var db = mongojs(config.dbname);

	log.debug('Starting');

	me.listAll = function (collectionName) {
		var collection = db.collection(collectionName);
		return collection.find();
	}

	me.update = function (collectionName, entry) {
		entry.time = (new Date()).getTime();
		entry.state = 'new';
		var collection = db.collection(collectionName);
		collection.insert(entry);
	}

	return me;
}