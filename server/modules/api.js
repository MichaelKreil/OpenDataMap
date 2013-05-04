exports.Api = function (model) {
	var me = this;
	var log = new (require('./log.js').Log)('API');

	me.get = function (path, callback) {
		log.debug('get');
		var source = getSource(path[0]);

		var options = {};
		var call = source.getAll;
		var flags = path.splice(1);
		for (var i = 0; i < flags.length; i++) {
			var flag = flags[i];
			switch (flag) {
				case 'new':
					options.includeNew = true;
					log.debug('include new');
				break;
				case 'deleted':
					options.includeDeleted = true;
					log.debug('include deleted');
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

		source.getAll(options, callback);
	}

	me.set = function (path, data, user, callback) {
		log.debug('set');
		var source = getSource(path[0]);
		var options = { user: user };
		source.set(data, options, callback);
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