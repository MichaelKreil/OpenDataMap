var updateTree = function () {
	var node = $('#tree');
	node.empty();

	var output = function (list, indent, parentId) {
		var margin = indent*20;
		
		var subnode = $('<div class="entry new" style="margin-left:'+margin+'px">Neuen Eintrag hinzufügen</div>');
		subnode.click(function () {
			showDetails(addChild(list, parentId));
		})
		node.append(subnode);

		if (list && list.length > 0) {
			$.each(list, function (i, entry) {
				console.log(entry);

				var subnode = $('<div class="entry" style="margin-left:'+margin+'px">'+entry.attributes.title+'</div>');
				subnode.click(function () {
					showDetails(entry);
				})
				node.append(subnode);

				output(entry.children, indent+1, entry.id);
			});
		}
	}

	output(topics, 0, null);
}

var attributeTranslation = {
	title: {title:'Titel'},
	parentId: {title:'Unterelement von', type:'parent'}
};

var showDetails = function (entry) {
	var node = $('#details');
	node.empty();

	var attributes = entry.attributes;
	for (var key in attributes) {
		createDetailEntry(key, attributes[key], node);
	}
	
	for (var i = 0; i < 5; i++) {
		createDetailEntry('', '', node);
	}

	var button = $('<button class="btn" type="button">Speichern</button>');
	node.append(button);
	button.click(function () {
		var attributes = {};
		node.find('.entry').each(function (i, node) {
			var key = $(node).find('.key');
			if (key.val()) {
				key = key.val()
			} else {
				key = key.attr('name');
			}
			var value = $(node).find('.value').val();
			if (key != '') attributes[key] = value;
		});
		entry.attributes = attributes;
		updateTree();
		node.empty();
	});
}

var createDetailEntry = function (name, value, node) {
	var label;
	if (attributeTranslation[name] !== undefined) {
		label = $('<label class="key" name="'+name+'">'+attributeTranslation[name].title+'</label>');
	} else {
		label = $('<input class="key" name="'+name+'" type="text" value="'+name+'">');
	}
	var input = '<input class="value" type="text" value="'+value+'">';
	if (attributeTranslation[name] && attributeTranslation[name].type) {
		switch (attributeTranslation[name].type) {
			case 'parent':
				input = '<option value=""></option>';
				var rec = function (list, indent) {
					for (var i = 0; i < list.length; i++) {
						var entry = list[i];
						var title = new Array(indent + 1).join('&nbsp;-&nbsp;') + entry.attributes.title;
						var selected = (entry.id == value) ? 'selected="selected"' : '';
						input += '<option value="'+entry.id+'" '+selected+'>'+title+'</option>';
						if (entry.children) rec(entry.children, indent+1);
					}
				}
				rec(topics, 0);
				input = '<select class="value" value="'+value+'">'+input+'</select>';
			break;
		}
	}

	var subnode = $('<div class="entry"></div>');
	node.append(subnode);
	subnode.append(label);
	subnode.append($(input));
}

var addChild = function (list, parentId) {
	var entry = {attributes:{title:'Neuer Eintrag', parentId:parentId}, children:[]};
	list.push(entry);
	return entry;
}



