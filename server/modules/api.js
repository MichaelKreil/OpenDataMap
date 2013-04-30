exports.Api = function (model) {
	var me = this;

	me.get = function (path) {
		switch (path[0]) {
			case 'topics':
				return JSON.stringify(model.getTopics().getAll());
			break;
			case 'institutions':
				return JSON.stringify(model.getInstitutions().getAll());
			break;
		}
		return path.join(',');
	}
	return me;
}