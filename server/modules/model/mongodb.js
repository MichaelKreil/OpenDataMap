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

	log.debug('starting');

	me.get = function (options, callback) {
		log.debug('get ('+options.collectionName+')');
		var collection = db.collection(options.collectionName);
		
		var query = {state: 'accepted'};

		if (options.includeNew) delete query.state;

		if (options.id) query.id = id;
		
		log.debug('query: '+JSON.stringify(query));

		collection.find(query, function (err, docs) {
			if (err) log.error(err);
			callback(condense(docs, options));
		});
	}

	me.has = function (query, collectionName, callback) {
		log.debug('has ('+collectionName+': '+JSON.stringify(query)+')');
		var collection = db.collection(collectionName);
		collection.find(query).count(function (err, count) {
			callback(count > 0);
		})
	}

	var getLast = function (collectionName, id, callback) {
		log.debug('getLast ('+collectionName+': '+id+')');
		var collection = db.collection(collectionName);
		var alreadyFound = false;
		if ((!id) && (id != 0)) {
			callback(false);
		} else {
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
	}

	me.set = function (entries, options, callback) {
		log.debug('set ('+options.collectionName+')');
		var collection = db.collection(options.collectionName);

		var stack = entries.length;
		entries.forEach(function (entry) {
			me.setOne(entry, options, function () {
				stack--;
				if (stack == 0) callback(true);
			});
		});
	}

	me.setOne = function (entry, options, callback) {
		log.debug('setOne ('+options.collectionName+')');
		var collection = db.collection(options.collectionName);

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
					callback(true);
				});
			} else {
				callback(true);
			}
		})
	}

	var condense = function(data, options) {
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
			if (options.includeDeleted || !container[i].deleted) {
				list.push(container[i]);
			}
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
		log.log('getNewId ('+collectionName+')');
		maxIds[collectionName]++;
		return maxIds[collectionName];
	}


	var sameObject = function (obj1, obj2) {
		if (!obj1.attributes && obj2.attributes) return false;
		if (obj1.attributes && !obj2.attributes) return false;

		var same = true;
		var attr1 = obj1.attributes;
		var attr2 = obj2.attributes;
		if (!compareObjects(attr1, attr2)) same = false;
		if (obj1.deleted !== obj2.deleted) same = false;
		return same;
	}

	var compareObjects = function (obj1, obj2) {
		var same = true;
		for (var i in obj1) if (obj1.hasOwnProperty(i)) {
			if (!compareValues(obj1[i], obj2[i])) same = false;
		}
		for (var i in obj2) if (obj2.hasOwnProperty(i)) {
			if (!compareValues(obj1[i], obj2[i])) same = false;
		}
		return same;
	}

	var compareArrays = function (obj1, obj2) {
		var same = true;
		var n = Math.max(obj1.length, obj2.length);
		for (var i = 0; i < n; i++) {
			if (!compareValues(obj1[i], obj2[i])) same = false;
		}
		return same;
	}

	var compareValues = function (val1, val2) {
		var datatype = Object.prototype.toString.call(val1);
		switch (datatype) {
			case '[object Array]':
				return compareArrays(val1, val2);
			break;
			case '[object Object]':
				return compareObjects(val1, val2);
			break;
			case '[object String]':
			case '[object Number]':
				return val1 == val2
			break;
			default:
				log.error('Unknown data type "'+datatype+'"');
				return val1 == val2
		}
	}

	return me;
}




