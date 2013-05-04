exports.Model = function (config) {
	var me = this;

	var db = new require('./mongodb.js').DB(config.db);

	var topics = new (require('./hierarchie.js').Hierarchie)({
		db: db,
		name: 'topics'
	});

	var institutions = new (require('./hierarchie.js').Hierarchie)({
		db: db,
		name: 'institutions'
	});

	var relations = new (require('./relations.js').Relations)({
		db: db,
		name: 'relations',
		relations: {
			topics: topics,
			institutions: institutions
		}
	});

	me.getTopics = function () {
		return topics;
	}

	me.getInstitutions = function () {
		return institutions;
	}

	me.getRelations = function () {
		return relations;
	}


	me.destroy = function () {
		//db.close();
	}

	return me;
}