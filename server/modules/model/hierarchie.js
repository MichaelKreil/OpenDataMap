exports.Hierarchie = function (options) {
	var me = this;
	var db = options.db;
	var collectionName = options.name;
	var maxId = 0;

	me.getAll = function (includingNew, callback) {
		db.list(collectionName, callback, includingNew);
	}

	me.getHierarchie = function (includingNew, callback) {
		db.list(collectionName, function (list) {

			// create LUT ... for optimization ... as usual
			var lut = [];
			for (var i = 0; i < list.length; i++) {
				lut[list[i].id] = list[i];
				list[i].children = [];
			}

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
		db.update(collectionName, entry);
	}

	return me;
}