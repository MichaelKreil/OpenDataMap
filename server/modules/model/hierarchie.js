exports.Hierarchie = function (options) {
	var me = this;
	var db = options.db;
	var collectionName = options.name;
	var maxId = 0;

	me.getAll = function () {
		return db.listAll(collectionName);
	}

	me.update = function (entry) {
		db.update(collectionName, entry);
	}

	return me;
}