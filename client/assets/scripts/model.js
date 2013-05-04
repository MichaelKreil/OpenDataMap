var topics, institutions, relations;

var apiStart = function (callback) {
	apiGet('topics/new/tree', function (data) {
		topics = data;
		apiGet('institutions/new/tree', function (data) {
			institutions = data;
			apiGet('relations/new', function (data) {
				relations = data;
				callback();
			});
		});
	});
}

var apiGet = function (url, callback) {
	$.ajax(odm.api + url, {
		success: callback
	})
}


var apiPost = function (url, data, callback) {
	data = JSON.stringify(data);

	$.ajax(odm.api + url, {
		data: data,
		type: 'POST',
		complete: callback,
		error: function (a,b,c) {console.error(a,b,c);},
	})
}


