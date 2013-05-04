exports.Hierarchie = function (options) {
	var log = new (require('../log.js').Log)('Hierarchie');

	var me = this;
	var db = options.db;
	var collectionName = options.name;
	db.calcNewId(collectionName);

	
	me.get = function (options, callback) {
		log.debug('get');
		
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
			
			entry.attributes.parentId = checkInt(entry.attributes.parentId);
			var parentId = entry.attributes.parentId;
			if ((parentId !== undefined) && (lut[parentId]) && (lut[parentId].children)) {
				lut[parentId].children.push(entry);
			} else {
				entry.attributes.parentId = undefined;
				roots.push(entry);
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

	var decodeHierarchie = function (roots) {
		log.debug('decodeHierarchie');
		var list = [];
		var rec = function (entries, parentId) {
			for (var i = 0; i < entries.length; i++) {
				var entry = entries[i];

				entry.id = checkInt(entry.id);
				if (entry.id === undefined) entry.id = db.getNewId(collectionName);

				entry.attributes.parentId = checkInt(entry.attributes.parentId);
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

	me.set = function (data, options, callback) {
		log.debug('set');
		data = decodeHierarchie(data);
		options.collectionName = collectionName;
		db.set(data, options, callback);
	}

	return me;
}

function checkInt(value) {
	if (isFinite(value)) return value;
	if (Object.prototype.toString.call(value) == '[Object String]') value = parseInt(value, 10);
	if (isFinite(value)) return value;
	return undefined;
}