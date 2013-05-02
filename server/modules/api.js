exports.Api = function (model) {
	var me = this;
	var log = new (require('./log.js').Log)('API');

	me.get = function (path, callback) {
		var source = getSource(path[0]);

		var options = {};
		var call = source.getAll;
		var flags = path.splice(1);
		for (var i = 0; i < flags.length; i++) {
			var flag = flags[i];
			switch (flag) {
				case 'new':
					options.includingNew = true;
					log.debug('include new');
				break;
				case 'list':
					options.asHierarchie = false;
					log.debug('as list');
				break;
				case 'tree':
					options.asHierarchie = true;
					log.debug('as tree');
				break;
				case '': /*ignore*/ break;
				default:
					log.warning('unknown Flag "'+flag+'"');
			}
		}

		source.getAll(options, function (data) {
			callback(JSON.stringify(data));
		});
		
		return path.join(',');
	}
	var getSource = function (source) {
		switch (source) {
			case 'topics':
				log.debug('requesting topics');
				return model.getTopics();
			break;
			case 'institutions':
				log.debug('requesting institutions');
				return model.getInstitutions();
			break;
			default:
				log.error('unknown request: '+path.join('/'));
				callback('"error"');
		}
	}

	return me;
}