var updateTree = function () {
	var node = $('#tree');
	node.empty();
	$('#details').empty();
	var defaultAttributes = (path == 'topics') ? topicAttributes : institutionAttributes;

	var output = function (list, indent, parentId) {
		var margin = indent*16;
		
		var subnode = $('<div class="addnew">+</div>');
		subnode.click(function () {
			showDetails(addChild(list, parentId), defaultAttributes);
		})
		node.append(subnode);
		node.append('<br style="clear:both;" />');

		if (list && list.length > 0) {
			$.each(list, function (i, entry) {
				var classes = ['entry'];
				if (entry.deleted) classes.push('deleted');
				if (entry.state == 'new') classes.push('new');

				var subnode = $('<div class="'+classes.join(' ')+'" style="margin-left:'+margin+'px;width:'+(470-margin)+'px">'+entry.attributes.title+'</div>');
				subnode.click(function () {
					showDetails(entry, defaultAttributes);
				})
				node.append(subnode);

				output(entry.children, indent+1, entry.id);
			});
		}
	}

	output(data, 0, null);
}

var updateList = function () {
	var node = $('#tree');
	node.empty();
	$('#details').empty();

	$(data).each(function (i, entry) {
		var classes = ['entry'];
		if (entry.deleted) classes.push('deleted');
		if (entry.state == 'new') classes.push('new');

		var title = entry.attributes.title;
		var subnode = $('<div class="'+classes.join(' ')+'" style="float:none">'+title+'</div>');
		subnode.click(function () {
			showDetails(entry, relationAttributes);
		})
		node.append(subnode);
	})
}

var showDetails = function (entry, defaultAttributes) {
	var node = $('#details');
	node.empty();

	var attributes = entry.attributes;
	for (var key in attributes) {
		createDetailEntry(key, attributes[key], node, defaultAttributes);
	}
	
	for (var i = 0; i < 5; i++) {
		createDetailEntry('', '', node, defaultAttributes);
	}

	var saveButton = $('<button class="btn" type="button">Speichern</button>');
	node.append(saveButton);
	saveButton.click(function () {
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

	var deleteButton = $('<button class="btn" type="button">Löschen</button>');
	node.append(deleteButton);
	deleteButton.click(function () {
		entry.deleted = true;
		updateTree();
		node.empty();
	});
};

var topicAttributes = {
	title: {title:'Titel'},
	parentId: {title:'Unterelement von', type:'lookup-topics', multiple:false}
};

var institutionAttributes = {
	title: {title:'Titel'},
	parentId: {title:'Unterelement von', type:'lookup-institutions', multiple:false}
};

var relationAttributes = {
	title: {title:'Titel'},
	topics: {title:'Themen', type:'lookup-topics', multiple:true},
	institutions: {title:'Institution', type:'lookup-institutions', multiple:true}
};

var createDetailEntry = function (name, value, node, attributes) {
	var label;
	if (attributes[name] !== undefined) {
		label = $('<label class="key" name="'+name+'">'+attributes[name].title+'</label>');
	} else {
		label = $('<input class="key" name="'+name+'" type="text" value="'+name+'">');
	}
	var input = '<input class="value" type="text" value="'+value+'">';
	if (attributes[name] && attributes[name].type) {
		switch (attributes[name].type) {
			case 'lookup-topics':
				input = getComboBox(topics, value, attributes[name].multiple);
			break;
			case 'lookup-institutions':
				input = getComboBox(institutions, value, attributes[name].multiple);
			break;
		}
	}

	var subnode = $('<div class="entry"></div>');
	node.append(subnode);
	subnode.append(label);
	subnode.append($(input));
}

var getComboBox = function (data, values, multiple) {
	var selection = [];
	if (multiple) {
		for (var i = 0; i < values.length; i++) selection[values[i]] = true;
	} else {
		selection[values] = true;
	}

	var input = '<option value=""></option>';
	var rec = function (list, indent) {
		for (var i = 0; i < list.length; i++) {
			var entry = list[i];
			var title = new Array(indent + 1).join('&nbsp;-&nbsp;') + entry.attributes.title;
			var selected = selection[entry.id] ? 'selected="selected"' : '';
			input += '<option value="'+entry.id+'" '+selected+'>'+title+'</option>';
			if (entry.children) rec(entry.children, indent+1);
		}
	}
	rec(data, 0);
	return '<select class="value" '+(multiple ? ' multiple="multiple" size="8"' : '')+'>'+input+'</select>';
}

var addChild = function (list, parentId) {
	var entry = {attributes:{title:'Neuer Eintrag', parentId:parentId}, children:[], state:"new", deleted:"false"};
	list.push(entry);
	return entry;
}



