exports.Api = function (model) {
	var me = this;
	var log = new (require('./log.js').Log)('API');

	me.get = function (path, callback) {
		var acceptedOnly = true;
		if (path[1] == 'new') {
			log.debug('requesting also new entries');
			acceptedOnly = false;
		}
		switch (path[0]) {
			case 'topics':
				log.debug('requesting topics');
				model.getTopics().getAll(acceptedOnly, function (data) {
					callback(JSON.stringify(data));
				});
			break;
			case 'institutions':
				log.debug('requesting institutions');
				model.getInstitutions().getAll(acceptedOnly, function (data) {
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