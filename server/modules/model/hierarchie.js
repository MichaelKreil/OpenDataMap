exports.Hierarchie = function (options) {
	var log = new (require('../log.js').Log)('Hierarchie');

	var me = this;
	var db = options.db;
	var collectionName = options.name;
	var maxId = 0;

	me.getAll = function (includingNew, callback) {
		log.debug('getAll');
		db.list(collectionName, callback, includingNew);
	}

	me.getHierarchie = function (includingNew, callback) {
		log.debug('getHierarchie');
		db.list(collectionName, function (list) {

			log.debug('create LUT');
			// create LUT ... for optimization ... as usual
			var lut = [];
			for (var i = 0; i < list.length; i++) {
				lut[list[i].id] = list[i];
				list[i].children = [];
			}

			log.debug('create tree');
			// creating tree with children
			var roots = [];
			for (var i = 0; i < list.length; i++) {
				var entry = list[i];
				var parentId = entry.attributes.parentId;
				if ((parentId === undefined) && (parentId == null)) {
					roots.push(entry);
				} else {
					lut[parentId].children.push(entry);
				}
			}

			log.debug('sort');
			// sort
			var sort = function (list) {
				if (list.length >= 1) {
					list.sort(function (a,b) {
						if (a.attributes.title == b.attributes.title) return 0;
						return (a.attributes.title < b.attributes.title) ? -1 : 1;
					});
					for (var i = 0; i < list.length; i++) {
						sort(list[i].children);
					}
				}
			}
			sort(roots);

			return roots;
		}, includingNew);
	}

	me.update = function (entry) {
		log.debug('update');
		db.update(collectionName, entry);
	}

	return me;
}