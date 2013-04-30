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

	me.listAll = function (collectionName, callback) {
		var collection = db.collection(collectionName);
		log.debug('listAll');
		collection.find(function (err, docs) {
			callback(condense(docs));
		});
	}

	me.listAccepted = function (collectionName, callback) {
		var collection = db.collection(collectionName);
		log.debug('listAccepted');
		collection.find({state:'accepted'}, function (err, docs) {
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