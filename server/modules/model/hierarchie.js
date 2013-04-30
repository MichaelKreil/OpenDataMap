exports.Hierarchie = function (options) {
	var me = this;
	var db = options.db;
	var collectionName = options.name;
	var maxId = 0;

	me.getAll = function (acceptedOnly, callback) {
		if (acceptedOnly) {
			db.listAccepted(collectionName, callback);
		} else {
			db.listAll(collectionName, callback);
		}
	}

	me.update = function (entry) {
		db.update(collectionName, entry);
	}

	return me;
}