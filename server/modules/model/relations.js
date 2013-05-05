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
			interested
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

	me.set = function (entry, options, callback) {
		log.debug('set');

		var stackLength = 0;
		for (var key in relations) {
			stackLength++;
			(function () {
				var myKey = key;
				validateIntArray(entry.attributes[myKey], relations[myKey], function (list) {
					entry.attributes[myKey] = list;
					stackLength--;
					if (stackLength == 0) {
						options.collectionName = collectionName;
						db.set(data, options, callback);
					}
				});
			})();
		}
	}

	return me;
}

function validateIntArray(values, db, callback) {
	if (!(Object.prototype.toString.call(value) == '[Object Array]')) callback([0]);
	var newValues = [];
	for (var i = 0; i < values.length; i++) {
		var value = checkInt(values[i]);
		if (!db.has({id:value})) value = undefined;
		if (value !== undefined) newValues.push(value);
	}
	if (newValues.length == 0) newValues = [0];
	return newValues;

	var checkInt = function(value) {
		if (isFinite(value)) return value;
		if (Object.prototype.toString.call(value) == '[object String]') value = parseInt(value, 10);
		if (isFinite(value)) return value;
		return undefined;
	}
	
	return me;
}