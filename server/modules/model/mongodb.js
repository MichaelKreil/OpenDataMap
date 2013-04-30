exports.DB = function (config) {
	var me = this;

	/*
		states:
			- new
			- accepted
			- declined
			- deleted
	*/
	
	var mongojs = require('mongojs');
	var log = new (require('../log.js').Log)('MongoDB');
	
	var db = mongojs(config.dbname);

	log.debug('Starting');

	me.getEntry = function (collectionName, id, callback, all) {
		var collection = db.collection(collectionName);
		log.debug('list');
		
		var query = {state:'accepted'};
		if (all) query = {};

		query.attributes = {id:id};

		collection.find(query, function (err, docs) {
			callback(condense(docs));
		});
	}

	me.list = function (collectionName, callback, all) {
		var collection = db.collection(collectionName);
		log.debug('list');
		
		var query = {state:'accepted'};
		if (all) query = {};

		collection.find(query, function (err, docs) {
			callback(condense(docs));
		});
	}

	me.update = function (collectionName, entry) {
		var document = {
			attributes: entry,
			time: (new Date()).getTime(),
			state: 'new'
		};
		var collection = db.collection(collectionName);
		collection.insert(document, function (err, inserted) {
			if (err) {
				log.error(err);
				log.error(entry);
			}
		});
	}

	var condense = function(data) {
		var container = {};
		for (var i = 0; i < data.length; i++) {
			var entry = data[i];
			var id = '_'+entry.attributes.id;
			if ((container[id] === undefined) || (container[id].time < entry.time)) {
				container[id] = entry;
			}
		}
		var list = [];
		for (var i in container) if (container.hasOwnProperty(i)) {
			list.push(container[i]);
		}
		return list;
	}

	return me;
}