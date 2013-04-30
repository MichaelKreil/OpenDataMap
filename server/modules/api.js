exports.Api = function (model) {
	var me = this;
	var log = new (require('./log.js').Log)('API');

	me.get = function (path, callback) {
		var includingNew = false;
		if (path[1] == 'new') {
			log.debug('requesting also new entries');
			includingNew = true;
		}
		switch (path[0]) {
			case 'topics':
				log.debug('requesting topics');
				model.getTopics().getAll(includingNew, function (data) {
					callback(JSON.stringify(data));
				});
			break;
			case 'institutions':
				log.debug('requesting institutions');
				model.getInstitutions().getAll(includingNew, function (data) {
					callback(JSON.stringify(data));
				});
			break;
			default:
				log.error('unknown request: '+path.join('/'));
				callback('"error"');
		}
		return path.join(',');
	}
	return me;
}