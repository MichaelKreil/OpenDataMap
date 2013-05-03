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
		
		var query = {deleted: false};

		if (!options.includingNew) {
			query.state = 'accepted';
			query.deleted = true;
		}
		if (options.id) query.id = id;

		collection.find(query, function (err, docs) {
			if (err) log.error(err);
			callback(condense(docs));
		});
	}

	var getLast = function (collectionName, id, callback) {
		log.debug('getLast ('+collectionName+': '+id+')');
		var collection = db.collection(collectionName);
		var alreadyFound = false;
		collection.find({id:id}).sort({time:-1}).limit(1).forEach(function (err, doc) {
			if (err) log.error(err);
			if (doc) {
				alreadyFound = true;
				callback(doc);
			} else {
				if (!alreadyFound) callback(false);
			}
		});
	}

	me.set = function (entries, options, callback) {
		log.debug('set ('+options.collectionName+')');
		var collection = db.collection(options.collectionName);

		entries.forEach(function (entry) {

			var newEntry = {
				attributes: entry.attributes,
				time: (new Date()).getTime(),
				state: 'new',
				deleted: false,
				user: options.user,
				id: entry.id
			};
			if (entry.deleted) newEntry.deleted = true;

			if (newEntry.id === undefined) newEntry.id = me.getNewId(options.collectionName)
			if (entry._id) newEntry.previous_id = entry._id;

			getLast(options.collectionName, newEntry.id, function (doc) {
				if (!sameObject(doc, newEntry)) {
					collection.insert(newEntry, function (err, inserted) {
						log.log('new entry: '+JSON.stringify(newEntry));
						if (err) log.error(err);
					});
				}
			})
		});
		callback('ok');
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
		log.debug('calcNewId ('+collectionName+')');
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



var sameObject = function (obj1, obj2) {
	if (!obj1.attributes && obj2.attributes) return false;
	if (obj1.attributes && !obj2.attributes) return false;

	var same = true;
	var attr1 = obj1.attributes;
	var attr2 = obj2.attributes;
	for (var i in attr1) if (attr1.hasOwnProperty(i)) {
		if (attr1[i] != attr2[i]) same = false;
	}
	for (var i in attr2) if (attr2.hasOwnProperty(i)) {
		if (attr1[i] != attr2[i]) same = false;
	}
	if (obj1.deleted !== obj2.deleted) same = false;
	return same;
}



