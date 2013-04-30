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

	}

	me.getInstitutions = function () {
		
	}


	me.destroy = function () {
		//db.close();
	}

	return me;
}