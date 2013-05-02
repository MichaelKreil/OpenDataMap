exports.Hierarchie = function (options) {
	var log = new (require('../log.js').Log)('Hierarchie');

	var me = this;
	var db = options.db;
	var collectionName = options.name;
	db.calcNewId(collectionName);

	me.getAll = function (options, callback) {
		log.debug('getAll');
		
		options.collectionName = collectionName;
		
		var newCallback = callback;
		if (options.asHierarchie) newCallback = function (list) {
			callback(createHierarchie(list));
		}

		db.get(options, newCallback);
	}

	var createHierarchie = function (list) {
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
			if ((parentId === undefined) || (parentId == null)) {
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
	}

	me.update = function (entry) {
		log.debug('update');
		db.update(collectionName, entry);
	var decodeHierarchie = function (roots) {
		log.debug('decodeHierarchie');
		var list = [];
		var rec = function (entries, parentId) {
			for (var i = 0; i < entries.length; i++) {
				var entry = entries[i];
				if (entry.id === undefined) entry.id = db.getNewId(collectionName);
				if (entry.attributes.parentId === undefined) entry.attributes.parentId = parentId;
				list.push(entry);
				if (entry.children) {
					rec(entry.children, entry.id);
					entry.children = undefined;
				}
			}
		}
		rec(roots, null);
		return list;
	}
	}

	return me;
}