exports.Hierarchie = function (options) {
	var me = this;
	var db = options.db;
	var collectionName = options.name;
	var maxId = 0;

	me.getAll = function (acceptedOnly, callback) {
		if (acceptedOnly) {
			db.list(collectionName, callback);
		} else {
			db.list(collectionName, callback, true);
		}
	}

	me.update = function (entry) {
		db.update(collectionName, entry);
	}

	return me;
}