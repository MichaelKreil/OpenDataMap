exports.Model = function (config) {
	var me = this;

	var db = new require('./mongodb.js').DB(config.db);
	var topics = new require('./hierarchie.js').Hierarchie({
		db: db,
		name: 'topics'
	});
	var institutions = new require('./hierarchie.js').Hierarchie({
		db: db,
		name: 'institutions'
	});

	me.getTopics = function () {
		return topics;
	}

	me.getInstitutions = function () {
		return institutions;
	}


	me.destroy = function () {
		//db.close();
	}

	topics.update({title: 'Filialen', _id:0});

	return me;
}