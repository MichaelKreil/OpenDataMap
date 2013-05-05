exports.Relations = function (options) {
	var log = new (require('../log.js').Log)('Relations');

	var me = this;
	var db = options.db;
	var collectionName = options.name;
	var relations = options.relations;
	db.calcNewId(collectionName);

	/*
		type:
			comment
			supportedBy
			interest
			dataOfficial
			dataInofficial
			institutionContacted
			institutionDeclined
		url

	*/

	me.has = function (query, callback) {
		db.has(query, collectionName, callback);
	}

	me.get = function (options, callback) {
		log.debug('get');
		
		options.collectionName = collectionName;
		
		db.get(options, function (list) {
			callback(sort(list));
		});
	}

	var sort = function (list) {
		return list;
	}

	me.set = function (entries, options, callback) {
		log.debug('set');

		var entryCount = entries.length;
		entries.forEach(function (entry) {
			me.setOne(entry, options, function (result) {
				entryCount--;
				if (entryCount == 0) callback(true);
			});
		});
	}

	me.setOne = function (entry, options, callback) {
		log.debug('setOne');

		stackLength = 0;
		for (var key in relations) if (relations.hasOwnProperty(key)) stackLength++;
		for (var key in relations) if (relations.hasOwnProperty(key)) {
			(function () {
				var myKey = key;
				validateIntArray(entry.attributes[myKey], myKey, function (list) {
					entry.attributes[myKey] = list;
					stackLength--;
					if (stackLength == 0) {
						options.collectionName = collectionName;
						db.setOne(entry, options, callback);
					}
				});
			})();
		}
	}

	var validateIntArray = function(values, collectionName, callback) {
		log.debug('validateIntArray ('+collectionName+': '+JSON.stringify(values)+')');
		if (Object.prototype.toString.call(values) !== '[object Array]') {
			log.debug('validateIntArray: not an Array');
			callback([0]);
			return;
		}
		var temp = [];
		var stack = values.length;
		values.forEach(function (value, index) {
			db.has({id:value}, collectionName, function (result) {
				if (result) temp[index] = value;
				stack--;
				if (stack == 0) {
					var newValues = [];
					for (var i = 0; i < temp.length; i++) {
						if (temp[i] !== undefined) newValues.push(temp[i]);
					}
					if (newValues.length == 0) newValues = [0];
					callback(newValues);
				}
			});
		})
	}

	var checkInt = function(value) {
		if (isFinite(value)) return value;
		if (Object.prototype.toString.call(value) == '[object String]') value = parseInt(value, 10);
		if (isFinite(value)) return value;
		return undefined;
	}
	
	return me;
}