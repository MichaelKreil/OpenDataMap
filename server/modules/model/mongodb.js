exports.DB = function (config) {
	var me = this;

	/*
		states:
			- new
			- accepted
			- declined
		deleted:
			true/false
	*/
	
	var mongojs = require('mongojs');
	var log = new (require('../log.js').Log)('MongoDB');
	
	var db = mongojs(config.dbname);

	log.debug('Starting');

	me.get = function (options, callback) {
		log.debug('get ('+options.collectionName+')');
		var collection = db.collection(options.collectionName);
		
		var query = {};

		if (!options.includingNew) query.state = 'accepted';
		if (options.id) query.id = id;

		collection.find(query, function (err, docs) {
			console.log(docs);
			callback(condense(docs));
		});
	}

	me.set = function (entries, options, callback) {
		log.debug('set ('+options.collectionName+')');
		var collection = db.collection(options.collectionName);

		for (var i = 0; i < entries.length; i++) {
			var entry = entries[i];
			var newEntry = {
				attributes: entry.attributes,
				time: (new Date()).getTime(),
				state: 'new',
				deleted: false,
				user: options.user,
				id: entry.id
			};

			if (newEntry.id === undefined) me.getNewId(options.collectionName)
			if (entry._id) newEntry.previous_id = entry._id;

			log.debug('new entry: '+JSON.stringify(newEntry));
			collection.insert(newEntry, function (err, inserted) {
				if (err) {
					log.error(err);
				}
			});
		}
	}

	me.update = function (collectionName, entry) {
		var document = {
			attributes: entry,
			time: (new Date()).getTime(),
			state: 'new',
			deleted: false
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
			var id = '_'+entry.id;
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

	var maxIds = {};
	me.calcNewId = function (collectionName) {
		var collection = db.collection(collectionName);
		console.log('calcNewId ('+collectionName+')');
		maxIds[collectionName] = 1;
		collection.find().sort({'id':-1}).limit(1).forEach(function(err, doc) {
			if (doc != null) maxIds[collectionName] = doc.id;
		});
	}

	me.getNewId = function (collectionName) {
		console.log('getNewId ('+collectionName+')');
		maxIds[collectionName]++;
		return maxIds[collectionName];
	}

	return me;
}