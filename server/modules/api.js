exports.Api = function (model) {
	var me = this;

	me.get = function (path, callback) {
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