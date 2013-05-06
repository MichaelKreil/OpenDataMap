var updateTree = function () {
	var node = $('#tree');
	node.empty();
	$('#details').empty();
	var defaultAttributes = (path == 'topics') ? topicAttributes : institutionAttributes;

	var output = function (list, indent, parentId) {
		var margin = indent*16;
		
		var subnode = $('<div class="addnew">+</div>');
		subnode.click(function () {
			showDetails(addEntry(list, defaultAttributes, {parentId:parentId}), defaultAttributes);
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

	var subnode = $('<div class="addnew">+</div>');
	node.append(subnode);
	node.append('<br style="clear:both;" />');
	subnode.click(function () {
		showDetails(addEntry(data, relationAttributes), relationAttributes);
	})

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
	var returnFunctions = [];
	for (var key in attributes) {
		returnFunctions.push(createDetailEntry(key, attributes[key], node, defaultAttributes));
	}
	
	for (var i = 0; i < 5; i++) {
		returnFunctions.push(createDetailEntry('', '', node, defaultAttributes));
	}

	var saveButton = $('<button class="btn" type="button">Speichern</button>');
	node.append(saveButton);
	saveButton.click(function () {
		var attributes = {};
		for (var i = 0; i < returnFunctions.length; i++) {
			var result = returnFunctions[i]();
			var key = result.key;
			var value = result.value;
			if (defaultAttributes[key]) {
				if (defaultAttributes[key].multiple) {
					value = ensureArray(value);
					if (defaultAttributes[key].isInteger) {
						for (var j = 0; j < value.length; j++) value[j] = ensureInteger(value[j]);
					}
				} else {
					if (defaultAttributes[key].isInteger) {
						value = ensureInteger(value);
					}
				}
			}
			if (key != '') attributes[key] = value;
		};
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
	title: {title:'Titel', defaultValue:'Neues Thema'},
	parentId: {title:'Unterelement von', defaultValue:0, type:'lookup-topics', multiple:false, isInteger: true}
};

var institutionAttributes = {
	title: {title:'Titel', defaultValue:'Neue Institution'},
	parentId: {title:'Unterelement von', defaultValue:0, type:'lookup-institutions', multiple:false, isInteger: true}
};

var relationAttributes = {
	title: {title:'Titel', defaultValue:'Neue Beziehung'},
	topics: {title:'Themen', defaultValue:[0], type:'lookup-topics', multiple:true, isInteger: true},
	institutions: {title:'Institution', defaultValue:[0], type:'lookup-institutions', multiple:true, isInteger: true},
	type: {
		title: 'Typ',
		type: 'lookup-simple',
		values: {
			'':'',
			'comment': 'Kommentar',
			'supportedBy': 'Unterstützung',
			'interest': 'Interesse',
			'dataOfficial': 'offizielle Daten',
			'dataInofficial': 'inoffizielle Daten',
			'institutionContacted': 'Kontakt aufgenommen',
			'institutionDeclined': 'Kommentar'
		}
	}
};

var createDetailEntry = function (key, value, node, attributes) {
	var input, label, returnFunction;
	if (attributes[key]) {
		label = $('<label class="key" name="'+key+'">'+attributes[key].title+'</label>');
		if (attributes[key].type) {
			switch (attributes[key].type) {
				case 'lookup-topics': input = getSelectionBox(topics, value, attributes[key].multiple); break;
				case 'lookup-institutions': input = getSelectionBox(institutions, value, attributes[key].multiple); break;
				case 'lookup-simple': input = getSimpleSelectionBox(attributes[key].values, value); break;
			}
			var getValue = input.getValue;
			returnFunction = function () {
				return {	key: key, value: getValue() };
			}
			input = input.node;
		} else {
			input = $('<input class="value" type="text" value="'+value+'">');
			returnFunction = function () {
				return {	key: key, value: input.val() };
			}
		}
	} else {
		label = $('<input class="key" name="'+key+'" type="text" value="'+key+'">');
		input = $('<input class="value" type="text" id="'+(''+Math.random()).substr(2)+'" value="'+value+'">');
		returnFunction = function () {
			return {	key: label.val(), value: input.val() };
		}
	}

	var subnode = $('<div class="entry"></div>');
	node.append(subnode);
	subnode.append(label);
	subnode.append(input);

	return returnFunction;
}

var getSimpleSelectionBox = function (data, value, multiple) {
	console.log(value);
	var options = '';
	for (var key in data) if (data.hasOwnProperty(key)) {
		var selected = (value == key) ? ' selected="selected"' : '';
		options += '<option value="'+key+'" '+selected+'>'+data[key]+'</option>';	
	}
	var node = $('<select class="value">'+options+'</select>');
	return {
		node: node,
		getValue:function () {
			return parseInt(node.val(), 10);
		}
	};
}

var getSelectionBox = function (data, values, multiple) {
	if (multiple) {
		var selection = [];
		for (var i = 0; i < values.length; i++) selection[values[i]] = true;
		var checkboxes = '';
		var random = 'a'+(''+Math.random()).substr(2)+'b';
		var ids = [];
		var rec = function (list, indent) {
			for (var i = 0; i < list.length; i++) {
				var entry = list[i];
				var title = entry.attributes.title;
				var selected = selection[entry.id] ? 'checked="checked"' : '';
				var id = random+entry.id;
				ids.push(id);
				checkboxes += '<label for="'+id+'"><input type="checkbox" id="'+id+'" value="'+entry.id+'" '+selected+' style="margin-left:'+(indent*10)+'px">'+title+'</label>';
				if (entry.children) rec(entry.children, indent+1);
			}
		}
		rec(data, 0);
		var node = $('<div class="checkboxWrapper value">'+checkboxes+'</div>');
		return {
			node: node,
			getValue:function () {
				var values = [];
				for (var i = 0; i < ids.length; i++) {
					var entryId = parseInt(ids[i].split('b').pop(), 10);
					if ($('#'+ids[i]).prop('checked')) values.push(entryId);
				}
				return values;
			}
		};
	} else {
		var options = '';
		var rec = function (list, indent) {
			for (var i = 0; i < list.length; i++) {
				var entry = list[i];
				var title = new Array(indent + 1).join('&nbsp;-&nbsp;') + entry.attributes.title;
				var selected = (entry.id == values) ? 'selected="selected"' : '';
				options += '<option value="'+entry.id+'" '+selected+'>'+title+'</option>';
				if (entry.children) rec(entry.children, indent+1);
			}
		}
		rec(data, 0);
		var node = $('<select class="value">'+options+'</select>');
		return {
			node: node,
			getValue:function () {
				return parseInt(node.val(), 10);
			}
		};
	}
}

var addEntry = function (list, defaultAttributes, additionalAttributes) {
	var entry = {attributes:{}, children:[], state:"new", deleted:"false"};
	for (var key in defaultAttributes) if (defaultAttributes.hasOwnProperty(key)) {
		if (defaultAttributes[key].defaultValue) entry.attributes[key] = defaultAttributes[key].defaultValue;
	}
	if (additionalAttributes) $.extend(entry.attributes, additionalAttributes);
	list.push(entry);
	return entry;
}

var ensureArray = function (values) {
	if (Object.prototype.toString.call(values) == '[object Array]') return values;
	if (Object.prototype.toString.call(values) == '[object String]') values = JSON.parse(values);
	if (Object.prototype.toString.call(values) == '[object Array]') return values;
	console.error('ensureArray versagt an "'+values+'"');
	return undefined;
}


var ensureInteger = function (value) {
	if (isFinite(value)) return value;
	if (Object.prototype.toString.call(value) == '[object String]') value = parseInt(value, 10);
	if (isFinite(value)) return value;
	console.error('ensureInteger versagt an "'+value+'"');
	return undefined;
}




