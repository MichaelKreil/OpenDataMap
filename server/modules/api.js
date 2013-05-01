exports.Api = function (model) {
	var me = this;
	var log = new (require('./log.js').Log)('API');

	me.get = function (path, callback) {
		var source = path[0];

		switch (source) {
			case 'topics':
				log.debug('requesting topics');
				source = model.getTopics();
			break;
			case 'institutions':
				log.debug('requesting institutions');
				source = model.getInstitutions();
			break;
			default:
				log.error('unknown request: '+path.join('/'));
				callback('"error"');
		}


		var call = source.getAll;
		var ids = [];
		var includingNew = false;
		var flags = path.splice(1);
		for (var i = 0; i < flags.length; i++) {
			var flag = flags[i];
			switch (flag) {
				case 'new':
					includingNew = true;
					log.debug('include new');
				break;
				case 'list':
					call = source.getAll;
					log.debug('as list');
				break;
				case 'tree':
					call = source.getHierarchie;
					log.debug('as tree');
				break;
				case '': /*ignore*/ break;
				default:
					log.warning('unknown Flag "'+flag+'"');
			}
		}

		call(includingNew, function (data) {
			callback(JSON.stringify(data));
		});
		
		return path.join(',');
	}
	return me;
}